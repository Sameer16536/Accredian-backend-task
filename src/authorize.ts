import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN!;

const OAuth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
OAuth2.setCredentials({ refresh_token: REFRESH_TOKEN });

export const sendMail = async (to: string, username: string, referrerEmail: string, referralCode: string) => {
  try {
    const accessToken = await OAuth2.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'sameermarathe15@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    } as nodemailer.TransportOptions);

    const mailOptions = {
      from: 'sameermarathe15@gmail.com',
      to: to,
      subject: 'Referral Code',
      text: `Hello from ${username},\n\nYour referral code is ${referralCode}.\n\nPlease share this code with your friends and family to earn some extra cash.\n\nRegards,\n${referrerEmail}`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error while sending email:', error);
    throw new Error('Failed to send email');
  }
};
