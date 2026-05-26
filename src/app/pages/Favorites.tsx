import { Heart } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { OfferCard } from "../components/OfferCard";
import { offers } from "../data/mockData";

export function Favorites() {
  // Mock favorite offers - in real app this would come from state/database
  const favoriteOffers = [offers[0], offers[1], offers[3]];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl text-gray-900">Favoritos</h1>
          <p className="text-sm text-gray-600 mt-1">
            {favoriteOffers.length} {favoriteOffers.length === 1 ? "restaurante" : "restaurantes"}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {favoriteOffers.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl text-gray-900 mb-2">Sem favoritos ainda</h2>
            <p className="text-gray-600">
              Adicione restaurantes aos favoritos para acompanhar suas ofertas!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
