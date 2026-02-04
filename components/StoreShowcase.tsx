
import React, { useState } from 'react';
import { ExternalLink, ShoppingBag, Zap, Star, Monitor, Shirt, Sparkles, Tent } from 'lucide-react';

interface Store {
  name: string;
  url: string;
  category: 'Tech' | 'Fashion' | 'Beauty' | 'Outdoor' | 'General';
  description: string;
  logo: string;
  hot?: boolean;
}

const stores: Store[] = [
  { name: 'Amazon US', url: 'https://www.amazon.com', category: 'General', description: 'Die größte Auswahl weltweit. Viele Deals gibt es nur hier.', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', hot: true },
  { name: 'Best Buy', url: 'https://www.bestbuy.com', category: 'Tech', description: 'Exklusive Technik & Gadgets, oft Monate vor EU-Release.', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg' },
  { name: 'Nike US', url: 'https://www.nike.com/us', category: 'Fashion', description: 'Sneaker-Modelle und Colorways, die nie nach Europa kommen.', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Nike_logo.svg', hot: true },
  { name: 'Sephora US', url: 'https://www.sephora.com', category: 'Beauty', description: 'Brands wie Rare Beauty oder Fenty oft mit US-exklusiven Sets.', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Sephora_logo.svg' },
  { name: 'REI', url: 'https://www.rei.com', category: 'Outdoor', description: 'High-End Outdoor-Ausrüstung von Marken wie Patagonia & Arc\'teryx.', logo: 'https://upload.wikimedia.org/wikipedia/en/3/3b/REI_logo.svg' },
  { name: 'StockX', url: 'https://stockx.com', category: 'Fashion', description: 'Der Marktplatz für limitierte Sneaker und Streetwear.', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/StockX_logo.svg', hot: true },
  { name: 'Urban Outfitters', url: 'https://www.urbanoutfitters.com', category: 'Fashion', description: 'Retro-Style und Home-Decor mit speziellem US-Vibe.', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Urban_Outfitters_logo.svg' },
  { name: 'B&H Photo', url: 'https://www.bhphotovideo.com', category: 'Tech', description: 'Das Mekka für Kameras und Profi-Equipment.', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/B%26H_Photo_Video_logo.svg/1200px-B%26H_Photo_Video_logo.svg.png' },
];

export const StoreShowcase: React.FC<{ onAnalyzeClick: () => void }> = ({ onAnalyzeClick }) => {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Tech', 'Fashion', 'Beauty', 'Outdoor'];

  const filteredStores = filter === 'All' 
    ? stores 
    : stores.filter(s => s.category === filter);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-6">
              Inspiration gesucht? <br/><span className="text-indigo-600">Shoppe wie ein Local.</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Hier sind die beliebtesten US-Stores unserer Kunden. Finde dein Wunschprodukt, kopiere den Link und lass es uns nach Hause liefern.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                  filter === c 
                    ? 'bg-gray-900 border-gray-900 text-white shadow-xl scale-105' 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredStores.map((store, i) => (
            <div 
              key={i} 
              className="group relative bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2 overflow-hidden flex flex-col h-full"
            >
              {store.hot && (
                <div className="absolute top-6 right-6 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-red-200">
                  <Zap size={10} className="fill-current" /> Hot
                </div>
              )}
              
              <div className="mb-8 h-12 flex items-center justify-start">
                <img src={store.logo} alt={store.name} className="h-full w-auto max-w-[120px] object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="mb-6 flex-grow">
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{store.category}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{store.name}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{store.description}</p>
              </div>

              <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
                <a 
                  href={store.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-white border border-gray-200 text-gray-900 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white transition-all group/btn shadow-sm"
                >
                  Store besuchen
                  <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
                <button 
                  onClick={onAnalyzeClick}
                  className="w-full bg-indigo-50 text-indigo-700 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all"
                >
                  <ShoppingBag size={14} />
                  Analyse starten
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gray-900 rounded-[3rem] p-12 text-center relative overflow-hidden group">
           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
           <div className="relative z-10">
              <div className="bg-indigo-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white mb-4 tracking-tight">Finde deinen eigenen Favoriten.</h3>
              <p className="text-gray-400 max-w-xl mx-auto font-medium mb-10">
                Egal ob Special-Interests, Sammlerstücke oder US-Fashion: <br/>Kopiere einfach den Link aus einem beliebigen US-Shop und unser Kalkulator erledigt den Rest.
              </p>
              <button 
                onClick={onAnalyzeClick}
                className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-50 transition-all shadow-2xl active:scale-95 flex items-center gap-3 mx-auto"
              >
                Zum Kalkulator
                <Zap size={20} className="text-indigo-600 fill-current" />
              </button>
           </div>
        </div>
      </div>
    </section>
  );
};
