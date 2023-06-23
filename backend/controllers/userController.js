const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//Register a user
const registerUser = catchAsyncErrors(async(req, res, next) => {
    const {name, email, password} = req.body;
    const user = await User.create({
        name, email, password,
        avatar:{
            public_id:"This is a sample ID",
            url:"ProfilePicUrl"
        }
    });

    sendToken(user, 201, res);
});

const loginUser = catchAsyncErrors (async(req, res, next) => {
    const {email, password} = req.body;

    //Checking if the user has entered a password and an email both
    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({email:email}).select("+password");
    //If the user is not found
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    //If the password of the user does not match the database
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});

//Logout User
const logoutUser = catchAsyncErrors(async(req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"User logged out"
    });
});

//Forgot Password
const forgotPassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findOne({ email : req.body.email });

    if(!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    //Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    //Saving the resetPasswordToken and resetPasswordExpire
    await user.save({ validateBeforeSave:false });
    
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested to change your password then please ignore this email`;

    try {
        await sendEmail({
            email:user.email,
            subject:`ShopMore Password Recovery`,
            message
        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave:false });
        return next(new ErrorHandler(error.message, 500));
    }
});

//Reset Password
const resetPassword = catchAsyncErrors(async(req, res, next) => {
    //Created hashed token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken:resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has expired", 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    //After changing the password, log them in
    sendToken(user, 200, res);
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword
}