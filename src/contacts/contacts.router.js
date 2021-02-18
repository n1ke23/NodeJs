import express from 'express';
import { listContacts, getContactById, addContact, removeContact, updateContact } from './contacts.module.js';
import { addContactSchema, updateContactSchema } from './contacts.schemes.js'
import { contactValidation } from './../helpers/validate.js'

const contactRouter = express.Router();

contactRouter.get('/', listContacts);
contactRouter.get('/:contactId', contactValidation(), getContactById);
contactRouter.post('/', contactValidation(addContactSchema), addContact);
contactRouter.delete('/:contactId', contactValidation(), removeContact);
contactRouter.patch('/:contactId', contactValidation(updateContactSchema), updateContact);

export default contactRouter;