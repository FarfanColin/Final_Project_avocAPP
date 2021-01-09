//The purpose of this page is to send a email verification,once the user has signed up, confirming that the account was created successfull
const nodemailer = require('nodemailer');
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

module.exports = () => {

  const sendEmail = async (email) => {
    const output = `
        <h2><p>THANK YOU FOR REGISTER WITH US</p><h2>
        <h3>CONTACT DETAILS</h3>
        <ul>  
          <li>Email:${email}</li>
        </ul>
        <h3>YOU ARE READY TO GO!</h3>
        <p>Now you can start order online, just go back to the home page</p>
      `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL, // generated ethereal user

        pass: process.env.PASSWORD  // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"avocAPP" <no-reply@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Email Confirmation', // Subject line
      html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('user/email_sent', { layout: false });
    });
  }

  return {
    sendEmail
  }
}