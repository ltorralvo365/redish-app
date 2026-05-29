import { useState } from "react";
import {
  Search, MapPin, SlidersHorizontal, Zap, Bell, Trophy, Star,
  X, ChevronDown, ChevronUp, BellRing,
} from "lucide-react";
import { Link, Navigate } from "react-router";
import { OfferCard } from "../components/OfferCard";
import { CommercialOfferCard } from "../components/CommercialOfferCard";
import { offers, commercialOffers } from "../data/mockData";
import type { SurplusType } from "../data/mockData";
import { SURPLUS_LABELS } from "../data/mockData";
import { BottomNav } from "../components/BottomNav";
import { SmartAlerts } from "../components/SmartAlerts";
import { useAuth } from "../context/AuthContext";

// ── filter types ──────────────────────────────────────────────────────────────

type AllergyKey =
  | "gluten" | "lactose" | "frutos_secos" | "ovos" | "marisco"
  | "soja" | "amendoim" | "sesamo" | "vegetariano" | "vegano";

const ALLERGY_LABELS: Record<AllergyKey, string> = {
  gluten: "Sem Glúten", lactose: "Sem Lactose", frutos_secos: "Sem Frutos Secos",
  ovos: "Sem Ovos", marisco: "Sem Marisco", soja: "Sem Soja",
  amendoim: "Sem Amendoim", sesamo: "Sem Sésamo", vegetariano: "Vegetariano", vegano: "Vegan",
};

interface ConsumerFilters {
  maxDistance: number;
  minDiscount: number;
  minRating: number;
  sortBy: "distance" | "discount" | "rating" | "expiry";
  allergies: AllergyKey[];
}
const DEFAULT_CONSUMER: ConsumerFilters = {
  maxDistance: 10, minDiscount: 0, minRating: 0, sortBy: "distance", allergies: [],
};

interface CommercialFilters {
  maxDistance: number;
  surplusTypes: SurplusType[];
  sortBy: "distance" | "rating" | "weight";
}
const DEFAULT_COMMERCIAL: CommercialFilters = { maxDistance: 10, surplusTypes: [], sortBy: "distance" };

const COMMERCIAL_CATEGORIES = ["Todos", "Supermercado", "Restaurante", "Padaria", "Hotel", "Mercado", "Cantina"];
const CONSUMER_CATEGORIES = ["Todos", "Italiana", "Japonesa", "Hambúrgueres", "Saudável", "Padaria", "Variada"];

// ── component ─────────────────────────────────────────────────────────────────

export function Home() {
  const { user } = useAuth();
  const isSeller = user?.accountType === "seller";
  const isCommercial =
    user?.accountType === "consumer" &&
    user.consumerProfile?.partnershipType === "commercial";

  // Sellers don't have a home offer page
  if (isSeller) return <Navigate to="/seller" replace />;

  const [searchQuery, setSearchQuery] = useState("");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [alertedOffers, setAlertedOffers] = useState<Set<string>>(new Set());

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [consumerFilters, setConsumerFilters] = useState<ConsumerFilters>(DEFAULT_CONSUMER);
  const [pendingConsumer, setPendingConsumer] = useState<ConsumerFilters>(DEFAULT_CONSUMER);

  const [selectedCommCategory, setSelectedCommCategory] = useState("Todos");
  const [commFilters, setCommFilters] = useState<CommercialFilters>(DEFAULT_COMMERCIAL);
  const [pendingComm, setPendingComm] = useState<CommercialFilters>(DEFAULT_COMMERCIAL);

  const toggleAlert = (id: string) =>
    setAlertedOffers(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const filteredOffers = offers
    .filter(o => {
      const q = searchQuery.toLowerCase();
      return (
        (o.title.toLowerCase().includes(q) || o.restaurantName.toLowerCase().includes(q)) &&
        (selectedCategory === "Todos" || o.category === selectedCategory) &&
        o.distance <= consumerFilters.maxDistance &&
        o.discount >= consumerFilters.minDiscount &&
        o.rating >= consumerFilters.minRating
      );
    })
    .sort((a, b) => {
      if (consumerFilters.sortBy === "distance") return a.distance - b.distance;
      if (consumerFilters.sortBy === "discount") return b.discount - a.discount;
      if (consumerFilters.sortBy === "rating") return b.rating - a.rating;
      if (consumerFilters.sortBy === "expiry") return a.expiryHours - b.expiryHours;
      return 0;
    });

  const filteredCommercial = commercialOffers
    .filter(o => {
      const q = searchQuery.toLowerCase();
      return (
        (o.establishmentName.toLowerCase().includes(q) || o.address.toLowerCase().includes(q)) &&
        (selectedCommCategory === "Todos" || o.category === selectedCommCategory) &&
        o.distance <= commFilters.maxDistance &&
        (commFilters.surplusTypes.length === 0 || commFilters.surplusTypes.some(t => o.surplusTypes.includes(t)))
      );
    })
    .sort((a, b) => {
      if (commFilters.sortBy === "distance") return a.distance - b.distance;
      if (commFilters.sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const urgentCount = offers.filter(o => o.expiryHours <= 2).length;

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

  const activeFilterCount = isCommercial
    ? (commFilters.surplusTypes.length > 0 ? 1 : 0) + (commFilters.maxDistance < 10 ? 1 : 0)
    : (consumerFilters.minDiscount > 0 ? 1 : 0) + (consumerFilters.minRating > 0 ? 1 : 0) +
      (consumerFilters.maxDistance < 10 ? 1 : 0) + consumerFilters.allergies.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {!isCommercial && <SmartAlerts enabled={alertsEnabled} />}

      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl">{isCommercial ? "Parcerias de Excedentes 🤝" : "Olá! 👋"}</h1>
              <p className="text-sm text-green-100">
                {isCommercial ? "Excedentes alimentares disponíveis perto de si" : "O que vamos salvar hoje?"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!isCommercial && (
                <button onClick={() => setAlertsEnabled(p => !p)}
                  className={`p-2 rounded-lg transition-colors ${alertsEnabled ? "bg-green-700" : "bg-green-700/50"}`}>
                  <Bell className="w-5 h-5" />
                </button>
              )}
              <button className="flex items-center gap-1 bg-green-700 px-3 py-2 rounded-lg text-sm">
                <MapPin className="w-4 h-4" />
                {user?.consumerProfile?.city ?? "Lisboa"}
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder={isCommercial ? "Pesquisar estabelecimentos..." : "Pesquisar restaurantes ou comida..."}
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Quick access — personal consumer only */}
        {!isCommercial && (
          <div className="grid grid-cols-3 gap-3 my-4">
            <Link to="/subscriptions" className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 shadow-md">
              <Star className="w-6 h-6 mb-2" /><p className="text-xs font-semibold">Subscrições</p>
            </Link>
            <Link to="/eco-ranking" className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl p-3 shadow-md">
              <Trophy className="w-6 h-6 mb-2" /><p className="text-xs font-semibold">Ranking</p>
            </Link>
            <Link to="/compost-partners" className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl p-3 shadow-md">
              <Zap className="w-6 h-6 mb-2" /><p className="text-xs font-semibold">Zero Waste</p>
            </Link>
          </div>
        )}

        {/* Surplus legend — commercial only */}
        {isCommercial && (
          <div className="mt-4 mb-3 space-y-1.5">
            {(Object.entries(SURPLUS_LABELS) as [SurplusType, typeof SURPLUS_LABELS[SurplusType]][]).map(([, meta]) => (
              <div key={meta.label} className="flex items-start gap-2 text-xs text-gray-600">
                <span className={`mt-0.5 px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${meta.color}`}>{meta.label}</span>
                <span>{meta.description}</span>
              </div>
            ))}
          </div>
        )}

        {/* Urgent banner */}
        {!isCommercial && urgentCount > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><Zap className="w-6 h-6" /></div>
              <div>
                <p className="font-bold text-lg">{urgentCount} Ofertas Urgentes!</p>
                <p className="text-sm text-orange-100">Descontos até 80% • Expira em breve</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats — personal consumer */}
        {!isCommercial && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div><p className="text-2xl">🌍</p><p className="text-sm text-gray-600 mt-1">Refeições salvas hoje</p><p className="text-2xl text-green-600 mt-1">1,247</p></div>
              <div className="text-right"><p className="text-sm text-gray-600">Você salvou</p><p className="text-3xl text-green-600 mt-1">12</p><p className="text-xs text-gray-500">refeições</p></div>
            </div>
          </div>
        )}

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {(isCommercial ? COMMERCIAL_CATEGORIES : CONSUMER_CATEGORIES).map(cat => (
            <button key={cat} onClick={() => isCommercial ? setSelectedCommCategory(cat) : setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                (isCommercial ? selectedCommCategory : selectedCategory) === cat
                  ? "bg-green-600 text-white" : "bg-white text-gray-700 border border-gray-200"
              }`}>{cat}</button>
          ))}
        </div>

        {/* List header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base text-gray-900" style={{ fontWeight: 600 }}>
            {isCommercial ? `${filteredCommercial.length} estabelecimentos perto de si` : `${filteredOffers.length} ofertas perto de si`}
          </h2>
          <button onClick={openFilters}
            className="flex items-center gap-1 text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {/* Cards */}
        <div className="space-y-4 mb-4">
          {isCommercial
            ? filteredCommercial.map(o => (
                <div key={o.id} className="relative">
                  <CommercialOfferCard offer={o} />
                  <button onClick={() => toggleAlert(o.id)}
                    className={`absolute top-3 right-3 flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border shadow-sm transition-colors ${alertedOffers.has(o.id) ? "bg-amber-100 border-amber-400 text-amber-700" : "bg-white border-gray-200 text-gray-600 hover:border-green-400"}`}>
                    <BellRing className="w-3 h-3" />
                    {alertedOffers.has(o.id) ? "Alerta ativo" : "Alertar"}
                  </button>
                </div>
              ))
            : filteredOffers.map(o => <OfferCard key={o.id} offer={o} showDynamicPricing />)
          }
          {isCommercial && filteredCommercial.length === 0 && (
            <div className="text-center py-12 text-gray-400"><p className="text-sm">Nenhum estabelecimento encontrado com esses filtros.</p></div>
          )}
          {!isCommercial && filteredOffers.length === 0 && (
            <div className="text-center py-12 text-gray-400"><p className="text-sm">Nenhuma oferta encontrada com esses filtros.</p></div>
          )}
        </div>
      </div>

      <BottomNav />

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="relative w-full bg-white rounded-t-2xl shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <h2 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Filtros</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => { setPendingConsumer(DEFAULT_CONSUMER); setPendingComm(DEFAULT_COMMERCIAL); }} className="text-xs text-green-600 underline">Repor</button>
                <button onClick={() => setShowFilters(false)} className="p-1 text-gray-400"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="px-4 py-4 space-y-6 max-w-md mx-auto">
              {isCommercial
                ? <CommercialFilterPanel pending={pendingComm} setPending={setPendingComm} />
                : <ConsumerFilterPanel pending={pendingConsumer} setPending={setPendingConsumer} />
              }
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
              <button onClick={applyFilters} className="w-full bg-green-600 text-white rounded-xl py-3.5 hover:bg-green-700 transition-colors">
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── filter panels ─────────────────────────────────────────────────────────────

function ConsumerFilterPanel({ pending, setPending }: {
  pending: ConsumerFilters;
  setPending: React.Dispatch<React.SetStateAction<ConsumerFilters>>;
}) {
  const toggleAllergy = (k: AllergyKey) =>
    setPending(p => ({ ...p, allergies: p.allergies.includes(k) ? p.allergies.filter(a => a !== k) : [...p.allergies, k] }));

  return (
    <>
      <FilterSection title="Ordenar por">
        <div className="grid grid-cols-2 gap-2">
          {([["distance", "Distância"], ["discount", "Maior desconto"], ["rating", "Melhor avaliação"], ["expiry", "Expira mais cedo"]] as [ConsumerFilters["sortBy"], string][]).map(([v, l]) => (
            <ChoiceBtn key={v} label={l} active={pending.sortBy === v} onClick={() => setPending(p => ({ ...p, sortBy: v }))} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title={`Distância máxima: ${pending.maxDistance} km`}>
        <RangeSlider min={0.5} max={10} step={0.5} value={pending.maxDistance}
          onChange={v => setPending(p => ({ ...p, maxDistance: v }))} labels={["0.5 km", "10 km"]} />
      </FilterSection>

      <FilterSection title={`Desconto mínimo: ${pending.minDiscount}%`}>
        <RangeSlider min={0} max={80} step={5} value={pending.minDiscount}
          onChange={v => setPending(p => ({ ...p, minDiscount: v }))} labels={["0%", "80%"]} />
      </FilterSection>

      <FilterSection title={`Avaliação mínima: ${pending.minRating > 0 ? `${pending.minRating}★` : "Todas"}`}>
        <div className="flex gap-2">
          {([0, 4, 4.5, 4.8] as const).map(v => (
            <ChoiceBtn key={v} label={v === 0 ? "Todas" : `${v}+`} active={pending.minRating === v}
              onClick={() => setPending(p => ({ ...p, minRating: v }))} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Alergias e restrições alimentares">
        <div className="flex flex-wrap gap-2">
          {(Object.entries(ALLERGY_LABELS) as [AllergyKey, string][]).map(([k, l]) => (
            <button key={k} onClick={() => toggleAllergy(k)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                pending.allergies.includes(k)
                  ? "bg-green-100 border-green-500 text-green-700"
                  : "border-gray-200 text-gray-600 hover:border-green-300"
              }`}>{l}</button>
          ))}
        </div>
        {pending.allergies.length > 0 && (
          <p className="text-xs text-gray-400 mt-2">Apenas serão mostradas ofertas compatíveis com os filtros selecionados.</p>
        )}
      </FilterSection>
    </>
  );
}

function CommercialFilterPanel({ pending, setPending }: {
  pending: CommercialFilters;
  setPending: React.Dispatch<React.SetStateAction<CommercialFilters>>;
}) {
  const toggle = (t: SurplusType) =>
    setPending(p => ({ ...p, surplusTypes: p.surplusTypes.includes(t) ? p.surplusTypes.filter(x => x !== t) : [...p.surplusTypes, t] }));

  return (
    <>
      <FilterSection title="Ordenar por">
        <div className="grid grid-cols-3 gap-2">
          {([["distance", "Distância"], ["rating", "Avaliação"], ["weight", "Quantidade"]] as [CommercialFilters["sortBy"], string][]).map(([v, l]) => (
            <ChoiceBtn key={v} label={l} active={pending.sortBy === v} onClick={() => setPending(p => ({ ...p, sortBy: v }))} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title={`Distância máxima: ${pending.maxDistance} km`}>
        <RangeSlider min={0.5} max={15} step={0.5} value={pending.maxDistance}
          onChange={v => setPending(p => ({ ...p, maxDistance: v }))} labels={["0.5 km", "15 km"]} />
      </FilterSection>

      <FilterSection title="Tipo de excedente">
        <div className="space-y-2">
          {(Object.entries(SURPLUS_LABELS) as [SurplusType, typeof SURPLUS_LABELS[SurplusType]][]).map(([t, meta]) => (
            <button key={t} onClick={() => toggle(t)}
              className={`w-full text-left text-sm px-3 py-2.5 rounded-lg border transition-colors ${
                pending.surplusTypes.includes(t) ? "bg-green-50 border-green-500" : "border-gray-200 text-gray-700"
              }`}>
              <span className={`text-xs px-2 py-0.5 rounded-full border mr-2 ${meta.color}`}>{meta.label}</span>
              <span className="text-xs text-gray-500">{meta.description}</span>
            </button>
          ))}
          {pending.surplusTypes.length === 0 && <p className="text-xs text-gray-400 pl-1">Nenhum selecionado = mostrar todos</p>}
        </div>
      </FilterSection>
    </>
  );
}

// ── small helpers ─────────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center justify-between mb-3 text-sm text-gray-800" style={{ fontWeight: 600 }}>
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function ChoiceBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`text-sm px-3 py-2 rounded-lg border transition-colors ${active ? "bg-green-50 border-green-500 text-green-700" : "border-gray-200 text-gray-700 hover:border-green-300"}`}>
      {label}
    </button>
  );
}

function RangeSlider({ min, max, step, value, onChange, labels }: {
  min: number; max: number; step: number; value: number;
  onChange: (v: number) => void; labels: [string, string];
}) {
  return (
    <>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} className="w-full accent-green-600" />
      <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{labels[0]}</span><span>{labels[1]}</span></div>
    </>
  );
}
