
import React from 'react';
import { ShoppingCart, Globe, LayoutDashboard, Search, User } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => setView(AppView.LANDING)}>
            <div className="bg-indigo-600 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-100">
              <Globe className="text-white h-6 w-6" />
            </div>
            <div className="ml-3">
              <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-600">
                GlobalCart
              </span>
              <div className="flex items-center gap-1.5 -mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Systems Online</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-10">
            <button 
              onClick={() => setView(AppView.CALCULATOR)}
              className={`text-sm font-black uppercase tracking-widest transition-colors ${currentView === AppView.CALCULATOR ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-900'}`}
            >
              Calculator
            </button>
            <button 
              onClick={() => setView(AppView.DASHBOARD)}
              className={`text-sm font-black uppercase tracking-widest transition-colors ${currentView === AppView.DASHBOARD ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-900'}`}
            >
              My Orders
            </button>
            <div className="h-4 w-[1px] bg-gray-200"></div>
            <button className="flex items-center gap-2 text-sm font-black text-gray-900 hover:text-indigo-600 transition-colors">
              <User size={18} />
              Sign In
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView(AppView.CALCULATOR)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-100 active:scale-95"
            >
              <Search size={18} />
              <span className="hidden sm:inline">Start Shopping</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
