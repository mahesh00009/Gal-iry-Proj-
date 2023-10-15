const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModal');
require('dotenv').config()

const SECRET_KEY = process.env.SECRET_KEY

const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({success : false, message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(200).json({success : false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY);
    res.status(200).json({ success:true, token });
  } catch (error) {
    console.error(error);
    res.status(200).json({ success : false, message: 'Server error' });
  }
};

module.exports = UserLogin;
