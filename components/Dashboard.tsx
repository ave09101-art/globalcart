
import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, ExternalLink, RefreshCw } from 'lucide-react';
import { Order } from '../types';
import { storageService } from '../services/storageService';

const StatusIcon = ({ status }: { status: Order['status'] }) => {
  switch (status) {
    case 'pending': return <Clock size={18} className="text-amber-500" />;
    case 'purchased': return <Package size={18} className="text-blue-500" />;
    case 'at_warehouse': return <MapPin size={18} className="text-indigo-500" />;
    case 'shipped': return <Truck size={18} className="text-purple-500" />;
    case 'delivered': return <CheckCircle size={18} className="text-green-500" />;
  }
};

const StatusLabel = ({ status }: { status: Order['status'] }) => {
  return status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1);
};

export const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(storageService.getOrders());
  }, []);

  const inTransitCount = orders.filter(o => ['pending', 'purchased', 'at_warehouse', 'shipped'].includes(o.status)).length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Meine Bestellungen</h2>
          <p className="text-gray-500 font-medium">Verfolge deine internationalen Pakete in Echtzeit</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-2xl">
              <Package className="text-indigo-600" size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-black uppercase tracking-widest">In Zustellung</p>
              <p className="text-2xl font-black text-gray-900">{inTransitCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-2xl">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Geliefert</p>
              <p className="text-2xl font-black text-gray-900">{deliveredCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Produkt</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order ID</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Gesamtpreis</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bestelldatum</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Package className="text-indigo-600 h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-black text-gray-900 line-clamp-1">{order.productName}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                          {/* Display the selected variant in the order row if it was chosen during checkout */}
                          {order.selectedVariant ? `${order.selectedVariant} • ` : ''}
                          {order.selectedSize ? `${order.selectedSize} • ` : ''} 
                          {order.selectedColor || 'Standard'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-gray-500 font-mono">
                    {order.id}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black bg-white border border-gray-100 shadow-sm uppercase tracking-wider">
                      <StatusIcon status={order.status} />
                      <StatusLabel status={order.status} />
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-black text-indigo-600">
                    {/* Fixed: changed totalCost to totalCostEUR */}
                    ${order.totalCostEUR.toFixed(2)}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-gray-400">
                    {order.date}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                    <button className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <ExternalLink size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {orders.length === 0 && (
          <div className="py-32 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="text-gray-200 animate-spin-slow" size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Noch keine Bestellungen</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Sobald du dein erstes Produkt in den USA bestellst, erscheint es hier in der Liste.</p>
          </div>
        )}
      </div>
    </div>
  );
};
