import { useState } from "react";
import { MapPin, Clock, Star, Scale, MessageSquare, X, Check, Send } from "lucide-react";
import type { CommercialOffer } from "../data/mockData";
import { SURPLUS_LABELS } from "../data/mockData";

export function CommercialOfferCard({ offer }: { offer: CommercialOffer }) {
  const [showContact, setShowContact] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => { setSent(false); setShowContact(false); setMessage(""); }, 2000);
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="relative h-36 overflow-hidden">
          <img src={offer.image} alt={offer.establishmentName} className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"; }} />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs text-gray-700 px-2 py-1 rounded-full border border-gray-200">
            {offer.establishmentType}
          </div>
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm flex items-center gap-1 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-700">{offer.rating}</span>
          </div>
        </div>

        <div className="p-3">
          <h3 className="text-sm text-gray-900 mb-0.5" style={{ fontWeight: 700 }}>{offer.establishmentName}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{offer.address}</span>
            <span className="ml-auto whitespace-nowrap">{offer.distance} km</span>
          </div>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{offer.surplusDescription}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {offer.surplusTypes.map(type => (
              <span key={type} className={`text-xs px-2 py-0.5 rounded-full border ${SURPLUS_LABELS[type].color}`}>
                {SURPLUS_LABELS[type].label}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1"><Scale className="w-3 h-3" />{offer.estimatedWeight}</div>
              <div className="flex items-center gap-1"><Clock className="w-3 h-3" />Disp. {offer.availableFrom}</div>
            </div>
            <button onClick={() => setShowContact(true)}
              className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors">
              <MessageSquare className="w-3 h-3" />
              Contactar
            </button>
          </div>
        </div>
      </div>

      {/* Contact modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowContact(false)} />
          <div className="relative w-full bg-white rounded-t-2xl shadow-xl px-4 py-5 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base text-gray-900" style={{ fontWeight: 700 }}>Contactar estabelecimento</h3>
                <p className="text-xs text-gray-500">{offer.establishmentName}</p>
              </div>
              <button onClick={() => setShowContact(false)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>

            {sent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-700" style={{ fontWeight: 600 }}>Pedido enviado!</p>
                <p className="text-xs text-gray-500 mt-1">O estabelecimento receberá a tua mensagem em breve.</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-xl p-3 mb-3 text-xs text-gray-600 space-y-1">
                  <p><span className="text-gray-400">Excedentes:</span> {offer.surplusTypes.map(t => SURPLUS_LABELS[t].label).join(", ")}</p>
                  <p><span className="text-gray-400">Quantidade:</span> {offer.estimatedWeight}</p>
                  <p><span className="text-gray-400">Disponível a partir das:</span> {offer.availableFrom}</p>
                </div>
                <label className="text-xs text-gray-500 mb-1 block">A tua mensagem</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                  placeholder={`Olá, somos a [organização] e temos interesse nos vossos excedentes de ${offer.surplusTypes.map(t => SURPLUS_LABELS[t].label).join(" e ")}. Podemos combinar uma recolha?`}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 transition-colors resize-none mb-3" />
                <button onClick={handleSend} disabled={!message.trim()}
                  className="w-full bg-green-600 text-white rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send className="w-4 h-4" /> Enviar pedido
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
