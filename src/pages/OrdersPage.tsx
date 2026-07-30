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

                {/* Items in order */}
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div
                      key={item.cartItemId}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center space-x-4"
                    >
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />

                      <div className="flex-1 text-xs space-y-0.5">
                        <h4 className="font-bold text-slate-900">{item.product.title}</h4>
                        {item.customDimensions && (
                          <p className="text-[11px] text-slate-500">
                            Size: {item.customDimensions.width} × {item.customDimensions.height} {item.customDimensions.unit} ({item.customDimensions.totalSqFt} SqFt)
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500">
                          Qty: <strong>{item.quantity}</strong> | Price: <strong>₹{item.totalPrice}</strong>
                        </p>

                        {item.artworkFile && (
                          <div className="pt-1 flex items-center space-x-1 text-[10px] text-brand-green font-bold">
                            <FileCheck className="w-3 h-3" />
                            <span>Artwork Attached: {item.artworkFile.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Details */}
                <div className="pt-2 text-xs text-slate-600 flex flex-col sm:flex-row justify-between gap-2 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800">Ship To: </span>
                    <span>{order.shippingAddress.fullName}, {order.shippingAddress.city} ({order.shippingAddress.pincode})</span>
                  </div>

                  <div className="text-slate-500">
                    Payment Method: <strong className="text-slate-800">{order.paymentMethod}</strong>
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
