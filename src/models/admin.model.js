const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema(
    {
        name: { type: String, required: true },
        passwordHash: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
