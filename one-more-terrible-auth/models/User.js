const {Schema, model} = require('mongoose')

const User = new Schema({
  ID: {type: String, unique:false, required:false},
  username: {type: String, unique: true, required: true},
  email: {type: String, unique:true, required:true},
  password: {type: String, required: true},
  registrationDate:{type: String, required: false},
  lastLoginDate:{type: String, required: false},
  status: {type: String, required: false},
})

module.exports = model('User', User)