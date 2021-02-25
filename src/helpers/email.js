import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { getPaths } from './utils.js';

const { __dirname } = getPaths(import.meta.url);
dotenv.config({ path: path.join(__dirname, "./.env") })

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: MY_EMAIL,
        pass: MY_EMAIL_PASSWORD,
    },
});

async function emailMsg(email, verificationLink) {
    await transporter.sendMail({
        to: email,
        from: process.env.MY_EMAIL,
        subject: 'Hellow, I need verificed you email',
        html: `<h1>Please verify your email by click this <a href=${verificationLink}>verification link</a></h1>`,
    })
}

export default emailMsg(email, verificationLink)