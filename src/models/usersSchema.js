const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
 username:{
  type:String,
  unique:true,
  required:true
 },
 email:{
  type:String,
  unique:true,
  required:true
 },
 password:{
  type:String,
  required:true
 }
});

module.exports = mongoose.model('User', usersSchema);

