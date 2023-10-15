const jwt = require('jsonwebtoken');
const User = require('../models/UserModal');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const sendUser = async (req, res) => {
  try {
    const token = req.body.token;

    const decoded = jwt.verify(token, secretKey); 

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = sendUser;
