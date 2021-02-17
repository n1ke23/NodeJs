import Joi from 'joi';


export const addContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(8).required(),
    subscription: Joi.string().required(),
    password: Joi.string().min(6).max(20).required(),
    token: Joi.string().token(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().min(8),
    subscription: Joi.string().required(),
    password: Joi.string().min(6).max(20).required(),
}).min(1);

