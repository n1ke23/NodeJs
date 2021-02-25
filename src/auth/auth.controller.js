import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { userModel } from '../users/user.model.js';
import { avatarCreate } from '../helpers/avatarGenerator.js';
import { getPaths } from '../helpers/utils.js';
import { default as fsWithCallbacks } from 'fs';
import { v4 as uuidv4 } from 'uuid';
const fs = fsWithCallbacks.promises;

export async function registerUser(req, res, next) {
    try {
        const { email, password, subscription } = req.body;
        const existUser = await userModel.findOne({ email });
        if (existUser) {
            return res.status(409).json({ message: "Email in use" });
        }
        const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

        const avatarName = await avatarCreate();
        const avatarURL = 'http://localhost:3000/images/' + avatarName;
        const verificationToken = uuidv4();
        await userModel.create({ avatarURL, email, pasword: passwordHash, verificationToken });

        // const { __dirname } = getPaths(import.meta.url);
        const src = path.join(__dirname, (`../../tmp/${avatarName}`));
        const dest = path.join(__dirname, (`../../public/images/${avatarName}`));
        await fs.copyFile(src, dest, (err) => {
            if (err) throw err
        });
        await fs.unlink(src);
        const verificationLink = `http://localhost:3000/auth/verify/${verificationToken}`
        await emailMsg(email, verificationLink)
        return res.status(201).send({ user: { email, subscription } });
    } catch (err) {
        next(err);
    }
};

export async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;
        const existUser = await userModel.findOne({ email });
        if (!existUser) {
            return res.status(401).json({ message: "Email or password is wrong" });
        }
        if (!existUser.verificationToken) {
            return res.status(401).json({ message: "User not verification account" })
        }
        const isPasswordValid = await bcrypt.compare(password, existUser.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email or password is wrong" });
        }
        const token = jwt.sign({ userId: existUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        await userModel.findByIdAndUpdate(existUser._id, { token });
        return res.status(200).send({ token, user: { email, subscription: existUser.subscription } });
    }
    catch (err) {
        next(err);
    }
};

export async function logOut(req, res, next) {
    try {
        const { user, token } = req;

        await userModel.updateOne(
            { _id: user._id },
            {
                $pull: { tokens: token },
            }
        );
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export async function verifyUser(req, res, next) {
    const { verificationToken } = req.params;
    const user = await userModel.findOne({ verificationToken });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    await userModel.findOneAndUpdate({ _id: user._id }, { verificationToken: "", });

    return res.status(200).send();
};