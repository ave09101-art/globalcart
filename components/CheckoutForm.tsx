
import React, { useState } from 'react';
import { Truck, User, ShieldCheck, ArrowRight, Lock, Loader2, AlertCircle, Copy, Check, Info, Package, BellRing, ExternalLink } from 'lucide-react';
import { ProductInfo, CostBreakdown } from '../types';

interface CheckoutFormProps {
  productData: {
    product: ProductInfo;
    costs: CostBreakdown;
    selectedSize?: string;
    selectedColor?: string;
    selectedVariant?: string;
    specialNotes?: string;
  };
  onComplete: (customerData: any) => void;
  onBack: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ productData, onComplete, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const { product, costs, selectedSize, selectedColor, selectedVariant, specialNotes } = productData;
  
  const PAYPAL_EMAIL = "anton.einem@gmx.de"; 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zip: ''
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PAYPAL_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(costs.totalPriceEUR.toFixed(2));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulation eines API Calls
    await new Promise(r => setTimeout(r, 1500));
    
    onComplete({
      ...formData,
      address: `${formData.street}, ${formData.zip} ${formData.city}`
    });
    setIsProcessing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow space-y-8">
          <button onClick={onBack} className="group flex items-center gap-2 text-sm font-black text-indigo-600 hover:text-indigo-800 transition-all uppercase tracking-widest">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Zurück zum Kalkulator
          </button>
          
          <div className="flex items-center gap-4">
             <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
                <User size={28} />
             </div>
             <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Bestell-Details</h2>
                <p className="text-gray-500 font-medium">Wohin dürfen wir dein US-Paket liefern?</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-100 border border-gray-50">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Vollständiger Name (für den Zoll)</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Z.B. Max Mustermann" className="w-full px-6 py-5 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-indigo-100 font-bold transition-all text-lg" />
                </div>
                
                <div className="md:col-span-2 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-center gap-3 mb-2">
                  <BellRing size={18} className="text-indigo-600 shrink-0" />
                  <p className="text-[11px] font-bold text-indigo-700 leading-tight">
                    Hinweis: E-Mail und Telefon sind optional. Wir empfehlen sie jedoch anzugeben, damit wir dir Status-Updates und die Sendungsverfolgung zuschicken können.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Deine E-Mail Adresse <span className="text-gray-300 ml-1">(Optional)</span></label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="deine@mail.de" className="w-full px-6 py-5 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-indigo-100 font-bold transition-all text-lg" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Mobilnummer <span className="text-gray-300 ml-1">(Optional)</span></label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+49 176..." className="w-full px-6 py-5 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-indigo-100 font-bold transition-all text-lg" />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Lieferanschrift (EU)</label>
                    <div className="group relative">
                      <Info size={12} className="text-gray-300 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        An diese Adresse wird das verzollte Paket geliefert.
                      </div>
                    </div>
                  </div>
                  <input type="text" required value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} placeholder="Straße & Hausnummer" className="w-full px-6 py-5 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-indigo-100 font-bold transition-all text-lg" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">PLZ</label>
                  <input type="text" required value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} placeholder="10115" className="w-full px-6 py-5 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-indigo-100 font-bold transition-all text-lg" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Stadt</label>
                  <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Berlin" className="w-full px-6 py-5 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-indigo-100 font-bold transition-all text-lg" />
                </div>
              </div>
            </section>

            <section className="bg-gray-900 rounded-[3rem] p-10 shadow-2xl text-white relative overflow-hidden ring-1 ring-white/10">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mt-32 -mr-32"></div>
               
               <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-3 rounded-2xl text-white">
                      <ShieldCheck size={28} />
                    </div>
                    <h3 className="text-2xl font-black">Zahlung per PayPal</h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl">
                    <Lock size={12} className="text-green-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Manual Transfer</span>
                  </div>
                </div>

                <p className="text-gray-400 font-medium mb-10 leading-relaxed text-lg">
                  Um Kosten zu sparen, nutzen wir die manuelle PayPal-Zahlung. Überweise den Betrag direkt an unser Concierge-Konto.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] transition-all group">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Gesamtbetrag</span>
                      {copiedAmount && <span className="text-[10px] bg-green-500 text-white px-2 py-1 rounded-lg animate-in zoom-in">Kopiert!</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black">{costs.totalPriceEUR.toFixed(2)}€</span>
                      <button type="button" onClick={handleCopyAmount} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all active:scale-90">
                        {copiedAmount ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] transition-all group">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-indigo-400">PayPal Empfänger</span>
                      {copiedEmail && <span className="text-[10px] bg-green-500 text-white px-2 py-1 rounded-lg animate-in zoom-in">Kopiert!</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black truncate mr-4">{PAYPAL_EMAIL}</span>
                      <button type="button" onClick={handleCopyEmail} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all active:scale-90">
                        {copiedEmail ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="text-gray-400" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <a 
                    href="https://www.paypal.com/myaccount/transfer/homepage" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-[#0070ba] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#005ea6] transition-all shadow-xl shadow-blue-500/10 group active:scale-[0.98]"
                  >
                    <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    Direkt zu PayPal & Senden
                  </a>
                </div>

                <div className="bg-indigo-600/20 border border-indigo-500/20 p-5 rounded-2xl flex items-start gap-4">
                   <AlertCircle className="text-indigo-400 mt-1 shrink-0" size={20} />
                   <p className="text-sm font-bold text-indigo-100">
                     Wichtig: Bitte gib im PayPal-Betreff deine E-Mail Adresse an, damit wir die Zahlung sofort zuordnen können.
                   </p>
                </div>
              </div>
            </section>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="group w-full bg-indigo-600 text-white py-7 rounded-[2.5rem] font-black text-2xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(79,70,229,0.3)] disabled:opacity-50 active:scale-[0.98]"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={32} /> : (
                <>
                  Bestellung zahlungspflichtig aufgeben
                  <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
              Mit dem Absenden akzeptierst du unsere AGB & Import-Richtlinien.
            </p>
          </form>
        </div>

        <div className="lg:w-[420px]">
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-100 border border-gray-50 sticky top-28 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
            
            <h4 className="text-xl font-black mb-8 tracking-tight relative z-10">Bestellübersicht</h4>
            
            <div className="space-y-6 relative z-10">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Package size={24} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 line-clamp-2">{product.name}</p>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">
                    {selectedVariant ? `${selectedVariant} • ` : ''}{selectedSize || 'Standard'} • {selectedColor || 'Standard'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100 text-sm font-bold">
                <div className="flex justify-between text-gray-500">
                  <span>Produktpreis (US)</span>
                  <span className="text-gray-900">${costs.originalPriceUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Import & Service (EU)</span>
                  <span className="text-gray-900">${(costs.totalPriceUSD - costs.originalPriceUSD).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Wechselkurs</span>
                  <span>1$ = {costs.exchangeRate}€</span>
                </div>
                
                <div className="flex justify-between pt-6 mt-6 border-t-2 border-dashed border-gray-200">
                  <div className="text-gray-400 text-xs font-black uppercase tracking-widest self-end pb-1">Total in Euro</div>
                  <span className="text-indigo-600 text-4xl font-black tracking-tighter">{costs.totalPriceEUR.toFixed(2)}€</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-4 mt-6 flex items-center gap-3 border border-green-100">
                 <Truck size={18} className="text-green-600" />
                 <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Inkl. Zollfrei-Garantie bis DE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
