import { userModel } from "./user.model.js";
import bcrypt from 'bcrypt';


export async function updateUser(req, res, next) {
    try {
        const { _id, avatarURL } = req.user;
        const { filename } = req.file;
        const { email, password } = req.body
        const existUser = await userModel.findOne({ email });
        if (existUser) {
            return res.status(409).json({ message: "Email in use" });
        }

        const oldAvatar = avatarURL.replace(baseAvatarURL, '');
        const src = path.join(__dirname, (`../../public/images/${oldAvatar}`));
        await fs.promises.unlink(src);
        const newAvatarURL = baseAvatarURL + filename;
        const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        const baseAvatarURL = 'http://localhost:3000/images/';
        const updatedUser = await UserModel.findByIdAndUpdate(_id, { avatarURL: newAvatarURL, email, password: passwordHash }, { new: true });


        return res.status(200).send({ avatarURL: updatedUser.avatarURL, email, password: passwordHash });
    } catch (error) {
        next(error);
    }
}


export async function updateSubscription(req, res, next) {
    try {
        const { body: { subscription }, user: { _id } } = req;

        const updatedUser = await userModel.findByIdAndUpdate(_id, subscription);

        return res.status(200).json({
            email: updatedUser.email,
            subscription: updatedUser.subscription,
        });
    } catch (error) {
        next(error);
    }
}
export async function getCurrentUser(req, res, next) {
    try {
        const user = req.user;
        const { email, subscription } = user;
        return res.status(200).json({
            email: email,
            subscription: subscription,
        });
    } catch (error) {
        next(error);
    }
}