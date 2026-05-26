import { X, MapPin, Clock, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { offers, isNearOffer, calculateDynamicPrice } from "../data/mockData";

interface SmartAlertsProps {
  enabled?: boolean;
}

export function SmartAlerts({ enabled = true }: SmartAlertsProps) {
  const [alerts, setAlerts] = useState<typeof offers>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    // Simulate geofencing check
    const nearbyOffers = offers.filter(offer => 
      isNearOffer(offer) && 
      offer.expiryHours <= 3 &&
      !dismissed.has(offer.id)
    );

    setAlerts(nearbyOffers);

    // Simulate periodic checks (every 30 seconds in production this would be real geofencing)
    const interval = setInterval(() => {
      const updatedOffers = offers.filter(offer => 
        isNearOffer(offer) && 
        offer.expiryHours <= 3 &&
        !dismissed.has(offer.id)
      );
      setAlerts(updatedOffers);
    }, 30000);

    return () => clearInterval(interval);
  }, [enabled, dismissed]);

  const handleDismiss = (offerId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(prev => new Set(prev).add(offerId));
  };

  if (!enabled || alerts.length === 0) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="max-w-md mx-auto space-y-3">
        {alerts.map(offer => {
          const dynamicPrice = calculateDynamicPrice(offer);
          
          return (
            <Link
              key={offer.id}
              to={`/offer/${offer.id}`}
              className="block"
            >
              <div className="bg-white border-2 border-orange-500 rounded-xl shadow-2xl overflow-hidden animate-bounce-slow">
                {/* Alert Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-semibold">Perto de si • Urgente!</span>
                  </div>
                  <button
                    onClick={(e) => handleDismiss(offer.id, e)}
                    className="hover:bg-white/20 rounded-full p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Alert Content */}
                <div className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                        {offer.title}
                      </h3>
                      <p className="text-sm text-orange-600 mb-2">
                        {offer.restaurantName}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{offer.distance} km</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-600 font-semibold">
                          <Clock className="w-3 h-3" />
                          <span>{offer.expiryHours}h até expirar</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          <TrendingDown className="w-3 h-3" />
                          <span>-{dynamicPrice.discount}%</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          €{dynamicPrice.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          €{offer.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 text-center">
                      ⚡ <span className="font-semibold text-orange-600">Preço dinâmico ativo!</span> 
                      {" "}Desconto aumenta à medida que se aproxima o horário de fecho
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
