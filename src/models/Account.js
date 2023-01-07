const mongoose = require('mongoose');

const Account = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    notes: {
        type: Object
    }
});

module.exports = mongoose.model('Account', Account);