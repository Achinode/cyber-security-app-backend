const nodemailer = require("nodemailer");

// Create a transporter object using the Gmail SMTP server
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_APP_PASSWORD,
    },
});

// Function to send email
function sendEmailFunc(to, subject, text) {
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: to,
        subject: subject,
        text: text,
    };
    // Send email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            throw Error("Email not sent: " + error);
        } else {
            throw Error("Email successfully sent to " + to);
        }
    });
}

module.exports = sendEmailFunc;
