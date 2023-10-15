

const bcrypt = require('bcrypt');
const User = require('../models/UserModal');

const UserRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({success:false, message: 'Email already in use' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({success:true, message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(200).json({success:false, message: 'Server error' });
  }
};




module.exports = UserRegistration;
