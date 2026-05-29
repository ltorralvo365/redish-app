import { useState } from "react";
import {
  Search, MapPin, SlidersHorizontal, Zap, Bell, Trophy, Star,
  X, ChevronDown, ChevronUp,
} from "lucide-react";
import { Link } from "react-router";
import { OfferCard } from "../components/OfferCard";
import { CommercialOfferCard } from "../components/CommercialOfferCard";
import { offers, commercialOffers } from "../data/mockData";
import type { SurplusType } from "../data/mockData";
import { SURPLUS_LABELS } from "../data/mockData";
import { BottomNav } from "../components/BottomNav";
import { SmartAlerts } from "../components/SmartAlerts";
import { useAuth } from "../context/AuthContext";

// ─── Consumer filter state ───────────────────────────────────────────────────

interface ConsumerFilters {
  maxDistance: number;
  minDiscount: number;
  minRating: number;
  sortBy: "distance" | "discount" | "rating" | "expiry";
}

const DEFAULT_CONSUMER: ConsumerFilters = {
  maxDistance: 10,
  minDiscount: 0,
  minRating: 0,
  sortBy: "distance",
};

// ─── Commercial filter state ─────────────────────────────────────────────────

interface CommercialFilters {
  maxDistance: number;
  surplusTypes: SurplusType[];
  categories: string[];
  sortBy: "distance" | "rating" | "weight";
}

const DEFAULT_COMMERCIAL: CommercialFilters = {
  maxDistance: 10,
  surplusTypes: [],
  categories: [],
  sortBy: "distance",
};

const COMMERCIAL_CATEGORIES = ["Todos", "Supermercado", "Restaurante", "Padaria", "Hotel", "Mercado", "Cantina"];
const CONSUMER_CATEGORIES = ["Todos", "Italiana", "Japonesa", "Hambúrgueres", "Saudável", "Padaria", "Variada"];

// ─── Component ────────────────────────────────────────────────────────────────

export function Home() {
  const { user } = useAuth();
  const isCommercial =
    user?.accountType === "consumer" &&
    user.consumerProfile?.partnershipType === "commercial";

  const [searchQuery, setSearchQuery] = useState("");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Consumer state
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [consumerFilters, setConsumerFilters] = useState<ConsumerFilters>(DEFAULT_CONSUMER);
  const [pendingConsumer, setPendingConsumer] = useState<ConsumerFilters>(DEFAULT_CONSUMER);

  // Commercial state
  const [selectedCommCategory, setSelectedCommCategory] = useState("Todos");
  const [commFilters, setCommFilters] = useState<CommercialFilters>(DEFAULT_COMMERCIAL);
  const [pendingComm, setPendingComm] = useState<CommercialFilters>(DEFAULT_COMMERCIAL);

  // ── Filtered consumer offers ──────────────────────────────────────────────
  const filteredOffers = offers
    .filter((o) => {
      const matchSearch =
        o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "Todos" || o.category === selectedCategory;
      const matchDist = o.distance <= consumerFilters.maxDistance;
      const matchDisc = o.discount >= consumerFilters.minDiscount;
      const matchRating = o.rating >= consumerFilters.minRating;
      return matchSearch && matchCat && matchDist && matchDisc && matchRating;
    })
    .sort((a, b) => {
      if (consumerFilters.sortBy === "distance") return a.distance - b.distance;
      if (consumerFilters.sortBy === "discount") return b.discount - a.discount;
      if (consumerFilters.sortBy === "rating") return b.rating - a.rating;
      if (consumerFilters.sortBy === "expiry") return a.expiryHours - b.expiryHours;
      return 0;
    });

  // ── Filtered commercial offers ────────────────────────────────────────────
  const filteredCommercial = commercialOffers
    .filter((o) => {
      const matchSearch =
        o.establishmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCommCategory === "Todos" || o.category === selectedCommCategory;
      const matchDist = o.distance <= commFilters.maxDistance;
      const matchType =
        commFilters.surplusTypes.length === 0 ||
        commFilters.surplusTypes.some((t) => o.surplusTypes.includes(t));
      return matchSearch && matchCat && matchDist && matchType;
    })
    .sort((a, b) => {
      if (commFilters.sortBy === "distance") return a.distance - b.distance;
      if (commFilters.sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const urgentOffersCount = offers.filter((o) => o.expiryHours <= 2).length;

  const openFilters = () => {
    setPendingConsumer(consumerFilters);
    setPendingComm(commFilters);
    setShowFilters(true);
  };

  const applyFilters = () => {
    setConsumerFilters(pendingConsumer);
    setCommFilters(pendingComm);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setPendingConsumer(DEFAULT_CONSUMER);
    setPendingComm(DEFAULT_COMMERCIAL);
  };

  const toggleSurplus = (type: SurplusType) => {
    setPendingComm((prev) => ({
      ...prev,
      surplusTypes: prev.surplusTypes.includes(type)
        ? prev.surplusTypes.filter((t) => t !== type)
        : [...prev.surplusTypes, type],
    }));
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SmartAlerts enabled={alertsEnabled} />

      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl">
                {isCommercial ? "Parcerias de Excedentes 🤝" : "Olá! 👋"}
              </h1>
              <p className="text-sm text-green-100">
                {isCommercial
                  ? "Excedentes alimentares disponíveis perto de si"
                  : "O que vamos salvar hoje?"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!isCommercial && (
                <button
                  onClick={() => setAlertsEnabled((p) => !p)}
                  className={`p-2 rounded-lg transition-colors ${alertsEnabled ? "bg-green-700" : "bg-green-700/50"}`}
                >
                  <Bell className="w-5 h-5" />
                </button>
              )}
              <button className="flex items-center gap-1 bg-green-700 px-3 py-2 rounded-lg text-sm">
                <MapPin className="w-4 h-4" />
                Lisboa
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={
                isCommercial
                  ? "Pesquisar estabelecimentos..."
                  : "Pesquisar restaurantes ou comida..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Quick Access (consumer only) */}
        {!isCommercial && (
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
        )}

        {/* Surplus type legend (commercial) */}
        {isCommercial && (
          <div className="mt-4 mb-3 space-y-1.5">
            {(Object.entries(SURPLUS_LABELS) as [SurplusType, typeof SURPLUS_LABELS[SurplusType]][]).map(
              ([, meta]) => (
                <div key={meta.label} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className={`mt-0.5 px-2 py-0.5 rounded-full border whitespace-nowrap ${meta.color}`}>
                    {meta.label}
                  </span>
                  <span>{meta.description}</span>
                </div>
              )
            )}
          </div>
        )}

        {/* Urgent banner (consumer only) */}
        {!isCommercial && urgentOffersCount > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg">{urgentOffersCount} Ofertas Urgentes!</p>
                <p className="text-sm text-orange-100">Descontos até 80% • Expira em breve</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats (consumer only) */}
        {!isCommercial && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl">🌍</p>
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
        )}

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {(isCommercial ? COMMERCIAL_CATEGORIES : CONSUMER_CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() =>
                isCommercial ? setSelectedCommCategory(cat) : setSelectedCategory(cat)
              }
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                (isCommercial ? selectedCommCategory : selectedCategory) === cat
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-gray-900">
            {isCommercial
              ? `${filteredCommercial.length} estabelecimentos perto de si`
              : `${filteredOffers.length} ofertas perto de si`}
          </h2>
          <button
            onClick={openFilters}
            className="flex items-center gap-1 text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Offer cards */}
        <div className="space-y-4 mb-4">
          {isCommercial
            ? filteredCommercial.map((o) => <CommercialOfferCard key={o.id} offer={o} />)
            : filteredOffers.map((o) => <OfferCard key={o.id} offer={o} showDynamicPricing />)}

          {isCommercial && filteredCommercial.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">Nenhum estabelecimento encontrado com esses filtros.</p>
            </div>
          )}
          {!isCommercial && filteredOffers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">Nenhuma oferta encontrada com esses filtros.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />

      {/* ── Filter Modal ─────────────────────────────────────────────────── */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="relative w-full bg-white rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Filtros</h2>
              <div className="flex items-center gap-2">
                <button onClick={resetFilters} className="text-xs text-green-600 underline">
                  Repor
                </button>
                <button onClick={() => setShowFilters(false)} className="p-1 text-gray-400 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-4 py-4 space-y-6 max-w-md mx-auto">
              {isCommercial ? (
                <CommercialFilterPanel
                  pending={pendingComm}
                  setPending={setPendingComm}
                  toggleSurplus={toggleSurplus}
                />
              ) : (
                <ConsumerFilterPanel pending={pendingConsumer} setPending={setPendingConsumer} />
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
              <button
                onClick={applyFilters}
                className="w-full bg-green-600 text-white rounded-xl py-3.5 hover:bg-green-700 transition-colors"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Consumer filter panel ─────────────────────────────────────────────────────

function ConsumerFilterPanel({
  pending,
  setPending,
}: {
  pending: ConsumerFilters;
  setPending: React.Dispatch<React.SetStateAction<ConsumerFilters>>;
}) {
  return (
    <>
      <FilterSection title="Ordenar por">
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { value: "distance", label: "Distância" },
              { value: "discount", label: "Maior desconto" },
              { value: "rating", label: "Melhor avaliação" },
              { value: "expiry", label: "Expira mais cedo" },
            ] as { value: ConsumerFilters["sortBy"]; label: string }[]
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPending((p) => ({ ...p, sortBy: value }))}
              className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
                pending.sortBy === value
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "border-gray-200 text-gray-700 hover:border-green-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={`Distância máxima: ${pending.maxDistance} km`}>
        <input
          type="range"
          min={0.5}
          max={10}
          step={0.5}
          value={pending.maxDistance}
          onChange={(e) => setPending((p) => ({ ...p, maxDistance: Number(e.target.value) }))}
          className="w-full accent-green-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.5 km</span>
          <span>10 km</span>
        </div>
      </FilterSection>

      <FilterSection title={`Desconto mínimo: ${pending.minDiscount}%`}>
        <input
          type="range"
          min={0}
          max={80}
          step={5}
          value={pending.minDiscount}
          onChange={(e) => setPending((p) => ({ ...p, minDiscount: Number(e.target.value) }))}
          className="w-full accent-green-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span>80%</span>
        </div>
      </FilterSection>

      <FilterSection title={`Avaliação mínima: ${pending.minRating > 0 ? `${pending.minRating}★` : "Todas"}`}>
        <div className="flex gap-2">
          {[0, 4, 4.5, 4.8].map((v) => (
            <button
              key={v}
              onClick={() => setPending((p) => ({ ...p, minRating: v }))}
              className={`flex-1 text-sm py-2 rounded-lg border transition-colors ${
                pending.minRating === v
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "border-gray-200 text-gray-700"
              }`}
            >
              {v === 0 ? "Todas" : `${v}+`}
            </button>
          ))}
        </div>
      </FilterSection>
    </>
  );
}

// ── Commercial filter panel ───────────────────────────────────────────────────

function CommercialFilterPanel({
  pending,
  setPending,
  toggleSurplus,
}: {
  pending: CommercialFilters;
  setPending: React.Dispatch<React.SetStateAction<CommercialFilters>>;
  toggleSurplus: (type: SurplusType) => void;
}) {
  return (
    <>
      <FilterSection title="Ordenar por">
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { value: "distance", label: "Distância" },
              { value: "rating", label: "Avaliação" },
              { value: "weight", label: "Quantidade" },
            ] as { value: CommercialFilters["sortBy"]; label: string }[]
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPending((p) => ({ ...p, sortBy: value }))}
              className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
                pending.sortBy === value
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "border-gray-200 text-gray-700 hover:border-green-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={`Distância máxima: ${pending.maxDistance} km`}>
        <input
          type="range"
          min={0.5}
          max={15}
          step={0.5}
          value={pending.maxDistance}
          onChange={(e) => setPending((p) => ({ ...p, maxDistance: Number(e.target.value) }))}
          className="w-full accent-green-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.5 km</span>
          <span>15 km</span>
        </div>
      </FilterSection>

      <FilterSection title="Tipo de excedente">
        <div className="space-y-2">
          {(Object.entries(SURPLUS_LABELS) as [SurplusType, typeof SURPLUS_LABELS[SurplusType]][]).map(
            ([type, meta]) => (
              <button
                key={type}
                onClick={() => toggleSurplus(type)}
                className={`w-full text-left text-sm px-3 py-2.5 rounded-lg border transition-colors ${
                  pending.surplusTypes.includes(type)
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "border-gray-200 text-gray-700"
                }`}
              >
                <span className={`text-xs px-2 py-0.5 rounded-full border mr-2 ${meta.color}`}>
                  {meta.label}
                </span>
                <span className="text-xs text-gray-500">{meta.description}</span>
              </button>
            )
          )}
          {pending.surplusTypes.length === 0 && (
            <p className="text-xs text-gray-400 pl-1">Nenhum selecionado = mostrar todos</p>
          )}
        </div>
      </FilterSection>
    </>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between mb-3 text-sm text-gray-800"
        style={{ fontWeight: 600 }}
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
