const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // حتماً این بالا باشه

const app = express();
app.use(cors());
app.use(express.json());

// اتصال به MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected ✔️'))
.catch(err => console.log('MongoDB connection error ❌', err));

const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ثبت‌نام
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });
    res.json({ message: 'کاربر ساخته شد', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// لاگین
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'کاربر پیدا نشد' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'رمز اشتباه' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'وارد شدی', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// تست ساده
app.get('/', (req, res) => {
  res.json({ message: 'API کار می‌کند 👌' });
});

// شروع سرور
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
