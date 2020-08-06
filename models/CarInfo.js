const mongoose = require('mongoose');

//Create the user schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    make: {
        type: String
    },
    image: {
        type: String
    },
    year: {
        type: String
    },
    price: {
        type: String
    },
    description: {
        type: String
    },
    contact:{
        type: String
    }
});
//Create, instantiate and export model with schema
const Users = mongoose.model("Car", UserSchema);
module.exports = Users;