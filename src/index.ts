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
  console.log(email, username, referralCode, referreeEmail);
  
  try {
    // Check if the referree already exists in the database
    const existingReferree = await prisma.referree.findUnique({ where: { email: referreeEmail } });
    
    if (existingReferree) {
      return res.status(400).json({ message: "You cannot refer another person" });
    }

    // Create a new referree entry
    const newReferree = await prisma.referree.create({
      data: {
        email: referreeEmail,
        referredBy: email,  // Assuming 'email' is the referrer's email
        username,
      },
    });

    // Send the referral email
    await sendMail(referreeEmail, username, email, referralCode);

    res.status(201).json(newReferree);
  } catch (error) {
    console.error(error);
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