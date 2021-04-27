const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt')

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;
const SEX = ['Male', 'Female', 'Other']

const userSchema = new Schema({
  email: {
      unique: true,
      type: String,
      required: 'E-mail required.',
      match: [EMAIL_PATTERN, 'Invalid e-mail.']
    },
  name: {
      type: String,
      required: 'Name required.'
    },
  surname: {
      type: String,
      required: 'Surname required.'
    },
  password: {
      type: String,
      required: 'Password is required',
      minLength: [8, 'Password must contain at least 8 characters.']
    },
  sex: { 
    type: String,
    required: 'Sex selection required.'
   },
  age: {
    type: Number,
    required: 'Age required.'
  },
  city: {
      type: String,
      required: 'City required.'
    },
  picture: {
      type: String,
      validate: {
        validator: value => {
          try {
            const url = new URL(value)
            return url.protocol === 'http:' || url.protocol === 'https:'
          } catch(err) {
            return false
          }
        },
        message: () => 'Invalid image URL.'
      },
      default: 'https://miro.medium.com/max/3150/1*NFwzjjur2atssvIlGia0AQ.jpeg'
    },
  token: {
  type: String
  },
  active: {
  type: Boolean,
  default: true
  },
  searches: {
    type: [String]
    },
});

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, SALT_WORK_FACTOR)
      .then(hash => {
        this.password = hash
        next()
      })
  } else {
    next()
  }
})

userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;