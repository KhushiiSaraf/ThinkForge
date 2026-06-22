const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/user.blacklistToken');

/** * @name authMiddleware
 * @desc Middleware to protect routes by verifying JWT token in cookies
 * @access Private
 * Checks if the token is present in cookies, verifies it, and checks if it's blacklisted. If valid, attaches user info to req.user and calls next(). Otherwise, returns 401 Unauthorized.
*/ 

async function authMiddleware(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "Unauthorized: No token provided"});
    }
    try{
        // check if token is blacklisted
        const blacklistedToken = await blacklistTokenModel.findOne({ token });
        if(blacklistedToken){
            return res.status(401).json({message: "Unauthorized: Token is invalid"});
        }
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { ...decoded, _id: decoded.id };
        next();
    }
    catch (error) {
        console.error("Error in authMiddleware:", error);
        return res.status(401).json({message: "Unauthorized: Invalid token"});
    }
}

module.exports = {authMiddleware};