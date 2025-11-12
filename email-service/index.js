const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

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
  },
  logger: true,
  debug: true
});

console.log('Transporter created with config:', {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: process.env.SMTP_EMAIL
});

// Email sending endpoint
app.post('/send-recharge-notification', async (req, res) => {
  try {
    const { username, whatsapp, credits, price, panel_name, order_id } = req.body;
    
    console.log('Received email request:', { username, whatsapp, credits, price, panel_name, order_id });
    console.log('Environment variables loaded:', {
      SMTP_EMAIL: process.env.SMTP_EMAIL ? 'SET' : 'NOT SET',
      SMTP_PASSWORD: process.env.SMTP_PASSWORD ? 'SET' : 'NOT SET',
      RECEIVER_EMAIL: process.env.RECEIVER_EMAIL ? 'SET' : 'NOT SET'
    });
    
    // Validate environment variables
    const missingEnvVars = [];
    if (!process.env.SMTP_EMAIL) missingEnvVars.push('SMTP_EMAIL');
    if (!process.env.SMTP_PASSWORD) missingEnvVars.push('SMTP_PASSWORD');
    if (!process.env.RECEIVER_EMAIL) missingEnvVars.push('RECEIVER_EMAIL');
    
    if (missingEnvVars.length > 0) {
      console.warn('Missing environment variables:', missingEnvVars.join(', '));
      return res.status(400).json({ 
        error: 'Email configuration missing', 
        missingVariables: missingEnvVars 
      });
    }

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('Server is ready to take our messages');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError.message);
      return res.status(500).json({ error: 'SMTP configuration error', details: verifyError.message });
    }

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Credit Recharge - ${panel_name}`,
      html: `
        <h2>New Credit Recharge Notification</h2>
        <p><strong>Panel:</strong> ${panel_name}</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>Credits:</strong> ${credits}</p>
        <p><strong>Price:</strong> ${price}</p>
        ${order_id ? `<p><strong>Order ID:</strong> #${order_id}</p>` : ''}
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');
    
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email notification:', error);
    
    // Provide more specific error messages for common issues
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your email and password.');
      return res.status(401).json({ error: 'Authentication failed', details: 'Please check your email and password.' });
    } else if (error.code === 'EENVELOPE') {
      console.error('Invalid envelope. Please check the email addresses.');
      return res.status(400).json({ error: 'Invalid email addresses', details: 'Please check the email addresses.' });
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Connection timeout. Please check your network connection.');
      return res.status(504).json({ error: 'Connection timeout', details: 'Please check your network connection.' });
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Please check the SMTP server settings.');
      return res.status(503).json({ error: 'Connection refused', details: 'Please check the SMTP server settings.' });
    } else if (error.code === 'EINVALID') {
      console.error('Invalid configuration. Please check your SMTP settings.');
      return res.status(500).json({ error: 'Invalid configuration', details: 'Please check your SMTP settings.' });
    }
    
    res.status(500).json({ error: 'Failed to send email', details: error.message, code: error.code });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
  console.log(`SMTP Email: ${process.env.SMTP_EMAIL}`);
  console.log(`Receiver Email: ${process.env.RECEIVER_EMAIL}`);
});