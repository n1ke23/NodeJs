import express from "express";
import Joi from "joi";
import { authorize, validate, } from "../helpers/validate.js";
import { updateSubscription, getCurrentUser, updateUserAvatar } from "./user.controller.js";
import { imageCreator } from "../helpers/downloadImg.js"

const router = express.Router();

const userSchema = Joi.object({
    subscription: Joi.string().valid("free", "pro", "premium").required(),
});
router.get("/current", authorize, getCurrentUser);
router.patch("/", authorize, validate(userSchema), updateSubscription);
router.patch("/avatar", imageCreator, updateUserAvatar)

export const userRouter = router;