
import React, { useState, useEffect } from 'react';
import { AppView, ProductInfo, CostBreakdown } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Calculator } from './components/Calculator';
import { Dashboard } from './components/Dashboard';
import { CheckoutForm } from './components/CheckoutForm';
import { StoreShowcase } from './components/StoreShowcase';
import { ProductTour } from './components/ProductTour';
import { storageService } from './services/storageService';
import { notificationService } from './services/notificationService';
import { MailCheck, Globe, Instagram, Twitter, Linkedin, Facebook, MapPin, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>(AppView.LANDING);
  const [selectedProduct, setSelectedProduct] = useState<{product: ProductInfo, costs: CostBreakdown, selectedSize?: string, selectedColor?: string, selectedVariant?: string, specialNotes?: string} | null>(null);
  const [isNotifying, setIsNotifying] = useState(false);
  const [showTour, setShowTour] = useState(false);
  
  // Persistenter Status für den Kalkulator
  const [calcInput, setCalcInput] = useState('');
  const [calcMode, setCalcMode] = useState<'link' | 'search'>('link');

  useEffect(() => {
    storageService.initMockData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const hasSeenTour = localStorage.getItem('globalcart_tour_seen');
    if (!hasSeenTour) {
      setTimeout(() => setShowTour(true), 1500);
      localStorage.setItem('globalcart_tour_seen', 'true');
    }
  }, [currentView]);

  const handleCheckoutInitiate = (data: {product: ProductInfo, costs: CostBreakdown, selectedSize?: string, selectedColor?: string, selectedVariant?: string, specialNotes?: string}) => {
    setSelectedProduct(data);
    setView(AppView.CHECKOUT);
  };

  const handleOrderComplete = async (customerData: any) => {
    if (selectedProduct) {
      setIsNotifying(true);
      const newOrder = storageService.saveOrder(
        selectedProduct.product,
        selectedProduct.costs,
        selectedProduct.selectedSize,
        selectedProduct.selectedColor,
        selectedProduct.selectedVariant,
        selectedProduct.specialNotes
      );

      await notificationService.notifyAdminNewOrder(
        newOrder,
        selectedProduct.product,
        selectedProduct.costs,
        customerData,
        selectedProduct.specialNotes
      );
      
      setIsNotifying(false);
    }
    setView(AppView.CONFIRMATION);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.LANDING:
        return (
          <>
            <div id="hero-title">
              <Hero onGetStarted={() => setView(AppView.CALCULATOR)} />
            </div>
            
            <StoreShowcase onAnalyzeClick={() => setView(AppView.CALCULATOR)} />
            
            <section className="py-24 sm:py-32 bg-gray-900 text-white overflow-hidden relative">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
              <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                  <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none mb-6">
                    US-Shopping war noch <br/><span className="text-indigo-400">nie so einfach.</span>
                  </h2>
                  <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">
                    GlobalCart verbindet dich direkt mit den größten Lagern der Welt.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                  {[
                    { title: "AI-Analyse", desc: "Unsere KI findet automatisch alle relevanten Produkt-Optionen und Versandgewichte." },
                    { title: "Concierge-Kauf", desc: "Wir kaufen das Produkt lokal in den USA für dich. Sicher und verifiziert." },
                    { title: "Safe Delivery", desc: "Alle Pakete werden in Miami konsolidiert und vollversichert nach Europa geschickt." }
                  ].map((f, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] group hover:bg-white/10 transition-all">
                      <div className="text-indigo-500 font-black text-4xl mb-6">0{i+1}</div>
                      <h4 className="text-2xl font-black mb-4">{f.title}</h4>
                      <p className="text-gray-400 font-medium leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
      case AppView.CALCULATOR:
        return (
          <Calculator 
            onCheckout={handleCheckoutInitiate} 
            externalInput={calcInput}
            setExternalInput={setCalcInput}
            externalMode={calcMode}
            setExternalMode={setCalcMode}
          />
        );
      case AppView.CHECKOUT:
        return selectedProduct ? (
          <CheckoutForm 
            productData={selectedProduct} 
            onComplete={handleOrderComplete}
            onBack={() => setView(AppView.CALCULATOR)}
          />
        ) : (
          <Calculator 
            onCheckout={handleCheckoutInitiate}
            externalInput={calcInput}
            setExternalInput={setCalcInput}
            externalMode={calcMode}
            setExternalMode={setCalcMode}
          />
        );
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.CONFIRMATION:
        return (
          <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-in zoom-in duration-500">
            <div className="bg-white p-16 rounded-[3.5rem] shadow-2xl border border-gray-50">
              <div className="bg-green-100 text-green-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-green-100">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tight">Fast geschafft!</h2>
              <p className="text-xl text-gray-500 mb-10 font-medium">
                Deine Bestellung ist im System. Bitte führe jetzt die PayPal-Überweisung durch, damit wir den Kauf in den USA starten können.
              </p>

              <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest mb-12">
                <MailCheck size={18} />
                Concierge Benachrichtigt
              </div>
              
              <div className="grid gap-4">
                <button onClick={() => setView(AppView.DASHBOARD)} className="w-full bg-gray-900 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl active:scale-95">
                  Bestellung im Dashboard verfolgen
                </button>
                <button onClick={() => setView(AppView.LANDING)} className="w-full bg-white text-gray-600 border border-gray-200 px-8 py-5 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                  Zurück zum Shop
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {showTour && <ProductTour onClose={() => setShowTour(false)} />}
      
      <Navbar currentView={currentView} setView={setView} />
      
      {currentView === AppView.LANDING && !showTour && (
        <button 
          onClick={() => setShowTour(true)}
          className="fixed bottom-10 right-10 z-40 bg-white text-gray-900 p-5 rounded-full shadow-3xl border border-gray-100 flex items-center gap-3 group hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-2 animate-bounce"
        >
          <Sparkles className="text-indigo-600 group-hover:text-white" size={24} />
          <span className="text-xs font-black uppercase tracking-widest pr-2">Tour starten</span>
        </button>
      )}

      <main className="flex-grow">
        {renderContent()}
      </main>
      
      <footer id="footer" className="bg-white border-t border-gray-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center mb-8">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-3xl font-black tracking-tighter">GlobalCart</span>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed mb-8">
                Dein Partner für grenzenloses Shopping. Sicher, transparent und schnell direkt aus den USA.
              </p>
              <div className="flex gap-4">
                {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-gray-100">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-8">Lagerstandorte</h4>
              <ul className="space-y-4 text-gray-900 font-bold">
                <li className="flex items-center gap-2 text-sm"><MapPin size={14} className="text-indigo-500" /> Miami, FL (Haupt-Hub)</li>
                <li className="flex items-center gap-2 text-sm"><MapPin size={14} className="text-indigo-500" /> New Jersey, NJ</li>
                <li className="flex items-center gap-2 text-sm"><MapPin size={14} className="text-indigo-500" /> Berlin, DE (Distribution)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-8">Unternehmen</h4>
              <ul className="space-y-4 text-gray-900 font-bold">
                <li><a href="#" className="hover:text-indigo-600 transition-colors text-sm">Wie es funktioniert</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors text-sm">Zoll & Gebühren</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors text-sm">Concierge-Service</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors text-sm">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-8">Service</h4>
              <p className="text-gray-500 mb-6 font-medium text-sm">Support 24/7 über unser Dashboard erreichbar.</p>
              <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <p className="text-indigo-900 font-black text-sm">Händler-Anfragen</p>
                <p className="text-indigo-700 text-xs mt-1">partner@globalcart.logistics</p>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest gap-6">
            <p>© 2024 GlobalCart Logistics. Worldwide shipping made simple.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-gray-900 transition-colors">Datenschutz</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Impressum</a>
              <a href="#" className="hover:text-gray-900 transition-colors">AGB</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
