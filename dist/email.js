"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReferralEmail = sendReferralEmail;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = 'token.json';
function sendReferralEmail(to, username, referrerEmail) {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile('credentials.json', (err, content) => {
            if (err)
                return reject('Error loading client secret file:' + err);
            authorize(JSON.parse(content.toString()), auth => {
                sendEmail(auth, to, username, referrerEmail)
                    .then(() => resolve())
                    .catch(reject);
            });
        });
    });
}
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    fs_1.default.readFile(TOKEN_PATH, (err, token) => {
        if (err)
            return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token.toString()));
        callback(oAuth2Client);
    });
}
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err)
                return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            fs_1.default.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err)
                    return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}
function sendEmail(auth, to, username, referrerEmail) {
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
    const email = `
    From: "Your Name" <your.email@example.com>
    To: ${to}
    Subject: Referral Invitation
    Content-Type: text/plain; charset="UTF-8"

    Hi ${username},

    I would like to refer you to this amazing platform. Please check it out!

    Best regards,
    ${referrerEmail}
  `;
    const encodedMessage = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage,
        },
    });
}
