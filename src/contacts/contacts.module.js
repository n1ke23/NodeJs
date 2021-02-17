
import { contactModel } from "./contacts.model.js";


async function listContacts(req, res, next) {
    try {
        const data = await contactModel.find();
        console.log("listContacts", data);
        return res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}


async function getContactById(req, res, next) {
    try {
        const { contactId } = req.params;
        const data = await contactModel.findOne({ _id: contactId });
        return data
            ? res.status(200).json(data)
            : res.status(404).send({ message: "Not found" });
    } catch (error) {
        next(error)
    }
}

async function removeContact(req, res, next) {
    try {
        const { contactId } = req.params;
        const data = await contactModel.findByIdAndDelete(contactId);
        return data
            ? res.status(200).json({ message: "contact deleted" })
            : res.status(404).send({ message: "Not found" });
    } catch (error) {
        next(error)
    }
}


async function addContact(req, res, next) {
    try {
        const data = await contactModel.create(req.body);
        return res.status(201).send(data)
    } catch (error) {
        next(error)
    }

}
async function updateContact(req, res, next) {
    try {
        const { contactId } = req.params;

        const data = await contactModel.findByIdAndUpdate(
            contactId,
            { $set: req.body },
            { new: true }
        );

        return data
            ? res.status(200).json(data)
            : res.status(404).send({ message: "Not found" });

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