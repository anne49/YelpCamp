var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});
 
userSchema.plugin(passportLocalMongoose);//gives all methods, functionalities to user model

module.exports = mongoose.model("User", userSchema);