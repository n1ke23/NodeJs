import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: "src/public/images",
    filename: function (req, file, cb) {
        const ext = path.parse(file.originalname).ext;
        cb(null, uuidv4(3) + ext);
    },
});

const upload = multer({ storage });

export default imageCreator = upload.single("avatar");