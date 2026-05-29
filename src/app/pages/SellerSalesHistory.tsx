import { QrCode, CheckCircle, Clock, ChevronLeft, Package } from "lucide-react";
import { Link } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";

interface SaleOrder {
  id: string;
  productName: string;
  category: string;
  originalPrice: number;
  soldPrice: number;
  quantity: number;
  date: string;
  pickupTime: string;
  collected: boolean;
  buyerName: string;
}

const MOCK_ORDERS: SaleOrder[] = [
  { id: "o1", productName: "Menu do dia", category: "Refeição", originalPrice: 12.5, soldPrice: 4.5, quantity: 2, date: "2026-05-28", pickupTime: "13:00–15:00", collected: true, buyerName: "Ana M." },
  { id: "o2", productName: "Sopa de legumes", category: "Sopa", originalPrice: 4.0, soldPrice: 1.5, quantity: 1, date: "2026-05-28", pickupTime: "12:30–14:00", collected: true, buyerName: "João P." },
  { id: "o3", productName: "Menu do dia", category: "Refeição", originalPrice: 12.5, soldPrice: 4.5, quantity: 1, date: "2026-05-27", pickupTime: "13:00–15:00", collected: true, buyerName: "Carla S." },
  { id: "o4", productName: "Buffet de sobremesas", category: "Sobremesa", originalPrice: 8.0, soldPrice: 3.0, quantity: 3, date: "2026-05-27", pickupTime: "15:00–17:00", collected: false, buyerName: "Miguel A." },
  { id: "o5", productName: "Pão e Broa", category: "Padaria", originalPrice: 5.0, soldPrice: 1.8, quantity: 2, date: "2026-05-26", pickupTime: "18:30–20:00", collected: true, buyerName: "Rita F." },
  { id: "o6", productName: "Menu do dia", category: "Refeição", originalPrice: 12.5, soldPrice: 4.5, quantity: 1, date: "2026-05-25", pickupTime: "13:00–15:00", collected: true, buyerName: "Pedro N." },
  { id: "o7", productName: "Snacks variados", category: "Snacks", originalPrice: 6.0, soldPrice: 2.2, quantity: 2, date: "2026-05-24", pickupTime: "17:00–19:00", collected: false, buyerName: "Beatriz L." },
];

function groupByDate(orders: SaleOrder[]) {
  const map = new Map<string, SaleOrder[]>();
  for (const o of orders) {
    if (!map.has(o.date)) map.set(o.date, []);
    map.get(o.date)!.push(o);
  }
  return map;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Hoje";
  if (d.toDateString() === yesterday.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" });
}

export function SellerSalesHistory() {
  const { user } = useAuth();
  const seller = user?.sellerProfile;
  const grouped = groupByDate(MOCK_ORDERS);

  const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.soldPrice * o.quantity, 0);
  const totalCollected = MOCK_ORDERS.filter(o => o.collected).length;
  const totalPending = MOCK_ORDERS.filter(o => !o.collected).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white px-4 pt-10 pb-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Link to="/seller" className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl" style={{ fontWeight: 700 }}>Histórico de Vendas</h1>
          </div>
          <p className="text-green-100 text-sm mb-4">{seller?.establishmentName}</p>
          <div className="grid grid-cols-3 gap-2">
            <StatBox label="Receita total" value={`€${totalRevenue.toFixed(2)}`} />
            <StatBox label="Recolhidos" value={String(totalCollected)} />
            <StatBox label="Pendentes" value={String(totalPending)} />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-6">
        {Array.from(grouped.entries()).map(([date, orders]) => (
          <div key={date}>
            <p className="text-xs text-gray-500 mb-2 capitalize" style={{ fontWeight: 600 }}>{formatDate(date)}</p>
            <div className="space-y-3">
              {orders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        ))}

        {MOCK_ORDERS.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Ainda sem vendas registadas.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function OrderCard({ order }: { order: SaleOrder }) {
  const discount = Math.round((1 - order.soldPrice / order.originalPrice) * 100);
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${order.collected ? "border-green-500" : "border-amber-400"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{order.productName}</h3>
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">-{discount}%</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{order.category}</span>
          </div>
          <p className="text-xs text-gray-500 mb-1">Comprador: {order.buyerName} · {order.quantity} un.</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{order.pickupTime}</div>
            <span className="text-green-600" style={{ fontWeight: 600 }}>€{(order.soldPrice * order.quantity).toFixed(2)}</span>
            <span className="text-gray-400 line-through text-xs">€{(order.originalPrice * order.quantity).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {order.collected ? (
            <div className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" />
              Recolhido
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              Pendente
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <QrCode className="w-3.5 h-3.5" />
            {order.id.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/20 rounded-lg p-2.5 text-center">
      <p className="text-lg text-white" style={{ fontWeight: 700 }}>{value}</p>
      <p className="text-xs text-green-100">{label}</p>
    </div>
  );
}
