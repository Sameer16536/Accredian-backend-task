import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import { ReferralInput, ReferreeInput } from '@sameer11/inputs';
import { generateReferralCode } from './util';
import cors from 'cors'
import { sendMail } from './authorize';
const app = express();

app.use(cors())
app.use(bodyParser.json());


//you are referring someone else -> Required Fields: email , username , generate code , send email to referree
app.post('/referral', async (req, res) => {
  const { success } = ReferralInput.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Invalid Input" });
  }

  const { email, username, referralCode, referreeEmail } = req.body;
  console.log(req.body);
  console.log(email, username, referralCode, referreeEmail)
  try {
    const referrer = await prisma.referrer.findUnique({ where: { email } });
    if (!referrer) {
      return res.status(400).json({ message: "Invalid Referrer" });
    }

    const referree = await prisma.referree.findUnique({ where: { email: referreeEmail } })
    if (!referree) {
      const receiver = await prisma.referree.create({
        data: {
          email: referreeEmail, // Make sure you save the referree's email
          referredBy: referrer.id,
          username,
        },
      });

      res.status(201).json(receiver);
    }


    await sendMail(referreeEmail, username, email, referralCode);






  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Enter email , enter referral code
app.post('/referree', async (req, res) => {
  const { success } = ReferreeInput.safeParse(req.body)
  if (!success) {
    return res.status(400).json({ message: "Invalid Input" })
  }

  const { email, referralCode } = req.body()
  try {

    const code = await prisma.referrer.findUnique({ where: { referralCode } })
    if (!code) {
      return res.status(404).json({ error: "Referral code not found" })
    }
    else {
      const referree = await prisma.referree.create({
        data: {
          email,
          referredBy: code.id,
        }
      })
    }
  }
  catch (err) {
    console.log(err)
  }


})
app.post('/generatecode', async (req, res) => {
  const { email } = req.body;
  try {
    const code = generateReferralCode(email)
    return res.json({
      referralCode: code
    })
  }
  catch (err) {
    console.log(err)
  }
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});