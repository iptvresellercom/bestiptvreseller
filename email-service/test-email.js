const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test email
const mailOptions = {
  from: process.env.SMTP_EMAIL,
  to: process.env.RECEIVER_EMAIL,
  subject: 'Test Email Service',
  html: `
    <h2>Email Service Test</h2>
    <p>This is a test email to verify that the email service is working correctly.</p>
    <p>If you received this email, the configuration is correct!</p>
  `
};

// Send test email
async function testEmail() {
  try {
    console.log('Testing email configuration...');
    
    // Verify connection
    await transporter.verify();
    console.log('✓ SMTP connection verified');
    
    // Send test email
    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Test email sent successfully');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('✗ Error testing email service:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your email and password.');
    } else if (error.code === 'EENVELOPE') {
      console.error('Invalid envelope. Please check the email addresses.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Connection timeout. Please check your network connection.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Please check the SMTP server settings.');
    }
  }
}

testEmail();