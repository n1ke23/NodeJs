import { default as fsWithCallbacks } from 'fs';
const fs = fsWithCallbacks.promises;
import path from 'path';

// const __dirname = dirname(__filename);
// const contactsPath = path.join(__dirname, "../../db/contacts.json");
const contactsPath = path.format({
    root: './db/',
    name: 'contacts',
    ext: '.json'
});

async function listContacts(req, res, next) {
    try {
        const data = await fs.readFile(contactsPath, "utf8");
        return res.status(200).send(JSON.parse(data))
    } catch (error) {
        next(error)
    }
}


async function getContactById(req, res, next) {
    try {
        const { contactId } = req.params;
        const data = await (fs.readFile(contactsPath, "utf8"));
        const getContact = JSON.parse(data).find(user => user.id === contactId);
        getContact ? res.status(200).send(getContact) : res.status(404).send({ message: 'Not found' })
    } catch (error) {
        next(error)
    }
}

async function removeContact(req, res, next) {
    try {
        const { contactId } = req.params;
        const data = await (fs.readFile(contactsPath, "utf8"));
        const getContacts = JSON.parse(data);
        if (getContacts.find(user => user.id === contactId)) {
            const updateData = await getContacts.filter(user => user.id !== contactId);
            await (fs.writeFile(contactsPath, JSON.stringify(updateData), 'utd-8'));
            return res.status(200).send({ message: "contact deleted" });
        } else {
            return res.status(404).send({ message: "Not found" });
        }
    } catch (error) {
        next(error)
    }
}


async function addContact(req, res, next) {
    try {

        const data = await (fs.readFile(contactsPath, "utf8"));
        const getContacts = JSON.parse(data);
        const nextId = getContacts[getContacts.length - 1].id + 1;
        const newContact = { id: nextId, ...req.body }

        getContacts.push(newContact);
        await (fs.writeFile(contactsPath, JSON.stringify(getContacts), 'utf-8'));

        return res.status(201).send(newContact);
    } catch (error) {
        next(error)
    }

}
async function updateContact(req, res, next) {
    try {
        const data = await fs.readFile(contactsPath, "utf-8");

        const { contactId } = req.params;
        const parsedData = JSON.parse(data);
        const existContactIdx = parsedData.findIndex((contact) => contact.id == contactId);

        if (existContactIdx === -1) {
            return res.status(404).send({ message: "Not found" });
        }

        const updatedData = parsedData.map((contact) =>
            contact.id == contactId ? { ...contact, ...req.body } : contact
        );
        const stringifyParsedData = JSON.stringify(updatedData, null, 2);

        await fs.writeFile(contactsPath, stringifyParsedData, "utf-8");

        const updatedContact = updatedData[existContactIdx];

        return res.status(200).send(updatedContact);
    } catch (error) {
        next(error);
    }

}
export {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact
}