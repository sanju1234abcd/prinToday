import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Download, 
  FileCheck,
  MapPin,
  CreditCard
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { Order } from '../types';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, loadingOrders } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orders.length > 0 && id) {
      const foundOrder = orders.find((o) => o.id === id || o._id === id || o.orderNumber === id);
      setOrder(foundOrder || null);
    }
  }, [orders, id]);

  if (loadingOrders) {
    return (
      <div className="py-20 flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-slate-500 font-bold animate-pulse">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
          <p className="text-slate-500 text-sm">We couldn't find the order you're looking for.</p>
          <Link to="/orders" className="inline-block mt-4 px-6 py-2 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-blue-dark transition">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusMap = {
    'PLACED': { icon: Package, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Order Placed' },
    'PROCESSING': { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Processing' },
    'SHIPPED': { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-100', label: 'Shipped' },
    'DELIVERED': { icon: CheckCircle2, color: 'text-brand-green', bg: 'bg-emerald-100', label: 'Delivered' }
  };

  // Fallback for older mock data
  const normalizedStatus = (order.orderStatus || order.status || 'PLACED').toUpperCase();
  const validStatus = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(normalizedStatus) 
    ? normalizedStatus 
    : 'PLACED';

  const statusIndex = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(validStatus);

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-brand-blue">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/orders" className="hover:text-brand-blue">My Orders</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">{order.orderNumber || order.id}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Order #{order.orderNumber || order.id}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Amount</span>
              <span className="text-2xl font-extrabold text-brand-blue">₹{order.totalAmount?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md">
          <h3 className="text-sm font-bold text-slate-900 mb-8 border-b border-slate-100 pb-3">Order Status</h3>
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-brand-green -translate-y-1/2 rounded-full transition-all duration-500"
              style={{ width: `${(statusIndex / 3) * 100}%` }}
            />
            
            <div className="relative flex justify-between">
              {['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((step, idx) => {
                const stepDetails = statusMap[step as keyof typeof statusMap];
                const Icon = stepDetails.icon;
                const isCompleted = idx <= statusIndex;
                const isCurrent = idx === statusIndex;
                
                let expectedDateStr = '';
                if (step === 'PROCESSING' && order.expectedProcessingTime) {
                  expectedDateStr = new Date(order.expectedProcessingTime).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                } else if (step === 'SHIPPED' && order.expectedShippingTime) {
                  expectedDateStr = new Date(order.expectedShippingTime).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                } else if (step === 'DELIVERED' && order.expectedDeliveryTime) {
                  expectedDateStr = new Date(order.expectedDeliveryTime).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                }

                return (
                  <div key={step} className="flex flex-col items-center flex-1 text-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-colors duration-300 mx-auto
                        ${isCompleted ? stepDetails.bg + ' ' + stepDetails.color : 'bg-slate-100 text-slate-300'}
                        ${isCurrent ? 'ring-4 ring-slate-50 scale-110' : ''}
                      `}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] sm:text-xs font-bold mt-3 block ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                      {stepDetails.label}
                    </span>
                    {expectedDateStr && (
                      <span className="text-[9px] sm:text-[10px] text-brand-blue font-semibold mt-1 block">
                        Exp. {expectedDateStr}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Items */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item: any, idx: number) => {
                const title = item.product?.title || item.title || 'Product';
                const thumbnail = item.product?.thumbnail || item.artworkUrl || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=200&q=80';
                const totalPrice = item.totalPrice ?? item.itemTotalPrice ?? 0;
                const unitPrice = item.unitPrice ?? item.calculatedUnitPrice ?? 0;

                return (
                  <div key={item.cartItemId || item.productId || idx} className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <img
                      src={thumbnail}
                      alt={title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=200&q=80'; }}
                    />
                    
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-slate-900">{title}</h4>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                        {item.customDimensions && (
                          <span>Size: {item.customDimensions.width} × {item.customDimensions.height} {item.customDimensions.unit}</span>
                        )}
                        {item.dimensions && (
                          <span>Size: {item.dimensions.widthFt} × {item.dimensions.heightFt} ft</span>
                        )}
                        <span>Qty: <strong>{item.quantity}</strong></span>
                        <span>Unit: <strong>₹{unitPrice}</strong></span>
                      </div>

                      {item.artworkUrl && (
                        <div className="pt-2 mt-2 border-t border-slate-200/60">
                          <a 
                            href={item.artworkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white rounded-lg text-[10px] font-bold transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Artwork</span>
                          </a>
                        </div>
                      )}
                      
                      {item.artworkFile && !item.artworkUrl && (
                        <div className="pt-2 flex items-center space-x-1 text-[10px] text-brand-green font-bold">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Artwork Attached: {item.artworkFile.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right shrink-0 mt-2 sm:mt-0">
                      <span className="text-xs text-slate-400 block font-semibold mb-0.5">Item Total</span>
                      <span className="font-extrabold text-slate-900">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Order Summary */}
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <div className="w-full sm:w-64 space-y-2 text-sm">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>GST (18%)</span>
                  <span>₹{order.gstAmount?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium pb-2 border-b border-slate-100">
                  <span>Shipping</span>
                  <span>{order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold pt-1 text-lg">
                  <span>Total</span>
                  <span>₹{order.totalAmount?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-brand-green" />
              <h3 className="text-sm font-bold text-slate-900">Delivery Address</h3>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <p className="font-bold text-slate-900 text-sm">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.email}</p>
              <p>{order.shippingAddress?.phone}</p>
              <div className="pt-2">
                <p>{order.shippingAddress?.houseNo}</p>
                {order.shippingAddress?.buildingName && <p>{order.shippingAddress.buildingName}</p>}
                <p>{order.shippingAddress?.streetName}</p>
                <p>{order.shippingAddress?.area}</p>
                <p className="font-semibold text-slate-800">PIN: {order.shippingAddress?.pin}</p>
              </div>
              {order.shippingAddress?.gstin && (
                <div className="mt-3 pt-3 border-t border-slate-100 inline-block">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-0.5">GSTIN</span>
                  <span className="font-mono text-slate-800 font-semibold">{order.shippingAddress.gstin}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-brand-blue" />
              <h3 className="text-sm font-bold text-slate-900">Payment Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-0.5">Method</span>
                <span className="font-semibold text-slate-800 text-sm">{order.paymentMethod}</span>
              </div>
              
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-0.5">Status</span>
                <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-extrabold ${
                  order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                  order.paymentStatus === 'FAILED' ? 'bg-rose-100 text-rose-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {order.paymentStatus || 'PENDING'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
