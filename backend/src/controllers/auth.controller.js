const userModel = require('../models/user.model');
const blacklistTokenModel = require('../models/user.blacklistToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require("../validator/auth.validator");

/**
 * @name registerUserController
 * @route POST /api/auth/register
 * @desc Register a new user, expects {name, email, password} in the request body
 * @access Public
 */
async function registerUserController(req, res) {

    const { error } = registerSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }
    try {
        const { name, email, password } = req.body;


        // validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        // check if user with the same name or email already exists
        const existingUser = await userModel.findOne({
            $or: [{ name }, { email }]
        });
        if (existingUser) {
            if (existingUser.name === name) {
                return res.status(400).json({ message: "Username already exists" });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Account with this email already exists" });
            }
        }
        // create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    }
    catch (error) {
        console.error("Error in registerUserController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/** * @name loginUserController
 * @route POST /api/auth/login
 * @desc Login a user, expects {email, password} in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    const { error } = loginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }
    try {
        const { email, password } = req.body;


        // find user by email
        const user = await userModel.findOne({ email });

        // if user not found, return error
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    }
    catch (error) {
        console.error("Error in loginUserController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/** * @name logoutUserController
 * @route POST /api/auth/logout
 * @desc Logout a user by blacklisting the token and clearing the cookie
 * @access Public
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token;
        if (token) {
            // add token to blacklist
            const blacklistedToken = new blacklistTokenModel({ token });
            await blacklistedToken.save();
            // clear cookie
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });
            res.status(200).json({ message: "Logout successful" });
        }
    }
    catch (error) {
        console.error("Error in logoutUserController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/** * @name getMeController
 * @route GET /api/auth/me
 * @desc Get current user info, requires valid JWT token in cookie
 * @access Private
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User info retrieved successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};