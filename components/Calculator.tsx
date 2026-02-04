
// Add React import to fix 'Cannot find namespace React' errors and move AlertCircle import to the top
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Zap, Link, ShieldCheck, Check, Sparkles, ExternalLink, Edit3, X, ArrowRight, Layers, Ruler, History, Info, RefreshCw, AlertCircle } from 'lucide-react';
import { parseProductFromInput, calculateCosts, findBestUSDeals, USDeal } from '../services/geminiService';
import { ProductInfo, CostBreakdown, ProductVariant } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface CalculatorProps {
  onCheckout: (data: { product: ProductInfo, costs: CostBreakdown, selectedSize?: string, selectedColor?: string, selectedVariant?: string, specialNotes?: string }) => void;
  externalInput?: string;
  setExternalInput?: (val: string) => void;
  externalMode?: 'link' | 'search';
  setExternalMode?: (val: 'link' | 'search') => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ 
  onCheckout, 
  externalInput, 
  setExternalInput, 
  externalMode, 
  setExternalMode 
}) => {
  const [internalInput, setInternalInput] = useState('');
  const [internalMode, setInternalMode] = useState<'link' | 'search'>('link');

  const input = externalInput !== undefined ? externalInput : internalInput;
  const setInput = (val: string) => {
    if (setExternalInput) setExternalInput(val);
    else setInternalInput(val);
  };

  const mode = externalMode !== undefined ? externalMode : internalMode;
  const setMode = (val: 'link' | 'search') => {
    if (setExternalMode) setExternalMode(val);
    else setInternalMode(val);
  };

  const [loading, setLoading] = useState(false);
  const [showFinishedBadge, setShowFinishedBadge] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [deals, setDeals] = useState<USDeal[]>([]);
  const [result, setResult] = useState<{ product: ProductInfo, costs: CostBreakdown } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deepScanActive, setDeepScanActive] = useState(false);
  
  const [editablePrice, setEditablePrice] = useState<number>(0);
  const [editableWeight, setEditableWeight] = useState<number>(0.5);
  const [editableSize, setEditableSize] = useState<string>('');
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [error, setError] = useState('');

  const loadingStatuses = [
    "Scanne US-Datenbanken...",
    "Extrahiere Varianten & Farben...",
    "Checke Checkout-Preise...",
    "Verifiziere Produktdaten..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      let idx = 0;
      setStatusText(loadingStatuses[0]);
      interval = setInterval(() => {
        idx = (idx + 1) % loadingStatuses.length;
        setStatusText(loadingStatuses[idx]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const runAnalysis = useCallback(async (url: string, forceDeep: boolean = false) => {
    setLoading(true);
    setShowFinishedBadge(false);
    setError('');
    setResult(null);
    setDeals([]);
    setSelectedSize(''); 
    setSelectedColor('');
    
    try {
      const product = await parseProductFromInput(url, forceDeep);
      const costs = calculateCosts({ 
        originalPrice: product.originalPrice, 
        estimatedWeightKg: product.estimatedWeightKg 
      });
      setResult({ product, costs });
      setEditablePrice(product.originalPrice);
      setEditableWeight(product.estimatedWeightKg);
      setEditableSize(product.availableSizes?.[0] || '');
      
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
      if (product.availableSizes && product.availableSizes.length > 0) {
        setSelectedSize(product.availableSizes[0]);
      }
      if (product.availableColors && product.availableColors.length > 0) {
        setSelectedColor(product.availableColors[0]);
      }
      
      setLoading(false);
      setShowFinishedBadge(true);
      setTimeout(() => setShowFinishedBadge(false), 3000);

    } catch (err: any) {
      console.error("Analyse Fehler:", err);
      setLoading(false);
      setError(err.message?.includes("entity was not found") 
        ? "API Key Fehler. Bitte wähle deinen Key erneut aus." 
        : "Analyse fehlgeschlagen. Der Link ist eventuell geschützt oder ungültig.");
    }
  }, []);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (mode === 'link') {
      await runAnalysis(input, deepScanActive);
    } else {
      setLoading(true);
      setError('');
      try {
        const foundDeals = await findBestUSDeals(input);
        if (foundDeals.length === 0) {
          setError('Keine direkten Deals gefunden. Versuche es mit einem Link.');
        } else {
          setDeals(foundDeals);
        }
      } catch (err) {
        setError('Suche fehlgeschlagen.');
      } finally {
        setLoading(false);
      }
    }
  };

  const updateManualCalculation = () => {
    if (!result) return;
    const newCosts = calculateCosts({ 
      originalPrice: editablePrice, 
      estimatedWeightKg: editableWeight 
    });
    setResult({
      ...result,
      product: { ...result.product, originalPrice: editablePrice, estimatedWeightKg: editableWeight },
      costs: newCosts
    });
    setSelectedSize(editableSize);
    setIsEditing(false);
  };

  const clearAll = () => {
    setInput('');
    setResult(null);
    setDeals([]);
    setError('');
    setIsEditing(false);
    setShowFinishedBadge(false);
  };

  const chartData = result ? [
    { name: 'Produkt', value: result.costs.originalPriceUSD * result.costs.exchangeRate, color: '#4F46E5' },
    { name: 'Versand', value: (result.costs.internationalShippingFeeUSD + result.costs.usShippingFeeUSD) * result.costs.exchangeRate, color: '#10B981' },
    { name: 'Zoll/MwSt', value: (result.costs.customsFeeUSD + result.costs.vatUSD) * result.costs.exchangeRate, color: '#F59E0B' },
    { name: 'Service', value: result.costs.serviceFeeUSD * result.costs.exchangeRate, color: '#8B5CF6' },
  ] : [];

  return (
    <div id="calculator" className="max-w-6xl mx-auto px-4 py-16 lg:py-24 animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-7xl font-black text-gray-900 mb-6 tracking-tighter leading-none">Smart Import Calc</h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-500 font-medium">
          Verstehe jeden Cent deines US-Imports. <span className="text-indigo-600 font-bold">Präzise & Live.</span>
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-20">
        <div className="flex p-1.5 bg-gray-100/80 backdrop-blur-md rounded-[2.5rem] mb-8 w-fit mx-auto ring-1 ring-gray-200 shadow-sm items-center gap-4">
          <div className="flex">
            <button 
              onClick={() => { setMode('link'); clearAll(); }}
              className={`px-10 py-4 rounded-3xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'link' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Analyse Link
            </button>
            <button 
              onClick={() => { setMode('search'); clearAll(); }}
              className={`px-10 py-4 rounded-3xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'search' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Deal Finder
            </button>
          </div>
          
          {mode === 'link' && (
            <div className="relative group/tooltip">
              <button 
                type="button"
                onClick={() => setDeepScanActive(!deepScanActive)}
                className={`flex items-center gap-2 px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${deepScanActive ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
              >
                <Sparkles size={14} />
                {deepScanActive ? 'Deep Scan Ein' : 'Standard'}
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 bg-gray-900 text-white text-[10px] rounded-2xl opacity-0 group-hover/tooltip:opacity-100 transition-all pointer-events-none z-50 shadow-2xl border border-white/10">
                Nutzt Gemini 3 Pro für maximale Preisgenauigkeit & Echtzeit-Verfügbarkeit.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleAction} className="relative bg-white p-5 rounded-[4rem] shadow-[0_40px_120px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col sm:flex-row gap-3 ring-1 ring-gray-50 transition-all">
          <div className="flex-grow flex items-center px-8 relative group">
            {mode === 'link' ? <Link className="text-indigo-400 mr-5" size={28} /> : <Search className="text-indigo-500 mr-5" size={28} />}
            <input
              type="text"
              className="w-full py-5 text-xl font-bold outline-none placeholder:text-gray-300 bg-transparent text-gray-900"
              placeholder={mode === 'link' ? "Shop Link einfügen..." : "Was suchst du in den USA?"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {input && (
              <button type="button" onClick={clearAll} className="absolute right-4 p-3 text-gray-300 hover:text-red-500 transition-all">
                <X size={24} strokeWidth={3} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 text-white px-14 py-6 rounded-[2.5rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 disabled:opacity-30 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={32} /> : 'Berechnen'}
          </button>
        </form>
        {error && (
          <div className="mt-8 flex items-center justify-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest bg-red-50 py-4 px-8 rounded-2xl border border-red-100 animate-in shake duration-500">
             <AlertCircle size={16} /> {error}
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-20 animate-in fade-in zoom-in">
          <Loader2 size={64} className="mx-auto text-indigo-600 animate-spin mb-6" />
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">{statusText}</h3>
        </div>
      )}

      {showFinishedBadge && (
        <div className="flex items-center justify-center gap-3 bg-green-50 text-green-600 font-black text-xs py-4 px-8 rounded-full w-fit mx-auto mb-10 border border-green-100 animate-in fade-in slide-in-from-bottom-2">
          <Check size={18} strokeWidth={4} /> Analyse abgeschlossen
        </div>
      )}

      {result && !loading && (
        <div className="grid lg:grid-cols-12 gap-12 animate-in slide-in-from-bottom-8 duration-500">
          <div className="lg:col-span-7 space-y-12">
            <div className="bg-white rounded-[4rem] p-8 sm:p-14 shadow-2xl border border-gray-100 relative h-full flex flex-col">
               <div className="mb-8 flex flex-wrap gap-4 items-center">
                  <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-6 py-3 rounded-2xl uppercase tracking-widest border border-indigo-100">{result.product.category}</span>
                  <div className="bg-gray-50 text-gray-400 text-[10px] font-black px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2">
                    <History size={14} /> {result.product.verifiedAt}
                  </div>
               </div>
                
                <h3 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-8 tracking-tighter">{result.product.name}</h3>
                
                <div className="mb-12">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-5xl sm:text-7xl font-black text-indigo-600 tracking-tighter leading-none">${result.product.originalPrice.toFixed(2)}</span>
                    <span className="text-gray-400 font-black uppercase text-[10px] mb-2 tracking-widest">US-Netto</span>
                  </div>
                  <button 
                    onClick={() => runAnalysis(input, true)}
                    className="group mt-2 text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                    Falsch? Scan neu starten
                  </button>
                </div>

                <div className="flex-grow">
                  {isEditing ? (
                    <div className="bg-gray-900 p-8 sm:p-10 rounded-[3rem] text-white mb-12 space-y-8 animate-in zoom-in duration-300">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Preis ($)</label>
                          <input type="number" value={editablePrice} onChange={e => setEditablePrice(Number(e.target.value))} className="w-full bg-white/10 px-6 py-4 rounded-xl border border-white/10 text-xl font-black outline-none" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Gewicht (KG)</label>
                          <input type="number" step="0.1" value={editableWeight} onChange={e => setEditableWeight(Number(e.target.value))} className="w-full bg-white/10 px-6 py-4 rounded-xl border border-white/10 text-xl font-black outline-none" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Option manuell</label>
                          <input type="text" value={editableSize} onChange={e => setEditableSize(e.target.value)} placeholder="Farbe, Größe..." className="w-full bg-white/10 px-6 py-4 rounded-xl border border-white/10 text-xl font-black outline-none" />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={updateManualCalculation} className="flex-grow bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest">Speichern</button>
                        <button onClick={() => setIsEditing(false)} className="px-6 bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Abbrechen</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-4 mb-12">
                         <div className="bg-gray-50 p-6 sm:p-8 rounded-[2rem] border border-gray-100 flex-grow min-w-[140px]">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Gewählte Option</p>
                            <p className="text-xl sm:text-2xl font-black text-gray-900">
                              {selectedColor && selectedSize ? `${selectedColor} / ${selectedSize}` : selectedSize || selectedColor || 'Standard'}
                            </p>
                         </div>
                         <div className="bg-gray-50 p-6 sm:p-8 rounded-[2rem] border border-gray-100 flex-grow min-w-[140px]">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Gewicht</p>
                            <p className="text-xl sm:text-2xl font-black text-gray-900">{result.product.estimatedWeightKg} kg</p>
                         </div>
                         <button onClick={() => setIsEditing(true)} className="group bg-indigo-50 p-6 sm:p-8 rounded-[2rem] border border-indigo-100 flex items-center justify-center transition-all hover:bg-indigo-100">
                            <Edit3 size={24} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                         </button>
                      </div>

                      {result.product.variants && result.product.variants.length > 0 && (
                        <div className="mb-12">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Varianten & Modelle</label>
                          <div className="flex flex-wrap gap-3">
                            {result.product.variants.map((v, idx) => (
                              <button 
                                key={idx}
                                onClick={() => {
                                  setSelectedVariant(v);
                                  const newCosts = calculateCosts({ originalPrice: v.priceUSD, estimatedWeightKg: v.weightKg || result.product.estimatedWeightKg });
                                  setResult({ ...result, product: { ...result.product, originalPrice: v.priceUSD }, costs: newCosts });
                                  setEditablePrice(v.priceUSD);
                                }}
                                className={`px-8 py-4 rounded-2xl border-2 transition-all font-black text-xs ${selectedVariant?.label === v.label ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-200'}`}
                              >
                                {v.label} • ${v.priceUSD.toFixed(0)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.product.availableColors && result.product.availableColors.length > 0 && (
                        <div className="mb-12 p-6 sm:p-8 bg-gray-50/50 rounded-[3rem] border border-gray-100">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Verfügbare Farben</label>
                          <div className="flex flex-wrap gap-3">
                            {result.product.availableColors.map((color, idx) => (
                              <button 
                                key={idx}
                                onClick={() => setSelectedColor(color)}
                                className={`px-8 py-4 rounded-2xl border-2 font-black transition-all text-xs ${
                                  selectedColor === color 
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.product.availableSizes && result.product.availableSizes.length > 0 && (
                        <div className="mb-12">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Verfügbare Größen</label>
                          <div className="flex flex-wrap gap-3">
                            {result.product.availableSizes.map((size, idx) => (
                              <button 
                                key={idx}
                                onClick={() => { setSelectedSize(size); setEditableSize(size); }}
                                className={`px-8 py-4 rounded-2xl border-2 font-black transition-all text-xs ${
                                  selectedSize === size 
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105' 
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="bg-gray-900 rounded-[3.5rem] p-8 sm:p-12 text-white shadow-3xl flex flex-col md:flex-row justify-between items-center gap-10 border border-white/5 group relative overflow-hidden mt-auto shrink-0">
                    <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors pointer-events-none"></div>
                    <div className="text-center md:text-left relative z-10">
                      <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">EU-Endpreis (All-In)</p>
                      <p className="text-6xl sm:text-8xl font-black tracking-tighter leading-none group-hover:scale-105 transition-transform">{result.costs.totalPriceEUR.toFixed(2)}€</p>
                    </div>
                    <button 
                      onClick={() => onCheckout({ ...result, selectedSize, selectedColor, selectedVariant: selectedVariant?.label })}
                      className="w-full md:w-auto bg-indigo-600 text-white px-10 sm:px-14 py-6 sm:py-8 rounded-3xl font-black text-2xl sm:text-3xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 relative z-10 border-b-4 border-indigo-800 shrink-0 min-w-[280px]"
                    >
                      Kaufen <ArrowRight size={32} />
                    </button>
                </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-[4rem] p-8 sm:p-12 shadow-2xl border border-gray-100 sticky top-32">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10 text-center">Aufschlüsselung (EUR)</h4>
              <div className="h-64 w-full mb-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={85} outerRadius={115} paddingAngle={10} dataKey="value" stroke="none">
                      {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-6">
                {chartData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-bold text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color.replace('#', 'bg-')}`}></div>
                      {item.name}
                    </div>
                    <span className="text-gray-900">{item.value.toFixed(2)}€</span>
                  </div>
                ))}
                <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-indigo-600 font-black">
                  <span className="text-xs uppercase tracking-widest">Gesamt</span>
                  <span className="text-2xl">{result.costs.totalPriceEUR.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deals.length > 0 && !loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8">
          {deals.map((deal, i) => (
            <div key={i} className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-2xl hover:-translate-y-2 transition-all flex flex-col group">
              <span className="bg-gray-100 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500 w-fit mb-6">{deal.storeName}</span>
              <h4 className="text-4xl font-black text-gray-900 mb-2">${deal.priceUSD.toFixed(2)}</h4>
              <button 
                onClick={() => { setInput(deal.url); runAnalysis(deal.url); }}
                className="mt-auto w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl"
              >
                Kosten Check
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
