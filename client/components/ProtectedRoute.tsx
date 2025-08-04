import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4">
            <svg viewBox="0 0 50 50" className="w-full h-full">
              <circle
                className="opacity-30"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
              <circle
                className="text-blue-600"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray="100"
                strokeDashoffset="75"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
