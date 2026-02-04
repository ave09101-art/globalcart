
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export const paymentService = {
  /**
   * Simuliert die Abwicklung einer Zahlung über einen Provider wie Stripe.
   */
  processPayment: async (amount: number, method: 'card' | 'paypal'): Promise<PaymentResult> => {
    console.log(`%c💳 INITIIERE ZAHLUNG: ${amount}$ via ${method}...`, "color: #10b981; font-weight: bold;");
    
    // Simuliert Netzwerk-Verbindung zum Payment-Gateway
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulation einer Erfolgsquote von 95%
    const isSuccessful = Math.random() < 0.95;

    if (isSuccessful) {
      return {
        success: true,
        transactionId: `TXN-${Math.random().toString(36).substring(2, 12).toUpperCase()}`
      };
    } else {
      return {
        success: false,
        error: "Die Zahlung wurde von deiner Bank abgelehnt. Bitte überprüfe deine Deckung oder verwende eine andere Karte."
      };
    }
  },

  validateCardNumber: (num: string): boolean => {
    // Einfacher Format-Check (Luhn-Algorithmus Simulation)
    return num.replace(/\s/g, '').length >= 13;
  }
};
