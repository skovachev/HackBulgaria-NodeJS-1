var personFirstNames = ['John', 'Sarah', 'Stefan'],
    personLastNames = ['Shepard', 'Kovachev', 'Lightyear'],
    phones = ['0898 123 456', '0891 345 123', '0987 123 321'],
    contactIds = ['1', '2', '3', '4', '5', '6', '7'];

function getRandomElement(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function generateName() {
    return getRandomElement(personFirstNames) + ' ' + getRandomElement(personLastNames);
}

function generatePhone() {
    return getRandomElement(phones);
}

function generateContact() {
    return {
        phoneNumber: generatePhone(),
        personIdentifier: generateName(),
    };
}

function generateGroupContacts() {
    contactIds.sort(function() {
        return 0.5 - Math.random();
    });
    return contactIds.slice(0, 2);
}

function generateContactGroup() {
    var groupName = getRandomElement(getRandomElement([personFirstNames, personLastNames]));
    return {
        groupName: groupName,
        contacts: generateGroupContacts()
    };
}

module.exports = {
    generateName: generateName,
    generatePhone: generatePhone,
    generateContact: generateContact,
    generateContactGroup: generateContactGroup
};