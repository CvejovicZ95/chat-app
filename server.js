const express=require('express');
const path=require('path');
const connect=require('./connectDB');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/usersRoutes');

const {saveMessage,loadMessage}=require('./controllers/messageController');

const app=express();
const server=require('http').createServer(app);
const PORT=3000;

connect();

const io=require('socket.io')(server);

app.use(express.static(path.join('public')));
app.use(bodyParser.json());
app.use(usersRoutes);

io.on('connection',async (socket)=>{
  try{
    const messages=await loadMessage();
    socket.emit('load-messages',messages);
    
    socket.on('new-user',username=>{
      socket.broadcast.emit('update',`${username} has joined the converastion`);
    });
  
    socket.on('chat',async (message)=>{
      socket.broadcast.emit('chat',message);
      await saveMessage(message.username,message.text);
    });
  
    socket.on('exit-user',username=>{
      socket.broadcast.emit('update',`${username} has left the conversation`);
    });
  
    socket.on('activity',username=>{
      socket.broadcast.emit('activity',username);
    });
  }catch(err){
    console.error('Error while connection', err);
  }
});

server.listen(PORT,()=>{
  console.log(`Server is listening on port ${PORT}`);
});









