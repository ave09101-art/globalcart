
export interface ProductVariant {
  label: string; // z.B. "128GB", "512GB", "Pro Max"
  priceUSD: number;
  weightKg?: number;
}

export interface ProductInfo {
  name: string;
  originalPrice: number; // Basis- oder gewählter Preis
  currency: string;
  category: string;
  estimatedWeightKg: number;
  description: string;
  variants?: ProductVariant[]; // Liste der erkannten Konfigurationen
  availableSizes?: string[];
  availableColors?: string[];
  confidenceScore?: number; // 0-1
  euReferencePrice?: number; // Geschätzter Preis in Europa zum Vergleich
  priceSource?: string; // z.B. "Amazon.com" oder "Nike.com"
  verifiedAt?: string; // Zeitstempel der Analyse
  analysisNotes?: string; // Interne KI-Notiz zur Preisbildung
}

export interface CostBreakdown {
  originalPriceUSD: number;
  usShippingFeeUSD: number;
  internationalShippingFeeUSD: number;
  customsFeeUSD: number;
  vatUSD: number;
  serviceFeeUSD: number;
  totalPriceUSD: number;
  totalPriceEUR: number;
  exchangeRate: number;
}

export interface Order {
  id: string;
  productName: string;
  status: 'pending' | 'purchased' | 'at_warehouse' | 'shipped' | 'delivered';
  date: string;
  totalCostEUR: number;
  trackingNumber?: string;
  selectedSize?: string;
  selectedColor?: string;
  selectedVariant?: string;
  specialNotes?: string;
}

export enum AppView {
  LANDING = 'landing',
  CALCULATOR = 'calculator',
  DASHBOARD = 'dashboard',
  CHECKOUT = 'checkout',
  CONFIRMATION = 'confirmation'
}
