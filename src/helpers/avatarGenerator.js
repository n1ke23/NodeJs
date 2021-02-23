import AvatarGenerator from 'avatar-generator';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getPaths } from './utils';

const { __dirname } = getPaths(import.meta.url);
const avatar = new AvatarGenerator({
    //All settings are optional.
    parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth'], //order in which sprites should be combined
    partsLocation: path.join(__dirname, '../img'), // path to sprites
    imageExtension: '.png' // sprite file extension
});

export async function avatarCreate() {
    const variant = "male";
    const image = await avatar.generate("email@example.com", variant);
    const nameAvatar = `${uuidv4()}.png`;
    image
        .resize(300, 300)
        .png()
        .toFile(`${nameAvatar}`);
    return nameAvatar;
};