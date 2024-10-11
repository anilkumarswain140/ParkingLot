const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const users = []; // In-memory users storage

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if(!username || !password){
      return res.status(400).json({ message: 'Please pass all th fields' });
    }
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
