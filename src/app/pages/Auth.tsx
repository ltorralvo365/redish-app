import { useState } from "react";
import { Navigate } from "react-router";
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react";
import {
  useAuth,
  AccountType,
  PartnershipType,
  CommercialOrgType,
  EstablishmentType,
  AuthUser,
} from "../context/AuthContext";

type Step =
  | "landing"
  | "login"
  | "register-email"
  | "register-account-type"
  | "register-consumer-partnership"
  | "register-consumer-personal"
  | "register-consumer-commercial"
  | "register-consumer-city"
  | "register-seller";

const ORG_TYPE_LABELS: Record<CommercialOrgType, string> = {
  ong: "ONG / Associação",
  biomassa: "Empresa de Biomassa",
  supermercado: "Supermercado / Retalho",
  escola: "Escola / Universidade",
  hospital: "Hospital / Clínica",
  outro: "Outro",
};

const ESTABLISHMENT_TYPE_LABELS: Record<EstablishmentType, string> = {
  restaurante: "Restaurante",
  padaria: "Padaria / Pastelaria",
  cafe: "Café / Snack-Bar",
  supermercado: "Supermercado",
  hotel: "Hotel / Alojamento",
  catering: "Catering / Eventos",
  outro: "Outro",
};

const CITIES = [
  "Lisboa", "Porto", "Braga", "Coimbra", "Aveiro", "Faro",
  "Setúbal", "Évora", "Viseu", "Leiria", "Viana do Castelo", "Outra",
];

export function Auth() {
  const { login, register, user } = useAuth();

  if (user) {
    return <Navigate to={user.accountType === "seller" ? "/seller" : "/"} replace />;
  }

  const [step, setStep] = useState<Step>("landing");
  const [showPassword, setShowPassword] = useState(false);

  // login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // register
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("consumer");
  const [partnershipType, setPartnershipType] = useState<PartnershipType>("personal");
  const [personalName, setPersonalName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState<CommercialOrgType>("ong");
  const [city, setCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [estType, setEstType] = useState<EstablishmentType>("restaurante");
  const [estName, setEstName] = useState("");
  const [estCity, setEstCity] = useState("");
  const [customEstCity, setCustomEstCity] = useState("");

  const [error, setError] = useState("");
  const clearError = () => setError("");

  const resolvedCity = city === "Outra" ? customCity : city;
  const resolvedEstCity = estCity === "Outra" ? customEstCity : estCity;

  function handleLogin() {
    if (!loginEmail || !loginPassword) { setError("Preencha todos os campos."); return; }
    login(loginEmail, loginPassword);
  }

  function handleRegisterEmail() {
    if (!regEmail || !regPassword) { setError("Preencha todos os campos."); return; }
    clearError();
    setStep("register-account-type");
  }

  function handleAccountType() {
    if (accountType === "consumer") setStep("register-consumer-partnership");
    else setStep("register-seller");
  }

  function handleConsumerPartnership() {
    if (partnershipType === "personal") setStep("register-consumer-personal");
    else setStep("register-consumer-commercial");
  }

  function goToCity(fromPersonal: boolean) {
    if (fromPersonal && !personalName) { setError("Introduz o teu nome."); return; }
    if (!fromPersonal && !orgName) { setError("Introduz o nome da organização."); return; }
    clearError();
    setStep("register-consumer-city");
  }

  function handleFinalizeConsumer() {
    const c = resolvedCity;
    if (!c) { setError("Seleciona a tua cidade."); return; }
    const u: AuthUser = {
      email: regEmail,
      accountType: "consumer",
      consumerProfile: {
        partnershipType,
        city: c,
        name: partnershipType === "personal" ? personalName : undefined,
        orgName: partnershipType === "commercial" ? orgName : undefined,
        orgType: partnershipType === "commercial" ? orgType : undefined,
      },
    };
    register(u);
  }

  function handleFinalizeSeller() {
    const c = resolvedEstCity;
    if (!estName) { setError("Introduz o nome do estabelecimento."); return; }
    if (!c) { setError("Seleciona a cidade do estabelecimento."); return; }
    const u: AuthUser = {
      email: regEmail,
      accountType: "seller",
      sellerProfile: { establishmentType: estType, establishmentName: estName, location: c },
    };
    register(u);
  }

  const back = (to: Step) => { clearError(); setStep(to); };

  const prevConsumerCity = partnershipType === "personal"
    ? "register-consumer-personal"
    : "register-consumer-commercial";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">

        {/* Landing */}
        {step === "landing" && (
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="w-9 h-9 text-white" />
              </div>
            </div>
            <h1 className="text-3xl text-green-700 mb-1" style={{ fontWeight: 700 }}>ReDish</h1>
            <p className="text-gray-500 mb-10 text-sm">Salva comida. Poupa dinheiro. Cuida do planeta.</p>
            <button onClick={() => setStep("login")} className="w-full bg-green-600 text-white rounded-xl py-3.5 mb-3 shadow hover:bg-green-700 transition-colors">
              Iniciar Sessão
            </button>
            <button onClick={() => setStep("register-email")} className="w-full bg-white text-green-700 border border-green-200 rounded-xl py-3.5 hover:bg-green-50 transition-colors">
              Criar Conta
            </button>
            <p className="text-xs text-gray-400 mt-8">
              Ao continuar, aceita os <span className="text-green-600">Termos de Serviço</span> e a{" "}
              <span className="text-green-600">Política de Privacidade</span>.
            </p>
          </div>
        )}

        {/* Login */}
        {step === "login" && (
          <div>
            <BackBtn onClick={() => back("landing")} />
            <h2 className="text-2xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>Bem-vindo de volta</h2>
            <p className="text-gray-500 text-sm mb-6">Inicia sessão na tua conta ReDish.</p>
            <Field label="Email" icon={<Mail className="w-4 h-4 text-gray-400" />}>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                placeholder="email@exemplo.com" className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
            </Field>
            <Field label="Password" icon={<Lock className="w-4 h-4 text-gray-400" />} action={
              <button type="button" onClick={() => setShowPassword(p => !p)} className="text-gray-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }>
              <input type={showPassword ? "text" : "password"} value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••" className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
            </Field>
            {error && <ErrorMsg msg={error} />}
            <button onClick={handleLogin} className="w-full bg-green-600 text-white rounded-xl py-3.5 mt-2 shadow hover:bg-green-700 transition-colors">Entrar</button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Não tens conta?{" "}
              <button onClick={() => back("register-email")} className="text-green-600 underline">Criar conta</button>
            </p>
          </div>
        )}

        {/* Step 1 — email & password */}
        {step === "register-email" && (
          <div>
            <BackBtn onClick={() => back("landing")} />
            <StepIndicator current={1} total={4} />
            <h2 className="text-2xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>Criar conta</h2>
            <p className="text-gray-500 text-sm mb-6">Introduz as tuas credenciais.</p>
            <Field label="Email" icon={<Mail className="w-4 h-4 text-gray-400" />}>
              <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                placeholder="email@exemplo.com" className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
            </Field>
            <Field label="Password" icon={<Lock className="w-4 h-4 text-gray-400" />} action={
              <button type="button" onClick={() => setShowPassword(p => !p)} className="text-gray-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }>
              <input type={showPassword ? "text" : "password"} value={regPassword} onChange={e => setRegPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres" className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
            </Field>
            {error && <ErrorMsg msg={error} />}
            <NextButton onClick={handleRegisterEmail} />
          </div>
        )}

        {/* Step 2 — account type */}
        {step === "register-account-type" && (
          <div>
            <BackBtn onClick={() => back("register-email")} />
            <StepIndicator current={2} total={4} />
            <h2 className="text-2xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>Tipo de conta</h2>
            <p className="text-gray-500 text-sm mb-6">Como vais usar o ReDish?</p>
            <div className="space-y-3 mb-6">
              <SelectCard selected={accountType === "consumer"} onClick={() => setAccountType("consumer")}
                emoji="🛒" title="Consumidor" desc="Quero comprar comida excedente a preços reduzidos." />
              <SelectCard selected={accountType === "seller"} onClick={() => setAccountType("seller")}
                emoji="🍽️" title="Vendedor" desc="Tenho um estabelecimento e quero vender excedentes." />
            </div>
            <NextButton onClick={handleAccountType} />
          </div>
        )}

        {/* Step 3 — consumer: partnership type */}
        {step === "register-consumer-partnership" && (
          <div>
            <BackBtn onClick={() => back("register-account-type")} />
            <StepIndicator current={3} total={4} />
            <h2 className="text-2xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>Tipo de conta</h2>
            <p className="text-gray-500 text-sm mb-6">Esta conta é para uso pessoal ou organizacional?</p>
            <div className="space-y-3 mb-6">
              <SelectCard selected={partnershipType === "personal"} onClick={() => setPartnershipType("personal")}
                emoji="👤" title="Pessoal" desc="Uso individual para poupar dinheiro e reduzir desperdício." />
              <SelectCard selected={partnershipType === "commercial"} onClick={() => setPartnershipType("commercial")}
                emoji="🏢" title="Comercial / Organizacional" desc="Uma organização que reaproveita ou redistribui excedentes." />
            </div>
            <NextButton onClick={handleConsumerPartnership} />
          </div>
        )}

        {/* Step 3b — personal name */}
        {step === "register-consumer-personal" && (
          <div>
            <BackBtn onClick={() => back("register-consumer-partnership")} />
            <StepIndicator current={3} total={4} />
            <h2 className="text-2xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>O teu nome</h2>
            <p className="text-gray-500 text-sm mb-6">Como te devemos chamar?</p>
            <Field label="Nome completo">
              <input type="text" value={personalName} onChange={e => setPersonalName(e.target.value)}
                placeholder="Ex: Maria Silva" className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
            </Field>
            {error && <ErrorMsg msg={error} />}
            <NextButton onClick={() => goToCity(true)} />
          </div>
        )}

        {/* Step 3b — commercial org */}
        {step === "register-consumer-commercial" && (
          <div>
            <BackBtn onClick={() => back("register-consumer-partnership")} />
            <StepIndicator current={3} total={4} />
            <h2 className="text-2xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>Dados da organização</h2>
            <p className="text-gray-500 text-sm mb-6">Conta-nos sobre a tua organização.</p>
            <Field label="Nome da organização">
              <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)}
                placeholder="Ex: Banco Alimentar Lisboa" className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
            </Field>
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Tipo de organização</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(ORG_TYPE_LABELS) as CommercialOrgType[]).map(key => (
                  <button key={key} onClick={() => setOrgType(key)}
                    className={`text-left text-xs px-3 py-2.5 rounded-lg border transition-colors ${orgType === key ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-gray-200 text-gray-700 hover:border-green-300"}`}>
                    {ORG_TYPE_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>
            {error && <ErrorMsg msg={error} />}
            <NextButton onClick={() => goToCity(false)} />
          </div>
        )}

        {/* Step 4 — consumer city */}
        {step === "register-consumer-city" && (
          <div>
            <BackBtn onClick={() => back(prevConsumerCity)} />
            <StepIndicator current={4} total={4} />
            <h2 className="text-2xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>A tua cidade</h2>
            <p className="text-gray-500 text-sm mb-6">Em que cidade te encontras?</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {CITIES.map(c => (
                <button key={c} onClick={() => setCity(c)}
                  className={`text-xs px-2 py-2.5 rounded-lg border text-center transition-colors ${city === c ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-gray-200 text-gray-700 hover:border-green-300"}`}>
                  <MapPin className="w-3 h-3 mx-auto mb-0.5" />{c}
                </button>
              ))}
            </div>
            {city === "Outra" && (
              <Field label="Qual cidade?">
                <input type="text" value={customCity} onChange={e => setCustomCity(e.target.value)}
                  placeholder="Ex: Santarém" className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
              </Field>
            )}
            {error && <ErrorMsg msg={error} />}
            <button onClick={handleFinalizeConsumer}
              className="w-full bg-green-600 text-white rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 shadow hover:bg-green-700 transition-colors">
              <Check className="w-4 h-4" /> Criar Conta
            </button>
          </div>
        )}

        {/* Step 3 — seller */}
        {step === "register-seller" && (
          <div>
            <BackBtn onClick={() => back("register-account-type")} />
            <StepIndicator current={3} total={4} />
            <h2 className="text-2xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>O teu estabelecimento</h2>
            <p className="text-gray-500 text-sm mb-6">Diz-nos mais sobre o teu negócio.</p>
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Tipo de estabelecimento</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(ESTABLISHMENT_TYPE_LABELS) as EstablishmentType[]).map(key => (
                  <button key={key} onClick={() => setEstType(key)}
                    className={`text-left text-xs px-3 py-2.5 rounded-lg border transition-colors ${estType === key ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-gray-200 text-gray-700 hover:border-green-300"}`}>
                    {ESTABLISHMENT_TYPE_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Nome do estabelecimento">
              <input type="text" value={estName} onChange={e => setEstName(e.target.value)}
                placeholder="Ex: Tasca do Zé" className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
            </Field>
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Cidade do estabelecimento</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {CITIES.map(c => (
                  <button key={c} onClick={() => setEstCity(c)}
                    className={`text-xs px-2 py-2 rounded-lg border text-center transition-colors ${estCity === c ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-gray-200 text-gray-700 hover:border-green-300"}`}>
                    <MapPin className="w-3 h-3 mx-auto mb-0.5" />{c}
                  </button>
                ))}
              </div>
              {estCity === "Outra" && (
                <Field label="Qual cidade?">
                  <input type="text" value={customEstCity} onChange={e => setCustomEstCity(e.target.value)}
                    placeholder="Ex: Santarém" className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
                </Field>
              )}
            </div>
            {error && <ErrorMsg msg={error} />}
            <button onClick={handleFinalizeSeller}
              className="w-full bg-green-600 text-white rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 shadow hover:bg-green-700 transition-colors">
              <Check className="w-4 h-4" /> Criar Conta
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ── helpers ───────────────────────────────────────────────────────────────────

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 text-gray-500 mb-6 hover:text-gray-700">
      <ArrowLeft className="w-4 h-4" /> Voltar
    </button>
  );
}

function Field({ label, icon, action, children }: {
  label: string; icon?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-3 focus-within:border-green-500 transition-colors">
        {icon}{children}{action}
      </div>
    </div>
  );
}

function SelectCard({ selected, onClick, emoji, title, desc }: {
  selected: boolean; onClick: () => void; emoji: string; title: string; desc: string;
}) {
  return (
    <button onClick={onClick}
      className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-colors ${selected ? "border-green-500 bg-green-50" : "border-gray-200 bg-white hover:border-green-300"}`}>
      <span className="text-2xl mt-0.5">{emoji}</span>
      <div>
        <p className={`text-sm ${selected ? "text-green-700" : "text-gray-800"}`} style={{ fontWeight: 600 }}>{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      {selected && (
        <div className="ml-auto mt-0.5 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </button>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all flex-1 ${i + 1 <= current ? "bg-green-500" : "bg-gray-200"}`} />
      ))}
    </div>
  );
}

function NextButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full bg-green-600 text-white rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 shadow hover:bg-green-700 transition-colors">
      Continuar <ArrowRight className="w-4 h-4" />
    </button>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return <p className="text-red-500 text-xs mb-2">{msg}</p>;
}
