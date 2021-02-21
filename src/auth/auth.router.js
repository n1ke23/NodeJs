import express from "express";
import Joi from "joi";
import { validate, authorize } from "../helpers/validate.js";
import { registerUser, loginUser, logOut } from "./auth.controller.js";

const router = express.Router();

const authSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

router.post("/register", validate(authSchema), registerUser);

router.post("/login", validate(authSchema), loginUser);

router.post("/logout", authorize, logOut);

export const authRouter = router;