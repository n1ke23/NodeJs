import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const { ObjectId } = mongoose.Types;
export function contactValidation(schema, reqPart = "body") {
    return (req, res, next) => {
        const { contactId } = req.params;
        if (!ObjectId.isValid(contactId)) {
            return res.status(400).send({ message: "invalid id" });
        }
        if (Object.keys(req[reqPart]).length == 0) {
            return res.status(400).json({
                message: "missing fields",
            });
        }
        const validationResult = schema.validate(req[reqPart]);
        if (validationResult.error) {
            return res.status(400).json({
                message: validationResult.error.details[0].message,
            });
        }

        next();
    };
}

export async function authorize(req, res, next) {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");

        let payload
        try {
            payload = await jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const user = await UserModel.findById(payload.userId)
        if (!user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        req.user = user;

        next()
    } catch (error) {
        next(error)
    }
}