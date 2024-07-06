"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferralCode = void 0;
const generateReferralCode = (email) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + email;
    let referralCode = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        referralCode += characters[randomIndex];
    }
    return referralCode;
};
exports.generateReferralCode = generateReferralCode;
