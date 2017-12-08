
var mongoose = require('mongoose');
var bc   = require('bcrypt-nodejs');


var userSchema = mongoose.Schema({

    local            : {
         email:  {
                  type: String,
                  required: true,
                  unique: true},
        password     : String
    },
    
    twitter          : {
        id           : String,
        token        : String,
		tokenSecret  : String,
        displayName  : String,
        username     : String
    }
});


userSchema.methods.generateHash = function(password) {
    return bc.hashSync(password, bc.genSaltSync(8), null);
};


userSchema.methods.validPassword = function(password) {
    return bc.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User', userSchema);
