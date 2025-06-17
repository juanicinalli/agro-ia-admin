
import { LoginForm } from '@/components/auth/login-form';
import { AppProvider } from '@/contexts/app-provider';

export default function LoginPage() {
  return (
    <AppProvider> {/* LoginForm uses useApp hook */}
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-gray-800 p-4">
        <LoginForm />
      </div>
    </AppProvider>
  );
}
