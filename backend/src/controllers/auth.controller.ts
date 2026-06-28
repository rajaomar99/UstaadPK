import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { generateToken, hashToken } from '../utils/token';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import { LoginDto, RegisterDto, VerifyEmailDto, ForgotPasswordDto, ResetPasswordDto } from '../schemas/auth.schema';

export const registerNewUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, password, role } = req.body as RegisterDto;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(409).json({ success: false, error: 'Email already registered' });
      return;
    }

    // Hash password with 12 rounds
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate email verification token
    const verificationToken = generateToken();
    const hashedVerificationToken = hashToken(verificationToken);
    
    // Set expiry to 24 hours from now
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24);

    // Create user document
    const newUser = new User({
      email: normalizedEmail,
      name: name.trim(),
      password: hashedPassword,
      role,
      isEmailVerified: false,
      emailVerificationToken: hashedVerificationToken,
      emailVerificationExpiry: verificationExpiry,
    });

    await newUser.save();

    // Send verification email via Resend
    const emailResult = await sendVerificationEmail(normalizedEmail, name.trim(), verificationToken);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email to:', normalizedEmail);
      // We don't fail the request here, but log it so the user can request a new link later
    }

    // Return success response exactly as required
    res.status(201).json({ 
      success: true, 
      message: 'Check your email to verify your account' 
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body as VerifyEmailDto;

    if (!token || typeof token !== 'string') {
      res.status(400).json({ success: false, error: 'Token is required' });
      return;
    }

    const hashedVerificationToken = hashToken(token);

    const user = await User.findOne({
      emailVerificationToken: hashedVerificationToken,
      emailVerificationExpiry: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ success: false, error: 'Invalid or expired verification token' });
      return;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as ForgotPasswordDto;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // ALWAYS return success to prevent email enumeration attacks
    if (!user) {
      res.status(200).json({ success: true, message: 'If an account exists with that email, a password reset link has been sent.' });
      return;
    }

    const resetToken = generateToken();
    const hashedResetToken = hashToken(resetToken);

    // Expiry: 1 hour from now
    const resetExpiry = new Date();
    resetExpiry.setHours(resetExpiry.getHours() + 1);

    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpiry = resetExpiry;

    await user.save();

    const emailResult = await sendPasswordResetEmail(normalizedEmail, user.name, resetToken);

    if (!emailResult.success) {
      console.error('Failed to send password reset email to:', normalizedEmail);
    }

    res.status(200).json({ success: true, message: 'If an account exists with that email, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body as ResetPasswordDto;
    const hashedResetToken = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashedResetToken,
      passwordResetExpiry: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ success: false, error: 'Invalid or expired password reset token' });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginDto;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    if (!user.isEmailVerified) {
      res.status(403).json({ success: false, error: 'Please verify your email before logging in' });
      return;
    }

    // Return only the fields NextAuth needs — never the full document
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
