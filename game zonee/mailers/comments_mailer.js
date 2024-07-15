const nodeMailer = require('../config/nodemailer');

exports.newComment= (comment)=> {
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs')
    nodeMailer.transporter.sendMail({
        from: 'anshuinfinity19@gmail.com',
        to: comment.user.email,
        subject: "Your first comment Published",
        html: htmlString
    }, (err, info)=>{
        if(err){
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent', info);
        return;
    });
}