var mailer = require('nodemailer');

function configureMailerTransporter(mailer, config) {
    var transporter = mailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.gmail.address,
            pass: config.gmail.pass
        }
    });

    return transporter;
}

function sendEmail(subscriber, content, subject, config, callback) {
    var transporter = configureMailerTransporter(mailer, config);

    var mailOptions = {
        from: config.email.from,
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