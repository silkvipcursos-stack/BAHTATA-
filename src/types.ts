export type FlavorId =
  | 'calabresa-queijo'
  | 'frango-desfiado'
  | 'bacon-queijo'
  | 'strogonofe';

export type CreamyChoice = 'catupiry' | 'cheddar' | 'catupiry-cheddar';
export type StrogonoffProtein = 'frango' | 'carne';
export type DeliveryMode = 'delivery' | 'pickup';
export type PaymentMethod = 'pix' | 'card' | 'cash';
export type ToppingCategory = 'Proteínas' | 'Queijos & Cremes' | 'Crocantes & Vegetais';

export interface FlavorItem {
  id: FlavorId;
  name: string;
  shortName: string;
  subtitle: string;
  description: string;
  basePrice: number;
  weightLabel: string;
  prepTime: string;
  calories: string;
  image: string;
  hasProteinChoice?: boolean;
  highlights: string[];
}

export interface SizeOption {
  id: string;
  name: string;
  weight: string;
  description: string;
  extraPrice: number;
}

export interface GratinOption {
  id: string;
  name: string;
  description: string;
  extraPrice: number;
}

export interface ToppingItem {
  id: string;
  name: string;
  category: ToppingCategory;
  price: number;
  detail: string;
}

export interface SauceItem {
  id: string;
  name: string;
  intensity: string;
  description: string;
  price: number;
}

export interface ExclusiveOption {
  id: string;
  name: string;
  description: string;
  price: number;
  tag: string;
}

export interface PotatoConfig {
  flavorId: FlavorId;
  creamyChoice: CreamyChoice;
  strogonoffProtein: StrogonoffProtein;
  sizeId: string;
  gratinId: string;
  toppingIds: string[];
  sauceIds: string[];
  exclusiveIds: string[];
  notes: string;
}

export interface CartItem {
  uid: string;
  config: PotatoConfig;
  quantity: number;
  unitPrice: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: string;
  items: CartItem[];
  scheduling: {
    mode: DeliveryMode;
    dayLabel: string;
    timeSlot: string;
  };
  customer: CustomerInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface StoreConfig {
  whatsappNumber: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  flavorPrices: {
    'calabresa-queijo': number;
    'frango-desfiado': number;
    'bacon-queijo': number;
    'strogonofe-frango': number;
    'strogonofe-carne': number;
  };
  creamyPrices: {
    catupiry: number;
    cheddar: number;
  };
  toppings: ToppingItem[];
}

export interface AuthorizedRecentOrder {
  id: string;
  firstName: string;
  neighborhood: string;
  createdAt: string;
  authorized: true;
}
