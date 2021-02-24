import express from "express";
import Joi from "joi";
import { authorize, contactValidation, } from "../helpers/validate.js";
import { updateSubscription, getCurrentUser, updateUser } from "./user.controller.js";
import imageCreator from "../helpers/downloadImg.js"

const router = express.Router();

const userSchema = Joi.object({
    subscription: Joi.string().valid("free", "pro", "premium").required(),
});
router.get("/current", authorize, getCurrentUser);
router.patch("/", authorize, contactValidation(userSchema), updateSubscription);
router.patch("/avatar", imageCreator, updateUser)

export const userRouter = router;