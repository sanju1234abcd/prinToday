import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, FileCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

const statusBadgeStyles: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-300',
  Printing: 'bg-blue-100 text-blue-800 border-blue-300',
  Dispatched: 'bg-purple-100 text-purple-800 border-purple-300',
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300'
};

export const OrdersPage: React.FC = () => {
  const { orders } = useOrders();

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-6">
          <Link to="/" className="hover:text-brand-blue">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">My Orders & Proofs</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Order History & Proofs
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track live print status, inspect uploaded artwork specs & digital proofs.
            </p>
          </div>
          <Link
            to="/products"
            className="px-4 py-2 bg-brand-green text-white font-bold text-xs rounded-xl shadow hover:bg-brand-green-dark transition hidden sm:inline-flex items-center space-x-1"
          >
            <span>+ New Order</span>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500">
              When you configure and place orders, they will show up here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-brand-blue text-white font-bold text-xs rounded-xl shadow hover:bg-brand-blue-dark transition"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4"
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-extrabold text-brand-blue text-base sm:text-lg">
                        {order.id}
                      </span>
                      <span
                        className={`px-3 py-0.5 border text-xs font-extrabold rounded-full ${
                          statusBadgeStyles[order.status] || 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        ● {order.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Total Payable
                    </span>
                    <span className="text-lg font-extrabold text-slate-900">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item: any, idx: number) => {
                      const thumbnail = item.product?.thumbnail || item.artworkUrl || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=200&q=80';
                      return (
                        <img 
                          key={idx}
                          src={thumbnail} 
                          alt="Product thumbnail" 
                          className="w-10 h-10 rounded-full border-2 border-white object-cover bg-slate-100 shadow-sm"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=200&q=80'; }}
                        />
                      );
                    })}
                    {order.items.length > 3 && (
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm z-10">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-500 font-medium">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </span>
                    <Link
                      to={`/orders/${order.id || order.orderNumber}`}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-blue/10 text-brand-blue font-bold text-xs rounded-xl hover:bg-brand-blue hover:text-white transition-colors"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
