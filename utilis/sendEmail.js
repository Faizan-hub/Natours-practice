const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const { options } = require('../app');
require('dotenv').config();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.firstName = user.name.split(' ')[0];
    this.from = `Faizan Riasat <${process.env.EMAIL_FORM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORTING,
      auth: {
        user: process.env.EMAIL_User_Name,
        pass: process.env.EMAIL_PassWord,
      },
    });
  }
  //Actual Email
  async sendTemplate(template, subject) {
    //1Render HTML
    const html = pug.renderFile(
      `D:\\Semester_4\\complete-node-bootcamp-master\\4-natours\\starter\\dev-data\\views\\email\\${template}.pug`,
      { firstName: this.firstName, url: this.url, subject }
    );
    //2Email Options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };
    //3Create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.sendTemplate('welcome', 'Welcome to natours family!');
  }
  async resetPassword() {
    await this.sendTemplate(
      'passwordReset',
      'Your password reset token(valid only for 10 minutes) '
    );
  }
};
/*const sendMail = async (options) => {
  const tranporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORTING,
    auth: {
      user: process.env.EMAIL_User_Name,
      pass: process.env.EMAIL_PassWord,
    },
  });
  const mailOptions = {
    from: 'Faizan Riasat <faizanriasat75@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await tranporter.sendMail(mailOptions);
};*/
