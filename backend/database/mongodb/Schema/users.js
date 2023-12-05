require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR;
const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tyep:{
        type:String,
        enum:['admin','worker','driver'],
        required:true
    },
    autho: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});
UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
UserSchema.methods.compareAutho = function(autho, cb) {
    bcrypt.compare(autho, this.autho, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
UserSchema.methods.generateAutho = function(cb) {
    var user = this;
    var autho = jwt.sign({ _id: user._id.toHexString() }, process.env.SECRET, { expiresIn: '180s' });
    user.autho = autho;
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    });
}
module.exports = mongoose.model('users', UserSchema);