import { Home, ShoppingBag, User, Heart, Store } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const isSeller = user?.accountType === "seller";

  const isActive = (path: string) => location.pathname === path;

  if (isSeller) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <NavItem to="/" icon={<Home className="w-6 h-6" />} label="Início" active={isActive("/")} />
          <NavItem to="/seller" icon={<Store className="w-6 h-6" />} label="Loja" active={isActive("/seller")} />
          <NavItem to="/profile" icon={<User className="w-6 h-6" />} label="Perfil" active={isActive("/profile")} />
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <NavItem to="/" icon={<Home className="w-6 h-6" />} label="Início" active={isActive("/")} />
        <NavItem to="/favorites" icon={<Heart className="w-6 h-6" />} label="Favoritos" active={isActive("/favorites")} />
        <NavItem to="/cart" icon={<ShoppingBag className="w-6 h-6" />} label="Carrinho" active={isActive("/cart")} />
        <NavItem to="/profile" icon={<User className="w-6 h-6" />} label="Perfil" active={isActive("/profile")} />
      </div>
    </nav>
  );
}

function NavItem({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center flex-1 h-full ${active ? "text-green-600" : "text-gray-500"}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
}
