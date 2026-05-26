import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { subscriptions } from "../data/mockData";

export function Subscriptions() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    const plan = subscriptions.find(s => s.id === planId);
    alert(`Subscrição "${plan?.name}" ativada!\n\nTerá ${plan?.mealsPerMonth} refeições por mês com ${plan?.discount}% de desconto adicional.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 pb-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Planos de Resgate</h1>
          </div>
          <p className="text-sm text-green-100">
            Garanta refeições todos os meses e ajude a reduzir o desperdício com previsibilidade
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8">
        {/* Benefits Banner */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-green-100">
          <h3 className="font-semibold text-gray-900 mb-3">Vantagens das Subscrições:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Previsibilidade de receita para restaurantes parceiros</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Descontos progressivos e economia garantida</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Acesso prioritário às melhores ofertas</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Sem compromisso - cancele quando quiser</span>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="space-y-4 mb-6">
          {subscriptions.map((sub, index) => (
            <div
              key={sub.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all ${
                selectedPlan === sub.id ? "ring-2 ring-green-500" : ""
              } ${index === 1 ? "border-2 border-green-500" : "border border-gray-200"}`}
            >
              {index === 1 && (
                <div className="bg-green-500 text-white text-center py-1 text-sm font-semibold">
                  ⭐ Mais Popular
                </div>
              )}
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{sub.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {sub.mealsPerMonth} refeições/mês
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      €{sub.price}
                    </div>
                    <div className="text-xs text-gray-500">por mês</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    +{sub.discount}% desconto adicional
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  {sub.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(sub.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    selectedPlan === sub.id
                      ? "bg-gray-200 text-gray-700"
                      : index === 1
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-800 text-white hover:bg-gray-900"
                  }`}
                >
                  {selectedPlan === sub.id ? "✓ Plano Ativo" : "Aderir ao Plano"}
                </button>

                <p className="text-xs text-center text-gray-500 mt-2">
                  ~€{(sub.price / sub.mealsPerMonth).toFixed(2)} por refeição
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Perguntas Frequentes</h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-gray-900 mb-1">O que acontece se não usar todas as refeições?</p>
              <p className="text-gray-600">
                As refeições não utilizadas acumulam até 2 meses, dando-lhe flexibilidade.
              </p>
            </div>
            
            <div>
              <p className="font-medium text-gray-900 mb-1">Posso cancelar a qualquer momento?</p>
              <p className="text-gray-600">
                Sim! Sem compromisso. Cancele quando quiser sem taxas adicionais.
              </p>
            </div>
            
            <div>
              <p className="font-medium text-gray-900 mb-1">Como funciona a prioridade nas reservas?</p>
              <p className="text-gray-600">
                Subscritors têm acesso antecipado às ofertas antes de serem públicas.
              </p>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border border-green-200">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🌍</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Impacto Coletivo</h3>
              <p className="text-sm text-gray-700 mb-3">
                Os nossos subscritores já salvaram <span className="font-bold text-green-700">47,385 refeições</span> e 
                evitaram <span className="font-bold text-green-700">118 toneladas de CO₂</span> este ano!
              </p>
              <p className="text-xs text-gray-600">
                Juntos, estamos a criar um sistema alimentar mais sustentável.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
