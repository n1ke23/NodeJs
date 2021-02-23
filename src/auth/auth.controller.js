import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { userModel } from '../users/user.model.js';
import { avatarCreate } from '../helpers/avatarGenerator.js';
import { getPaths } from '../helpers/utils.js';
import { default as fsWithCallbacks } from 'fs';
const fs = fsWithCallbacks.promises;

export async function registerUser(req, res, next) {
    try {
        const { email, password, subscription } = req.body;
        const existUser = await userModel.findOne({ email });
        if (existUser) {
            return res.status(409).json({ message: "Email in use" });
        }
        const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        await userModel.create({ email, pasword: passwordHash });

        const avatarName = await avatarCreate();
        // const { __dirname } = getPaths(import.meta.url);
        const src = path.join(__dirname, (`../../tmp/${avatarName}`));
        const dest = path.join(__dirname, (`../../public/images/${avatarName}`));
        await fs.copyFile(src, dest, (err) => {
            if (err) throw err
        });
        await fs.unlink(src);

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