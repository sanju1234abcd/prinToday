import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  UploadCloud,
  FileCheck,
  Calculator,
  ChevronRight,
  ShieldCheck,
  Truck,
  Star,
  CheckCircle2,
  ShoppingCart,
  Zap,
  Info,
  X
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useOrders();
  const { addToCart } = useCart();

  const product = products.find(p => p.id === id) || products[0];
  const { requirements } = product;

  // State: Custom Dimensions
  const [width, setWidth] = useState<number>(requirements.defaultWidth || 6);
  const [height, setHeight] = useState<number>(requirements.defaultHeight || 3);
  const [dimensionUnit] = useState<'ft' | 'in'>(requirements.dimensionUnit || 'ft');

  // State: Selected Variant Options
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (requirements.variantOptions) {
      requirements.variantOptions.forEach(opt => {
        initial[opt.name] = opt.defaultOption || opt.options[0].label;
      });
    }
    return initial;
  });

  // State: Quantity
  const [quantity, setQuantity] = useState<number>(product.minQuantity || 1);

  // State: Uploaded Artwork File
  const [artworkFile, setArtworkFile] = useState<{
    name: string;
    size: number;
    type: string;
    previewUrl?: string;
  } | null>(null);

  // Ref for GSAP Price Animation
  const priceDisplayRef = useRef<HTMLSpanElement>(null);

  // Calculate Square Footage
  const totalSqFt = useMemo(() => {
    if (!requirements.requiresCustomDimensions) return 1;
    let wFt = width;
    let hFt = height;
    if (dimensionUnit === 'in') {
      wFt = width / 12;
      hFt = height / 12;
    }
    return Math.max(0.1, Number((wFt * hFt).toFixed(2)));
  }, [width, height, dimensionUnit, requirements.requiresCustomDimensions]);

  // Calculate Unit & Total Price
  const { unitPrice, totalPrice, discountPercent } = useMemo(() => {
    let base = product.basePrice;

    // Per SqFt adjustment
    if (product.pricingType === 'per_sqft') {
      base = base * totalSqFt;
    }

    // Apply Variant Adjustments
    if (requirements.variantOptions) {
      requirements.variantOptions.forEach(optGroup => {
        const selectedLabel = selectedVariants[optGroup.name];
        const match = optGroup.options.find(o => o.label === selectedLabel);
        if (match) {
          if (match.extraPrice) base += match.extraPrice;
          if (match.priceMultiplier) base *= match.priceMultiplier;
        }
      });
    }

    // Tiered Quantity Discounts
    let discount = 0;
    if (quantity >= 1000) discount = 0.20; // 20% OFF
    else if (quantity >= 500) discount = 0.15; // 15% OFF
    else if (quantity >= 250) discount = 0.10; // 10% OFF
    else if (quantity >= 10) discount = 0.05; // 5% OFF

    const unitPriceCalc = base * (1 - discount);
    const totalPriceCalc = Math.round(unitPriceCalc * quantity);

    return {
      unitPrice: unitPriceCalc,
      totalPrice: totalPriceCalc,
      discountPercent: discount * 100
    };
  }, [product, totalSqFt, selectedVariants, quantity, requirements.variantOptions]);

  // GSAP Price Pulse Animation when totalPrice changes
  useGSAP(() => {
    if (priceDisplayRef.current) {
      gsap.fromTo(
        priceDisplayRef.current,
        { scale: 1.2, color: '#00C853' },
        { scale: 1, color: '#1B00B2', duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [totalPrice]);

  // Handle Drag & Drop File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const previewUrl = isImage ? URL.createObjectURL(file) : undefined;
      setArtworkFile({
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl
      });
    }
  };

  const handleAddToCart = () => {
    addToCart({
      product,
      customDimensions: requirements.requiresCustomDimensions
        ? { width, height, unit: dimensionUnit, totalSqFt }
        : undefined,
      selectedVariants,
      artworkFile: artworkFile || undefined,
      quantity,
      unitPrice,
      totalPrice
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-6">
          <Link to="/" className="hover:text-brand-blue">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-brand-blue">Catalog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 truncate max-w-xs">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Product Showcase & Artwork Uploader */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Product Image */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-md">
              <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-4 left-4 flex flex-col space-y-1">
                  {product.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-brand-navy/90 backdrop-blur-md text-white text-xs font-extrabold rounded-lg shadow"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Artwork File Upload Box */}
            {requirements.requiresArtworkUpload && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                    <UploadCloud className="w-4 h-4 text-brand-green" />
                    <span>Upload Print Artwork File</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    PDF, PNG, JPG
                  </span>
                </div>

                {!artworkFile ? (
                  <label className="border-2 border-dashed border-slate-300 hover:border-brand-blue rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition group">
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-brand-blue mb-2 group-hover:scale-110 transition" />
                    <p className="text-xs font-bold text-slate-700">
                      Click to upload or drag & drop artwork file
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Max file size 50MB (300 DPI recommended)
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="bg-brand-green/10 border border-brand-green/30 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3 truncate">
                      {artworkFile.previewUrl ? (
                        <img
                          src={artworkFile.previewUrl}
                          alt="Artwork Preview"
                          className="w-12 h-12 rounded-lg object-cover border border-brand-green/40"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-brand-green text-white flex items-center justify-center">
                          <FileCheck className="w-5 h-5" />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {artworkFile.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {(artworkFile.size / (1024 * 1024)).toFixed(2)} MB • File Ready
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setArtworkFile(null)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-full hover:bg-white"
                      title="Remove artwork"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Guarantees Box */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-green" />
                <span>Free 2D Digital Proofing sent before printing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-brand-blue" />
                <span>Standard Dispatch: {product.turnaroundTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>100% Quality & Material Guarantee</span>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Configurator Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-amber-500 mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-extrabold text-xs text-slate-900">{product.rating}</span>
                  <span className="text-xs text-slate-400">({product.reviewsCount} reviews)</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {product.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price Calculation Display Banner */}
              <div className="p-4 bg-gradient-to-r from-brand-blue-soft/50 via-slate-50 to-brand-green/10 rounded-2xl border border-brand-blue/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Calculated Price ({quantity} {product.pricingType === 'per_sqft' ? 'units' : 'pcs'})
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span
                      ref={priceDisplayRef}
                      className="text-3xl sm:text-4xl font-extrabold text-brand-blue"
                    >
                      ₹{totalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500">
                      (₹{unitPrice.toFixed(2)} / unit)
                    </span>
                  </div>
                </div>

                {discountPercent > 0 && (
                  <span className="px-3 py-1 bg-brand-green text-white font-extrabold text-xs rounded-full shadow animate-pulse">
                    {discountPercent}% BULK DISCOUNT
                  </span>
                )}
              </div>

              {/* DYNAMIC FORM SECTION 1: Custom Dimensions */}
              {requirements.requiresCustomDimensions && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-900 text-sm flex items-center space-x-1.5">
                      <Calculator className="w-4 h-4 text-brand-green" />
                      <span>Custom Dimensions ({dimensionUnit === 'ft' ? 'Feet' : 'Inches'})</span>
                    </label>
                    <span className="text-xs font-bold text-brand-blue bg-brand-blue-soft px-2.5 py-0.5 rounded-full">
                      Total Area: {totalSqFt} Sq.Ft
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                        Width ({dimensionUnit})
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={width}
                        onChange={e => setWidth(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                        Height ({dimensionUnit})
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={height}
                        onChange={e => setHeight(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-brand-blue focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC FORM SECTION 2: Variant Options Dropdowns */}
              {requirements.variantOptions && requirements.variantOptions.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  {requirements.variantOptions.map((optGroup, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <label className="font-bold text-slate-800 text-xs flex justify-between">
                        <span>{optGroup.name}</span>
                        <span className="text-brand-blue font-semibold">
                          {selectedVariants[optGroup.name]}
                        </span>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {optGroup.options.map((opt, i) => {
                          const isSelected = selectedVariants[optGroup.name] === opt.label;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() =>
                                setSelectedVariants(prev => ({
                                  ...prev,
                                  [optGroup.name]: opt.label
                                }))
                              }
                              className={`p-3 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                                isSelected
                                  ? 'border-brand-blue bg-brand-blue/5 text-brand-blue ring-2 ring-brand-blue/20'
                                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {opt.extraPrice ? (
                                <span className="text-[10px] text-slate-500 font-bold">
                                  +₹{opt.extraPrice}
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* DYNAMIC FORM SECTION 3: Quantity Selector */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="font-bold text-slate-800 text-xs block">
                  Select Quantity
                </label>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2">
                  {product.quantityPresets.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuantity(preset)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                        quantity === preset
                          ? 'bg-brand-blue text-white shadow'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {preset} Pcs
                    </button>
                  ))}
                </div>

                {/* Custom Quantity Input */}
                <div className="flex items-center space-x-3 pt-2">
                  <span className="text-xs text-slate-500 font-semibold">Custom Quantity:</span>
                  <input
                    type="number"
                    min={product.minQuantity}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(product.minQuantity, Number(e.target.value)))}
                    className="w-28 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 text-sm text-center focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-brand-navy text-white font-extrabold text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4 text-brand-green" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 bg-gradient-to-r from-brand-green to-emerald-600 hover:from-emerald-600 hover:to-brand-green text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-green/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
