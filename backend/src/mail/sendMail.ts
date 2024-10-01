// import nodemailer from "nodemailer";
// import asyncHandler from "express-async-handler";
// const transporter = nodemailer.createTransport({
//   // @ts-ignore
//   host: process.env.BREVO_HOST,
//   port: process.env.BREVO_PORT,
//   secure: false, // Use `true` for port 465, `false` for all other ports
//   auth: {
//     user: process.env.BREVO_USER,
//     pass: process.env.BREVO_PASSWORD,
//   },
// });

// const sendMail = asyncHandler(async (email, url) => {
//   await transporter.sendMail({
//     from: '"Review" <verify@review.com>',
//     // @ts-ignore
//     to: email,
//     subject: "URL/OTP for verification",
//     text: "Single use URL/OTP",
//     // @ts-ignore
//     html: url,
//   });
// });

// export default sendMail;

import nodemailer from 'nodemailer';

const sendMail = () => {
  // Step 1: Create a transporter object with SMTP server details
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your SMTP server (e.g., smtp.gmail.com for Gmail)
    port: 465, // Use 587 for TLS or 465 for SSL
    secure: true, // Set to true if using port 465 (SSL)
    auth: {
      user: 'somnathchattaraj51@gmail.com', // Your SMTP username (email)
      pass: 'ejqcrhjwectmivcd',    // Your SMTP password
    },
  });

  // Step 2: Define the email options (sender, receiver, subject, and body)
  let mailOptions = {
    from: '"Campus-Chatter Admin" campus_chatter@gmail.com', // Sender address
    to: 'somnathc.it.ug@jadavpuruniversity.in',            // List of recipients
    subject: 'Hello from Node.js!',               // Subject line
    text: 'This is a test email sent using Nodemailer.', // Plain text body
    html: '<b>This is a test email sent using Nodemailer.</b>', // HTML body (optional)
  };

  // Step 3: Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error while sending email:', error);
    }
    console.log('Email sent successfully:', info.response);
  });


}

export default sendMail
