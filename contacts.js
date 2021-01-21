const fs = require('fs').promises;
const path = require('path');

/*
 * Раскомментируй и запиши значение
  */
const contactsPath = path.join(__dirname, "./db/contacts.json");


// TODO: задокументировать каждую функцию
async function listContacts() {
    const data = await fs.readFile(contactsPath, "utf8");
    // console.log(JSON.parse(data));
    console.table(JSON.parse(data))
}
// listContacts()

async function getContactById(contactId) {
    // ...твой код (найти по айдишке)
    const data = await (fs.readFile(contactsPath, "utf8"));
    const getContact = await (JSON.parse(data).find(user => user.id === contactId));
    console.log(getContact);
}
// getContactById(1)

async function removeContact(contactId) {
    // ...твой код
    const data = await (fs.readFile(contactsPath, "utf8"));
    const getContacts = await (JSON.parse(data));
    if (getContacts.find(user => user.id === contactId)) {
        const updateData = await getContacts.filter(user => user.id !== contactId);

        await (fs.writeFile(contactsPath, JSON.stringify(updateData), err => {
            if (err) { console.warn(err) }
        }));
        console.table(JSON.parse(await (fs.readFile(contactsPath, "utf8")))); // проиверяю удаление

    } else {
        console.log(`Такого id ${contactId} нету в базе`);
    }

}
// removeContact(12)

async function addContact(name, email, phone) {
    // ...твой код
    const data = await (fs.readFile(contactsPath, "utf8"));
    const getContacts = await (JSON.parse(data));
    const nextId = getContacts[getContacts.length - 1].id + 1;
    const newContact = { id: nextId, name, email, phone }

    // вариант перезаписать
    getContacts.push(newContact);
    await (fs.writeFile(contactsPath, JSON.stringify(getContacts), err => { if (err) { console.warn(err) } }));
    console.table(JSON.parse(await (fs.readFile(contactsPath, "utf8")))); // проиверяю запись

    // вариант добавить 
    // await (fs.appendFile(contactsPath, JSON.stringify(newContact), err => {
    //     if (err) { console.warn(err) }
    // }));
    // console.table(JSON.parse(await (fs.readFile(contactsPath, "utf8")))); // проиверяю запись
    // !!!NB в файл добовляет после массива и получаеться в итогеуц не жейсоновский формат 
}
// addContact("Alex", "aa@BhxBrowser.ru", "066666666")

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
}