
import { Order, ProductInfo, CostBreakdown } from '../types';
import emailjs from '@emailjs/browser';

/**
 * HIER DEINE ECHTEN DATEN VON EMAILJS.COM EINTRAGEN
 * Achte darauf, dass die IDs in Anführungszeichen stehen!
 */
const SERVICE_ID = 'service_p3x57ms';   // Korrigiert: Anführungszeichen hinzugefügt
const TEMPLATE_ID = 'template_o98v36a'; // Korrigiert: Anführungszeichen hinzugefügt
const PUBLIC_KEY = 'm3q-c1RzM9Qp4CYRxKt-O';  

// EmailJS initialisieren
emailjs.init(PUBLIC_KEY);

export const notificationService = {
  notifyAdminNewOrder: async (
    order: Order, 
    product: ProductInfo, 
    costs: CostBreakdown,
    customer: { name: string, email: string, phone: string, address: string },
    specialNotes?: string
  ) => {
    // Diese Daten müssen exakt so in deinem EmailJS Template stehen (z.B. {{customer_name}})
    const templateParams = {
      order_id: order.id,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      customer_address: customer.address,
      product_name: product.name,
      options: `${order.selectedSize || 'Standard'} / ${order.selectedColor || 'Standard'}`,
      total_price: `${costs.totalPriceEUR.toFixed(2)}€`,
      special_notes: specialNotes || 'Keine.',
      date: order.date
    };

    try {
      // Sicherheits-Check: Falls IDs noch Platzhalter sind
      if (SERVICE_ID.includes('deine_id')) {
        console.warn("⚠️ EmailJS: Du musst deine echten IDs in notificationService.ts eintragen!");
        return false;
      }

      const response = await emailjs.send(
        SERVICE_ID, 
        TEMPLATE_ID, 
        templateParams, 
        PUBLIC_KEY
      );

      console.log("✅ EmailJS Erfolg! Admin wurde benachrichtigt.", response.status, response.text);
      return true;
    } catch (error) {
      console.error("❌ EmailJS Fehler beim Senden:", error);
      return false;
    }
  }
};
