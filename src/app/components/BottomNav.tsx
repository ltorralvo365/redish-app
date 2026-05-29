import { Home, ShoppingBag, User, Heart, Store } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const isSeller = user?.accountType === "seller";
  const isCommercial =
    user?.accountType === "consumer" &&
    user.consumerProfile?.partnershipType === "commercial";

  const active = (path: string) => location.pathname === path;

  if (isSeller) {
    return (
      <Nav>
        <NavItem to="/seller" icon={<Store />} label="Loja" active={active("/seller")} />
        <NavItem to="/seller/history" icon={<ShoppingBag />} label="Histórico" active={active("/seller/history")} />
        <NavItem to="/profile" icon={<User />} label="Perfil" active={active("/profile")} />
      </Nav>
    );
  }

  if (isCommercial) {
    return (
      <Nav>
        <NavItem to="/" icon={<Home />} label="Início" active={active("/")} />
        <NavItem to="/profile" icon={<User />} label="Perfil" active={active("/profile")} />
      </Nav>
    );
  }

  // personal consumer
  return (
    <Nav>
      <NavItem to="/" icon={<Home />} label="Início" active={active("/")} />
      <NavItem to="/favorites" icon={<Heart />} label="Favoritos" active={active("/favorites")} />
      <NavItem to="/cart" icon={<ShoppingBag />} label="Carrinho" active={active("/cart")} />
      <NavItem to="/profile" icon={<User />} label="Perfil" active={active("/profile")} />
    </Nav>
  );
}

function Nav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">{children}</div>
    </nav>
  );
}

function NavItem({ to, icon, label, active }: {
  to: string; icon: React.ReactNode; label: string; active: boolean;
}) {
  return (
    <Link to={to}
      className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${active ? "text-green-600" : "text-gray-500"}`}>
      <span className="w-6 h-6">{icon}</span>
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
}
