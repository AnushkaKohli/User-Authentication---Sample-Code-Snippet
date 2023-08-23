const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        service: process.env.SMTP_SERVICE,
        port: process.env.MAIL_PORT,
        host: "smtp.gmail.com",
        secure:false,
        auth: {
            //SMTP - Simple Mail Transfer Protocol
            user:process.env.SMTP_MAIL,
            //Set up and app password after turning on the two factor verification on your goggle account
            pass:process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;