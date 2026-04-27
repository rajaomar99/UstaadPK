import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

export const sendVerificationEmail = async (to: string, name: string, token: string) => {
  const verifyLink = `${clientUrl}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `UstaadPK <${fromEmail}>`,
      to,
      subject: 'Verify your email address - UstaadPK',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #1a1a1a;">Welcome to UstaadPK, ${name}!</h2>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.5;">Thank you for joining Pakistan's largest tutor network. Please click the button below to verify your email address and activate your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Verify Email</a>
          </div>
          <p style="margin-top: 20px; color: #71717a; font-size: 14px;">Or copy and paste this link in your browser: <br/> <a href="${verifyLink}" style="color: #2563eb;">${verifyLink}</a></p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending verification email:', error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (to: string, name: string, token: string) => {
  const resetLink = `${clientUrl}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `UstaadPK <${fromEmail}>`,
      to,
      subject: 'Reset your password - UstaadPK',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #1a1a1a;">Hello ${name},</h2>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.5;">We received a request to reset your password for your UstaadPK account. Click the button below to choose a new password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Reset Password</a>
          </div>
          <p style="margin-top: 20px; color: #71717a; font-size: 14px;">Or copy and paste this link in your browser: <br/> <a href="${resetLink}" style="color: #2563eb;">${resetLink}</a></p>
          <p style="margin-top: 30px; color: #a1a1aa; font-size: 12px;">If you didn't request this password reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending password reset email:', error);
    return { success: false, error };
  }
};
