import { Home, ShoppingBag, User, Heart } from "lucide-react";
import { Link, useLocation } from "react-router";

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive("/") ? "text-green-600" : "text-gray-600"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Início</span>
        </Link>
        
        <Link
          to="/favorites"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive("/favorites") ? "text-green-600" : "text-gray-600"
          }`}
        >
          <Heart className="w-6 h-6" />
          <span className="text-xs mt-1">Favoritos</span>
        </Link>
        
        <Link
          to="/cart"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive("/cart") ? "text-green-600" : "text-gray-600"
          }`}
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-xs mt-1">Carrinho</span>
        </Link>
        
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive("/profile") ? "text-green-600" : "text-gray-600"
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Perfil</span>
        </Link>
      </div>
    </nav>
  );
}
