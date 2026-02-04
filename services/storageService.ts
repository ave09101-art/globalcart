
import { Order, ProductInfo, CostBreakdown } from '../types';

const STORAGE_KEY = 'globalcart_orders';

export const storageService = {
  getOrders: (): Order[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Added variant as an argument to properly track selected product configuration
  saveOrder: (product: ProductInfo, costs: CostBreakdown, size?: string, color?: string, variant?: string, notes?: string): Order => {
    const orders = storageService.getOrders();
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      productName: product.name,
      status: 'pending',
      date: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }),
      // Fixed: changed totalCost to totalCostEUR and totalPrice to totalPriceEUR
      totalCostEUR: costs.totalPriceEUR,
      selectedSize: size,
      selectedColor: color,
      selectedVariant: variant,
      specialNotes: notes,
      trackingNumber: `GC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    };

    const updatedOrders = [newOrder, ...orders];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
    return newOrder;
  },

  initMockData: () => {
    if (storageService.getOrders().length === 0) {
      const mockOrders: Order[] = [
        {
          id: 'ORD-1234',
          productName: 'Apple Watch Series 9 (US Version)',
          status: 'shipped',
          date: '10. Feb 2024',
          // Fixed: changed totalCost to totalCostEUR
          totalCostEUR: 429.00,
          trackingNumber: 'UPS-9928112'
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrders));
    }
  }
};
