export interface FoodItem {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  quantity: number;
  available: number;
}

export interface Offer {
  id: string;
  restaurantName: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  image: string;
  pickupTime: string;
  distance: number;
  rating: number;
  category: string;
  quantity: number;
  items: FoodItem[];
  minItems: number;
  maxItems: number;
  closingTime: string; // Nova propriedade para dynamic pricing
  lat: number; // Para geofencing
  lng: number; // Para geofencing
  expiryHours: number; // Horas até expirar
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  mealsPerMonth: number;
  discount: number;
  benefits: string[];
  color: string;
}

export interface EcoAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface CompostPartner {
  id: string;
  name: string;
  type: "compostagem" | "biomassa" | "ração animal";
  description: string;
  processingCapacity: string;
  location: string;
  acceptedWaste: string[];
  icon: string;
}

export const subscriptions: Subscription[] = [
  {
    id: "basic",
    name: "Resgate Básico",
    price: 29.99,
    mealsPerMonth: 8,
    discount: 5,
    benefits: [
      "8 refeições por mês",
      "5% desconto adicional",
      "Prioridade nas reservas",
      "Acesso a ofertas exclusivas"
    ],
    color: "#6a8e7f"
  },
  {
    id: "premium",
    name: "Resgate Premium",
    price: 49.99,
    mealsPerMonth: 15,
    discount: 10,
    benefits: [
      "15 refeições por mês",
      "10% desconto adicional",
      "Máxima prioridade nas reservas",
      "Acesso antecipado a novas ofertas",
      "Notificações personalizadas",
      "Pontos eco em dobro"
    ],
    color: "#4a6751"
  },
  {
    id: "hero",
    name: "Herói Eco",
    price: 79.99,
    mealsPerMonth: 25,
    discount: 15,
    benefits: [
      "25 refeições por mês",
      "15% desconto adicional",
      "Prioridade máxima + reserva garantida",
      "Acesso VIP a eventos parceiros",
      "Consultor de sustentabilidade",
      "Pontos eco em triplo",
      "Certificado mensal de impacto"
    ],
    color: "#c17a55"
  }
];

export const achievements: EcoAchievement[] = [
  {
    id: "first-rescue",
    title: "Primeira Refeição Salva",
    description: "Completou a sua primeira reserva",
    icon: "🌱",
    points: 10,
    unlocked: true
  },
  {
    id: "week-warrior",
    title: "Guerreiro Semanal",
    description: "Salvou 5 refeições numa semana",
    icon: "🏆",
    points: 50,
    unlocked: true
  },
  {
    id: "eco-champion",
    title: "Campeão Eco",
    description: "Salvou 25 refeições no total",
    icon: "🌟",
    points: 100,
    unlocked: false,
    progress: 12,
    maxProgress: 25
  },
  {
    id: "night-hero",
    title: "Herói da Noite",
    description: "Resgatou 10 ofertas após as 21h",
    icon: "🌙",
    points: 75,
    unlocked: false,
    progress: 4,
    maxProgress: 10
  },
  {
    id: "variety-lover",
    title: "Explorador Gastronómico",
    description: "Experimentou 5 categorias diferentes",
    icon: "🍽️",
    points: 60,
    unlocked: true
  },
  {
    id: "carbon-saver",
    title: "Protetor do Clima",
    description: "Evitou 100kg de CO₂",
    icon: "🌍",
    points: 150,
    unlocked: false,
    progress: 30,
    maxProgress: 100
  }
];

export const compostPartners: CompostPartner[] = [
  {
    id: "cp1",
    name: "EcoCompost Lisboa",
    type: "compostagem",
    description: "Transformamos resíduos orgânicos em adubo de qualidade premium",
    processingCapacity: "500 kg/dia",
    location: "Lisboa",
    acceptedWaste: ["vegetais", "frutas", "pão", "restos de comida cozinhada"],
    icon: "🌱"
  },
  {
    id: "cp2",
    name: "BioEnergia Verde",
    type: "biomassa",
    description: "Produção de energia limpa a partir de biomassa orgânica",
    processingCapacity: "1000 kg/dia",
    location: "Amadora",
    acceptedWaste: ["todos os orgânicos", "óleos alimentares"],
    icon: "⚡"
  },
  {
    id: "cp3",
    name: "NutriAnimal Farms",
    type: "ração animal",
    description: "Aproveitamento de excedentes para nutrição animal certificada",
    processingCapacity: "800 kg/dia",
    location: "Sintra",
    acceptedWaste: ["vegetais", "frutas", "pão", "grãos"],
    icon: "🐄"
  }
];

// Calculate dynamic pricing based on time until closing
export function calculateDynamicPrice(offer: Offer, currentTime: Date = new Date()): { price: number; discount: number } {
  const [closingHour, closingMinute] = offer.closingTime.split(':').map(Number);
  const closingDate = new Date(currentTime);
  closingDate.setHours(closingHour, closingMinute, 0, 0);
  
  const hoursUntilClosing = (closingDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
  
  // Dynamic pricing tiers
  if (hoursUntilClosing <= 0.5) { // 30 min ou menos
    return { price: offer.originalPrice * 0.20, discount: 80 };
  } else if (hoursUntilClosing <= 1) { // 1 hora
    return { price: offer.originalPrice * 0.30, discount: 70 };
  } else if (hoursUntilClosing <= 2) { // 2 horas
    return { price: offer.originalPrice * 0.40, discount: 60 };
  } else {
    return { price: offer.discountedPrice, discount: offer.discount };
  }
}

// Simulate geofencing check
export function isNearOffer(offer: Offer, userLat: number = 38.7223, userLng: number = -9.1393): boolean {
  // Simple distance calculation (Haversine would be more accurate)
  const latDiff = Math.abs(offer.lat - userLat);
  const lngDiff = Math.abs(offer.lng - userLng);
  const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // rough km conversion
  
  return distance <= 0.5; // Within 500m
}

export const offers: Offer[] = [
  {
    id: "1",
    restaurantName: "La Bella Italia",
    title: "Cesta de Massas e Antipasti",
    description: "Seleção variada de massas frescas, antipasti e pão italiano",
    originalPrice: 35.00,
    discountedPrice: 12.99,
    discount: 63,
    image: "https://images.unsplash.com/photo-1662197480393-2a82030b7b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGFzdGElMjByZXN0YXVyYW50fGVufDF8fHx8MTc3MzA2NTk1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    pickupTime: "20:00 - 21:00",
    distance: 0.8,
    rating: 4.8,
    category: "Italiana",
    quantity: 3,
    minItems: 3,
    maxItems: 6,
    closingTime: "21:00",
    lat: 38.7223,
    lng: -9.1393,
    expiryHours: 3,
    items: [
      { id: "1-1", name: "Lasagna Bolonhesa", description: "Porção individual", originalPrice: 12.00, quantity: 1, available: 5 },
      { id: "1-2", name: "Risotto de Cogumelos", description: "300g", originalPrice: 10.00, quantity: 1, available: 4 },
      { id: "1-3", name: "Bruschetta (4 unidades)", description: "Com tomate e manjericão", originalPrice: 6.00, quantity: 1, available: 8 },
      { id: "1-4", name: "Pão Focaccia", description: "200g", originalPrice: 4.00, quantity: 1, available: 6 },
      { id: "1-5", name: "Tiramisu", description: "Sobremesa individual", originalPrice: 5.00, quantity: 1, available: 4 },
      { id: "1-6", name: "Panna Cotta", description: "Sobremesa individual", originalPrice: 4.50, quantity: 1, available: 3 }
    ]
  },
  {
    id: "2",
    restaurantName: "Sushi Master",
    title: "Caixa Surpresa de Sushi",
    description: "Mix de sushi, sashimi e rolls frescos do dia",
    originalPrice: 45.00,
    discountedPrice: 15.99,
    discount: 64,
    image: "https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGphcGFuZXNlJTIwZm9vZHxlbnwxfHx8fDE3NzMwOTk0Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    pickupTime: "19:30 - 20:30",
    distance: 1.2,
    rating: 4.9,
    category: "Japonesa",
    quantity: 2,
    minItems: 4,
    maxItems: 8,
    closingTime: "20:30",
    lat: 38.7250,
    lng: -9.1500,
    expiryHours: 2,
    items: [
      { id: "2-1", name: "Nigiri de Salmão (4 peças)", description: "Salmão fresco", originalPrice: 10.00, quantity: 1, available: 3 },
      { id: "2-2", name: "California Roll (8 peças)", description: "Com abacate e surimi", originalPrice: 9.00, quantity: 1, available: 4 },
      { id: "2-3", name: "Sashimi Misto (6 peças)", description: "Salmão, atum e peixe branco", originalPrice: 14.00, quantity: 1, available: 2 },
      { id: "2-4", name: "Hot Roll (6 peças)", description: "Empanado e frito", originalPrice: 11.00, quantity: 1, available: 3 },
      { id: "2-5", name: "Edamame", description: "Feijão de soja cozido", originalPrice: 4.00, quantity: 1, available: 5 },
      { id: "2-6", name: "Temaki de Salmão", description: "1 unidade", originalPrice: 7.00, quantity: 1, available: 4 }
    ]
  },
  {
    id: "3",
    restaurantName: "Burger House",
    title: "Combo Burger Gourmet",
    description: "Burger artesanal, batatas rústicas e bebida",
    originalPrice: 28.00,
    discountedPrice: 9.99,
    discount: 64,
    image: "https://images.unsplash.com/photo-1632898657999-ae6920976661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBnb3VybWV0JTIwZm9vZHxlbnwxfHx8fDE3NzMwNDA1NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    pickupTime: "21:00 - 22:00",
    distance: 0.5,
    rating: 4.6,
    category: "Hambúrgueres",
    quantity: 5,
    minItems: 2,
    maxItems: 5,
    closingTime: "22:00",
    lat: 38.7200,
    lng: -9.1350,
    expiryHours: 4,
    items: [
      { id: "3-1", name: "Burger Classic", description: "Carne 180g, queijo, alface, tomate", originalPrice: 12.00, quantity: 1, available: 6 },
      { id: "3-2", name: "Burger BBQ", description: "Carne 180g, queijo cheddar, bacon, molho BBQ", originalPrice: 14.00, quantity: 1, available: 5 },
      { id: "3-3", name: "Veggie Burger", description: "Hambúrguer vegetariano", originalPrice: 11.00, quantity: 1, available: 4 },
      { id: "3-4", name: "Batatas Rústicas", description: "Porção 300g", originalPrice: 5.00, quantity: 1, available: 8 },
      { id: "3-5", name: "Onion Rings (8 un.)", description: "Anéis de cebola empanados", originalPrice: 4.50, quantity: 1, available: 6 },
      { id: "3-6", name: "Milkshake", description: "Chocolate ou baunilha", originalPrice: 5.50, quantity: 1, available: 5 }
    ]
  },
  {
    id: "4",
    restaurantName: "Green Bowl",
    title: "Bowl Saudável Variado",
    description: "Bowl nutritivo com proteína, grãos e vegetais frescos",
    originalPrice: 22.00,
    discountedPrice: 7.99,
    discount: 64,
    image: "https://images.unsplash.com/photo-1615865417491-9941019fbc00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGhlYWx0aHklMjBib3dsfGVufDF8fHx8MTc3MzExNDI1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    pickupTime: "18:00 - 19:00",
    distance: 1.5,
    rating: 4.7,
    category: "Saudável",
    quantity: 4,
    minItems: 3,
    maxItems: 6,
    closingTime: "19:00",
    lat: 38.7280,
    lng: -9.1450,
    expiryHours: 1,
    items: [
      { id: "4-1", name: "Bowl de Frango Grelhado", description: "Com quinoa e vegetais", originalPrice: 11.00, quantity: 1, available: 5 },
      { id: "4-2", name: "Bowl Vegano", description: "Tofu, grão-de-bico e vegetais", originalPrice: 9.50, quantity: 1, available: 4 },
      { id: "4-3", name: "Salada Caesar", description: "Com frango e croutons", originalPrice: 9.00, quantity: 1, available: 6 },
      { id: "4-4", name: "Sopa do Dia", description: "500ml", originalPrice: 5.00, quantity: 1, available: 8 },
      { id: "4-5", name: "Smoothie Verde", description: "Espinafre, banana, abacaxi", originalPrice: 4.50, quantity: 1, available: 5 },
      { id: "4-6", name: "Bolo de Cenoura (fatia)", description: "Sem açúcar refinado", originalPrice: 3.50, quantity: 1, available: 4 }
    ]
  },
  {
    id: "5",
    restaurantName: "Padaria Artesanal",
    title: "Cesta de Pães e Doces",
    description: "Seleção de pães artesanais, croissants e doces do dia",
    originalPrice: 30.00,
    discountedPrice: 10.99,
    discount: 63,
    image: "https://images.unsplash.com/photo-1736520537688-1f1f06b71605?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBicmVhZCUyMHBhc3RyaWVzfGVufDF8fHx8MTc3MzEwNzY4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    pickupTime: "20:30 - 21:30",
    distance: 0.6,
    rating: 4.8,
    category: "Padaria",
    quantity: 6,
    minItems: 4,
    maxItems: 8,
    closingTime: "21:30",
    lat: 38.7190,
    lng: -9.1380,
    expiryHours: 3.5,
    items: [
      { id: "5-1", name: "Pão de Centeio", description: "500g", originalPrice: 4.00, quantity: 1, available: 8 },
      { id: "5-2", name: "Croissant Simples (2 un.)", description: "Amanteigado", originalPrice: 3.50, quantity: 1, available: 10 },
      { id: "5-3", name: "Pain au Chocolat (2 un.)", description: "Com chocolate belga", originalPrice: 4.50, quantity: 1, available: 8 },
      { id: "5-4", name: "Baguette", description: "Tradicional francesa", originalPrice: 2.50, quantity: 1, available: 12 },
      { id: "5-5", name: "Pastel de Nata (4 un.)", description: "Receita tradicional", originalPrice: 5.00, quantity: 1, available: 15 },
      { id: "5-6", name: "Bolo de Chocolate (fatia)", description: "Bolo caseiro", originalPrice: 4.00, quantity: 1, available: 6 },
      { id: "5-7", name: "Cookies (6 un.)", description: "Chocolate chip", originalPrice: 3.50, quantity: 1, available: 10 }
    ]
  },
  {
    id: "6",
    restaurantName: "Sabores do Mundo",
    title: "Refeição Completa do Dia",
    description: "Prato principal, acompanhamentos e sobremesa",
    originalPrice: 38.00,
    discountedPrice: 13.99,
    discount: 63,
    image: "https://images.unsplash.com/photo-1737141500169-4208e3296b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGZyZXNoJTIwbWVhbHxlbnwxfHx8fDE3NzMxMzI5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    pickupTime: "19:00 - 20:00",
    distance: 1.0,
    rating: 4.5,
    category: "Variada",
    quantity: 2,
    minItems: 3,
    maxItems: 6,
    closingTime: "20:00",
    lat: 38.7240,
    lng: -9.1420,
    expiryHours: 2,
    items: [
      { id: "6-1", name: "Frango Assado com Batatas", description: "1/4 de frango", originalPrice: 13.00, quantity: 1, available: 3 },
      { id: "6-2", name: "Bacalhau à Brás", description: "Porção generosa", originalPrice: 15.00, quantity: 1, available: 2 },
      { id: "6-3", name: "Arroz de Pato", description: "Porção individual", originalPrice: 12.00, quantity: 1, available: 3 },
      { id: "6-4", name: "Salada Mista", description: "Acompanhamento", originalPrice: 3.50, quantity: 1, available: 6 },
      { id: "6-5", name: "Arroz Branco", description: "Porção", originalPrice: 2.50, quantity: 1, available: 8 },
      { id: "6-6", name: "Pudim Flan", description: "Sobremesa", originalPrice: 4.00, quantity: 1, available: 5 }
    ]
  }
];