import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  UploadCloud,
  FileCheck,
  Calculator,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Truck,
  Star,
  CheckCircle2,
  ShoppingCart,
  Zap,
  Info,
  X
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { useCart } from '../context/CartContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useCatalog();
  const { addToCart } = useCart();

  const product = products.find((p: any) => p.id === id) || products[0];
  const { requirements } = product;

  // State: Custom Dimensions
  const [width, setWidth] = useState<number>(requirements.defaultWidth || 6);
  const [height, setHeight] = useState<number>(requirements.defaultHeight || 3);
  const [dimensionUnit] = useState<'ft' | 'in'>(requirements.dimensionUnit || 'ft');

  // State: Selected Variant Options
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (requirements.variantOptions) {
      requirements.variantOptions.forEach((opt: any) => {
        initial[opt.name] = opt.defaultOption || opt.options[0].label;
      });
    }
    return initial;
  });

  // State: Quantity — initialize to the effective minimum
  const initialQuantity = product.quantityConfig?.minQuantity ?? product.minQuantity ?? 1;
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  // State: Validation
  const [validationError, setValidationError] = useState<string | null>(null);

  // State: Uploaded Artwork File (display metadata)
  const [artworkFile, setArtworkFile] = useState<{
    name: string;
    size: number;
    type: string;
    previewUrl?: string;
  } | null>(null);
  // Hold the raw File object — only uploaded to Cloudinary on submit
  const artworkRawFile = useRef<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // State: Active Image for Slider
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // State: Touch handlers for slider swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && product?.images && product.images.length > 1) {
      setActiveImageIndex(prev => prev === product.images!.length - 1 ? 0 : prev + 1);
    } else if (isRightSwipe && product?.images && product.images.length > 1) {
      setActiveImageIndex(prev => prev === 0 ? product.images!.length - 1 : prev - 1);
    }
  };

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
    const isPersqft = product.pricingType === 'per_sqft';

    // Per SqFt adjustment — unit price covers one copy at those dimensions
    if (isPersqft) {
      base = base * totalSqFt;
    }

    // Apply Variant Adjustments
    if (requirements.variantOptions) {
      requirements.variantOptions.forEach((optGroup: any) => {
        const selectedLabel = selectedVariants[optGroup.name];
        const match = optGroup.options.find((o: any) => o.label === selectedLabel);
        if (match) {
          if (match.extraPrice) base += match.extraPrice;
          if (match.priceMultiplier) base *= match.priceMultiplier;
        }
      });
    }

    // effectiveMetric: total sq ft ordered (per_sqft) OR plain item count (fixed)
    // Discount tiers are keyed against this value — mirrors backend logic
    const effectiveMetric = isPersqft ? totalSqFt * quantity : quantity;

    let discount = 0;

    if (product?.discountTiers && Array.isArray(product.discountTiers) && product.discountTiers.length > 0) {
      const sortedTiers = [...product.discountTiers].sort((a, b) => (a.minQty ?? 0) - (b.minQty ?? 0));
      const highestTier = sortedTiers[sortedTiers.length - 1];

      // If metric exceeds the last tier's maxQty, cap at the highest tier
      if (highestTier && effectiveMetric > (highestTier.maxQty ?? Infinity)) {
        if (highestTier.discountType === 'PERCENTAGE') {
          discount = highestTier.discountValue > 1 ? highestTier.discountValue / 100 : highestTier.discountValue;
        } else if ((highestTier.discountType as string) === 'FLAT' || (highestTier.discountType as string) === 'FLAT_AMOUNT') {
          discount = base > 0 ? highestTier.discountValue / base : 0;
        }
      } else {
        const matchedTier = sortedTiers.find((tier: any) => {
          const min = tier.minQty ?? 0;
          const max = tier.maxQty ?? Infinity;
          return effectiveMetric >= min && effectiveMetric <= max;
        });

        if (matchedTier) {
          if (matchedTier.discountType === 'PERCENTAGE') {
            discount = matchedTier.discountValue > 1 ? matchedTier.discountValue / 100 : matchedTier.discountValue;
          } else if ((matchedTier.discountType as string) === 'FLAT' || (matchedTier.discountType as string) === 'FLAT_AMOUNT') {
            discount = base > 0 ? matchedTier.discountValue / base : 0;
          }
        }
      }
    }

    const unitPriceCalc = Math.max(0, base * (1 - discount));
    const totalPriceCalc = Math.round(unitPriceCalc * quantity);

    return {
      unitPrice: unitPriceCalc,
      totalPrice: totalPriceCalc,
      discountPercent: Math.round(discount * 100)
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

  // Store file metadata for display; keep raw File in ref for deferred upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      if (!isImage && !isPdf) {
        setValidationError('Only image files (JPG, PNG, WebP, etc.) or PDF files are allowed for artwork.');
        e.target.value = '';
        return;
      }

      const MAX_SIZE_MB = 18;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setValidationError(`Artwork file is too large. Maximum size is ${MAX_SIZE_MB} MB.`);
        e.target.value = '';
        return;
      }

      setValidationError('');
      artworkRawFile.current = file;
      const previewUrl = isImage ? URL.createObjectURL(file) : undefined;
      setArtworkFile({
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl // local blob URL for preview only
      });
    }
  };

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validateOrder = useCallback((): string | null => {
    const isPersqft = product.pricingType === 'per_sqft';
    const config = product.quantityConfig;
    const minQ = config?.minQuantity ?? product.minQuantity ?? 1;
    const step = config?.quantityStep ?? 1;
    const mode = config?.quantityMode ?? 'ANY_QUANTITY';

    // 1. Artwork required
    if (requirements.requiresArtworkUpload && !artworkFile && !artworkRawFile.current) {
      return 'Please upload your artwork file before adding to cart.';
    }

    // 2. Dimension check for per_sqft
    if (requirements.requiresCustomDimensions && (width <= 0 || height <= 0)) {
      return 'Please enter valid dimensions (width & height must be greater than 0).';
    }

    // 3. Quantity checks
    if (isPersqft) {
      // For per_sqft, minQuantity is in sq ft — validate total area
      const totalArea = totalSqFt * quantity;
      if (minQ > 0 && totalArea < minQ) {
        return `Minimum order is ${minQ} sq ft total. Current order is only ${totalArea.toFixed(1)} sq ft.`;
      }
    } else {
      // Fixed pricing — validate item count
      if (quantity < minQ) {
        return `Minimum quantity is ${minQ} ${mode === 'CUSTOM_INTERVAL' ? 'units' : 'pieces'}.`;
      }

      if (mode === 'CUSTOM_INTERVAL' && step > 1) {
        const remainder = (quantity - minQ) % step;
        if (remainder !== 0) {
          return `Quantity must be ${minQ} + multiples of ${step} (e.g. ${minQ}, ${minQ + step}, ${minQ + step * 2}...).`;
        }
      }

      if (mode === 'PRESET_ONLY') {
        const presets = config?.presetOptions || product.quantityPresets || [];
        if (!presets.includes(quantity)) {
          return `Please select a valid preset quantity: ${presets.join(', ')}.`;
        }
      }
    }

    return null;
  }, [product, requirements, artworkFile, width, height, totalSqFt, quantity]);

  const handleAddToCart = useCallback(async () => {
    // Run validation first
    const error = validateOrder();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);

    let finalArtworkFile = artworkFile;

    // Upload to Cloudinary only on submit, not on file selection
    if (artworkRawFile.current) {
      setIsUploading(true);
      try {
        const cloudUrl = await uploadToCloudinary(artworkRawFile.current);
        finalArtworkFile = {
          name: artworkRawFile.current.name,
          size: artworkRawFile.current.size,
          type: artworkRawFile.current.type,
          previewUrl: cloudUrl // replace local blob with permanent Cloudinary URL
        };
        setArtworkFile(finalArtworkFile);
        artworkRawFile.current = null; // clear after successful upload
      } catch (err) {
        console.error('Cloudinary upload failed:', err);
        alert('Artwork upload failed. Please try again.');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    addToCart({
      product,
      customDimensions: requirements.requiresCustomDimensions
        ? { width, height, unit: dimensionUnit, totalSqFt }
        : undefined,
      selectedVariants,
      artworkFile: finalArtworkFile || undefined,
      quantity,
      unitPrice,
      totalPrice
    });
  }, [validateOrder, artworkFile, product, requirements, width, height, dimensionUnit, totalSqFt, selectedVariants, quantity, unitPrice, totalPrice, addToCart]);

  const handleBuyNow = async () => {
    const error = validateOrder();
    if (error) {
      setValidationError(error);
      return;
    }
    await handleAddToCart();
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
            {/* Main Product Image & Slider */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-md space-y-4">
              <div 
                className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100 group"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEndHandler}
              >
                <div 
                  className="flex w-full h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
                >
                  {(product.images && product.images.length > 0 ? product.images : [product.thumbnail]).map((img, idx) => (
                    <img
                      key={idx}
                      src={optimizeCloudinaryUrl(img)}
                      alt={`${product.title} view ${idx + 1}`}
                      className="w-full h-full object-cover flex-shrink-0"
                    />
                  ))}
                </div>
                
                <div className="absolute top-4 left-4 flex flex-col space-y-1">
                  {(product.badges || []).map((b: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-brand-navy/90 backdrop-blur-md text-white text-xs font-extrabold rounded-lg shadow"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* Slider Arrows & Dots Overlay */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex(prev => prev === 0 ? product.images!.length - 1 : prev - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex(prev => prev === product.images!.length - 1 ? 0 : prev + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2">
                      {product.images.map((_: any, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-sm transition-all ${
                            activeImageIndex === idx ? 'bg-brand-blue w-5 sm:w-6' : 'bg-white/80 hover:bg-white'
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
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
                      JPG, PNG, WebP, PDF · Max 18 MB
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf,application/pdf"
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
                    {product.pricingType === 'per_sqft'
                      ? `Total Price — ${quantity} ${quantity === 1 ? 'copy' : 'copies'} × ${totalSqFt} sq.ft = ${(totalSqFt * quantity).toFixed(1)} sq.ft`
                      : `Total Price — ${quantity} ${quantity === 1 ? 'piece' : 'pieces'}`
                    }
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span
                      ref={priceDisplayRef}
                      className="text-3xl sm:text-4xl font-extrabold text-brand-blue"
                    >
                      ₹{totalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {product.pricingType === 'per_sqft'
                        ? `(₹${unitPrice.toFixed(2)} / copy)`
                        : `(₹${unitPrice.toFixed(2)} / piece)`
                      }
                    </span>
                  </div>
                  {product.pricingType === 'per_sqft' && (
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
                      Base rate: ₹{product.basePrice.toFixed(2)} / sq.ft
                    </span>
                  )}
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
              {product.requirements.variantOptions && product.requirements.variantOptions.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  {product.requirements.variantOptions?.map((optGroup: any, idx: number) => (
                    <div key={idx} className="space-y-1.5">
                      <label className="font-bold text-slate-800 text-xs flex justify-between">
                        <span>{optGroup.name}</span>
                        <span className="text-brand-blue font-semibold">
                          {selectedVariants[optGroup.name]}
                        </span>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {optGroup.options.map((opt: any, i: number) => {
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
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs block">
                    {product.pricingType === 'per_sqft' ? 'Number of Copies' : 'Select Quantity'}
                  </label>
                  {product.pricingType === 'per_sqft' && product.quantityConfig?.minQuantity && (
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                      Min {product.quantityConfig.minQuantity} sq ft total
                    </span>
                  )}
                </div>

                {/* Dynamic Quantity Selector based on Mode */}
                {(product.quantityConfig?.quantityMode === 'PRESET_ONLY' || (!product.quantityConfig && product.quantityPresets?.length > 0)) && (
                  <select
                    value={quantity}
                    onChange={e => { setQuantity(Number(e.target.value)); setValidationError(null); }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue outline-none cursor-pointer hover:border-brand-blue transition"
                  >
                    {(product.quantityConfig?.presetOptions || product.quantityPresets || []).map((preset: number) => (
                      <option key={preset} value={preset}>
                        {preset} {product.pricingType === 'per_sqft' ? 'copies' : 'pcs'}
                      </option>
                    ))}
                  </select>
                )}

                {product.quantityConfig?.quantityMode === 'CUSTOM_INTERVAL' && (() => {
                  const isPersqft = product.pricingType === 'per_sqft';
                  const minQ = product.quantityConfig!.minQuantity;
                  const step = product.quantityConfig!.quantityStep || 1;
                  const minSqFt = isPersqft ? minQ : 0;
                  return (
                    <div className="space-y-1.5">
                      <select
                        value={quantity}
                        onChange={e => { setQuantity(Number(e.target.value)); setValidationError(null); }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue outline-none cursor-pointer hover:border-brand-blue transition"
                      >
                        {Array.from({ length: 15 }).map((_, i) => {
                          const val = minQ + (i * step);
                          const totalArea = isPersqft ? (val * totalSqFt).toFixed(1) : null;
                          const label = isPersqft
                            ? `${val} ${val === 1 ? 'copy' : 'copies'} · ${totalArea} sq.ft total`
                            : `${val} pcs`;
                          return <option key={val} value={val}>{label}</option>;
                        })}
                      </select>
                      {isPersqft && minSqFt > 0 && (
                        <p className="text-[10px] font-medium">
                          <span className={`${ (totalSqFt * quantity) >= minSqFt ? 'text-brand-green' : 'text-rose-500' } font-bold`}>
                            {(totalSqFt * quantity) >= minSqFt
                              ? `✓ ${(totalSqFt * quantity).toFixed(1)} sq.ft — meets minimum`
                              : `✗ ${(totalSqFt * quantity).toFixed(1)} sq.ft — minimum is ${minSqFt} sq.ft`
                            }
                          </span>
                        </p>
                      )}
                    </div>
                  );
                })()}

                {((product.quantityConfig?.quantityMode === 'ANY_QUANTITY') || (!product.quantityConfig && (!product.quantityPresets || product.quantityPresets.length === 0))) && (() => {
                  const isPersqft = product.pricingType === 'per_sqft';
                  const minSqFt = product.quantityConfig?.minQuantity ?? 0;
                  // For per_sqft, the user sets #copies and we validate totalArea >= minSqFt
                  // For fixed, user directly sets quantity and we validate >= minQuantity items
                  const minQtyItems = isPersqft
                    ? 1
                    : (product.quantityConfig?.minQuantity ?? product.minQuantity ?? 1);
                  return (
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-3 pt-1">
                        <span className="text-xs text-slate-500 font-semibold">
                          {isPersqft ? 'Number of Copies:' : 'Quantity:'}
                        </span>
                        <input
                          type="number"
                          min={minQtyItems}
                          value={quantity}
                          onChange={e => {
                            setQuantity(Math.max(minQtyItems, Number(e.target.value)));
                            setValidationError(null);
                          }}
                          className="w-28 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 text-sm text-center focus:ring-2 focus:ring-brand-blue focus:outline-none"
                        />
                      </div>
                      {isPersqft && (
                        <p className="text-[10px] text-slate-400 font-medium">
                          Total area: <span className="font-bold text-slate-600">{(totalSqFt * quantity).toFixed(1)} sq.ft</span>
                          {minSqFt > 0 && (
                            <span className={`ml-1 font-bold ${ (totalSqFt * quantity) >= minSqFt ? 'text-brand-green' : 'text-rose-500' }`}>
                              · Min {minSqFt} sq.ft required
                            </span>
                          )}
                        </p>
                      )}
                      {!isPersqft && minQtyItems > 1 && (
                        <p className="text-[10px] text-slate-400 font-medium">
                          Minimum order: <span className="font-bold text-slate-600">{minQtyItems} pieces</span>
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Action Buttons */}
              {validationError && (
                <div className="flex items-start space-x-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-500" />
                  <p className="text-xs font-semibold leading-relaxed">{validationError}</p>
                </div>
              )}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isUploading}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-brand-navy text-white font-extrabold text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-brand-green" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span>Uploading Artwork...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-brand-green" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isUploading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-brand-green to-emerald-600 hover:from-emerald-600 hover:to-brand-green text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-green/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span>Uploading Artwork...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Buy Now</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
