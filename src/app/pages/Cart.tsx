import { useState } from "react";
import { Trash2, ShoppingBag, ArrowRight, Clock, MapPin, Check, ChevronLeft } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { offers } from "../data/mockData";

interface CartItem {
  offer: typeof offers[0];
  quantity: number;
}

type PaymentMethod = "mbway" | "multibanco" | "cartao" | "dinheiro" | null;

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: string; desc: string }[] = [
  { id: "mbway", label: "MB WAY", icon: "📱", desc: "Pagamento imediato pelo telemóvel" },
  { id: "multibanco", label: "Multibanco", icon: "🏧", desc: "Referência gerada após confirmação" },
  { id: "cartao", label: "Cartão de Crédito/Débito", icon: "💳", desc: "Visa, Mastercard, etc." },
  { id: "dinheiro", label: "Dinheiro", icon: "💵", desc: "Paga em espécie no momento da recolha" },
];

export function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { offer: offers[0], quantity: 1 },
    { offer: offers[1], quantity: 2 },
  ]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "payment" | "confirm">("cart");
  const [mbwayPhone, setMbwayPhone] = useState("");
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce((s, i) => s + i.offer.discountedPrice * i.quantity, 0);
  const serviceFee = 1.5;
  const total = subtotal + serviceFee;

  const remove = (id: string) => setCartItems(p => p.filter(i => i.offer.id !== id));
  const update = (id: string, qty: number) => {
    if (qty === 0) { remove(id); return; }
    setCartItems(p => p.map(i => i.offer.id === id ? { ...i, quantity: qty } : i));
  };

  function handleProceedToPayment() {
    setError("");
    setCheckoutStep("payment");
  }

  function handleConfirmPayment() {
    if (!paymentMethod) { setError("Seleciona um método de pagamento."); return; }
    if (paymentMethod === "mbway" && !mbwayPhone) { setError("Introduz o número de telemóvel."); return; }
    setCheckoutStep("confirm");
  }

  if (checkoutStep === "confirm") {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>Reserva Confirmada!</h2>
          <p className="text-sm text-gray-500 mb-4">
            {paymentMethod === "multibanco"
              ? "Receberás a referência Multibanco por email em breve."
              : paymentMethod === "mbway"
              ? `Notificação enviada para ${mbwayPhone}.`
              : "Apresenta o código QR no momento da recolha."}
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-1">
            {cartItems.map(i => (
              <p key={i.offer.id} className="text-xs text-gray-600">{i.quantity}× {i.offer.title} — €{(i.offer.discountedPrice * i.quantity).toFixed(2)}</p>
            ))}
            <p className="text-xs text-gray-400 pt-1 border-t border-gray-200">Total: €{total.toFixed(2)}</p>
          </div>
          <button onClick={() => { setCheckoutStep("cart"); setCartItems([]); setPaymentMethod(null); }}
            className="w-full bg-green-600 text-white rounded-xl py-3 hover:bg-green-700 transition-colors">
            Fechar
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (checkoutStep === "payment") {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <button onClick={() => setCheckoutStep("cart")} className="text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl text-gray-900" style={{ fontWeight: 700 }}>Método de Pagamento</h1>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-4 space-y-3">
          {PAYMENT_OPTIONS.map(opt => (
            <button key={opt.id} onClick={() => setPaymentMethod(opt.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left ${paymentMethod === opt.id ? "border-green-500 bg-green-50" : "border-gray-200 bg-white hover:border-green-300"}`}>
              <span className="text-3xl">{opt.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{opt.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
              </div>
              {paymentMethod === opt.id && (
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}

          {paymentMethod === "mbway" && (
            <div className="mt-2">
              <label className="text-xs text-gray-500 mb-1 block">Número de telemóvel</label>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-3 focus-within:border-green-500 transition-colors">
                <span className="text-sm text-gray-400">+351</span>
                <input type="tel" value={mbwayPhone} onChange={e => setMbwayPhone(e.target.value)}
                  placeholder="912 345 678" className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Subtotal</span><span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Taxa de serviço</span><span>€{serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base text-gray-900 border-t border-gray-100 pt-2" style={{ fontWeight: 700 }}>
              <span>Total</span><span>€{total.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handleConfirmPayment}
            className="w-full bg-green-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-green-700 transition-colors">
            Confirmar Reserva <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Carrinho</h1>
          <p className="text-sm text-gray-600 mt-1">{cartItems.length} {cartItems.length === 1 ? "item" : "itens"}</p>
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
            <div className="space-y-4 mb-4">
              {cartItems.map(item => (
                <div key={item.offer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex gap-3 p-3">
                    <img src={item.offer.image} alt={item.offer.title} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="text-sm text-gray-900 mb-1" style={{ fontWeight: 600 }}>{item.offer.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{item.offer.restaurantName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.offer.pickupTime}</div>
                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.offer.distance} km</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button onClick={() => update(item.offer.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600">−</button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => update(item.offer.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600">+</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-600" style={{ fontWeight: 600 }}>€{(item.offer.discountedPrice * item.quantity).toFixed(2)}</span>
                      <button onClick={() => remove(item.offer.id)} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-lg mb-3" style={{ fontWeight: 600 }}>Resumo</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>€{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Taxa de serviço</span><span>€{serviceFee.toFixed(2)}</span></div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-gray-900" style={{ fontWeight: 700 }}><span>Total</span><span>€{total.toFixed(2)}</span></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
              <h3 className="text-sm text-gray-900 mb-2" style={{ fontWeight: 600 }}>Impacto Ambiental 🌍</h3>
              <p className="text-xs text-gray-600">
                Ao reservar {cartItems.reduce((s, i) => s + i.quantity, 0)} refeições estás a evitar aproximadamente{" "}
                <span className="text-green-700" style={{ fontWeight: 600 }}>2.5 kg</span> de desperdício alimentar!
              </p>
            </div>

            <button onClick={handleProceedToPayment}
              className="w-full bg-green-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-green-700 transition-colors">
              <span style={{ fontWeight: 600 }}>Escolher pagamento</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
