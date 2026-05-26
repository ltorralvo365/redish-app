import { MapPin, Star, Clock, TrendingDown, Zap } from "lucide-react";
import { Offer, calculateDynamicPrice } from "../data/mockData";
import { Link } from "react-router";

interface OfferCardProps {
  offer: Offer;
  showDynamicPricing?: boolean;
}

export function OfferCard({ offer, showDynamicPricing = false }: OfferCardProps) {
  const dynamicPrice = showDynamicPricing ? calculateDynamicPrice(offer) : null;
  const finalPrice = dynamicPrice ? dynamicPrice.price : offer.discountedPrice;
  const finalDiscount = dynamicPrice ? dynamicPrice.discount : offer.discount;
  const isDynamicActive = dynamicPrice && dynamicPrice.discount > offer.discount;
  const isUrgent = offer.expiryHours <= 2;

  return (
    <Link to={`/offer/${offer.id}`} className="block">
      <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${
        isUrgent ? "ring-2 ring-orange-500" : ""
      }`}>
        <div className="relative">
          <img
            src={offer.image}
            alt={offer.title}
            className="w-full h-40 object-cover"
          />
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-sm font-semibold flex items-center gap-1 ${
            isDynamicActive ? "bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse" : "bg-red-500 text-white"
          }`}>
            {isDynamicActive && <TrendingDown className="w-3 h-3" />}
            -{finalDiscount}%
          </div>
          
          {isUrgent && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 animate-pulse">
              <Zap className="w-3 h-3" />
              URGENTE
            </div>
          )}
          
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {offer.pickupTime}
          </div>
          
          {offer.expiryHours <= 3 && (
            <div className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              {offer.expiryHours}h restantes
            </div>
          )}
        </div>
        
        <div className="p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 mb-1">{offer.restaurantName}</h3>
              <p className="font-semibold text-gray-900">{offer.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{offer.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{offer.distance} km</span>
            </div>
            <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
              {offer.quantity} disponíveis
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-lg font-semibold ${isDynamicActive ? "text-orange-600" : "text-green-600"}`}>
                €{finalPrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">€{offer.originalPrice.toFixed(2)}</span>
            </div>
            {isDynamicActive && (
              <span className="text-xs text-orange-600 font-semibold">🔥 Preço dinâmico</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}