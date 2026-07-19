const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/user.blacklistToken');
const User = require('../models/user.model');

async function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
        const blacklistedToken = await blacklistTokenModel.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).json({ message: "Unauthorized: Token is invalid" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // fetch the live user from DB instead of trusting stale token data
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User no longer exists" });
        }

        req.user = user;
        next();
    }
    catch (error) {
        console.error("Error in authMiddleware:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = { authMiddleware };