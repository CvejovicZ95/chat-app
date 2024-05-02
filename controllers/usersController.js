const bcrypt=require('bcrypt');
const User = require('../models/usersSchema');

const registerUser = async (username, email, password) => {
  try {
    if (!isValidPassword(password)) {
      throw new Error('Password must be at least 6 characters long and contain at least 1 uppercase letter.');
    }
    if (!isValidEmail(email)) {
      throw new Error('Invalid email format.');
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, email, password:hashedPassword });
    await newUser.save();
  } catch (err) {
    console.error('Error while registering user', err);
    throw err;
  }
};

const loginUser = async (username, password) => {
    const user = await User.findOne({ username });
    if (user) {
      const passwordMatch = await comparePassword(password, user.password);
      if (passwordMatch) {
        return user;
      } else {
        return null; 
      }
    } else {
      return null; 
    }
 
};

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z]).{6,}$/;
  return passwordRegex.test(password);
};


const isValidEmail = (email) => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ;
  return emailRegex.test(email);
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};

const getUserByUsername = async (username) => {
    const user = await User.findOne({ username });
    if(user){
      return user;
    }else{
      return null;
    }
    
};

module.exports = {
  registerUser,
  loginUser,
  getUserByUsername
};
