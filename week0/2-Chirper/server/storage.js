var chirps = [],
    user_counter = 1,
    chirp_counter = 1,
    users = [],
    user = null,
    create_user = function(username){
        var key = username + '' + (user_counter++),
            user = {
                'name': username,
                'key': key
            };

        users[key] = user;

        return user;
    },
    load_user = function(key){
        return typeof users[key] !== 'undefined' ? users[key] : null;
    },

    create_chirp = function(text){
        var chirp = {
                'user': user.name,
                'id': chirp_counter++,
                'text': text
            },
            user_chirps = get_user_chirps();

        user_chirps.push(chirp);
        chirps[user.key] = user_chirps;
        return chirp;
    },

    get_user_chirps = function(key){
        var user_key = key || user.key;
        var user_chirps = chirps[user_key] || [];
        return user_chirps;
    },

    delete_chirp = function(chirp_id){
        var user_chirps = get_user_chirps(),
            target_index = -1,
            deleted_chirp = null,
            remaining_chirps = [];

        user_chirps.forEach(function(chirp, index){
            console.log('search: ', chirp, index, chirp_id);
            if (chirp.id !== chirp_id)
            {
                remaining_chirps.push(chirp);
            }
            else
            {
                deleted_chirp = chirp;
            }
        });

        if (deleted_chirp === null){
            return 'Chirp does not exist';
        }

        chirps[user.key] = remaining_chirps;

        return deleted_chirp;
    };

module.exports = {
    get_all_chirps: function(){
        var all_chirps = [];
        Object.keys(chirps).forEach(function(user_key){
            all_chirps = all_chirps.concat(get_user_chirps(user_key));
        });
        return all_chirps;
    },
            
    create_user: function(username){
        return create_user(username);
    },

    login_user: function(user_key){
        user = load_user(user_key);

        if (user === null)
        {
            return 'User does not exist';
        }

        return {
            create_chirp: create_chirp,
            get_user_chirps: get_user_chirps,
            delete_chirp: delete_chirp
        };
    }
};