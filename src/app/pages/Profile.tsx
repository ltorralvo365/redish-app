import { User, Settings, Heart, Receipt, HelpCircle, LogOut, ChevronRight, Award, Leaf, Star, Trophy, Recycle } from "lucide-react";
import { Link } from "react-router";
import { BottomNav } from "../components/BottomNav";

export function Profile() {
  const user = {
    name: "Maria Silva",
    email: "maria.silva@email.com",
    avatar: "MS",
    mealsSaved: 12,
    co2Saved: 30, // kg
    moneySaved: 145.50,
    ecoPoints: 285,
    ranking: 7
  };

  const menuItems = [
    { icon: Receipt, label: "Minhas Reservas", badge: "3", path: "/cart" },
    { icon: Heart, label: "Favoritos", badge: null, path: "/favorites" },
    { icon: Star, label: "Minha Subscrição", badge: "Premium", path: "/subscriptions" },
    { icon: Trophy, label: "Eco-Ranking", badge: `#${user.ranking}`, path: "/eco-ranking" },
    { icon: Recycle, label: "Parceiros Zero Waste", badge: null, path: "/compost-partners" },
    { icon: Award, label: "Conquistas", badge: "Novo", path: "/eco-ranking" },
    { icon: Settings, label: "Configurações", badge: null, path: "/profile" },
    { icon: HelpCircle, label: "Ajuda & Suporte", badge: null, path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 text-xl font-semibold">
              {user.avatar}
            </div>
            <div>
              <h1 className="text-xl">{user.name}</h1>
              <p className="text-sm text-green-100">{user.email}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl mb-1">{user.mealsSaved}</p>
              <p className="text-xs text-green-100">Refeições</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl mb-1">{user.co2Saved}kg</p>
              <p className="text-xs text-green-100">CO₂ poupado</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl mb-1">€{user.moneySaved}</p>
              <p className="text-xs text-green-100">Poupado</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl mb-1">{user.ecoPoints}</p>
              <p className="text-xs text-green-100">Pontos Eco</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Environmental Impact */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
          <div className="flex items-start gap-3">
            <Leaf className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-sm text-gray-900 mb-1 font-semibold">Herói da Sustentabilidade! 🌟</h3>
              <p className="text-xs text-gray-600">
                Você já evitou o desperdício de {user.mealsSaved} refeições. Continue assim
                e ajude a criar um mundo mais sustentável!
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
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

        {/* Recent Achievements */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg mb-3 font-semibold text-gray-900">Conquistas Recentes</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                🥇
              </div>
              <div>
                <p className="text-sm text-gray-900 font-medium">Primeira Reserva</p>
                <p className="text-xs text-gray-600">Completada há 2 semanas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                🌱
              </div>
              <div>
                <p className="text-sm text-gray-900 font-medium">Eco Warrior</p>
                <p className="text-xs text-gray-600">Salvou 10+ refeições</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button className="w-full bg-white rounded-lg shadow-md p-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Terminar Sessão</span>
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          Versão 1.0.0
        </p>
      </div>

      <BottomNav />
    </div>
  );
}