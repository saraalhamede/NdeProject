const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: true,
        minlength: 2,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
});
const User = model("users", userSchema);
module.exports = User;