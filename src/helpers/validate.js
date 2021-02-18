import mongoose from "mongoose";
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
        // const validationResult = schema.validate(req[reqPart]);
        // if (validationResult.error) {
        //     return res.status(400).json({
        //         message: validationResult.error.message,
        //     });
        // }

        next();
    };
}