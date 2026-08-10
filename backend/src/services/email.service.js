const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendOtpEmail(to, otp) {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'ThinkForge', email: process.env.BREVO_FROM_EMAIL },
      to: [{ email: to }],
      subject: 'Verify your email — ThinkForge',
      htmlContent: `
        <p>Your ThinkForge verification code is:</p>
        <h2 style="letter-spacing: 4px;">${otp}</h2>
        <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      `,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo API error: ${response.status} — ${errorBody}`);
  }
}

module.exports = { sendOtpEmail };