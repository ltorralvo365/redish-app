import { useState } from "react";
import { Search, MapPin, SlidersHorizontal, Zap, Bell, Trophy, Star } from "lucide-react";
import { Link } from "react-router";
import { OfferCard } from "../components/OfferCard";
import { offers } from "../data/mockData";
import { BottomNav } from "../components/BottomNav";
import { SmartAlerts } from "../components/SmartAlerts";

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const categories = ["Todos", "Italiana", "Japonesa", "Hambúrgueres", "Saudável", "Padaria", "Variada"];

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || offer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Count urgent offers (expiring soon)
  const urgentOffersCount = offers.filter(o => o.expiryHours <= 2).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Smart Alerts */}
      <SmartAlerts enabled={alertsEnabled} />

      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl">Olá! 👋</h1>
              <p className="text-sm text-green-100">O que vamos salvar hoje?</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAlertsEnabled(!alertsEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  alertsEnabled ? "bg-green-700" : "bg-green-700/50"
                }`}
                title={alertsEnabled ? "Alertas ativados" : "Alertas desativados"}
              >
                <Bell className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-1 bg-green-700 px-3 py-2 rounded-lg text-sm">
                <MapPin className="w-4 h-4" />
                Lisboa
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar restaurantes ou comida..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <Link 
            to="/subscriptions"
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow"
          >
            <Star className="w-6 h-6 mb-2" />
            <p className="text-xs font-semibold">Subscrições</p>
          </Link>
          
          <Link 
            to="/eco-ranking"
            className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow"
          >
            <Trophy className="w-6 h-6 mb-2" />
            <p className="text-xs font-semibold">Ranking</p>
          </Link>
          
          <Link 
            to="/compost-partners"
            className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow"
          >
            <Zap className="w-6 h-6 mb-2" />
            <p className="text-xs font-semibold">Zero Waste</p>
          </Link>
        </div>

        {/* Urgent Offers Banner */}
        {urgentOffersCount > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">{urgentOffersCount} Ofertas Urgentes!</p>
                <p className="text-sm text-orange-100">Descontos até 80% • Expira em breve</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl text-green-700">🌍</p>
              <p className="text-sm text-gray-600 mt-1">Refeições salvas hoje</p>
              <p className="text-2xl text-green-600 mt-1">1,247</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Você salvou</p>
              <p className="text-3xl text-green-600 mt-1">12</p>
              <p className="text-xs text-gray-500">refeições</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Offers List */}
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-gray-900">
              {filteredOffers.length} ofertas perto de si
            </h2>
            <button className="flex items-center gap-1 text-sm text-gray-600">
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </button>
          </div>
          
          {filteredOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} showDynamicPricing />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}