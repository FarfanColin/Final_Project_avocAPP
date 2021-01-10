//The purpose of this page is to send a email verification,once the user has signed up, confirming that the account was created successfull
//We are using the "Nodemailer" module from node.js
//References for this page:
///https://nodemailer.com/about/
///https://www.youtube.com/channel/UC81OIFgbiCv9lE2ws07lsjA
//The Email and Password are stored on my .env file, as we can understand these are not visible
const nodemailer = require('nodemailer');
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

module.exports = () => {

  const sendEmail = async (email) => {
    //In the following lines, the body for the email is described
    const output = `
        <h2><p>THANK YOU FOR REGISTER WITH US</p><h2>
        <h3>CONTACT DETAILS</h3>
        <ul>  
          <li>Email:${email}</li>
        </ul>
        <h3>YOU ARE READY TO GO!</h3>
        <p>Now you can start order online, just go back to the home page</p>
      `;

    // Setting the port by the "Gmail host", using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', //As the web application will only works with Gmail account, the host will be set with Gmail
      port: 465, //The port for Gmail is 465
      secure: true, // True for 465, false for other ports
      auth: {
        user: process.env.EMAIL, // Email used in the nodemailer account

        pass: process.env.PASSWORD  // Password used in the nodemailer account
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Setting email data
    let mailOptions = {
      from: '"avocAPP" <no-reply@gmail.com>', // Email/Name where the email is being sent
      to: email, // Receiver(s)
      subject: 'Email Confirmation', // Subject
      html: output // Body
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