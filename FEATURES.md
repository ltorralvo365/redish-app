# ReDish - Funcionalidades Implementadas

## 📱 Visão Geral
Aplicação móvel para venda de comida excedente de restaurantes, focada em sustentabilidade e redução do desperdício alimentar.

---

## ✨ Funcionalidades Principais

### 1. 📍 Smart Alerts (Geofencing)
**Localização:** `/src/app/components/SmartAlerts.tsx`

- **Notificações push automáticas** quando o utilizador passa perto de estabelecimentos com excedentes prestes a expirar
- Sistema de geofencing simulado (raio de 500m)
- Alertas personalizados com informações da oferta:
  - Distância ao restaurante
  - Tempo até expirar
  - Preço dinâmico atual
  - Desconto aplicado
- Possibilidade de ativar/desativar alertas
- Alertas podem ser descartados individualmente

**Como funciona:**
- O sistema verifica continuamente a localização do utilizador
- Quando uma oferta está a menos de 500m E tem menos de 3h até expirar
- Um alerta visual aparece no topo da tela
- Click no alerta leva diretamente à página de detalhes da oferta

---

### 2. 💰 Dynamic Pricing (Leilão Inverso)
**Localização:** `/src/app/data/mockData.ts` - função `calculateDynamicPrice()`

Sistema de precificação dinâmica que **reduz o preço automaticamente** conforme o horário de fecho se aproxima:

| Tempo Restante | Desconto | Preço |
|----------------|----------|-------|
| > 2 horas | 63-64% | Preço base |
| 1-2 horas | 60% | 40% do original |
| 30min-1h | 70% | 30% do original |
| < 30min | 80% | 20% do original |

**Benefícios:**
- **Para restaurantes:** Maximiza a venda de excedentes que de outra forma seriam desperdiçados
- **Para utilizadores:** Descontos progressivos incentivam compras de última hora
- **Para o ambiente:** Reduz drasticamente o desperdício alimentar

**Indicadores visuais:**
- Badge "🔥 Preço dinâmico" nos cards de ofertas
- Animação pulsante em ofertas urgentes
- Contagem regressiva de tempo restante
- Cores laranja/vermelho para ofertas urgentes

---

### 3. ⭐ Subscrição de "Resgate"
**Localização:** `/src/app/pages/Subscriptions.tsx`

Sistema de **planos mensais** que garante X refeições por mês, criando previsibilidade de receita para os parceiros.

#### Planos Disponíveis:

**🌿 Resgate Básico - €29.99/mês**
- 8 refeições por mês (~€3.75/refeição)
- 5% desconto adicional
- Prioridade nas reservas
- Acesso a ofertas exclusivas

**⭐ Resgate Premium - €49.99/mês** (Mais Popular)
- 15 refeições por mês (~€3.33/refeição)
- 10% desconto adicional
- Máxima prioridade nas reservas
- Acesso antecipado a novas ofertas
- Notificações personalizadas
- Pontos eco em dobro

**🏆 Herói Eco - €79.99/mês**
- 25 refeições por mês (~€3.20/refeição)
- 15% desconto adicional
- Prioridade máxima + reserva garantida
- Acesso VIP a eventos parceiros
- Consultor de sustentabilidade
- Pontos eco em triplo
- Certificado mensal de impacto

**Vantagens do Sistema:**
- Refeições não utilizadas acumulam até 2 meses
- Sem compromisso - cancelamento a qualquer momento
- Previsibilidade para restaurantes parceiros
- Economia garantida para utilizadores
- Impacto coletivo visível (47,385 refeições salvas)

---

### 4. 🏆 Gamificação (Eco-Ranking)
**Localização:** `/src/app/pages/EcoRanking.tsx`

Sistema completo de **pontos, conquistas e ranking** para motivar utilizadores a salvar mais comida.

#### Sistema de Pontos:
- Ganhe pontos eco por cada refeição salva
- Pontos multiplicados para subscritores (2x ou 3x)
- Troque pontos por descontos:
  - 500 pts = €5 desconto
  - 1000 pts = €12 desconto
  - 2000 pts = €25 desconto + camisola eco

#### Conquistas:
- **🌱 Primeira Refeição Salva** (10 pts) - Completar primeira reserva
- **🏆 Guerreiro Semanal** (50 pts) - Salvar 5 refeições numa semana
- **🌟 Campeão Eco** (100 pts) - Salvar 25 refeições no total
- **🌙 Herói da Noite** (75 pts) - Resgatar 10 ofertas após as 21h
- **🍽️ Explorador Gastronómico** (60 pts) - Experimentar 5 categorias diferentes
- **🌍 Protetor do Clima** (150 pts) - Evitar 100kg de CO₂

Cada conquista mostra progresso visual com barra de percentagem.

#### Leaderboard:
- Top 10 utilizadores da semana
- Badges especiais para top 3 (🥇🥈🥉)
- "Herói da Semana" destacado
- Posição do utilizador atual sempre visível

---

### 5. ♻️ Parceria B2B (Compostagem Integrada)
**Localização:** `/src/app/pages/CompostPartners.tsx`

Sistema de **desperdício zero absoluto** - Se o produto passar o prazo de consumo humano, a app liga automaticamente o estabelecimento a empresas certificadas.

#### Parceiros Disponíveis:

**🌱 EcoCompost Lisboa** (Compostagem)
- Capacidade: 500 kg/dia
- Localização: Lisboa
- Aceita: vegetais, frutas, pão, restos cozinhados
- Transforma em adubo premium

**⚡ BioEnergia Verde** (Biomassa)
- Capacidade: 1000 kg/dia
- Localização: Amadora
- Aceita: todos orgânicos + óleos alimentares
- Produção de energia limpa

**🐄 NutriAnimal Farms** (Ração Animal)
- Capacidade: 800 kg/dia
- Localização: Sintra
- Aceita: vegetais, frutas, pão, grãos
- Nutrição animal certificada

#### Como Funciona:
1. **Monitorização Automática** - Sistema rastreia produtos próximos do fim
2. **Prioridade aos Utilizadores** - Ofertas com desconto progressivo (até 80%)
3. **Conexão Automática** - Se não vendido, app conecta ao parceiro apropriado
4. **Recolha e Valorização** - Parceiro recolhe e transforma em recursos

**Garantias:**
- ✓ Todos os parceiros certificados pelas autoridades ambientais
- ✓ Rastreabilidade completa do destino dos resíduos
- ✓ Relatórios mensais de impacto ambiental
- ✓ Conformidade com normas EU de economia circular

**Impacto Real:**
- 2.4 toneladas compostadas
- 1.8 toneladas convertidas em biomassa
- 850 kg usados como ração animal
- **0% de desperdício para aterros**

---

## 🎨 Interface e UX

### Navegação
- Bottom navigation bar fixo com 4 seções principais
- Quick access cards no home para funcionalidades premium
- Links contextuais distribuídos pelo perfil

### Feedback Visual
- Cores verde/laranja para estados normais/urgentes
- Animações pulse em itens críticos
- Badges informativos em tempo real
- Progress bars para conquistas e objetivos

### Mobile-First
- Design otimizado para smartphones
- Gestos intuitivos
- Performance otimizada
- Sem scrollbars visíveis (UX clean)

---

## 📊 Dados e Estatísticas

### Métricas do Utilizador:
- Refeições salvas
- CO₂ evitado (kg)
- Dinheiro poupado (€)
- Pontos eco acumulados
- Posição no ranking

### Métricas Globais:
- Refeições salvas hoje (comunidade)
- Impacto ambiental coletivo
- Estatísticas de parceiros B2B

---

## 🚀 Tecnologias Utilizadas

- **React** - Framework principal
- **React Router** - Navegação entre páginas
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Estilização
- **Lucide React** - Ícones
- **Geolocation API** (simulada) - Smart alerts

---

## 📱 Páginas Implementadas

1. `/` - Home (com smart alerts e quick access)
2. `/offer/:id` - Detalhes da oferta
3. `/cart` - Carrinho de compras
4. `/favorites` - Ofertas favoritas
5. `/profile` - Perfil do utilizador
6. `/subscriptions` - Planos de subscrição
7. `/eco-ranking` - Gamificação e ranking
8. `/compost-partners` - Parceiros de desperdício zero

---

## 🌍 Impacto Ambiental

A aplicação contribui ativamente para:
- ♻️ Redução do desperdício alimentar
- 🌱 Diminuição de emissões de CO₂
- 💚 Economia circular
- 🤝 Consciencialização comunitária
- 📊 Transparência de impacto

---

## 🎯 Próximos Passos (Sugestões)

1. Integração real de geolocalização (GPS)
2. Notificações push reais (PWA ou app nativa)
3. Sistema de pagamento integrado
4. Backend com Supabase para persistência
5. Analytics e relatórios detalhados
6. Sistema de reviews e avaliações
7. Parcerias com mais restaurantes
8. Expansão para outras cidades
