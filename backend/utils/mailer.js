require('dotenv').config(); // Load .env variables

const nodemailer = require('nodemailer');

// Create a transporter object using your email provider's settings
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use Gmail as the email service
  auth: {
    user: process.env.EMAIL_USER,  // Your Gmail address (from .env)
    pass: process.env.EMAIL_PASS   // Your Gmail password or App Password (from .env)
  }
});

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender's email address
    to,                           // Recipient's email address
    subject,                      // Subject of the email
    text,                         // Plain text version of the email
    html                          // HTML version of the email
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
