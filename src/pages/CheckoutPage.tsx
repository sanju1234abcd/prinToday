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
  Lock,
  MapPin,
  X
} from 'lucide-react';
import { fetchAddressFromLocation } from '../utils/location';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { ShippingAddress } from '../types';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

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

  const [paymentMethod, setPaymentMethod] = useState('FULL');
  const [locLoading, setLocLoading] = useState(false);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number; discountPercentage: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');
    try {
      const itemIds = cart.map(item => item.product._id || item.product.id);
      const res = await fetch(`${API}/orders/validate-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: couponCode, subtotal: cartSubtotal, itemIds })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid coupon');
      }
      setAppliedCoupon(data.data);
    } catch (err: any) {
      setCouponError(err.message);
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleDetectLocation = async () => {
    setLocLoading(true);
    try {
      const addr = await fetchAddressFromLocation();
      setFormData(prev => ({
        ...prev,
        houseNo: addr.houseNo || prev.houseNo,
        buildingName: addr.buildingName || prev.buildingName,
        streetName: addr.streetName || prev.streetName,
        area: addr.area || prev.area,
        pin: addr.pin || prev.pin,
        state: addr.state || prev.state,
      }));
    } catch (err: any) {
      alert(err.message || 'Failed to detect location. Ensure location access is allowed.');
    } finally {
      setLocLoading(false);
    }
  };

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
    { id: 'FULL', label: '100% Advance Payment', disabled: false }
  ];

  if (user?.accountType === 'INDIVIDUAL' && user.individual?.creditEligible) {
    paymentOptions.push({
      id: '50_PERCENT_ADVANCE',
      label: '30-Day Credit (50% Advance)',
      disabled: false
    });
  }

  if (user?.accountType === 'ORGANIZATION') {
    const isEligible = !!user.organization?.creditEligible;
    paymentOptions.push({
      id: 'ORG_CREDIT',
      label: '30-Day Credit – Pay Later',
      disabled: !isEligible,
      message: !isEligible ? 'Action Required: Pending Admin Approval' : undefined
    });
  }

  const gstAmount = Math.round((cartSubtotal - (appliedCoupon?.discountAmount || 0)) * 0.18);
  const shippingFee = (cartSubtotal - (appliedCoupon?.discountAmount || 0)) > 999 || cart.length === 0 ? 0 : 99;
  const grandTotal = Math.max(0, cartSubtotal - (appliedCoupon?.discountAmount || 0)) + gstAmount + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // backend paymentMethod enum is 'RAZORPAY', 'COD', '30_DAYS_CREDIT'
    const backendPaymentMethod = paymentMethod === 'ORG_CREDIT' ? '30_DAYS_CREDIT' : 'RAZORPAY';

    try {
      const createdOrder = await placeOrder(
        formData, 
        cart, 
        backendPaymentMethod, 
        appliedCoupon?.code, 
        paymentMethod
      );
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-brand-green" />
                    <span>1. Delivery & Tax Invoicing Address</span>
                  </h2>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={locLoading}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-dark transition disabled:opacity-50"
                  >
                    <MapPin className="w-4 h-4" />
                    {locLoading ? 'Detecting...' : 'Detect Location'}
                  </button>
                </div>

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

                {/* Coupon Section */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Have a coupon?</h3>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-brand-green/10 border border-brand-green/20 rounded-xl">
                      <div>
                        <p className="text-xs font-bold text-brand-green flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Coupon '{appliedCoupon.code}' Applied
                        </p>
                        <p className="text-[10px] text-emerald-700 mt-0.5">
                          {appliedCoupon.discountPercentage}% off your order!
                        </p>
                      </div>
                      <button 
                        type="button" 
                        onClick={handleRemoveCoupon}
                        className="text-[10px] text-rose-500 hover:text-rose-700 font-bold underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter Coupon Code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm uppercase placeholder:normal-case focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={!couponCode || validatingCoupon}
                          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors"
                        >
                          {validatingCoupon ? 'Applying...' : 'Apply'}
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[10px] text-rose-500 font-bold">{couponError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{cartSubtotal.toLocaleString()}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-brand-green font-semibold">
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                      <span>-₹{appliedCoupon.discountAmount.toLocaleString()}</span>
                    </div>
                  )}

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
                  <span>
                    {paymentMethod === 'ORG_CREDIT' 
                      ? 'Place Order on 30-Day Credit' 
                      : 'Place Order'}
                  </span>
                </button>
                <p className="text-[11px] text-center font-bold text-slate-500">
                  Our team will contact you for payment via WhatsApp/Call.
                </p>
              </div>

            </div>

          </form>
        )}
      </div>
    </div>
  );
};
