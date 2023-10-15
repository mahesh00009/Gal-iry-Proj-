const bcrypt = require('bcrypt');
const User = require('../models/UserModal');

const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    console.log(req.body)

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ success:false,message: 'User not found' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({success:true, message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(200).json({success:false, message: 'Server error' });
  }
};

module.exports = resetPasswordController;
