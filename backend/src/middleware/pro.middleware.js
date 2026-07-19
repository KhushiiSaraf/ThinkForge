// backend/src/middleware/pro.middleware.js
const requirePro = (req, res, next) => {
  if (req.user.plan !== 'pro') {
    return res.status(403).json({ message: 'This feature requires a Pro subscription' });
  }
  next();
};

module.exports = requirePro;