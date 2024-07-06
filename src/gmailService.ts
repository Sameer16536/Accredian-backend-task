import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = path.join(__dirname, '../token.json');
const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json');

// Load credentials from the credentials.json file
const loadCredentials = () => {
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
};

// Load token from the token.json file
const loadToken = () => {
  return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
};

const authorize = async (): Promise<OAuth2Client> => {
  const credentials = loadCredentials();
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    const token = loadToken();
    oAuth2Client.setCredentials(token);
  } catch (error) {
    console.error('Error loading token:', error);
    throw new Error('Token not found. Please authorize the app first.');
  }

  return oAuth2Client;
};

const sendEmail = async (to: string, subject: string, text: string) => {
  const oAuth2Client = await authorize();
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const messageParts = [
    `From: your-email@gmail.com`,
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    text,
  ];
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  try {
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log('Email sent:', res.data);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export { sendEmail };
