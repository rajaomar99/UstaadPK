import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { name, phone, city } = req.body;
    
    const updateFields: Record<string, any> = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (phone !== undefined) updateFields.phone = phone.trim();
    if (city !== undefined) updateFields.city = city.trim();

    if (Object.keys(updateFields).length === 0) {
      res.status(400).json({ success: false, error: 'No fields provided for update' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update current user error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const onboardUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { role } = req.body;

    if (!['student', 'tutor'].includes(role)) {
      res.status(400).json({ success: false, error: 'Invalid role. Must be student or tutor.' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    // Validate that the role is not already set (e.g., from manual registration)
    if (user.role !== 'pending' && user.isOnboarded) {
      res.status(400).json({ success: false, error: 'User is already onboarded and role is set' });
      return;
    }

    user.role = role;
    user.isOnboarded = true;
    
    await user.save();

    res.status(200).json({ success: true, data: user, message: 'Onboarding complete' });
  } catch (error) {
    console.error('Onboard user error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
