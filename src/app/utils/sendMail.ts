import nodemailer from 'nodemailer';
import config from '../config';

export const sendMail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_env === 'production',
    auth: {
      user: 'mkiuzzal07@gmail.com',
      pass: 'mqef beos qyjc mjai',
    },
  });

  await transporter.sendMail({
    from: 'mkiuzzal007@gmail.com',
    to: 'mkiuzzal07@gmail.com',
    subject: 'Reset password within 10 minutes',
    text: '',
    html: `${html}`,
  });
};
