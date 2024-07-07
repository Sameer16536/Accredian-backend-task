"use strict";
// import { google } from 'googleapis';
// import fs from 'fs';
// import readline from 'readline';
// const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
// const TOKEN_PATH = 'token.json';
// export function sendReferralEmail(to: string, username: string, referrerEmail: string, referralCode: string) {
//   return new Promise<void>((resolve, reject) => {
//     fs.readFile('credentials.json', (err, content) => {
//       if (err) return reject('Error loading client secret file:' + err);
//       authorize(JSON.parse(content.toString()), auth => {
//         sendEmail(auth, to, username, referrerEmail, referralCode)
//           .then(() => resolve())
//           .catch((e) => {
//             console.log(e);
//             reject(e);
//           });
//       });
//     });
//   });
// }
// function authorize(credentials: any, callback: (auth: any) => void) {
//   const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
//   const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getNewToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token.toString()));
//     callback(oAuth2Client);
//   });
// }
// function getNewToken(oAuth2Client: any, callback: (auth: any) => void) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code: string) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err: any, token: any) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }
// function sendEmail(auth: any, to: string, username: string, referrerEmail: string, referralCode: string) {
//   const gmail = google.gmail({ version: 'v1', auth });
//   const email = `
//     From: "sameermarathe15@gmail.com"
//     To: ${to}
//     Subject: Referral Invitation
//     Content-Type: text/plain; charset="UTF-8"
//     Hi ${username},
//     Your referral code is: ${referralCode}
//     I would like to refer you to this amazing platform. Please check it out!
//     Best regards,
//     ${referrerEmail}
//   `;
//   const encodedMessage = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
//   return gmail.users.messages.send({
//     userId: 'me',
//     requestBody: {
//       raw: encodedMessage,
//     },
//   });
// }
