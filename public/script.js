const chatapp = () => {
  const app = document.querySelector('.app');
  const socket = io();

  let uname;
  localStorage.getItem('authToken');

  socket.on('connect', () => {
    socket.on('load-messages', (messages) => {

      messages.forEach((message) => {
        if (message.username === uname) {
          renderMessage('my', message);
        } else {
          renderMessage('other', message);
        }
      });
    });
  });

  document.addEventListener('DOMContentLoaded',async () => {
    const storedUsername = localStorage.getItem('username');
    
    const joinScreen = document.querySelector('.join-screen');
    const chatScreen = document.querySelector('.chat-screen');

    if (storedUsername) {
      joinScreen.classList.remove('active');
      chatScreen.classList.add('active');
      uname = storedUsername;
      await connectAndLoadMessages(uname,'');
    } else {
      joinScreen.classList.add('active');
      chatScreen.classList.remove('active');
    }
  });
  
  const connectAndLoadMessages = async (username,password) => {
    
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (result.success===true) {
        localStorage.setItem('username', username);
        localStorage.setItem('authToken', result.token);
        
        socket.emit('new-user', username);
        uname = username;

        app.querySelector('.join-screen').classList.remove('active');
        app.querySelector('.chat-screen').classList.add('active');
      } else {
        app.querySelector('.join-screen .login-problem').innerHTML='Incorrect username or password, please double-check your login credentials. If you dont have an account, you must register to proceed.';
      }
    } catch (error) {
      alert('An error occurred during login.');
      throw error;
    }
  };

  app.querySelector('.join-screen #join-user').addEventListener('click', async () => {
    const username = app.querySelector('.join-screen #login-username').value;
    const password = app.querySelector('.join-screen #login-password').value;
    if (username.length == 0 || password.length == 0) {
      alert('Please fill in both username and password.');
      return;
    }
    connectAndLoadMessages(username, password);
  });

  app.querySelector('.chat-screen #exit-chat').addEventListener('click', () => {
    socket.emit('exit-user', uname);

    document.querySelector('.chat-screen').classList.add('hidden');
    document.querySelector('.join-screen').classList.add('active');
    app.querySelector('.join-screen .login-problem').innerHTML='';
    const username=document.querySelector('.join-screen #login-username').value;
    const password=document.querySelector('.join-screen #login-password').value;
    username.innerHTML='';
    password.innerHTML='';
    
    localStorage.removeItem('username');
    localStorage.removeItem('authToken');
  });

  app.querySelector('.chat-screen #send-message').addEventListener('click', () => {
    const message = app.querySelector('.chat-screen #message-input').value;

    if (message.length == 0) {
      return;
    }
    renderMessage('my', {
      username: uname,
      text: message,
    });
    socket.emit('chat', {
      username: uname,
      text: message
    });
    const messageInput = document.querySelector('.chat-screen #message-input');
    app.querySelector('.chat-screen #message-input').value = '';
    messageInput.focus();
  });

  socket.on('update', update => {
    renderMessage('update', update);
  });

  socket.on('chat', message => {
    renderMessage('other', message);
  });

  const messageInput = document.querySelector('.chat-screen #message-input');
  messageInput.addEventListener('keypress', () => {
    socket.emit('activity', uname);
  });

  let activityTimer;
  socket.on('activity', (activityUname) => {
    const activity = document.querySelector('.activity');
    activity.textContent = `${activityUname} is typing...`;
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
      activity.textContent = '';
    }, 1000);
  });

  function renderMessage(type, message) {
    const messageContainer = document.querySelector('.chat-screen .messages');
    if (type == 'my') {
      const time = new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: 'numeric'
      }).format(new Date());
      const el = document.createElement('div');
      el.setAttribute('class', 'message my-message');
      el.innerHTML = `
      <div>
        <div class="name">You</div>
        <div class="text">${message.text} <span class="time">${time}</span></div>
      </div>
      `;

      messageContainer.appendChild(el);
    } else if (type == 'other') {
      const time = new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: 'numeric'
      }).format(new Date());
      const el = document.createElement('div');
      el.setAttribute('class', 'message other-message');
      el.innerHTML = `
      <div>
        <div class="name">${message.username}</div>
        <div class="text">${message.text} <span class="time">${time}</span></div>
      </div>
      `;

      messageContainer.appendChild(el);
    } else if (type == 'update') {
      const el = document.createElement('div');
      el.setAttribute('class', 'update');
      el.innerHTML = message;
      messageContainer.appendChild(el);
    }
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
  }
};

chatapp();




