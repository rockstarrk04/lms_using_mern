import User from '../models/User.js';
import bcrypt from 'bcryptjs';

/**
 * @desc    Update user password
 * @route   PUT /api/users/update-password
 * @access  Private
 */
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Find user by ID from the token and select the password field
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current password matches the one in the database
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    // Set the new password and let the 'pre-save' hook handle hashing
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update user profile (name, avatar)
 * @route   PUT /api/users/update-profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      // In a real app, you would handle file upload to a cloud service (e.g., Cloudinary)
      // and save the URL here. For now, we'll assume a URL might be passed.
      if (req.body.avatar) {
        user.avatar = req.body.avatar;
      }

      const updatedUser = await user.save();
      res.status(200).json({ user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};