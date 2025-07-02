
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    console.log("404 Debug Info:", {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }, [location]);

  const handleGoHome = () => {
    console.log("NotFound: Navigating to home");
    navigate("/", { replace: true });
  };

  const handleRefresh = () => {
    console.log("NotFound: Refreshing page");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
          <p className="text-gray-600 mb-2">
            La página que buscas no existe o ha sido movida.
          </p>
          <p className="text-sm text-gray-500 font-mono bg-gray-100 p-2 rounded">
            Ruta: {location.pathname}
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleGoHome}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Home className="mr-2 h-4 w-4" />
            Ir al Inicio
          </Button>
          
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Recargar Página
          </Button>
        </div>

        <div className="mt-8 text-xs text-gray-400">
          <p>Si el problema persiste, intenta:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Cerrar sesión e iniciar sesión nuevamente</li>
            <li>Limpiar caché del navegador</li>
            <li>Verificar tu conexión a internet</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
