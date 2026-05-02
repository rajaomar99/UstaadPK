import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create an Account | UstaadPK',
  description: 'Join Pakistan\'s premier tutor network',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
