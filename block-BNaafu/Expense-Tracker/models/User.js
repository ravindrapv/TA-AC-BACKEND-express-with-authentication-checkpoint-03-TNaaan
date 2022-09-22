var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var path = require('path');
var userSchema = new Schema(
  {
    email: { type: String, unique: true },
    username: { type: String, required: true },
    password: { type: String}
  },
  { timestamps: true }
);
userSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    next();
  }
});
userSchema.methods.fullName = function () {
  return this.firstname + ' ' + this.lastname;
};
userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};
module.exports = mongoose.model('User', userSchema);