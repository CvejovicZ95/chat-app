const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userController = require('../controllers/usersController');

router.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const existingUser = await userController.getUserByUsername(username);

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    await userController.registerUser(username, email, password);
    res.status(200).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during user registration:', err);
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
});

router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userController.loginUser(username, password);

    if (user) {
      const token = jwt.sign({ username }, 'secret-key', { expiresIn: '1h' });

      res.cookie('authToken', token, { httpOnly: true });

      res.json({ success: true, token });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


module.exports = router;
