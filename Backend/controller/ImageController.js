const jwt = require('jsonwebtoken');
const User = require('../models/UserModal'); 
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const uploadImages = async (req, res) => {
  try {
    const token = req.headers.authorization;

    const decoded = jwt.verify(token.split(" ")[1], secretKey);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const titles = Array.isArray(req.body.titles) ? req.body.titles : [req.body.titles];
    
    const files = Array.isArray(req.files) ? req.files : [req.files];

    const images = files.map((file, index) => ({
      title: titles[index],
      imageUrl: file.path,
    }));

    user.images.push(...images);
    await user.save();

    res.status(200).json({ success: true, message: 'Images uploaded successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = uploadImages;
