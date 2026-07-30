const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: false, // false for port 587 (uses STARTTLS), true would be for port 465
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: `ThinkForge <${process.env.BREVO_FROM_EMAIL}>`,
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