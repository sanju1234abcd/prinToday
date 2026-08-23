import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Trash2,
  ChevronRight,
  ArrowRight,
  FileCheck,
  Building2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { ShippingAddress } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartSubtotal } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    gstin: '',
    houseNo: '',
    buildingName: '',
    streetName: '',
    area: '',
    state: '',
    pin: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI / Online Payment');

  useEffect(() => {
    if (user) {
      const address = user.accountType === 'ORGANIZATION' ? user.organization?.address : user.individual?.address;
      setFormData({
        fullName: user.accountType === 'ORGANIZATION' ? (user.organization?.contactName || '') : (user.individual?.name || ''),
        email: user.email || '',
        phone: user.mobileNumber || '',
        gstin: user.accountType === 'ORGANIZATION' ? (user.organization?.gstin || '') : '',
        houseNo: address?.houseNo || '',
        buildingName: address?.buildingName || '',
        streetName: address?.streetName || '',
        area: address?.area || '',
        state: '',
        pin: address?.pin || ''
      });
    }
  }, [user]);

  // Payment constraints
  interface PaymentOption {
    id: string;
    label: string;
    disabled: boolean;
    message?: string;
  }

  const paymentOptions: PaymentOption[] = [
    { id: 'UPI / Online Payment', label: 'UPI / Online Payment', disabled: false },
    { id: 'Credit / Debit Card', label: 'Credit / Debit Card', disabled: false },
    { id: 'Net Banking', label: 'Net Banking', disabled: false }
  ];

  if (user?.accountType === 'ORGANIZATION') {
    const isEligible = !!user.organization?.creditEligible;
    paymentOptions.push({
      id: '30 Days Credit (50% Advance)',
      label: '30 Days Credit (50% Advance)',
      disabled: !isEligible,
      message: !isEligible ? 'Action Required: Pending Admin Approval' : undefined
    });
  }

  const gstAmount = Math.round(cartSubtotal * 0.18);
  const shippingFee = cartSubtotal > 999 || cart.length === 0 ? 0 : 99;
  const grandTotal = cartSubtotal + gstAmount + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // The backend uses 'COD', 'RAZORPAY', '30_DAYS_CREDIT'
    const backendPaymentMethod = paymentMethod === '30 Days Credit (50% Advance)' ? '30_DAYS_CREDIT' : 'RAZORPAY';

    try {
      const createdOrder = await placeOrder(formData, cart, backendPaymentMethod);
      clearCart();
      navigate('/order-success', { state: { order: createdOrder } });
    } catch (error: any) {
      console.error('Order creation failed:', error);
      alert(`Order creation failed: ${error.message || 'Please try again.'}`);
    }
  };

  if (!user) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Sign In Required</h2>
          <p className="text-slate-500 font-medium">
            You must be logged in to securely place your order and track its status.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate('/')} // Or open modal if it was global, but we can just send to home
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-brand-blue text-white font-bold rounded-xl shadow-lg shadow-brand-blue/30 hover:shadow-brand-blue/50 hover:-translate-y-0.5 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Go to Home & Sign In</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-6">
          <Link to="/" className="hover:text-brand-blue">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">Checkout & Payment</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
          Order Checkout Summary
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Truck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
            <p className="text-xs text-slate-500">
              You have no configured print items in your shopping cart.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-blue text-white font-bold text-xs rounded-xl shadow hover:bg-brand-blue-dark transition"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Delivery Form & Payment Selection */}
            <div className="lg:col-span-7 space-y-6">

              {/* Shipping Address Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <Truck className="w-5 h-5 text-brand-green" />
                  <span>1. Delivery & Tax Invoicing Address</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
                      <span>GSTIN for Corporate Tax Invoice (Optional)</span>
                      <Building2 className="w-3.5 h-3.5 text-brand-green" />
                    </label>
                    <input
                      type="text"
                      name="gstin"
                      placeholder="e.g. 07AAAAA0000A1Z5"
                      value={formData.gstin}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-brand-blue outline-none uppercase"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">House / Flat No.</label>
                    <input
                      type="text"
                      name="houseNo"
                      required
                      placeholder="e.g. Flat 4B, Shop No. 12"
                      value={formData.houseNo}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Building / Society Name (Optional)</label>
                    <input
                      type="text"
                      name="buildingName"
                      placeholder="e.g. Sunrise Heights, M.G. Plaza"
                      value={formData.buildingName || ''}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Street / Road Name</label>
                    <input
                      type="text"
                      name="streetName"
                      required
                      placeholder="e.g. MG Road, Link Road"
                      value={formData.streetName}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Area / City</label>
                    <input
                      type="text"
                      name="area"
                      required
                      placeholder="e.g. Andheri, Bandra"
                      value={formData.area}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Pincode</label>
                    <input
                      type="text"
                      name="pin"
                      required
                      placeholder="e.g. 400001"
                      value={formData.pin}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <Lock className="w-5 h-5 text-brand-blue" />
                  <span>2. Payment Option</span>
                </h2>

                <div className="space-y-2">
                  {paymentOptions.map(option => (
                    <label
                      key={option.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition text-xs font-bold ${
                          option.disabled ? 'opacity-60 cursor-not-allowed border-slate-200 bg-slate-100 grayscale' :
                          paymentMethod === option.id
                          ? 'cursor-pointer border-brand-blue bg-brand-blue/5 text-brand-blue ring-2 ring-brand-blue/20'
                          : 'cursor-pointer border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          disabled={option.disabled}
                          checked={paymentMethod === option.id}
                          onChange={() => !option.disabled && setPaymentMethod(option.id)}
                          className="accent-brand-blue"
                        />
                        <div className="flex flex-col">
                          <span className={option.disabled ? 'text-slate-500 line-through decoration-slate-300' : ''}>{option.label}</span>
                          {option.message && (
                            <span className="text-[10px] text-rose-500 font-bold mt-0.5 uppercase tracking-wider">{option.message}</span>
                          )}
                        </div>
                      </div>
                      {!option.disabled && <span className="text-[10px] text-brand-green font-semibold">100% Secure</span>}
                      {option.disabled && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Order Review & Total Calculation */}
            <div className="lg:col-span-5 space-y-6">

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Cart Items ({cart.length})
                </h2>

                {/* Items List */}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div
                      key={item.cartItemId}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex space-x-3 relative"
                    >
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />

                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-slate-900 text-xs line-clamp-1 pr-4">
                            {item.product.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Specs */}
                        <div className="text-[10px] text-slate-500 space-y-0.5">
                          {item.customDimensions && (
                            <p>
                              Size: {item.customDimensions.width} × {item.customDimensions.height} {item.customDimensions.unit} ({item.customDimensions.totalSqFt} SqFt)
                            </p>
                          )}
                          {Object.entries(item.selectedVariants).map(([k, v]) => (
                            <p key={k}>
                              {k}: <strong className="text-slate-700">{v}</strong>
                            </p>
                          ))}
                        </div>

                        {/* Uploaded Artwork Badge */}
                        {item.artworkFile && (
                          <div className="mt-1 flex items-center space-x-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                            <FileCheck className="w-3 h-3 inline mr-1" />
                            <span>Artwork: {item.artworkFile.name}</span>
                          </div>
                        )}

                        <div className="pt-2 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] text-slate-500 font-semibold">Qty:</span>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={e => updateQuantity(item.cartItemId, Number(e.target.value))}
                              className="w-16 px-2 py-0.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center"
                            />
                          </div>

                          <span className="font-extrabold text-brand-blue text-xs sm:text-sm">
                            ₹{item.totalPrice.toLocaleString()}
                          </span>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{cartSubtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>GST (18% Input Tax Credit)</span>
                    <span className="font-semibold text-slate-900">₹{gstAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Express Priority Shipping</span>
                    <span className="font-semibold text-emerald-600">
                      {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
                    <span className="font-extrabold text-slate-900">Total Payable</span>
                    <span className="text-2xl font-extrabold text-brand-blue">
                      ₹{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-brand-green to-emerald-600 hover:from-emerald-600 hover:to-brand-green text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-green/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Place Order & Generate Receipt</span>
                </button>

              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};
