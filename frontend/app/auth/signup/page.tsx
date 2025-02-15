import SignUpClient from './SignUpClient';

// Prevent static generation for auth pages
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default function SignUpPage() {
  return <SignUpClient />;
}
