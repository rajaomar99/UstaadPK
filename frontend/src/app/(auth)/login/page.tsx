import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | UstaadPK',
  description: 'Sign in to your UstaadPK account',
};

export default function LoginPage() {
  return <LoginForm />;
}
