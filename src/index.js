import express from "express";
import * as nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3007;
const senderEmail = process.env.username;
const gmailAppPassword = process.env.appPassword;

app.use(express.json());

app.post("/send-email", async (req, res) => {
  const { username, email, subscription, addOns } = req.body;
  const emailTemplate = `
    <p>Dear ${username},</p>
    <p>Thank you for subscribing to our service</p>
    <p>Here is the details of your opted subscription</p>
    <p><b>${subscription}<b></p>
    <p>Here is the details of your opted addOns</p>
    <p><b>${addOns}</b></p>
    <p>Best regards</p>
`;

  if (!username | !email)
    return res.status(400).json({ message: "Missing request body" });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: senderEmail,
      pass: gmailAppPassword,
    },
  });
  try {
    await transporter.sendMail({
      from: senderEmail,
      to: email,
      subject: "Subscription",
      html: emailTemplate,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

app.listen(port, () => {
  console.log("Server is listening in port ", port);
});
