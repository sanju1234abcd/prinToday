import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Printer,
  Truck,
  ArrowRight,
  Download,
  Building2,
  PhoneCall
} from 'lucide-react';
import { Order } from '../types';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const order: Order | undefined = location.state?.order;

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-center">
          
          <div className="w-20 h-20 rounded-full bg-brand-green/15 text-brand-green flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 bg-brand-green/10 text-brand-green-dark font-extrabold text-xs rounded-full inline-block">
              Order Confirmed & Placed!
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Order <strong className="text-brand-blue font-mono">{order.id}</strong> has been received and queued for design proofing & printing.
            </p>
          </div>

          {/* Timeline Status Tracker */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-xs font-bold text-slate-700 mb-4 text-left">Live Order Workflow</p>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center mx-auto">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-brand-green font-extrabold block">Order Placed</span>
              </div>
              <div className="space-y-1 opacity-60">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                  <Printer className="w-4 h-4" />
                </div>
                <span className="block">Printing</span>
              </div>
              <div className="space-y-1 opacity-60">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="block">Dispatched</span>
              </div>
              <div className="space-y-1 opacity-60">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="block">Delivered</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="text-left bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Recipient Name</span>
              <span className="font-bold text-slate-900">{order.shippingAddress.fullName}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Delivery Address</span>
              <span className="font-semibold text-slate-900 text-right max-w-xs">
                {[order.shippingAddress.houseNo, order.shippingAddress.streetName, order.shippingAddress.area].filter(Boolean).join(', ')} — PIN {order.shippingAddress.pin}
              </span>
            </div>

            {order.shippingAddress.gstin && (
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-brand-green" />
                  <span>GSTIN Invoice</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{order.shippingAddress.gstin}</span>
              </div>
            )}

            <div className="flex justify-between pt-1 text-sm font-extrabold">
              <span className="text-slate-900">Total Amount Paid</span>
              <span className="text-brand-blue">₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              to="/orders"
              className="flex-1 py-3 bg-brand-navy hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2"
            >
              <span>Track All Orders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products"
              className="flex-1 py-3 bg-brand-green hover:bg-brand-green-dark text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
