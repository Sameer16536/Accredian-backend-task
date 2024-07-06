"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = path_1.default.join(__dirname, '../token.json');
const CREDENTIALS_PATH = path_1.default.join(__dirname, '../credentials.json');
// Load credentials from the credentials.json file
const loadCredentials = () => {
    return JSON.parse(fs_1.default.readFileSync(CREDENTIALS_PATH, 'utf-8'));
};
// Load token from the token.json file
const loadToken = () => {
    return JSON.parse(fs_1.default.readFileSync(TOKEN_PATH, 'utf-8'));
};
const authorize = () => __awaiter(void 0, void 0, void 0, function* () {
    const credentials = loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    try {
        const token = loadToken();
        oAuth2Client.setCredentials(token);
    }
    catch (error) {
        console.error('Error loading token:', error);
        throw new Error('Token not found. Please authorize the app first.');
    }
    return oAuth2Client;
});
const sendEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    const oAuth2Client = yield authorize();
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth: oAuth2Client });
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
        const res = yield gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });
        console.log('Email sent:', res.data);
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
});
exports.sendEmail = sendEmail;
