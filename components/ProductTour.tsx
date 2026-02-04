
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles, Zap, ShieldCheck, PieChart as PieIcon, Globe, Info } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  targetId: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    title: "Willkommen bei GlobalCart",
    description: "Ab heute gibt es keine Grenzen mehr für dein Shopping. Wir bringen dir jedes Produkt aus den USA direkt nach Hause.",
    targetId: "hero-title",
    icon: <Globe className="text-indigo-600" size={32} />
  },
  {
    title: "Smart Input & One-Click",
    description: "Füge einfach einen Link ein oder suche nach einem Produkt. Mit dem 'X' kannst du deine Suche sofort wieder löschen.",
    targetId: "calculator",
    icon: <Zap className="text-amber-500" size={32} />
  },
  {
    title: "Varianten-Intelligenz",
    description: "Unsere KI erkennt automatisch Upgrades und verschiedene Produkt-Konfigurationen (wie Speichergrößen oder Ausführungen) und passt den Importpreis sofort an.",
    targetId: "calculator",
    icon: <Sparkles className="text-purple-500" size={32} />
  },
  {
    title: "All-In Transparenz",
    description: "Keine versteckten Gebühren. Du siehst sofort den Endpreis inklusive Zoll, Steuern und internationalem Versand.",
    targetId: "calculator",
    icon: <PieIcon className="text-green-500" size={32} />
  },
  {
    title: "Global-Schutz Garantie",
    description: "Jedes Paket ist vollversichert. Wir garantieren dir, dass dein Produkt sicher und ohne Nachzahlungen ankommt.",
    targetId: "footer",
    icon: <ShieldCheck className="text-blue-500" size={32} />
  }
];

export const ProductTour: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 500);
  };

  return (
    <div className={`fixed inset-0 z-[100] transition-opacity duration-500 flex items-center justify-center p-4 sm:p-8 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={handleClose}></div>
      
      <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500">
        <div className="absolute top-0 right-0 p-8">
          <button onClick={handleClose} className="text-gray-300 hover:text-gray-900 transition-colors">
            <X size={32} strokeWidth={3} />
          </button>
        </div>

        <div className="p-12 sm:p-16">
          <div className="bg-gray-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 shadow-inner">
            {steps[currentStep].icon}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.4em]">Schritt {currentStep + 1} von {steps.length}</span>
            </div>
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">
              {steps[currentStep].title}
            </h3>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <button 
              onClick={nextStep}
              className="flex-grow bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-indigo-200 active:scale-95"
            >
              {currentStep === steps.length - 1 ? 'Tour beenden' : 'Verstanden'}
              <ArrowRight size={28} />
            </button>
          </div>

          <div className="mt-8 flex gap-2 justify-center">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${currentStep === i ? 'w-12 bg-indigo-600' : 'w-3 bg-gray-100'}`}></div>
            ))}
          </div>
        </div>
        
        <div className="bg-indigo-50 px-12 py-6 border-t border-indigo-100 flex items-center gap-4">
           <Info size={16} className="text-indigo-400" />
           <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Interaktiver Concierge Guide</p>
        </div>
      </div>
    </div>
  );
};
