const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//crypto is a built in module
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter your name"],
        maxLength:[30, "Name cannot exceed 30 characters"],
        minLength:[4, "Name should atleast have 4 characters"]
    },
    email:{
        type:String,
        required:[true, "Please enter your email"],
        unique:true,
        validate:[validator.isEmail, "Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true, "Please enter your password"],
        minLength:[8, "Password should atleast have 8 characters"],
        select:false //whenever User is called, password must not be returned
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
});

userSchema.pre("save", async function(next) {
    //while we are updating profile, we dont want the password to be hashed again so we check if the password hasnt been modified
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token - A token is generated and is stored inside a cookie. This token helps the server to know that the user can access the routes
userSchema.methods.getJWTToken = function() {
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRE
    });
};

//Compare Password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Generating password reset token
userSchema.methods.getResetPasswordToken = function() {
    //Generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    //the token will expire after 15 minutes
    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;
}

const User = mongoose.model("User", userSchema);
module.exports = User;