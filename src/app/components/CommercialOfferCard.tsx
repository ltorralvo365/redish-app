import { MapPin, Clock, Star, Scale, Mail } from "lucide-react";
import type { CommercialOffer } from "../data/mockData";
import { SURPLUS_LABELS } from "../data/mockData";

export function CommercialOfferCard({ offer }: { offer: CommercialOffer }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="relative h-36 overflow-hidden">
        <img
          src={offer.image}
          alt={offer.establishmentName}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80";
          }}
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs text-gray-700 px-2 py-1 rounded-full border border-gray-200">
          {offer.establishmentType}
        </div>
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm flex items-center gap-1 px-2 py-1 rounded-full">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs text-gray-700">{offer.rating}</span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm text-gray-900 mb-0.5" style={{ fontWeight: 700 }}>
          {offer.establishmentName}
        </h3>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{offer.address}</span>
          <span className="ml-auto whitespace-nowrap">{offer.distance} km</span>
        </div>

        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{offer.surplusDescription}</p>

        {/* Surplus type tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {offer.surplusTypes.map((type) => (
            <span
              key={type}
              className={`text-xs px-2 py-0.5 rounded-full border ${SURPLUS_LABELS[type].color}`}
            >
              {SURPLUS_LABELS[type].label}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Scale className="w-3 h-3" />
              {offer.estimatedWeight}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Disp. {offer.availableFrom}
            </div>
          </div>
          <a
            href={`mailto:${offer.contact}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Mail className="w-3 h-3" />
            Contactar
          </a>
        </div>
      </div>
    </div>
  );
}
