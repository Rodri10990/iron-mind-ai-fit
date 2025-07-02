
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute: Auth state check', { 
      user: user ? 'present' : 'null', 
      isLoading, 
      authError,
      currentPath: location.pathname 
    });

    if (!isLoading && !user && !authError) {
      console.log('ProtectedRoute: Redirecting to auth - no user found');
      navigate('/auth', { replace: true });
    }
  }, [user, isLoading, navigate, authError, location.pathname]);

  if (isLoading) {
    console.log('ProtectedRoute: Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Cargando...</p>
          <p className="text-sm text-gray-500 mt-2">Verificando autenticación</p>
        </div>
      </div>
    );
  }

  if (authError) {
    console.log('ProtectedRoute: Auth error detected:', authError);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md mx-4">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error de Autenticación</h2>
          <p className="text-gray-600 mb-4">{authError}</p>
          <button
            onClick={() => navigate('/auth', { replace: true })}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Ir a Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: No user found, should redirect to auth');
    return null;
  }

  console.log('ProtectedRoute: User authenticated, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
