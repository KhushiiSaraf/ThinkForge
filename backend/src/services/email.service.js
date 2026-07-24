// backend/src/services/email.service.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOtpEmail(to, otp) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: 'Verify your email — ThinkForge',
    html: `
      <p>Your ThinkForge verification code is:</p>
      <h2 style="letter-spacing: 4px;">${otp}</h2>
      <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
    `,
  });
}

module.exports = { sendOtpEmail };