const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        fullName: { type: String, required: true },
        dob: { type: Date, required: true },
        passwordHash: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        progress: { type: Number, default: 0 },
        overallMarks: { type: Number, default: 0 },
        isOTPValidate: { type: Boolean, default: false },
        OTPHash: { type: String },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
