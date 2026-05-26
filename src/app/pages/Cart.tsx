import { useState } from "react";
import { Trash2, ShoppingBag, ArrowRight, Clock, MapPin } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { offers } from "../data/mockData";

interface CartItem {
  offer: typeof offers[0];
  quantity: number;
}

export function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { offer: offers[0], quantity: 1 },
    { offer: offers[1], quantity: 2 },
  ]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.offer.discountedPrice * item.quantity,
    0
  );
  const serviceFee = 1.5;
  const total = subtotal + serviceFee;

  const handleRemoveItem = (offerId: string) => {
    setCartItems(cartItems.filter((item) => item.offer.id !== offerId));
  };

  const handleUpdateQuantity = (offerId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveItem(offerId);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.offer.id === offerId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleCheckout = () => {
    alert("Reserva confirmada! Você receberá os detalhes por email.");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl text-gray-900">Carrinho</h1>
          <p className="text-sm text-gray-600 mt-1">
            {cartItems.length} {cartItems.length === 1 ? "item" : "itens"}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl text-gray-900 mb-2">Carrinho vazio</h2>
            <p className="text-gray-600">Adicione ofertas para começar a salvar comida!</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-4">
              {cartItems.map((item) => (
                <div key={item.offer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex gap-3 p-3">
                    <img
                      src={item.offer.image}
                      alt={item.offer.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm text-gray-900 mb-1">{item.offer.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{item.offer.restaurantName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.offer.pickupTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.offer.distance} km
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.offer.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.offer.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-green-600">
                        €{(item.offer.discountedPrice * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.offer.id)}
                        className="text-red-500 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-lg mb-3">Resumo</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de serviço</span>
                  <span>€{serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-gray-900">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
              <h3 className="text-sm text-gray-900 mb-2">Impacto Ambiental 🌍</h3>
              <p className="text-xs text-gray-600">
                Ao reservar estas {cartItems.reduce((sum, item) => sum + item.quantity, 0)} refeições,
                você está evitando aproximadamente <span className="text-green-700">2.5 kg</span> de
                desperdício alimentar!
              </p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <span className="text-lg">Reservar agora</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-xs text-center text-gray-500 mt-3">
              O pagamento será processado no momento da recolha
            </p>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
