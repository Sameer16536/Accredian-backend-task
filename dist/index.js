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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const client_1 = require("@prisma/client");
const email_1 = require("./email");
const prisma = new client_1.PrismaClient();
const inputs_1 = require("@sameer11/inputs");
const util_1 = require("./util");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
//you are referring someone else -> Required Fields: email , username , generate code , send email to referree
app.post('/referral', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = inputs_1.ReferralInput.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Invalid Input" });
    }
    const { email, username, referralCode, referreeEmail } = req.body;
    try {
        const referrer = yield prisma.referrer.findUnique({ where: { email } });
        if (!referrer) {
            return res.status(400).json({ message: "Invalid Referrer" });
        }
        if (referreeEmail) {
            const referree = yield prisma.referree.findUnique({ where: { email: referreeEmail } });
            if (referree) {
                yield (0, email_1.sendReferralEmail)(email, username, referrer.email);
                res.status(201).json(referree);
            }
            const receiver = yield prisma.referree.create({
                data: {
                    email,
                    username,
                    referredBy: referrer.id,
                },
            });
            yield (0, email_1.sendReferralEmail)(email, username, referrer.email);
            res.status(201).json(receiver);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
//Enter email , enter referral code
app.post('/referree', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = inputs_1.ReferreeInput.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Invalid Input" });
    }
    const { email, referralCode } = req.body();
    try {
        if (referralCode) {
            const code = yield prisma.referrer.findUnique({ where: { referralCode } });
            if (!code) {
                return res.status(404).json({ error: "Referral code not found" });
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}));
app.post('/generatecode', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const code = (0, util_1.generateReferralCode)(email);
        return res.json({
            referralCode: code
        });
    }
    catch (err) {
        console.log(err);
    }
}));
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
