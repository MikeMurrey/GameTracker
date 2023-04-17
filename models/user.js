const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

//custom error message to handle a registration attempt with a duplicate email
UserSchema.post('save', function (error, _, next) {
  next(error.code === 11000 ? new Error('An account tied to that email already exists. Please try again.') : error)
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);