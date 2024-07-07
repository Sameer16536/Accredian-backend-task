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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const OAuth2 = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
OAuth2.setCredentials({ refresh_token: REFRESH_TOKEN });
const sendMail = (to, username, referrerEmail, referralCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield OAuth2.getAccessToken();
        const transport = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'sameermarathe15@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });
        const mailOptions = {
            from: 'sameermarathe15@gmail.com',
            to: to,
            subject: 'Referral Code',
            text: `Hello from ${username},\n\nYour referral code is ${referralCode}.\n\nPlease share this code with your friends and family to earn some extra cash.\n\nRegards,\n${referrerEmail}`,
        };
        const result = yield transport.sendMail(mailOptions);
        return result;
    }
    catch (error) {
        console.error('Error while sending email:', error);
        throw new Error('Failed to send email');
    }
});
exports.sendMail = sendMail;
