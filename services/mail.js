var nodemailer = require('nodemailer');

exports.send = function(email, pass, to, sub, txt){
    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
           ciphers:'SSLv3'
        },
        auth: {
            user: email,
            pass: pass,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    // setup e-mail data, even with unicode symbols
    var mailOptions = {
        from: email, // sender address (who sends)
        to: to, // list of receivers (who receives)
        subject: sub, // Subject line
        html: txt
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return false;
        }else{
            return true;
        }
    });
};