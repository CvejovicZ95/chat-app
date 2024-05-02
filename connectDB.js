const mongoose=require('mongoose');

const connect=()=>{
  mongoose.connect('mongodb://127.0.0.1/ChatMessages')
  .then(()=>console.log('Connected to DB'))
  .catch((err)=>{console.error('Something went wrong',err);});
};

module.exports=connect;