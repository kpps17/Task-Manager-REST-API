const nodemailer = require('nodemailer');
const { adminEmail, adminPassword } = require('../secrets');

module.exports.welcomeEmail = async function welcomeEmail(user) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: adminEmail, // generated ethereal user
            pass: adminPassword, // generated ethereal password
        },
    });
    
    let clientEmail = user.email;
    
    let mailOptions = {
        from: `"Task-Manager-Rest-API"${adminEmail}`,
        to : `${clientEmail}`,
        subject: "Welcome User",
        html: "<h2> Hii welcome to a Task Manager </h2>"
    };
    
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            // console.log('sucess');
        }
    });
};