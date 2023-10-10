const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add the 'cors' middleware
const dotenv = require('dotenv'); // Import the dotenv package

// Load environment variables from the .env file
dotenv.config({ path: './config.env' });

const app = express();
const port = 3000; // You can choose any available port

// Replace these with your Gmail credentials
const senderEmail = 'aagortey@gmail.com';
const appPassword = process.env.GMAIL_APP_PASSWORD; // Generate an App Password from your Gmail account


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: senderEmail,
    pass: appPassword,
  },
});

// Configure bodyParser to parse JSON
app.use(bodyParser.json());

// Enable CORS for all routes (adjust origin and other options as needed)
app.use(cors());

app.post('/send-email', async (req, res) => {
  const { subject, message, recipientEmail } = req.body;
  console.log(req.body)

  if (!subject || !message || !recipientEmail) {
    return res.status(400).send('Missing required fields (subject, message, recipientEmail)');
  }

  const mailOptions = {
    from: senderEmail,
    to: recipientEmail,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('Email sent successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Email sending failed.'+ error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
