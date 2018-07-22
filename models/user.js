var mongoose                = require("mongoose");
var passpoortLocalMongoose  = require("passport-local-mongoose");    


var UserSchema    =  new mongoose.Schema({
         
         username: String,
         password: String,
         googleID: String,
         facebookID: String
}); 
UserSchema.plugin(passpoortLocalMongoose)

module.exports = mongoose.model("User", UserSchema);