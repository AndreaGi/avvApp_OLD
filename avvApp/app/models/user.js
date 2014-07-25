// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

function toLower(text){
    return text.toLowerCase();
}

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : {type: String, set: toLower},
        password     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : {type: String, set: toLower},
        name         : String
    },
    documents: [{
        categoryId  :String,
        clientId    :String,
        isComplete  :Boolean,
        body        :String,
        creationDate: {type:Date, default:Date.now},
        modificationDate: {type:Date, default:Date.now}
    }],
    clients: [{
        name        :String,
        vatNumber   :String,
        creationDate: {type:Date, default:Date.now},
        modificationDate: {type:Date, default:Date.now}
    }],
    categories:[{
        name:    String,
        color:  String
    }],
    showComplete: Boolean
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
