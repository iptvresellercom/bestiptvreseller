# Email Service

This is a simple Node.js email service that sends notifications when users submit credit recharge requests.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file with the following variables:
   ```
   SMTP_EMAIL=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   RECEIVER_EMAIL=receiver-email@gmail.com
   PORT=3001
   ```

3. **Start the Service**
   ```bash
   npm start
   ```

   Or use the provided batch file:
   ```
   start-email-service.bat
   ```

## Gmail Configuration

For Gmail SMTP to work:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in the `SMTP_PASSWORD` field

## Testing the Service

You can test if the service is running by visiting:
```
http://localhost:3001/health
```

To test the email endpoint directly:
```bash
curl -X POST http://localhost:3001/send-recharge-notification \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "whatsapp": "+1234567890",
    "credits": 100,
    "price": "€10.00",
    "panel_name": "Test Panel",
    "order_id": "12345"
  }'
```

## Troubleshooting

1. **Connection Refused Error**
   - Make sure the email service is running
   - Check that the PORT in `.env` matches the one used in PanelPage.tsx
   - Ensure no firewall is blocking the connection

2. **Email Not Sending**
   - Verify SMTP credentials are correct
   - Check that you're using an App Password, not your regular Gmail password
   - Ensure the RECEIVER_EMAIL is correctly set

3. **CORS Issues**
   - The service already includes CORS middleware to allow requests from any origin