import {
  User, Settings, Heart, Receipt, HelpCircle, LogOut,
  ChevronRight, Award, Leaf, Star, Trophy, Recycle, Store,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";

function getDisplayName(user: ReturnType<typeof useAuth>["user"]): string {
  if (!user) return "Utilizador";
  if (user.accountType === "seller") return user.sellerProfile?.establishmentName ?? "Estabelecimento";
  if (user.consumerProfile?.partnershipType === "commercial") return user.consumerProfile.orgName ?? "Organização";
  return user.consumerProfile?.name ?? "Utilizador";
}

function getAvatarInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = getDisplayName(user);
  const avatar = getAvatarInitials(displayName);
  const email = user?.email ?? "";
  const isSeller = user?.accountType === "seller";

  const stats = { mealsSaved: 12, co2Saved: 30, moneySaved: 145.50, ecoPoints: 285, ranking: 7 };

  const consumerMenu = [
    { icon: Receipt, label: "Minhas Reservas", badge: "3", path: "/cart" },
    { icon: Heart, label: "Favoritos", badge: null, path: "/favorites" },
    { icon: Star, label: "Minha Subscrição", badge: "Premium", path: "/subscriptions" },
    { icon: Trophy, label: "Eco-Ranking", badge: `#${stats.ranking}`, path: "/eco-ranking" },
    { icon: Recycle, label: "Parceiros Zero Waste", badge: null, path: "/compost-partners" },
    { icon: Award, label: "Conquistas", badge: "Novo", path: "/eco-ranking" },
    { icon: Settings, label: "Configurações", badge: null, path: "/profile" },
    { icon: HelpCircle, label: "Ajuda & Suporte", badge: null, path: "/profile" },
  ];

  const sellerMenu = [
    { icon: Store, label: "Gerir Produtos", badge: null, path: "/seller" },
    { icon: Receipt, label: "Histórico de Vendas", badge: null, path: "/seller" },
    { icon: Trophy, label: "Eco-Ranking", badge: null, path: "/eco-ranking" },
    { icon: Recycle, label: "Parceiros Zero Waste", badge: null, path: "/compost-partners" },
    { icon: Settings, label: "Configurações", badge: null, path: "/profile" },
    { icon: HelpCircle, label: "Ajuda & Suporte", badge: null, path: "/profile" },
  ];

  const menuItems = isSeller ? sellerMenu : consumerMenu;

  function handleLogout() {
    logout();
    navigate("/auth", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 text-xl" style={{ fontWeight: 700 }}>
              {avatar || <User className="w-7 h-7" />}
            </div>
            <div>
              <h1 className="text-xl">{displayName}</h1>
              <p className="text-sm text-green-100">{email}</p>
              {isSeller && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                  Vendedor · {user?.sellerProfile?.location}
                </span>
              )}
              {user?.accountType === "consumer" && user.consumerProfile?.partnershipType === "commercial" && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                  Parceiro Comercial
                </span>
              )}
            </div>
          </div>

          {!isSeller && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-2xl mb-1">{stats.mealsSaved}</p>
                  <p className="text-xs text-green-100">Refeições</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-2xl mb-1">{stats.co2Saved}kg</p>
                  <p className="text-xs text-green-100">CO₂ poupado</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-2xl mb-1">€{stats.moneySaved}</p>
                  <p className="text-xs text-green-100">Poupado</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-2xl mb-1">{stats.ecoPoints}</p>
                  <p className="text-xs text-green-100">Pontos Eco</p>
                </div>
              </div>
            </>
          )}

          {isSeller && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <p className="text-2xl mb-1">8</p>
                <p className="text-xs text-green-100">Produtos</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <p className="text-2xl mb-1">143</p>
                <p className="text-xs text-green-100">Vendas</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <p className="text-2xl mb-1">4.8★</p>
                <p className="text-xs text-green-100">Avaliação</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Impact card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
          <div className="flex items-start gap-3">
            <Leaf className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-sm text-gray-900 mb-1" style={{ fontWeight: 600 }}>
                {isSeller ? "Obrigado por combater o desperdício! 🌟" : "Herói da Sustentabilidade! 🌟"}
              </h3>
              <p className="text-xs text-gray-600">
                {isSeller
                  ? `O ${displayName} já contribuiu para salvar centenas de refeições. Continue a fazer a diferença!`
                  : `Já evitaste o desperdício de ${stats.mealsSaved} refeições. Continue assim e ajuda a criar um mundo mais sustentável!`}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.path}
              className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-green-600" />
                <span className="text-gray-900">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.badge === "Novo" || item.badge === "Premium"
                      ? "bg-orange-500 text-white"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>

        {!isSeller && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg mb-3 text-gray-900" style={{ fontWeight: 600 }}>Conquistas Recentes</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">🥇</div>
                <div>
                  <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>Primeira Reserva</p>
                  <p className="text-xs text-gray-600">Completada há 2 semanas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">🌱</div>
                <div>
                  <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>Eco Warrior</p>
                  <p className="text-xs text-gray-600">Salvou 10+ refeições</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-lg shadow-md p-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 transition-colors mb-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Terminar Sessão</span>
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">Versão 1.0.0</p>
      </div>

      <BottomNav />
    </div>
  );
}
