"use strict";
const nodemailer = require("nodemailer");

const { NODEMAILER_EMAILID, NODEMAILER_PASSWORD } = process.env;

const auth = {
  user: NODEMAILER_EMAILID,
  pass: NODEMAILER_PASSWORD
};

// async..await is not allowed in global scope, must use a wrapper
const mail = async (emails = [''], subject, text, html = '') => {

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport

  const transporter = nodemailer.createTransport({ service: 'gmail', auth });

  const mailOptions = {
    from: auth.user,
    to: emails,
    subject,
    text,
    html
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Mail sent to : %s", emails);
  console.log("Message sent : %s", info.messageId);

}

module.exports = mail;
