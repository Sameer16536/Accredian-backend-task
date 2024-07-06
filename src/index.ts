import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import { sendReferralEmail } from './email';
const prisma = new PrismaClient();
import { ReferralInput, ReferreeInput } from '@sameer11/inputs';
import { generateReferralCode } from './util';
import cors from 'cors'
const app = express();

app.use(cors())
app.use(bodyParser.json());


//you are referring someone else -> Required Fields: email , username , generate code , send email to referree
app.post('/referral', async (req, res) => {
  const { success } = ReferralInput.safeParse(req.body)
  if (!success) {
    return res.status(400).json({ message: "Invalid Input" })
  }
  const { email, username, referralCode, referreeEmail } = req.body;



  try {
    const referrer = await prisma.referrer.findUnique({ where: { email } })
    if (!referrer) {
      return res.status(400).json({ message: "Invalid Referrer" })
    }
    if (referreeEmail) {
      const referree = await prisma.referree.findUnique({ where: {email:referreeEmail} })
      if (referree) {
        await sendReferralEmail(email, username, referrer.email);

        res.status(201).json(referree);
      }
      const receiver = await prisma.referree.create({
        data: {
          email,
          username,
          referredBy: referrer.id,
        },
      });
  
      await sendReferralEmail(email, username, referrer.email);
  
      res.status(201).json(receiver);
    }
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
    if (referralCode) {
      const code = await prisma.referrer.findUnique({ where: { referralCode } })
      if (!code) {
        return res.status(404).json({ error: "Referral code not found" })
      }
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