var mailer = require('nodemailer'),
    credentials = require('./gmail_credentials');

function configureMailerTransporter(mailer) {
    var transporter = mailer.createTransport({
        service: 'Gmail',
        auth: {
            user: credentials.address,
            pass: credentials.pass
        }
    });

    return transporter;
}

function sendEmail(subscriber, content, subject, from_email, callback) {
    var transporter = from_emailureMailerTransporter(mailer);

    var mailOptions = {
        from: from_email,
        to: subscriber.email,
        subject: subject,
        text: typeof content === 'string' ? content : content.text,
        html: typeof content === 'string' ? null : content.html
    };

    transporter.sendMail(mailOptions, callback);
}

module.exports = {
    sendEmail: sendEmail
};