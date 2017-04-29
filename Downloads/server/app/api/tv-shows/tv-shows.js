/**
 * Created by eygle on 4/29/17.
 */

module.exports= {
    Resource: {
        get: function(uid, callback) {
            callback(null, {uid: uid, query: this.query});
        }
    },

    Collection: {
        get: function(callback) {
            callback(null, {all: 'users'});
        }
    }
};