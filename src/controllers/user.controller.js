const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmailFunc = require("../util/email/email.service");

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// User SignUp
exports.signUp = async (req, res) => {
    const { name, fullName, dob, password, email } = req.body;

    if (!name || !password || !email) {
        return res.status(400).json({
            status: "ERROR",
            message: "Name, Password and Email are required!",
        });
    }
    if (password.length < 8) {
        return res.status(400).json({
            status: "ERROR",
            message: "Password should contains at least 8 characters!",
        });
    }
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: "ERROR",
                message: "User already exists with this email",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            fullName,
            dob,
            passwordHash: hashedPassword,
            email,
        });

        await newUser.save();

        res.status(201).json({
            status: "OK",
            message: "User created successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Server error",
            error,
        });
    }
};

// User SignIn
exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user || user.isDeleted) {
            return res.status(400).json({
                status: "ERROR",
                message: "User not found or account is deactivated",
            });
        }
        if (user.isOTPValidate == false) {
            return res.status(200).json({
                status: "ACTIVATE_EMAIL",
                message: "Your email is not validated!",
                data: {
                    userId: user._id,
                },
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res
                .status(400)
                .json({ status: "ERROR", message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: "user" },
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
                userId: user._id,
                name: user.name,
                email: user.email,
                fullName: user.fullName,
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

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(
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
// Get all users
exports.getOneUser = async (req, res) => {
    const userID = req.user.userId;

    try {
        const users = await User.findById(userID, { passwordHash: 0 });
        res.status(200).json({ status: "OK", data: users });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error fetching users",
            error,
        });
    }
};

exports.updateOneUser = async (req, res) => {
    const userID = req.user.userId;
    const { fullName, dob } = req.body;

    try {
        const users = await User.findByIdAndUpdate(userID, { dob, fullName });
        res.status(200).json({
            status: "OK",
            message: "Update Successful!",
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error fetching users",
            error,
        });
    }
};
exports.userChangePassword = async (req, res) => {
    const userID = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    try {
        const users = await User.findById(userID);

        const isMatch = await bcrypt.compare(
            currentPassword,
            users.passwordHash
        );
        if (!isMatch) {
            return res.status(400).json({
                status: "ERROR",
                message: "Invalid credentials! Current Password Invalid!",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        users.passwordHash = hashedPassword;

        await users.save();

        res.status(200).json({
            status: "OK",
            message: "Update Successful!",
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Error fetching users",
            error,
        });
    }
};

exports.userAccountActivation = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                status: "ERROR",
                message: "User not found ",
            });
        }

        user.isActive = !user.isActive;

        await user.save();

        res.status(200).json({
            status: "OK",
            message:
                "User account " + user.isActive ? "activated" : "deactivated",
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Server error",
            error,
        });
    }
};
exports.activateEmail = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                status: "ERROR",
                message: "User not found ",
            });
        }
        if (user.isOTPValidate) {
            return res.status(400).json({
                status: "ERROR",
                message: "User Already Validated! Please Login again!",
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpHash = await bcrypt.hash(otp.toString(), 10);

        await sendEmailFunc(
            user.email,
            "Your OTP for Account Activation",
            `
        Hi ${user.name},

            Thank you for signing up with Cyber Security Quiz App!

            To complete your account activation, please use the following One-Time Password (OTP):

            OTP: ${otp}

            This code is valid for the next 10 minutes. Please do not share it with anyone.

            If you did not request this, please ignore this email or contact our support team.

        Best regards,
        Cyber Security Quiz App
                `
        );
        user.OTPHash = otpHash;

        await user.save();

        return res.status(200).json({
            status: "OK",
            message: "OTP sent successfully!",
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Server error",
            error,
        });
    }
};
exports.validateOTP = async (req, res) => {
    const { userId, OTP } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                status: "ERROR",
                message: "User not found ",
            });
        }
        const isMatch = await bcrypt.compare(OTP, user.OTPHash);
        if (isMatch) {
            user.isOTPValidate = true;
            await user.save();

            res.status(200).json({
                status: "OK",
                message: "User account activated! Please login again.",
            });
        } else {
            return res.status(400).json({
                status: "ERROR",
                message: "OTP Does not match!",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Server error",
            error,
        });
    }
};
// Deactivate User Account
exports.delete = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user || user.isDeleted) {
            return res.status(400).json({
                status: "ERROR",
                message: "User not found or already deleted",
            });
        }

        user.isActive = false;
        user.isDeleted = true;
        user.email = new Date().getTime() + "-deleted-" + user.email;

        await user.save();

        res.status(200).json({
            status: "OK",
            message: "User account deactivated",
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Server error",
            error,
        });
    }
};
