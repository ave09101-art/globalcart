
import { GoogleGenAI, Type } from "@google/genai";
import { ProductInfo, CostBreakdown, ProductVariant } from "../types";

const USD_TO_EUR_RATE = 0.93;

/**
 * Hilfsfunktion zum sauberen Parsen von JSON-Antworten der KI.
 * Verhindert Fehler, wenn die KI Markdown-Code-Blöcke zurückgibt.
 */
function safeParseJSON(text: string | undefined): any {
  if (!text) return null;
  try {
    // Entferne potenzielle Markdown-Code-Blöcke (```json ... ```)
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Fehler beim Parsen der KI-Antwort:", e, text);
    return null;
  }
}

export interface USDeal {
  storeName: string;
  url: string;
  priceUSD: number;
  availability: string;
  savingsVsEU?: string;
}

export async function findBestUSDeals(query: string): Promise<USDeal[]> {
  // Initialisierung direkt vor dem Call für maximale Stabilität im Studio
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Flash ist schneller für reine Suchanfragen
      contents: `Finde die aktuell besten US-Online-Deals für: "${query}". 
      Suche bei Top-Retailern (Amazon.com, Best Buy, Walmart, Nike, B&H).
      Antworte AUSSCHLIESSLICH im validen JSON-Format. Keine Erklärungen vor oder nach dem JSON.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              storeName: { type: Type.STRING },
              url: { type: Type.STRING },
              priceUSD: { type: Type.NUMBER },
              availability: { type: Type.STRING },
              savingsVsEU: { type: Type.STRING }
            },
            required: ["storeName", "url", "priceUSD", "availability"]
          }
        }
      }
    });

    return safeParseJSON(response.text) || [];
  } catch (err) {
    console.error("Deal Finder Fehler:", err);
    return [];
  }
}

export async function parseProductFromInput(input: string, forceDeepScan: boolean = false): Promise<ProductInfo> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analysiere dieses Produkt oder diesen Link mit maximaler Präzision: "${input}"
      
      AUFGABE:
      1. Erkenne den REALEN Endpreis auf der Seite.
      2. Prüfe via Google Search nach aktuellen Rabatten oder Varianten-Aufschlägen.
      3. Wenn es verschiedene Modelle gibt (z.B. Speichergrößen), liste sie in 'variants' auf.
      
      WICHTIG: Deine Antwort muss ein valides JSON-Objekt sein, das exakt dem Schema entspricht.`,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: forceDeepScan ? 4000 : 2000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            originalPrice: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            category: { type: Type.STRING },
            estimatedWeightKg: { type: Type.NUMBER },
            description: { type: Type.STRING },
            priceSource: { type: Type.STRING },
            analysisNotes: { type: Type.STRING },
            variants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  priceUSD: { type: Type.NUMBER },
                  weightKg: { type: Type.NUMBER }
                },
                required: ["label", "priceUSD"]
              }
            },
            availableSizes: { type: Type.ARRAY, items: { type: Type.STRING } },
            availableColors: { type: Type.ARRAY, items: { type: Type.STRING } },
            euReferencePrice: { type: Type.NUMBER },
            confidenceScore: { type: Type.NUMBER }
          },
          required: ["name", "originalPrice", "category", "confidenceScore", "priceSource", "analysisNotes"]
        }
      }
    });

    const product = safeParseJSON(response.text);
    if (!product) throw new Error("KI-Antwort konnte nicht verarbeitet werden.");

    product.verifiedAt = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    
    // Fallback falls Preis in Varianten steckt
    if (product.variants && product.variants.length > 0 && (!product.originalPrice || product.originalPrice === 0)) {
      product.originalPrice = product.variants[0].priceUSD;
    }
    
    return product;
  } catch (err) {
    console.error("Produkt-Analyse Fehler:", err);
    throw err;
  }
}

export function calculateCosts(product: { originalPrice: number, estimatedWeightKg: number }): CostBreakdown {
  const originalPriceUSD = product.originalPrice;
  const weight = product.estimatedWeightKg || 0.5;
  
  const usShippingFeeUSD = originalPriceUSD > 100 ? 0 : 9.95;
  const internationalShippingFeeUSD = 22 + (weight * 13); 
  
  const baseValueForTax = originalPriceUSD + usShippingFeeUSD + internationalShippingFeeUSD;
  const customsRate = 0.045; 
  const vatRate = 0.19; 
  
  const customsFeeUSD = baseValueForTax * customsRate;
  const vatUSD = (baseValueForTax + customsFeeUSD) * vatRate;
  const serviceFeeUSD = Math.max(15, originalPriceUSD * 0.08);

  const totalPriceUSD = originalPriceUSD + usShippingFeeUSD + internationalShippingFeeUSD + customsFeeUSD + vatUSD + serviceFeeUSD;
  const totalPriceEUR = totalPriceUSD * USD_TO_EUR_RATE;

  return {
    originalPriceUSD,
    usShippingFeeUSD: Math.round(usShippingFeeUSD * 100) / 100,
    internationalShippingFeeUSD: Math.round(internationalShippingFeeUSD * 100) / 100,
    customsFeeUSD: Math.round(customsFeeUSD * 100) / 100,
    vatUSD: Math.round(vatUSD * 100) / 100,
    serviceFeeUSD: Math.round(serviceFeeUSD * 100) / 100,
    totalPriceUSD: Math.round(totalPriceUSD * 100) / 100,
    totalPriceEUR: Math.round(totalPriceEUR * 100) / 100,
    exchangeRate: USD_TO_EUR_RATE
  };
}
