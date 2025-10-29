const USERSModel = require("./../models/user.model");

const {
    generateToken,
    isValidEmail,
    isValidPassword,
    hashPassword,
    comparePassword,
} = require("../utils/authUtils");

const userSignUpController = async (req, res) => {
    try {
        const { email, password, role, address } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and role are required",
            });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }
        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters long and contain at least one letter and one number",
            });
        }
        const existingUser = await USERSModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await USERSModel.create({
            email,
            password: hashedPassword,
            role,
            address: address || "",
        });
        const token = generateToken(newUser._id, newUser.email, newUser.role);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                userId: newUser._id,
                email: newUser.email,
                role: newUser.role,
                address: newUser.address,
                memberSince: newUser.memberSince.toISOString().split("T")[0],
                token,
            },
        });
    } catch (error) {
        console.error("Error in userSignUpController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during registration",
            error: error.message,
        });
    }
};

const userSignInController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }
        const user = await USERSModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const token = generateToken(user._id, user.email, user.role);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                userId: user._id,
                email: user.email,
                role: user.role,
                address: user.address,
                memberSince: user.memberSince,
                token,
            },
        });
    } catch (error) {
        console.error("Error in userSignInController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during login",
            error: error.message,
        });
    }
};

const userProfileController = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No user ID found",
            });
        }

        const user = await USERSModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: {
                userId: user._id,
                email: user.email,
                role: user.role,
                address: user.address,
                memberSince: user.memberSince.toISOString().split("T")[0]
            },
        });
    } catch (error) {
        console.error("Error in userProfileController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching profile",
            error: error.message,
        });
    }
};

module.exports = {
    userSignUpController,
    userSignInController,
    userProfileController,
};