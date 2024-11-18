const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.sendConfirmationEmail = (recipient, orderDetailsHTML) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: 'Book Purchase Confirmation - University Bookstore',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; max-width: 600px; margin: auto; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
        <img src="https://res.cloudinary.com/drnefi8zc/image/upload/v1731865274/images_zlwd26.jpg" alt="College Photo" style="width: 100%; height: auto; border-radius: 5px; margin-bottom: 20px;">
        <h2 style="text-align: center; color: #004080;">University Bookstore</h2>
        <hr>
        <p style="font-size: 16px;">Dear Valued Customer,</p>
        <p>Thank you for your recent purchase from our university bookstore. Below are the details of your order:</p>
        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #004080;">Order Summary</h3>
          ${orderDetailsHTML}
        </div>
        <p>If you have any questions or need further assistance, please feel free to contact our support team at <a href="mailto:support@university.com">support@university.com</a>.</p>
        <p style="margin-top: 20px;">Best regards,</p>
        <p><strong>University Bookstore Team</strong></p>
        <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply directly to this email.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
