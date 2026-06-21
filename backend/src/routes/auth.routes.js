const express = require('express');
const authRouter = express.Router();

const {registerUserController, loginUserController, logoutUserController, getMeController} = require('../controller/auth.controller');

const {authMiddleware} = require('../middleware/auth.middleware');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post('/login', loginUserController); 
 
/**
 * @route POST /api/auth/logout
 * @desc Logout a user by blacklisting the token and clearing the cookie
 * @access Public
 */
authRouter.post('/logout', authMiddleware, logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @desc Get current user info, first checks for valid JWT token in cookie, then retrieves user info from database
 * @access Private
 */
authRouter.get('/get-me', authMiddleware, getMeController);

module.exports = authRouter;