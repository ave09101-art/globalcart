
import React, { useState, useEffect } from 'react';
import { ArrowRight, Package, ShieldCheck, Zap, Globe, Star, CheckCircle } from 'lucide-react';

export const Hero: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [tickerIndex, setTickerIndex] = useState(0);
  
  const recentOrders = [
    { location: "Berlin, DE", time: "Gerade eben", item: "Yeti Rambler 30oz", icon: "🇩🇪" },
    { location: "Paris, FR", time: "Vor 12 Min.", item: "Nike Air Max US-Edition", icon: "🇫🇷" },
    { location: "Wien, AT", time: "Vor 34 Min.", item: "Apple Watch Ultra 2", icon: "🇦🇹" },
    { location: "München, DE", time: "Vor 1 Std.", item: "Levi's 501 US-Import", icon: "🇩🇪" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % recentOrders.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative bg-white overflow-hidden pb-12 sm:pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              USA Shopping Concierge jetzt aktiv
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl tracking-tighter font-black text-gray-900 leading-[0.85]">
              <span className="block mb-2">Shopping ohne</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800">Grenzen.</span>
            </h1>
            
            <p className="mt-8 text-lg sm:text-xl text-gray-500 font-medium leading-relaxed max-w-2xl">
              Dein persönlicher Zugang zu jedem Online-Shop in den USA. Wir kaufen ein, prüfen die Qualität und liefern verzollt direkt vor deine Haustür.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-6">
              <button
                onClick={onGetStarted}
                className="group relative px-10 py-6 bg-gray-900 text-white text-xl font-black rounded-3xl overflow-hidden shadow-2xl transition-all hover:scale-105 active:scale-95 text-center"
              >
                <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="relative z-10 flex items-center justify-center gap-3">
                  Jetzt Analysieren
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <div className="glass-card px-8 py-5 rounded-3xl flex items-center justify-center gap-4 border border-gray-100">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <img key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100" src={`https://i.pravatar.cc/100?img=${i+15}`} alt="user" />
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">4.9/5 TrustScore</p>
                </div>
              </div>
            </div>

            {/* Order Ticker */}
            <div className="mt-16 h-14 overflow-hidden relative max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white to-transparent z-10"></div>
              <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent z-10"></div>
              <div 
                className="transition-transform duration-1000 ease-in-out" 
                style={{ transform: `translateY(-${tickerIndex * 56}px)` }}
              >
                {recentOrders.map((order, i) => (
                  <div key={i} className="h-14 flex items-center gap-4 text-sm font-bold text-gray-400">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-gray-900 leading-none mb-1">{order.icon} {order.item}</span>
                      <span className="text-[10px] uppercase tracking-widest opacity-60">Bestellt nach {order.location} • {order.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-16 lg:mt-0 lg:col-span-5 relative hidden lg:block">
            <div className="relative group animate-float">
              <div className="absolute -inset-6 bg-indigo-500/10 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative bg-white p-4 rounded-[3.5rem] shadow-2xl border border-gray-100">
                <img
                  className="rounded-[3rem] w-full h-[540px] object-cover"
                  src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=1000"
                  alt="Premium Product"
                />
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-t from-indigo-900/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-12 left-12 right-12">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl text-white">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-white p-2 rounded-xl text-indigo-600">
                        <Zap size={20} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">Global Express</span>
                    </div>
                    <p className="text-2xl font-black leading-tight">Von Miami bis an deine Tür in 5-8 Tagen.</p>
                  </div>
                </div>
              </div>

              {/* Security Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-white px-6 py-4 rounded-3xl shadow-2xl border border-gray-50 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-xl text-green-600">
                  <ShieldCheck size={24} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-gray-900 leading-none">Vollversichert</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">US-Warehouse Proof</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Retailer Strip */}
      <div className="max-w-7xl mx-auto px-4 border-t border-gray-50 pt-16">
        <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-12">Empfohlene US-Retailer</p>
        <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" className="h-6" alt="Amazon" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/eBay_logo.png" className="h-8" alt="eBay" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6" alt="PayPal" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Nike_logo.svg" className="h-6" alt="Nike" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Apple_logo_grey.svg" className="h-6" alt="Apple" />
        </div>
      </div>
    </div>
  );
};
