import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, MapPin, Star, Clock, ShoppingBag, Heart, Info, Check } from "lucide-react";
import { offers, FoodItem } from "../data/mockData";

export function OfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());

  const offer = offers.find((o) => o.id === id);

  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Oferta não encontrada</p>
      </div>
    );
  }

  const toggleItem = (item: FoodItem) => {
    const newSelectedItems = new Map(selectedItems);
    if (newSelectedItems.has(item.id)) {
      newSelectedItems.delete(item.id);
    } else {
      newSelectedItems.set(item.id, item.quantity);
    }
    setSelectedItems(newSelectedItems);
  };

  const updateItemQuantity = (itemId: string, delta: number) => {
    const newSelectedItems = new Map(selectedItems);
    const currentQuantity = newSelectedItems.get(itemId) || 0;
    const newQuantity = Math.max(0, currentQuantity + delta);
    
    if (newQuantity === 0) {
      newSelectedItems.delete(itemId);
    } else {
      const item = offer.items.find(i => i.id === itemId);
      if (item && newQuantity <= item.available) {
        newSelectedItems.set(itemId, newQuantity);
      }
    }
    setSelectedItems(newSelectedItems);
  };

  const totalSelectedItems = Array.from(selectedItems.values()).reduce((sum, qty) => sum + qty, 0);
  const canAddToCart = totalSelectedItems >= offer.minItems && totalSelectedItems <= offer.maxItems;

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    
    const itemsList = Array.from(selectedItems.entries())
      .map(([itemId, qty]) => {
        const item = offer.items.find(i => i.id === itemId);
        return `${qty}x ${item?.name}`;
      })
      .join(", ");
    
    alert(`Adicionado ao carrinho:\n${itemsList}`);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header Image */}
      <div className="relative">
        <img
          src={offer.image}
          alt={offer.title}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </button>
        <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md">
          -{offer.discount}%
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4">
        {/* Restaurant Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">{offer.restaurantName}</p>
              <h1 className="text-xl text-gray-900 mt-1">{offer.title}</h1>
            </div>
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded">
              <Star className="w-4 h-4 fill-green-700" />
              <span className="text-sm">{offer.rating}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">{offer.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Horário de recolha</p>
                <p className="text-gray-900">{offer.pickupTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Distância</p>
                <p className="text-gray-900">{offer.distance} km</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-900">
              Escolha entre {offer.minItems} a {offer.maxItems} itens. Preço fixo de €{offer.discountedPrice.toFixed(2)} independente dos itens escolhidos!
            </p>
          </div>
        </div>

        {/* Food Items Selection */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg">Escolha seus itens 🍽️</h2>
            <span className={`text-sm px-2 py-1 rounded ${
              canAddToCart ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            }`}>
              {totalSelectedItems} / {offer.minItems}-{offer.maxItems}
            </span>
          </div>

          <div className="space-y-3">
            {offer.items.map((item) => {
              const isSelected = selectedItems.has(item.id);
              const selectedQty = selectedItems.get(item.id) || 0;

              return (
                <div
                  key={item.id}
                  className={`border rounded-lg p-3 transition-all ${
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleItem(item)}
                      className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm text-gray-900">{item.name}</h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          €{item.originalPrice.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                      <p className="text-xs text-gray-500">
                        {item.available} disponíveis
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 flex items-center gap-3 pt-3 border-t border-green-200">
                      <span className="text-sm text-gray-700">Quantidade:</span>
                      <div className="flex items-center border border-green-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateItemQuantity(item.id, -1)}
                          className="px-3 py-1 text-green-600 hover:bg-green-50"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border-x border-green-300 min-w-[40px] text-center">
                          {selectedQty}
                        </span>
                        <button
                          onClick={() => updateItemQuantity(item.id, 1)}
                          disabled={selectedQty >= item.available}
                          className="px-3 py-1 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalSelectedItems > 0 && !canAddToCart && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-900">
                {totalSelectedItems < offer.minItems
                  ? `Escolha pelo menos ${offer.minItems - totalSelectedItems} item(s) adicional(is)`
                  : `Você excedeu o limite. Remova ${totalSelectedItems - offer.maxItems} item(s)`}
              </p>
            </div>
          )}
        </div>

        {/* Value Comparison */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h2 className="text-lg mb-3">Economia 💰</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Valor original dos itens</span>
              <span className="line-through">
                €{offer.items
                  .filter(item => selectedItems.has(item.id))
                  .reduce((sum, item) => sum + (item.originalPrice * (selectedItems.get(item.id) || 0)), 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Você paga</span>
              <span>€{offer.discountedPrice.toFixed(2)}</span>
            </div>
            {selectedItems.size > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Economia estimada: €
                  {(offer.items
                    .filter(item => selectedItems.has(item.id))
                    .reduce((sum, item) => sum + (item.originalPrice * (selectedItems.get(item.id) || 0)), 0) - 
                    offer.discountedPrice).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h2 className="text-lg mb-3">Localização</h2>
          <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {offer.restaurantName} • {offer.distance} km de distância
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              canAddToCart
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>
              {totalSelectedItems === 0
                ? "Escolha os itens"
                : !canAddToCart
                ? "Ajuste a seleção"
                : `Adicionar • €${offer.discountedPrice.toFixed(2)}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
