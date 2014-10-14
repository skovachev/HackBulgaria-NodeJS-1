var chirps = [],
    user_counter = 1,
    chirp_counter = 1,
    users = [],
    user = null,

    /**
     * Create a user from username
     * @param  {string} username username
     * @return {object}          user
     */
    create_user = function(username) {
        var key = username + '' + (user_counter++),
            user = {
                'name': username,
                'key': key
            };

        users[key] = user;

        return user;
    },

    /**
     * Load a user from storage
     * @param  {string} key user key
     * @return {object}     user, or null if it does not exist
     */
    load_user = function(key) {
        return typeof users[key] !== 'undefined' ? users[key] : null;
    },

    /**
     * Create a new chirp
     * @param  {string} text chirp content
     * @return {object}      the chirp
     */
    create_chirp = function(text) {
        var chirp = {
                'user': user.name,
                'id': chirp_counter++,
                'text': text,
                'date': new Date()
            },
            user_chirps = get_user_chirps();

        user_chirps.push(chirp);
        chirps[user.key] = user_chirps;
        return chirp;
    },

    /**
     * Load all chirps for a user
     * @param  {string} key the user key
     * @return {array}     user chirps
     */
    get_user_chirps = function(key) {
        var user_key = key || user.key;
        var user_chirps = chirps[user_key] || [];
        user_chirps = user_chirps.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        return user_chirps;
    },

    /**
     * Delete a chirp
     * @param  {string} chirp_id the chirp id
     * @return {object}          the deleted chirp
     */
    delete_chirp = function(chirp_id) {
        var user_chirps = get_user_chirps(),
            target_index = -1,
            deleted_chirp = null,
            remaining_chirps = [];

        user_chirps.forEach(function(chirp, index) {

            if (chirp.id !== chirp_id) {
                remaining_chirps.push(chirp);
            } else {
                deleted_chirp = chirp;
            }
        });

        if (deleted_chirp === null) {
            return 'Chirp does not exist';
        }

        chirps[user.key] = remaining_chirps;

        return deleted_chirp;
    };

module.exports = {

    /**
     * Get all chirps
     * @return {array} [all chirps]
     */
    get_all_chirps: function() {
        var all_chirps = [];

        // merge all user chirps into a single array
        Object.keys(chirps).forEach(function(user_key) {
            all_chirps = all_chirps.concat(get_user_chirps(user_key));
        });

        // sort by date
        all_chirps = all_chirps.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        return all_chirps;
    },

    create_user: create_user,

    /**
     * Login user to backend and return object to handle user specific functions
     * @param  {string} user_key the user key
     * @return {object} user specific functions of backend
     */
    login_user: function(user_key) {
        user = load_user(user_key);

        if (user === null) {
            return 'User does not exist';
        }

        return {
            create_chirp: create_chirp,
            get_user_chirps: get_user_chirps,
            delete_chirp: delete_chirp
        };
    }
};