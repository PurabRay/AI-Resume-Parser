const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendApplicationNotification(jobseeker, job) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: jobseeker.email,
    subject: `Application Received - ${job.title}`,
    html: `
      <h1>Application Received</h1>
      <p>Thank you for applying to the ${job.title} position.</p>
      <p>We will review your application and get back to you soon.</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

async function sendStatusUpdateNotification(jobseeker, job, status) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: jobseeker.email,
    subject: `Application Status Update - ${job.title}`,
    html: `
      <h1>Application Status Update</h1>
      <p>Your application for ${job.title} has been ${status}.</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendApplicationNotification,
  sendStatusUpdateNotification
}; 