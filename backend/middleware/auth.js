const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel")

const isAuthenticatedUser = catchAsyncErrors(async(req, res, next) => {
    //token is received from the one stored in cookies
    const { token } = req.cookies;
    
    if(!token){
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    //while making jwt token, we assigned an id in userModel.js so we can access this id from decodedData
    req.user = await User.findById(decodedData.id);
    next();
});

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        
        //if the user is not an admin
        //roles-admin
        //req.user.role-user    
        //it checks if req.user.role is admin then does the array roles contain admin? if not then this condision runs ekse next() runs
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }

        //if the user is admin
        next();
    };
};

module.exports = {
    isAuthenticatedUser,
    authorizeRoles
};