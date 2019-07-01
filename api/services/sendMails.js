"use strict";
const nodemailer = require("nodemailer");

const { NODEMAILER_EMAILID, NODEMAILER_PASSWORD } = process.env;

const auth = {
  user: NODEMAILER_EMAILID,
  pass: NODEMAILER_PASSWORD
};

// async..await is not allowed in global scope, must use a wrapper
const mail = async (name, email, message) => {

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport

  const transporter = nodemailer.createTransport({ service: 'gmail', auth });

  const HTML = `<p>
    <br /> Dear ${name}, <br />
    Your Password for CRM Account.
    Please use the below password in order to login.
    <br /><br />
    <strong> Password : </strong>
    <strong> ${message} </strong>
    <br /><br />
    If you have any questions or issues, please feel free to email us directly at
    <a href="mailto:${auth.user}" target="_top">${auth.user}</a> . <br /><br />
    Regards<br />
    CRM Team.
  </p>`;

  const mailOptions = {
    from: auth.user,
    to: email,
    subject: "CRM Account Password Reset",
    text: "Your Password for CRM Account.",
    html: HTML
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Mail sent to : %s", email);
  console.log("Message sent : %s", info.messageId);

}

module.exports = mail;