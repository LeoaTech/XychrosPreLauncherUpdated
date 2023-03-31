import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

export const sendemail = (options) => {
  const EMAIL_SERVICE = 'SendGrid';
  const EMAIL_USERNAME = 'apikey';
  const EMAIL_PASSWORD =
    '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';
  const EMAIL_FROM = 'sughra.mehdi@gmail.com';

  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
