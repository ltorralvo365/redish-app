import { Recycle, Leaf, Zap, ArrowRight, CheckCircle, TrendingUp, Building2 } from "lucide-react";
import { compostPartners } from "../data/mockData";

export function CompostPartners() {
  const handleContact = (partnerName: string) => {
    alert(`Pedido de parceria enviado para ${partnerName}!\n\nEntraremos em contacto em breve para estabelecer a logística.`);
  };

  const getIconComponent = (type: string) => {
    switch (type) {
      case "compostagem":
        return Leaf;
      case "biomassa":
        return Zap;
      case "ração animal":
        return Building2;
      default:
        return Recycle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 to-emerald-700 text-white p-6 pb-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Recycle className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Desperdício Zero</h1>
          </div>
          <p className="text-sm text-green-100">
            Parceiros de compostagem e valorização de resíduos orgânicos
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8">
        {/* Info Banner */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-green-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Compromisso de Desperdício Zero</h3>
              <p className="text-sm text-gray-600">
                Se os produtos passarem o prazo para consumo humano, conectamos automaticamente 
                com parceiros certificados para compostagem, energia ou ração animal.
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <span className="font-semibold">100% aproveitado</span> - Nenhum alimento vai para o lixo comum!
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-5 mb-6 text-white shadow-lg">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Impacto até Agora
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl font-bold">2.4 ton</div>
              <div className="text-sm text-green-100">Compostadas</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl font-bold">1.8 ton</div>
              <div className="text-sm text-green-100">Biomassa</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl font-bold">850 kg</div>
              <div className="text-sm text-green-100">Ração Animal</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl font-bold">0%</div>
              <div className="text-sm text-green-100">Desperdício</div>
            </div>
          </div>
        </div>

        {/* Process Flow */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Como Funciona</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-600 font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900">Monitorização Automática</p>
                <p className="text-sm text-gray-600">Sistema rastreia produtos que se aproximam do fim do prazo</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-600 font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900">Prioridade aos Utilizadores</p>
                <p className="text-sm text-gray-600">Ofertas com desconto progressivo (até 80% off)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-600 font-bold text-sm">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900">Conexão Automática</p>
                <p className="text-sm text-gray-600">Se não vendido, app liga automaticamente ao parceiro apropriado</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-600 font-bold text-sm">
                4
              </div>
              <div>
                <p className="font-semibold text-gray-900">Recolha e Valorização</p>
                <p className="text-sm text-gray-600">Parceiro recolhe e transforma em recursos úteis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partners List */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Nossos Parceiros Certificados</h2>
        
        <div className="space-y-4 mb-6">
          {compostPartners.map((partner) => {
            const IconComponent = getIconComponent(partner.type);
            
            return (
              <div
                key={partner.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
                      {partner.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{partner.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium capitalize">
                          {partner.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{partner.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-600 mb-1">Capacidade</p>
                      <p className="font-semibold text-gray-900">{partner.processingCapacity}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-600 mb-1">Localização</p>
                      <p className="font-semibold text-gray-900">{partner.location}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Aceita:</p>
                    <div className="flex flex-wrap gap-2">
                      {partner.acceptedWaste.map((waste, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs"
                        >
                          {waste}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleContact(partner.name)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                  >
                    <span>Estabelecer Parceria</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* B2B CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">É um Estabelecimento?</h3>
              <p className="text-sm text-gray-700 mb-3">
                Junte-se à nossa rede de parceiros e garanta que 100% dos seus excedentes 
                são aproveitados de forma sustentável.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                Tornar-se Parceiro B2B
              </button>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">Certificações & Garantias</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Todos os parceiros são certificados pelas autoridades ambientais</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Rastreabilidade completa do destino dos resíduos</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Relatórios mensais de impacto ambiental</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Conformidade com normas EU de economia circular</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
