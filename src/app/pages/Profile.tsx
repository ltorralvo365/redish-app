import {
  User, Settings, Heart, Receipt, HelpCircle, LogOut,
  ChevronRight, Leaf, Star, Trophy, Recycle, Store, Award,
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
  return name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
}

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = getDisplayName(user);
  const avatar = getAvatarInitials(displayName);
  const email = user?.email ?? "";
  const isSeller = user?.accountType === "seller";
  const isCommercial = user?.accountType === "consumer" && user.consumerProfile?.partnershipType === "commercial";
  const isPersonal = !isSeller && !isCommercial;

  const stats = { mealsSaved: 12, co2Saved: 30, moneySaved: 145.50, ecoPoints: 285, ranking: 7 };

  const personalMenu = [
    { icon: Receipt, label: "Minhas Reservas", badge: "3", path: "/cart" },
    { icon: Heart, label: "Favoritos", badge: null, path: "/favorites" },
    { icon: Star, label: "Minha Subscrição", badge: "Premium", path: "/subscriptions" },
    { icon: Trophy, label: "Eco-Ranking", badge: `#${stats.ranking}`, path: "/eco-ranking" },
    { icon: Recycle, label: "Parceiros Zero Waste", badge: null, path: "/compost-partners" },
    { icon: Award, label: "Conquistas", badge: "Novo", path: "/eco-ranking" },
    { icon: Settings, label: "Configurações", badge: null, path: "/profile" },
    { icon: HelpCircle, label: "Ajuda & Suporte", badge: null, path: "/profile" },
  ];

  const commercialMenu = [
    { icon: Recycle, label: "Parceiros Zero Waste", badge: null, path: "/compost-partners" },
    { icon: Settings, label: "Configurações", badge: null, path: "/profile" },
    { icon: HelpCircle, label: "Ajuda & Suporte", badge: null, path: "/profile" },
  ];

  const sellerMenu = [
    { icon: Store, label: "Gerir Produtos", badge: null, path: "/seller" },
    { icon: Receipt, label: "Histórico de Vendas", badge: null, path: "/seller/history" },
    { icon: Recycle, label: "Parceiros Zero Waste", badge: null, path: "/compost-partners" },
    { icon: Settings, label: "Configurações", badge: null, path: "/profile" },
    { icon: HelpCircle, label: "Ajuda & Suporte", badge: null, path: "/profile" },
  ];

  const menuItems = isSeller ? sellerMenu : isCommercial ? commercialMenu : personalMenu;

  function handleLogout() { logout(); navigate("/auth", { replace: true }); }

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
              {isCommercial && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                  Parceiro Comercial · {user?.consumerProfile?.city}
                </span>
              )}
              {isPersonal && user?.consumerProfile?.city && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                  📍 {user.consumerProfile.city}
                </span>
              )}
            </div>
          </div>

          {isPersonal && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <StatBox label="Refeições" value={String(stats.mealsSaved)} />
                <StatBox label="CO₂ poupado" value={`${stats.co2Saved}kg`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <StatBox label="Poupado" value={`€${stats.moneySaved}`} />
                <StatBox label="Pontos Eco" value={String(stats.ecoPoints)} />
              </div>
            </>
          )}

          {isSeller && (
            <div className="grid grid-cols-3 gap-3">
              <StatBox label="Produtos" value="8" />
              <StatBox label="Vendas" value="143" />
              <StatBox label="Avaliação" value="4.8★" />
            </div>
          )}

          {isCommercial && (
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="Parcerias ativas" value="3" />
              <StatBox label="Ton. reaproveitadas" value="1.2t" />
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
                {isSeller ? "Obrigado por combater o desperdício! 🌟" : isCommercial ? "Impacto da tua organização 🌍" : "Herói da Sustentabilidade! 🌟"}
              </h3>
              <p className="text-xs text-gray-600">
                {isSeller
                  ? `O ${displayName} já contribuiu para salvar centenas de refeições.`
                  : isCommercial
                  ? `A ${displayName} está a fazer a diferença no combate ao desperdício alimentar.`
                  : `Já evitaste o desperdício de ${stats.mealsSaved} refeições. Continue assim!`}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
          {menuItems.map((item, i) => (
            <Link key={item.label} to={item.path}
              className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors ${i < menuItems.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-green-600" />
                <span className="text-gray-900">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className={`text-xs px-2 py-1 rounded ${item.badge === "Novo" || item.badge === "Premium" ? "bg-orange-500 text-white" : "bg-green-100 text-green-700"}`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>

        {/* Achievements — personal only */}
        {isPersonal && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg mb-3 text-gray-900" style={{ fontWeight: 600 }}>Conquistas Recentes</h2>
            <div className="space-y-3">
              <AchievementRow emoji="🥇" title="Primeira Reserva" sub="Completada há 2 semanas" />
              <AchievementRow emoji="🌱" title="Eco Warrior" sub="Salvou 10+ refeições" />
            </div>
          </div>
        )}

        <button onClick={handleLogout}
          className="w-full bg-white rounded-lg shadow-md p-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 transition-colors mb-2">
          <LogOut className="w-5 h-5" />
          <span>Terminar Sessão</span>
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">Versão 1.0.0</p>
      </div>
      <BottomNav />
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
      <p className="text-2xl mb-1">{value}</p>
      <p className="text-xs text-green-100">{label}</p>
    </div>
  );
}

function AchievementRow({ emoji, title, sub }: { emoji: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">{emoji}</div>
      <div>
        <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{title}</p>
        <p className="text-xs text-gray-600">{sub}</p>
      </div>
    </div>
  );
}
