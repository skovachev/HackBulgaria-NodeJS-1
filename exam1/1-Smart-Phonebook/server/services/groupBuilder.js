var Levenshtein = require('levenshtein'),
    debug = require('debug')('GroupBuilder'),
    _ = require('underscore'),
    groups = [];

function formatToken(token) {
    token = token.toLowerCase();
    return token.charAt(0).toUpperCase() + token.slice(1);
}

function compareGroupName(nameA, nameB)
{
    if (!_.isArray(nameA)) {
        nameA = [nameA];
    }
    if (!_.isArray(nameB)) {
        nameB = [nameB];
    }
    nameA.sort();
    nameB.sort();

    for (var i = 0, l = nameA.length; i < l; i++) {
        if (i >= nameA.length && i >= nameB.length) {
            // equal lengths and equal tokens => equal
            return 0;
        }
        else if (i >= nameA.length) {
            // name A is shorter => sorted first
            return 1;
        }
        else if (i >= nameB.length) {
            // name B is shorter => sorted first
            return -1;
        }

        if (nameA[i] === nameB[i]) {
            continue;
        }
        else if (nameA[i] > nameB[i]) {
            return -1;
        }
        else {
            return 1;
        }
    }

    return 0;
}

function tokenMatchesGroupName(token, group) {
    return token === group.groupName || _.indexOf(group.groupName, token) !== -1;
}

function findGroupsByToken(token) {
    return _.filter(groups, function(group){
        return token === group.groupName || _.indexOf(token, group.groupName) !== -1;
    });
}

function sortGroups(groups) {
    return groups.sort(compareGroupName);
}

function createFuzzyGroup(token, otherToken, contact_ids) {
    var group = createGroup([token, otherToken], contact_ids);
    group['type'] = 'fuzzy';
    debug('created fuzzy group', group);
    return group;
}

function createNormalGroup(token, contact_ids) {
    var group = createGroup(token, contact_ids);
    debug('created normal group', group);
    return group;
}

function createGroup(token, contact_ids) {
    if (!_.isArray(contact_ids))
    {
        contact_ids = [contact_ids];
    }
    var existingGroups = findGroupsByToken(token);
    
    if (existingGroups.length > 0) {
        existingGroups.forEach(function(existingGroup){
            contact_ids = contact_ids.concat(existingGroup.contacts);
        });
        contact_ids = _.uniq(contact_ids);
    }
    return {
        'groupName': token,
        'contacts': contact_ids
    };
}

function tokenizeContactIdentifier(contact) {
    return contact.personIdentifier.split(/\s/).map(function(token){
        return formatToken(token);
    });
}

function groupResponse(new_groups, removed_groups) {
    new_groups = new_groups || [];
    removed_groups = removed_groups || [];
    return {
        update: sortGroups(new_groups),
        remove: sortGroups(removed_groups)
    };
}

function addNewContact(contact) {
    var tokens = tokenizeContactIdentifier(contact);

    var new_groups = [];

    var group_tokens = _(groups).chain().map(function(group) {
        return group.groupName;
    }).flatten().uniq().value();

    // add new groups for new tokens
    var new_tokens = _.difference(tokens, group_tokens);
    new_tokens.forEach(function(token){
        new_groups.push(createNormalGroup(token, contact._id));
    });

    debug('new tokens found', new_tokens);

    // update existing groups
    var existing_tokens = _.difference(tokens, new_tokens);
    existing_tokens.forEach(function(token){
        new_groups.push(createNormalGroup(token, contact._id));
    });

    // create fuzzy groups
    group_tokens.forEach(function(group_token){
        tokens.forEach(function(token){
            var l = new Levenshtein(group_token, token);
            debug('levenshtein for %s, %s: %i', group_token, token, l.distance);
            if (l.distance <= 2 && l.distance > 0) {
                new_groups.push(createFuzzyGroup(group_token, token, contact._id));
            }
        });
    });

    return groupResponse(new_groups);
}

function removeContactFromGroup(group, contact) {
    debug('removeContactFromGroup length before %d', group.contacts.length, group.contacts);
    debug('removing contact by id ', contact._id);
    group.contacts = _.without(group.contacts, contact._id+'');
    debug('removeContactFromGroup length after %d', group.contacts.length, group.contacts);
    if (group.contacts.length === 0) {
        return null;
    }
    return group;
}

function removeContact(contact) {
    var tokens = tokenizeContactIdentifier(contact);
    var removed_groups = [],
        new_groups = [];

    groups.forEach(function(group){
        tokens.forEach(function(token){
            if (tokenMatchesGroupName(token, group)) {
                var updated_group = removeContactFromGroup(group, contact);
                if (!updated_group) {
                    removed_groups.push(group);
                }
                else {
                    new_groups.push(group);
                }
            }
        });
    });

    return groupResponse(new_groups, removed_groups);
}

module.exports = function(g) {
    groups = g;

    return {
        addNewContact: addNewContact,
        compareGroupName: compareGroupName,
        removeContact: removeContact
    };
};
    
