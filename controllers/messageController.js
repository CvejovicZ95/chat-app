const Message = require('../models/messageSchema');
const User = require('../models/usersSchema');

const saveMessage = async (username, text) => {
  try {
    const user = await User.findOne({ username }); // Pronađi korisnika prema korisničkom imenu
    if (!user) {
      console.error(`User with username ${username} not found`);
      return;
    }

    const newMessage = new Message({ username, text }); // Koristi ID korisnika umesto korisničkog imena
    await newMessage.save();
  } catch (err) {
    console.error('Error while saving message', err);
  }
};

// ...


const loadMessage = async () => {
  try {
    const messages = await Message.find().populate('username').exec();
    return messages;
  } catch (err) {
    console.error('Error while loading messages', err);
    return [];
  }
};

module.exports = {
  saveMessage,
  loadMessage
};