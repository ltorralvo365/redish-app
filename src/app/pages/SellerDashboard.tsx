import { useState } from "react";
import { Plus, Package, Trash2, Edit2, ChevronRight, Store, Clock, Tag } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";

interface Product {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  category: string;
  pickupTime: string;
  active: boolean;
}

const CATEGORIES = ["Refeição", "Padaria", "Sobremesa", "Sopa", "Buffet", "Snacks", "Outro"];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Menu do dia",
    description: "Sopa + prato + sobremesa. Hoje: caldo verde + frango assado + mousse.",
    originalPrice: 12.5,
    discountedPrice: 4.5,
    quantity: 3,
    category: "Refeição",
    pickupTime: "13:00–15:00",
    active: true,
  },
];

type FormMode = "none" | "add" | "edit";

export function SellerDashboard() {
  const { user } = useAuth();
  const seller = user?.sellerProfile;

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [formMode, setFormMode] = useState<FormMode>("none");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [pickupTime, setPickupTime] = useState("18:00–20:00");
  const [formError, setFormError] = useState("");

  function openAdd() {
    setName(""); setDescription(""); setOriginalPrice(""); setDiscountedPrice("");
    setQuantity("1"); setCategory(CATEGORIES[0]); setPickupTime("18:00–20:00");
    setFormError(""); setEditingId(null); setFormMode("add");
  }

  function openEdit(p: Product) {
    setName(p.name); setDescription(p.description);
    setOriginalPrice(String(p.originalPrice)); setDiscountedPrice(String(p.discountedPrice));
    setQuantity(String(p.quantity)); setCategory(p.category); setPickupTime(p.pickupTime);
    setFormError(""); setEditingId(p.id); setFormMode("edit");
  }

  function handleSave() {
    if (!name || !originalPrice || !discountedPrice || !pickupTime) {
      setFormError("Preencha os campos obrigatórios.");
      return;
    }
    if (parseFloat(discountedPrice) >= parseFloat(originalPrice)) {
      setFormError("O preço com desconto tem de ser inferior ao original.");
      return;
    }
    const entry: Product = {
      id: editingId ?? String(Date.now()),
      name, description,
      originalPrice: parseFloat(originalPrice),
      discountedPrice: parseFloat(discountedPrice),
      quantity: parseInt(quantity) || 1,
      category, pickupTime, active: true,
    };
    if (formMode === "add") {
      setProducts(prev => [entry, ...prev]);
    } else {
      setProducts(prev => prev.map(p => p.id === editingId ? entry : p));
    }
    setFormMode("none");
  }

  function handleDelete(id: string) {
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  function toggleActive(id: string) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }

  const discount = (op: number, dp: number) => Math.round((1 - dp / op) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white px-4 pt-10 pb-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Store className="w-6 h-6 text-green-200" />
            <span className="text-green-100 text-sm">Dashboard do Vendedor</span>
          </div>
          <h1 className="text-xl text-white" style={{ fontWeight: 700 }}>{seller?.establishmentName ?? "O meu Estabelecimento"}</h1>
          <p className="text-green-100 text-xs mt-0.5">{seller?.location}</p>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <Stat label="Produtos" value={products.length} />
            <Stat label="Ativos" value={products.filter(p => p.active).length} />
            <Stat label="Unidades" value={products.reduce((a, p) => a + p.quantity, 0)} />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">

        {/* Add button */}
        <button
          onClick={openAdd}
          className="w-full bg-green-600 text-white rounded-xl py-3.5 flex items-center justify-center gap-2 shadow hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" /> Adicionar Produto
        </button>

        {/* Form */}
        {formMode !== "none" && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-base text-gray-900 mb-4" style={{ fontWeight: 600 }}>
              {formMode === "add" ? "Novo produto" : "Editar produto"}
            </h2>

            <InputField label="Nome do produto *" value={name} onChange={setName} placeholder="Ex: Menu do dia" />
            <InputField label="Descrição" value={description} onChange={setDescription} placeholder="O que inclui?" multiline />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <InputField label="Preço original (€) *" value={originalPrice} onChange={setOriginalPrice} placeholder="12.50" type="number" />
              <InputField label="Preço com desconto (€) *" value={discountedPrice} onChange={setDiscountedPrice} placeholder="4.50" type="number" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <InputField label="Quantidade *" value={quantity} onChange={setQuantity} placeholder="3" type="number" />
              <InputField label="Horário de levantamento *" value={pickupTime} onChange={setPickupTime} placeholder="18:00–20:00" />
            </div>

            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      category === c ? "bg-green-100 border-green-500 text-green-700" : "border-gray-200 text-gray-600 hover:border-green-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {formError && <p className="text-red-500 text-xs mb-3">{formError}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => setFormMode("none")}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 hover:bg-gray-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white rounded-xl py-2.5 hover:bg-green-700 transition-colors text-sm"
              >
                {formMode === "add" ? "Publicar" : "Guardar"}
              </button>
            </div>
          </div>
        )}

        {/* Product list */}
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Ainda sem produtos. Adiciona o primeiro!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${p.active ? "border-green-500" : "border-gray-300"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{p.name}</h3>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                        -{discount(p.originalPrice, p.discountedPrice)}%
                      </span>
                    </div>
                    {p.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{p.description}</p>}

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Tag className="w-3 h-3" /> {p.category}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" /> {p.pickupTime}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Package className="w-3 h-3" /> {p.quantity} un.
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-base text-green-600" style={{ fontWeight: 700 }}>€{p.discountedPrice.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 line-through">€{p.originalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 items-end">
                    <button
                      onClick={() => toggleActive(p.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        p.active ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}
                    >
                      {p.active ? "Ativo" : "Inativo"}
                    </button>
                    <div className="flex gap-1 mt-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-green-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/20 rounded-lg p-2.5 text-center">
      <p className="text-xl text-white" style={{ fontWeight: 700 }}>{value}</p>
      <p className="text-xs text-green-100">{label}</p>
    </div>
  );
}

function InputField({
  label, value, onChange, placeholder, type = "text", multiline = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; multiline?: boolean;
}) {
  return (
    <div className="mb-3">
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 transition-colors"
        />
      )}
    </div>
  );
}
