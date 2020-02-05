const nodemailer = require('nodemailer');
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
// AWS.config.loadFromPath('aws-config.json');
mailBody = "this is testmail"

var transporter = nodemailer.createTransport({
    SES: new AWS.SES({
        apiVersion: '2010-12-01'
    })
});

var mailOptions = {
    from: 'helpdesk@pasnet.us',
    to: '442056022@qq.com',
    subject: 'Moac Gateway Issue (This is not a test)',
    text: mailBody
};

transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
