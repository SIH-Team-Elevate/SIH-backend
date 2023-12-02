const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shovel= new Schema({
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    }
});
module.exports = mongoose.model('Shovel', shovel);