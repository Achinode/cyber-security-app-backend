const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Admin SignUp
exports.signUp = async (req, res) => {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
        return res.status(400).json({
            status: "ERROR",
            message: "Name, Password and Email are required!",
        });
    }
    try {
        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                status: "ERROR",
                message: "Admin already exists with this email",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = new Admin({
            name,
            passwordHash: hashedPassword,
            email,
        });

        await newAdmin.save();

        res.status(201).json({
            status: "OK",
            message: "Admin created successfully",
            data: { userId: newAdmin._id },
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Server error",
            error,
        });
    }
};

// Admin SignIn
exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin || admin.isDeleted) {
            return res.status(400).json({
                status: "ERROR",
                message: "Admin not found or account is deactivated",
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, admin.passwordHash);
        if (!isMatch) {
            return res
                .status(400)
                .json({ status: "ERROR", message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id, email: admin.email, role: "admin" },
            JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        res.status(200).json({
            status: "OK",
            message: "Sign in successful",
            data: {
                token,
                userId: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Server error",
            error,
        });
    }
};

// Deactivate Admin Account
exports.deactivate = async (req, res) => {
    const { adminId } = req.params;

    try {
        // Find admin by ID and deactivate
        const admin = await Admin.findById(adminId);
        if (!admin || admin.isDeleted) {
            return res
                .status(400)
                .json({ message: "Admin not found or already deactivated" });
        }

        admin.isActive = false;
        admin.isDeleted = true;

        await admin.save();

        res.status(200).json({ message: "Admin account deactivated" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getAllAdmins = async (req, res) => {
    try {
        const users = await Admin.find(
            { isDeleted: false },
            { passwordHash: 0 }
        );
        res.status(200).json({ status: "OK", data: users });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error fetching users",
            error,
        });
    }
};

exports.deleteAdmin = async (req, res) => {
    const { adminId } = req.params;
    try {
        const admin = await Admin.findById(adminId);

        if (!admin)
            return res
                .status(404)
                .json({ status: "ERROR", message: "Admin not found" });

        admin.isDeleted = true;
        admin.isActive = false;
        admin.email = new Date().getTime() + "-deleted-" + admin.email;

        await admin.save();
        res.status(200).json({
            status: "OK",
            message: "Admin deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error deleting Admin",
            data: error,
        });
    }
};
