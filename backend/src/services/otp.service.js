// backend/src/services/otp.service.js
const redisConnection = require('../config/redis.config'); // your existing ioredis instance

const OTP_TTL_SECONDS = 10 * 60;   // OTP valid for 10 minutes
const COOLDOWN_SECONDS = 60;       // 60s between resend requests

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}

async function storeOtp(userId, otp) {
  await redisConnection.set(`otp:${userId}`, otp, 'EX', OTP_TTL_SECONDS);
}

async function verifyOtp(userId, otp) {
  const storedOtp = await redisConnection.get(`otp:${userId}`);
  if (!storedOtp) return { valid: false, reason: 'expired' };
  if (storedOtp !== otp) return { valid: false, reason: 'mismatch' };
  await redisConnection.del(`otp:${userId}`); // one-time use — burn it after a correct verify
  return { valid: true };
}

async function isOnCooldown(userId) {
  const cooldown = await redisConnection.get(`otp:cooldown:${userId}`);
  return !!cooldown;
}

async function setCooldown(userId) {
  await redisConnection.set(`otp:cooldown:${userId}`, '1', 'EX', COOLDOWN_SECONDS);
}

module.exports = { generateOtp, storeOtp, verifyOtp, isOnCooldown, setCooldown };