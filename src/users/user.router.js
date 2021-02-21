
import express from "express";
import Joi from "joi";
import { authorize, validate, } from "../helpers/validate.js";
import { updateSubscription, getCurrentUser } from "./user.controller.js";

const router = express.Router();

const userSchema = Joi.object({
    subscription: Joi.string().valid("free", "pro", "premium").required(),
});
router.get("/current", authorize, getCurrentUser);
router.patch("/", authorize, validate(userSchema), updateSubscription);

export const userRouter = router;