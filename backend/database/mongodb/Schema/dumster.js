const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DumsterSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    }
});
const Dumster = mongoose.model('Dumster',DumsterSchema);
module.exports = Dumster;