const mongoose = require("mongoose");

const UserOTPVerificationSchema = new mongoose.Schema({
    collegeId: String,
    otp:String,
    createdAt: Date,
    expiresAt: Date
})

const UserOTPVerification = mongoose.model("UserOTPVerification",UserOTPVerificationSchema);

module.exports = UserOTPVerification;