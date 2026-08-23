import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Clock,
  FileCheck,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Download,
  Eye,
  Edit,
  Save,
  Grid,
  ShieldAlert,
  ImagePlus,
  Filter,
  X,
  BadgeCheck,
  Search,
  Building2,
  Check,
  Ban
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCatalog } from '../context/CatalogContext';
import { UserProfile } from '../context/AuthContext';
import { Product, Order, QuantityMode, DiscountTier } from '../types';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const AdminPage: React.FC = () => {
  const { fetchAdminOrders, updateOrderStatus } = useOrders();
  const { categories, subcategories, products, refreshCatalog } = useCatalog();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'approvals'>('orders');
  const [pendingOrgs, setPendingOrgs] = useState<UserProfile[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Filter States
  const [dateFilter, setDateFilter] = useState('');
  const [amountOp, setAmountOp] = useState('>');
  const [amountFilter, setAmountFilter] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('ALL');

  const handleClearFilters = () => {
    setDateFilter('');
    setAmountOp('>');
    setAmountFilter('');
    setUserTypeFilter('ALL');
  };

  // Compute Filtered Orders
  const filteredOrders = adminOrders.filter(order => {
    let match = true;
    
    if (dateFilter) {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      if (orderDate !== dateFilter) match = false;
    }

    if (amountFilter) {
      const threshold = Number(amountFilter);
      if (amountOp === '>') {
        if (order.totalAmount <= threshold) match = false;
      } else {
        if (order.totalAmount >= threshold) match = false;
      }
    }

    if (userTypeFilter !== 'ALL') {
      const type = order.userId?.accountType || 'INDIVIDUAL';
      if (type !== userTypeFilter) match = false;
    }

    return match;
  });

  useEffect(() => {
    const loadAdminOrders = async () => {
      setLoadingOrders(true);
      try {
        const data = await fetchAdminOrders();
        setAdminOrders(data);
      } catch (err) {
        console.error('Failed to load admin orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (activeTab === 'orders') {
      loadAdminOrders();
    }
  }, [activeTab, fetchAdminOrders]);

  useEffect(() => {
    const loadOrgs = async () => {
      setLoadingOrgs(true);
      try {
        const res = await fetch(`${API}/admin/organizations/pending-verification`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setPendingOrgs(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load pending organizations', err);
      } finally {
        setLoadingOrgs(false);
      }
    };
    if (activeTab === 'approvals') loadOrgs();
  }, [activeTab]);

  const handleVerifyOrg = async (orgId: string, status: 'VERIFIED' | 'REJECTED', creditEligible: boolean) => {
    try {
      const res = await fetch(`${API}/admin/organizations/${orgId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ physicalVerificationStatus: status, creditEligible })
      });
      if (!res.ok) throw new Error('Verification update failed');
      
      setPendingOrgs(prev => prev.filter(org => org._id !== orgId));
    } catch (err) {
      alert('Failed to update organization verification status.');
    }
  };

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newSubcategoryId, setNewSubcategoryId] = useState('');
  const [newBasePrice, setNewBasePrice] = useState(299);
  const [newPricingType, setNewPricingType] = useState<'fixed' | 'per_sqft'>('fixed');
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1542744094-3a3121699479?auto=format&fit=crop&w=800&q=80');
  const thumbnailRawFile = useRef<File | null>(null); // raw File — uploaded only on submit
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  const [newImage2, setNewImage2] = useState('');
  const image2RawFile = useRef<File | null>(null);
  const [image2Preview, setImage2Preview] = useState<string>('');
  
  const [requiresArtwork, setRequiresArtwork] = useState(true);
  const [requiresDimensions, setRequiresDimensions] = useState(false);
  const [newDescription, setNewDescription] = useState('Custom commercial print specification product.');
  const [successMsg, setSuccessMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // New Config States
  const [newQuantityMode, setNewQuantityMode] = useState<QuantityMode>('ANY_QUANTITY');
  const [newMinQuantity, setNewMinQuantity] = useState(1);
  const [newQuantityStep, setNewQuantityStep] = useState(1);
  const [newQuantityPresets, setNewQuantityPresets] = useState('1, 5, 10, 25, 50');
  const [newDiscountTiers, setNewDiscountTiers] = useState<DiscountTier[]>([]);

  const handleAddDiscountTier = () => {
    setNewDiscountTiers([...newDiscountTiers, { minQty: 1, maxQty: null, discountType: 'PERCENTAGE', discountValue: 5 }]);
  };

  const handleUpdateDiscountTier = (index: number, field: keyof DiscountTier, value: any) => {
    const updated = [...newDiscountTiers];
    updated[index] = { ...updated[index], [field]: value };
    setNewDiscountTiers(updated);
  };

  const handleRemoveDiscountTier = (index: number) => {
    setNewDiscountTiers(newDiscountTiers.filter((_, i) => i !== index));
  };

  // Selected Order for Artwork Inspection Modal
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);
  const [pendingStatus, setPendingStatus] = useState<Order['status'] | null>(null);
  const [expectedDate, setExpectedDate] = useState<string>('');

  const MAX_PRODUCT_IMAGE_MB = 3;

  const handleThumbnailFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_PRODUCT_IMAGE_MB * 1024 * 1024) {
        alert(`Image too large. Maximum size for product images is ${MAX_PRODUCT_IMAGE_MB} MB.`);
        e.target.value = '';
        return;
      }
      thumbnailRawFile.current = file;
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleImage2FileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_PRODUCT_IMAGE_MB * 1024 * 1024) {
        alert(`Image too large. Maximum size for product images is ${MAX_PRODUCT_IMAGE_MB} MB.`);
        e.target.value = '';
        return;
      }
      image2RawFile.current = file;
      setImage2Preview(URL.createObjectURL(file));
    }
  };

  const handleEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setNewTitle(p.title);
    setNewCategoryId(p.categoryId);
    setNewSubcategoryId(p.subcategoryId);
    setNewBasePrice(p.basePrice);
    setNewPricingType(p.pricingType);
    setNewThumbnail(p.thumbnail || p.images?.[0] || '');
    setThumbnailPreview(p.thumbnail || p.images?.[0] || '');
    setNewImage2(p.images?.[1] || '');
    setImage2Preview(p.images?.[1] || '');
    setRequiresArtwork(p.requirements?.requiresArtworkUpload ?? true);
    setRequiresDimensions(p.requirements?.requiresCustomDimensions ?? false);
    setNewDescription(p.description);
    setNewQuantityMode(p.quantityConfig?.quantityMode ?? 'ANY_QUANTITY');
    setNewMinQuantity(p.quantityConfig?.minQuantity ?? 1);
    setNewQuantityStep(p.quantityConfig?.quantityStep ?? 1);
    setNewQuantityPresets(p.quantityConfig?.presetOptions?.join(', ') ?? '1, 5, 10, 25, 50');
    setNewDiscountTiers(p.discountTiers || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setNewTitle('');
    setNewCategoryId('');
    setNewSubcategoryId('');
    setNewBasePrice(299);
    setNewPricingType('fixed');
    setNewThumbnail('https://images.unsplash.com/photo-1542744094-3a3121699479?auto=format&fit=crop&w=800&q=80');
    setThumbnailPreview('');
    thumbnailRawFile.current = null;
    setNewImage2('');
    setImage2Preview('');
    image2RawFile.current = null;
    setRequiresArtwork(true);
    setRequiresDimensions(false);
    setNewDescription('Custom commercial print specification product.');
    setNewQuantityMode('ANY_QUANTITY');
    setNewMinQuantity(1);
    setNewQuantityStep(1);
    setNewQuantityPresets('1, 5, 10, 25, 50');
    setNewDiscountTiers([]);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let finalThumbnail = newThumbnail;
    let finalImage2 = newImage2;

    if (thumbnailRawFile.current || image2RawFile.current) {
      setIsUploading(true);
      try {
        if (thumbnailRawFile.current) {
          finalThumbnail = await uploadToCloudinary(thumbnailRawFile.current);
          thumbnailRawFile.current = null;
        }
        if (image2RawFile.current) {
          finalImage2 = await uploadToCloudinary(image2RawFile.current);
          image2RawFile.current = null;
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        alert('Image upload failed. Please try again.');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const parsedPresets = newQuantityMode === 'PRESET_ONLY' 
      ? newQuantityPresets.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))
      : undefined;

    const created: any = {
      id: `prod-custom-${Date.now()}`,
      categoryId: newCategoryId,
      subcategoryId: newSubcategoryId,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      description: newDescription,
      basePrice: Number(newBasePrice),
      pricingType: newPricingType,
      minQuantity: Number(newMinQuantity),
      quantityPresets: parsedPresets || [],
      quantityConfig: {
        quantityMode: newQuantityMode,
        minQuantity: Number(newMinQuantity),
        quantityStep: newQuantityMode === 'CUSTOM_INTERVAL' ? Number(newQuantityStep) : 1,
        presetOptions: parsedPresets
      },
      discountTiers: newDiscountTiers.map(t => ({
        minQty: Number(t.minQty),
        maxQty: t.maxQty ? Number(t.maxQty) : null,
        discountType: t.discountType,
        discountValue: Number(t.discountValue)
      })),
      requirements: {
        requiresArtworkUpload: requiresArtwork,
        requiresCustomDimensions: requiresDimensions,
        variantOptions: [
          {
            name: 'Standard Finish',
            options: [
              { label: 'Standard Clean Trim', extraPrice: 0 },
              { label: 'Heavy Duty Reinforced', extraPrice: 50 }
            ]
          }
        ]
      },
      thumbnail: finalThumbnail,
      images: [finalThumbnail, finalImage2].filter(Boolean),
      badges: ['Custom Admin Added'],
      rating: 5.0,
      reviewsCount: 1,
      turnaroundTime: '24 Hours'
    };

    try {
      const url = editingProductId ? `${API}/admin/products/${editingProductId}` : `${API}/admin/products`;
      const method = editingProductId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(created)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to ${editingProductId ? 'update' : 'create'} product`);
      }

      await refreshCatalog();
      
      handleCancelEdit();
      setSuccessMsg(editingProductId ? 'Product updated successfully!' : 'Product added successfully to live catalog!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(`Error ${editingProductId ? 'updating' : 'creating'} product: ${err.message}`);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-6">
          <Link to="/" className="hover:text-brand-blue">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">Admin Control Panel</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-brand-navy text-white text-[10px] font-mono uppercase tracking-wider rounded-md font-bold">
                STORE MANAGER
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                PrinToday Administration
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage incoming customer print orders, inspect artwork files, and configure catalog products.
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex items-center p-1 bg-slate-200/80 rounded-2xl">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 ${
                activeTab === 'orders'
                  ? 'bg-white text-brand-blue shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4 text-brand-green" />
              <span>Orders ({adminOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 ${
                activeTab === 'products'
                  ? 'bg-white text-brand-blue shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-brand-blue" />
              <span>Product Configurator ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 ${
                activeTab === 'approvals'
                  ? 'bg-white text-brand-blue shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-brand-navy" />
              <span>B2B Approvals</span>
              {pendingOrgs.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[9px]">{pendingOrgs.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: ORDER MANAGEMENT TABLE */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-4">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-brand-green" />
                  <span>Customer Orders Queue</span>
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  Real-time Live Dispatch & Proofing Status
                </span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Filters:</span>
              </div>

              {/* Date Filter */}
              <input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
              />

              {/* Amount Filter */}
              <div className="flex items-center space-x-1">
                <select
                  value={amountOp}
                  onChange={e => setAmountOp(e.target.value)}
                  className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                >
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                </select>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amountFilter}
                    onChange={e => setAmountFilter(e.target.value)}
                    className="w-24 pl-6 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                  />
                </div>
              </div>

              {/* User Type Filter */}
              <select
                value={userTypeFilter}
                onChange={e => setUserTypeFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
              >
                <option value="ALL">All Users</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="ORGANIZATION">Organization / B2B</option>
              </select>

              {/* Clear Filters */}
              {(dateFilter || amountFilter || userTypeFilter !== 'ALL') && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px] rounded-lg transition flex items-center space-x-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-extrabold border-b border-slate-200">
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Items & Specs</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                      
                      {/* Order ID */}
                      <td className="p-4 align-top">
                        <span className="font-mono font-extrabold text-brand-blue text-sm block">
                          {order.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-brand-green font-bold block mt-1">
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="p-4 align-top space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <p className="font-bold text-slate-900">
                            {order.userId?.organization?.companyName || (order as any).customerName || order.shippingAddress.houseNo || '—'}
                          </p>
                          {order.userId?.accountType === 'ORGANIZATION' && order.userId?.organization?.creditEligible && (
                            <span title="Approved B2B Organization" className="flex items-center">
                              <BadgeCheck className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          {order.userId?.email || (order as any).customerEmail || '—'}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          {(order as any).customerPhone || '—'}
                        </p>
                        <p className="text-[10px] text-brand-blue font-bold mt-1">
                          {order.userId?.accountType || 'INDIVIDUAL'}
                        </p>
                        {(order as any).gstin && (
                          <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono block mt-1">
                            GSTIN: {(order as any).gstin}
                          </span>
                        )}
                      </td>

                      {/* Items */}
                      <td className="p-4 align-top space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <div key={item.productId || idx} className="space-y-0.5">
                            <p className="font-bold text-slate-900 text-[11px]">
                              {item.title || item.product?.title || 'Unknown Product'} <span className="text-brand-blue">x{item.quantity}</span>
                            </p>
                            {item.dimensions && (
                              <p className="text-[10px] text-slate-500">
                                Dim: {item.dimensions.widthFt} × {item.dimensions.heightFt} ft ({item.dimensions.totalSqFt} SqFt)
                              </p>
                            )}
                          </div>
                        ))}
                      </td>

                      {/* Total */}
                      <td className="p-4 align-top font-extrabold text-slate-900 text-sm">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>

                      {/* Action */}
                      <td className="p-4 align-top">
                        <div className="space-y-2">
                          <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold ${
                            order.orderStatus === 'DELIVERED' ? 'bg-brand-green/10 text-brand-green' :
                            order.orderStatus === 'SHIPPED' ? 'bg-brand-blue/10 text-brand-blue' :
                            order.orderStatus === 'PROCESSING' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {order.orderStatus || order.status}
                          </span>
                          <button
                            onClick={() => {
                              setInspectOrder(order);
                              setPendingStatus((order.orderStatus as Order['status']) || order.status || 'PLACED');
                            }}
                            className="w-full px-3 py-2 bg-slate-900 text-white hover:bg-slate-800 font-bold text-[11px] rounded-xl transition flex items-center justify-center space-x-1.5"
                          >
                            <Search className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ADD / CONFIG PRODUCT FORM */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <PlusCircle className="w-5 h-5 text-brand-blue" />
                <span>Add / Configure Custom Product</span>
              </h2>

              {successMsg && (
                <div className="p-3 bg-brand-green/15 text-brand-green-dark text-xs font-bold rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acrylic Spotify Music Plaque"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newCategoryId}
                      onChange={e => {
                        setNewCategoryId(e.target.value);
                        setNewSubcategoryId(''); // reset subcategory when category changes
                      }}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                      required
                    >
                      <option value="" disabled>Select a Category...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Subcategory</label>
                    <select
                      value={newSubcategoryId}
                      onChange={e => setNewSubcategoryId(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                      required
                      disabled={!newCategoryId}
                    >
                      <option value="" disabled>
                        {newCategoryId ? 'Select a Subcategory...' : 'Select a category first'}
                      </option>
                      {subcategories
                        .filter(s => s.categoryId === newCategoryId)
                        .map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Base Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newBasePrice}
                      onChange={e => setNewBasePrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Pricing Type</label>
                    <select
                      value={newPricingType}
                      onChange={e => setNewPricingType(e.target.value as any)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                    >
                      <option value="fixed">Fixed Unit Price</option>
                      <option value="per_sqft">Per Square Foot (Flex)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Thumbnail Image (Primary) <span className="text-slate-400 font-normal">(Max 3 MB)</span></label>
                    <div className="space-y-2">
                      {/* File picker — deferred upload on submit */}
                      <label className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-brand-blue transition text-xs font-semibold text-slate-600">
                        <ImagePlus className="w-4 h-4 text-brand-blue shrink-0" />
                        <span className="truncate">{thumbnailPreview ? 'Change Image' : 'Upload Thumbnail'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailFileSelect}
                        />
                      </label>
                      {/* Preview */}
                      {thumbnailPreview && (
                        <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                      )}
                      {/* Or paste URL */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-bold shrink-0">or URL:</span>
                        <input
                          type="url"
                          value={newThumbnail}
                          onChange={e => { setNewThumbnail(e.target.value); setThumbnailPreview(e.target.value); thumbnailRawFile.current = null; }}
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none min-w-0"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Second Image (Optional slider) <span className="text-slate-400 font-normal">(Max 3 MB)</span></label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-brand-blue transition text-xs font-semibold text-slate-600">
                        <ImagePlus className="w-4 h-4 text-brand-blue shrink-0" />
                        <span className="truncate">{image2Preview ? 'Change Image' : 'Upload Second Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImage2FileSelect}
                        />
                      </label>
                      {image2Preview && (
                        <img src={image2Preview} alt="Second Image preview" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-bold shrink-0">or URL:</span>
                        <input
                          type="url"
                          value={newImage2}
                          onChange={e => { setNewImage2(e.target.value); setImage2Preview(e.target.value); image2RawFile.current = null; }}
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none min-w-0"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                  />
                </div>

                {/* Quantity Configuration Panel */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                    <Grid className="w-4 h-4 text-brand-blue" />
                    <span>Quantity Configuration</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Quantity Mode</label>
                      <select
                        value={newQuantityMode}
                        onChange={e => setNewQuantityMode(e.target.value as QuantityMode)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                      >
                        <option value="ANY_QUANTITY">Any Quantity</option>
                        <option value="CUSTOM_INTERVAL">Custom Interval</option>
                        <option value="PRESET_ONLY">Preset Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Min Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={newMinQuantity}
                        onChange={e => setNewMinQuantity(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                      />
                    </div>
                  </div>

                  {newQuantityMode === 'CUSTOM_INTERVAL' && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Quantity Interval Step</label>
                      <input
                        type="number"
                        min="1"
                        value={newQuantityStep}
                        onChange={e => setNewQuantityStep(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                      />
                    </div>
                  )}

                  {newQuantityMode === 'PRESET_ONLY' && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Presets (Comma Separated)</label>
                      <input
                        type="text"
                        placeholder="1, 5, 10, 50"
                        value={newQuantityPresets}
                        onChange={e => setNewQuantityPresets(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Bulk Discount Tiers Panel */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                      <SlidersHorizontal className="w-4 h-4 text-brand-green" />
                      <span>Volume Discount Tiers</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddDiscountTier}
                      className="text-[10px] font-bold text-brand-blue bg-brand-blue/10 px-2 py-1 rounded hover:bg-brand-blue hover:text-white transition"
                    >
                      + Add Tier
                    </button>
                  </div>

                  {newDiscountTiers.length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic">No discount tiers configured.</p>
                  ) : (
                    <div className="space-y-2">
                      {newDiscountTiers.map((tier, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                          <input
                            type="number"
                            placeholder="Min Qty"
                            value={tier.minQty}
                            onChange={e => handleUpdateDiscountTier(idx, 'minQty', Number(e.target.value))}
                            className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] outline-none"
                          />
                          <span className="text-[10px] text-slate-400">to</span>
                          <input
                            type="number"
                            placeholder="Max Qty (leave blank for inf)"
                            value={tier.maxQty || ''}
                            onChange={e => handleUpdateDiscountTier(idx, 'maxQty', e.target.value ? Number(e.target.value) : null)}
                            className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] outline-none"
                          />
                          <select
                            value={tier.discountType}
                            onChange={e => handleUpdateDiscountTier(idx, 'discountType', e.target.value)}
                            className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] outline-none"
                          >
                            <option value="PERCENTAGE">% Off</option>
                            <option value="FLAT_AMOUNT">Flat Off</option>
                          </select>
                          <input
                            type="number"
                            placeholder="Value"
                            value={tier.discountValue}
                            onChange={e => handleUpdateDiscountTier(idx, 'discountValue', Number(e.target.value))}
                            className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveDiscountTier(idx)}
                            className="text-rose-500 hover:bg-rose-50 p-1 rounded transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Requirement Toggles */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">
                    Product Requirement Toggles
                  </span>

                  <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={requiresArtwork}
                      onChange={e => setRequiresArtwork(e.target.checked)}
                      className="accent-brand-blue w-4 h-4 rounded"
                    />
                    <span>Require Artwork Upload Field (PDF/PNG/JPG)</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={requiresDimensions}
                      onChange={e => setRequiresDimensions(e.target.checked)}
                      className="accent-brand-blue w-4 h-4 rounded"
                    />
                    <span>Require Width × Height Dimension Inputs (Feet/Inches)</span>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span>Uploading Thumbnail...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-brand-green" />
                        <span>{editingProductId ? 'Update Product' : 'Publish Product to Store'}</span>
                      </>
                    )}
                  </button>
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs rounded-xl transition"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Live Products List */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Live Store Products ({products.length})
              </h2>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {products.map(p => (
                  <div
                    key={p.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-3"
                  >
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 text-xs space-y-0.5">
                      <h4 className="font-bold text-slate-900">{p.title}</h4>
                      <p className="text-[11px] text-brand-blue font-semibold">
                        Base: ₹{p.basePrice} {p.pricingType === 'per_sqft' ? '/ sq.ft' : ''}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleEditProduct(p)}
                        className="p-2 text-slate-500 hover:text-brand-green"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/product/${p.id}`}
                        className="p-2 text-slate-500 hover:text-brand-blue"
                        title="View product"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: B2B APPROVALS */}
        {activeTab === 'approvals' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-brand-navy" />
                <span>Pending B2B Organization Approvals</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium mt-1 block">
                Verify business details and approve 30-day credit lines.
              </span>
            </div>

            {loadingOrgs ? (
              <div className="p-12 text-center text-slate-500 text-sm font-semibold">Loading organizations...</div>
            ) : pendingOrgs.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-brand-green/30 mx-auto" />
                <p className="text-slate-500 text-sm font-bold">All caught up! No pending verifications.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-600 font-extrabold border-b border-slate-200">
                      <th className="p-4">Organization & Rep</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Registration</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingOrgs.map(org => (
                      <tr key={org._id} className="hover:bg-slate-50 transition">
                        <td className="p-4 align-top">
                          <p className="font-bold text-slate-900 text-sm block">{org.organization?.companyName}</p>
                          <p className="text-slate-500 font-medium block mt-1">Rep: {org.organization?.contactName}</p>
                        </td>
                        <td className="p-4 align-top space-y-1">
                          <p className="font-semibold text-slate-700">{org.email}</p>
                          <p className="text-slate-500">{org.mobileNumber}</p>
                          <p className="text-slate-400 text-[10px] max-w-[200px] leading-relaxed pt-1">
                            {[org.organization?.address?.houseNo, org.organization?.address?.streetName, org.organization?.address?.area, org.organization?.address?.pin].filter(Boolean).join(', ')}
                          </p>
                        </td>
                        <td className="p-4 align-top">
                          <div className="inline-block bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-0.5">GSTIN Number</span>
                            <span className="font-mono text-slate-800 font-semibold">{org.organization?.gstin || 'Unregistered'}</span>
                          </div>
                        </td>
                        <td className="p-4 align-top text-center">
                          <div className="flex flex-col gap-2 min-w-[140px]">
                            <button
                              onClick={() => handleVerifyOrg(org._id, 'VERIFIED', true)}
                              className="px-3 py-2 bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white font-bold rounded-lg transition flex items-center justify-center space-x-1.5"
                              title="Approve verification and grant 30-Day Credit"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve & Grant Credit</span>
                            </button>
                            <button
                              onClick={() => handleVerifyOrg(org._id, 'REJECTED', false)}
                              className="px-3 py-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white font-bold rounded-lg transition flex items-center justify-center space-x-1.5"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Reject Application</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Comprehensive Order Details Modal */}
        {inspectOrder && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
              
              {/* Modal Header */}
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
                    <Package className="w-5 h-5 text-brand-blue" />
                    <span>Order Details: {inspectOrder.id}</span>
                  </h3>
                  <div className="text-xs text-slate-500 mt-1 flex items-center space-x-4">
                    <span>{new Date(inspectOrder.createdAt).toLocaleString()}</span>
                    <span className="font-bold text-brand-green">{inspectOrder.paymentMethod}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setInspectOrder(null);
                    setExpectedDate('');
                  }}
                  className="p-2 bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Customer & Items */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Customer Profile */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3">Customer & Delivery Profile</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500 block mb-0.5">Name / Company</span>
                        <div className="flex items-center space-x-1.5">
                          <strong className="text-slate-900 text-sm">
                            {inspectOrder.userId?.organization?.companyName || inspectOrder.userId?.individual?.name || (inspectOrder as any).customerName || inspectOrder.shippingAddress.houseNo}
                          </strong>
                          {inspectOrder.userId?.accountType === 'ORGANIZATION' && inspectOrder.userId?.organization?.creditEligible && (
                    <span title="Approved B2B Organization" className="flex items-center">
                              <BadgeCheck className="w-4 h-4 text-brand-green" />
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Contact</span>
                        <strong className="text-slate-900 text-sm block">
                          {inspectOrder.userId?.email || 'N/A'}
                        </strong>
                        <span className="text-slate-500 text-xs mt-0.5 block">
                          {inspectOrder.userId?.mobileNumber || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Account Type</span>
                        <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue font-bold rounded">
                          {inspectOrder.userId?.accountType || 'INDIVIDUAL'}
                        </span>
                        {(inspectOrder as any).gstin && (
                          <span className="block mt-1 text-slate-700 font-mono">GSTIN: {(inspectOrder as any).gstin}</span>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Delivery Address</span>
                        <p className="text-slate-900 font-medium">
                          {[inspectOrder.shippingAddress.houseNo, inspectOrder.shippingAddress.streetName, inspectOrder.shippingAddress.area].filter(Boolean).join(', ')}<br/>
                          PIN: {inspectOrder.shippingAddress.pin}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900">Itemized Breakdown ({inspectOrder.items.length})</h4>
                    {inspectOrder.items.map((item: any, idx) => (
                      <div key={item.productId || idx} className="p-4 bg-white rounded-2xl border border-slate-200 flex space-x-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-slate-900">{item.title || item.product?.title || 'Unknown Product'}</p>
                              <p className="text-xs text-brand-blue font-bold">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-extrabold text-slate-900">₹{(item.itemTotalPrice || item.totalPrice || 0).toLocaleString()}</p>
                          </div>
                          
                          {item.dimensions && (
                            <p className="text-[11px] text-slate-500">
                              Dimensions: {item.dimensions.widthFt} × {item.dimensions.heightFt} ft ({item.dimensions.totalSqFt} SqFt)
                            </p>
                          )}

                          {item.artworkUrl && (
                            <div className="pt-2 flex items-center space-x-3">
                              <a
                                href={item.artworkUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white font-bold text-[11px] rounded-lg transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Preview</span>
                              </a>
                              <a
                                href={item.artworkUrl}
                                download
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-brand-blue hover:text-white font-bold text-[11px] rounded-lg transition"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download Artwork</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Right Column: Status & Financials */}
                <div className="space-y-6">
                  
                  {/* Fulfillment Status */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Update Status</h4>
                    <select
                      value={pendingStatus || inspectOrder.orderStatus || inspectOrder.status}
                      onChange={e => setPendingStatus(e.target.value as Order['status'])}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                    >
                      <option value="PLACED">Placed / Pending</option>
                      <option value="PROCESSING">Processing / Printing</option>
                      <option value="SHIPPED">Dispatched / Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                    </select>

                    {(pendingStatus === 'PROCESSING' || pendingStatus === 'SHIPPED' || 
                      (!pendingStatus && (inspectOrder.orderStatus === 'PROCESSING' || inspectOrder.orderStatus === 'SHIPPED'))) && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {pendingStatus === 'PROCESSING' || (!pendingStatus && inspectOrder.orderStatus === 'PROCESSING') 
                            ? 'Expected Shipping Time' 
                            : 'Expected Delivery Time'}
                        </label>
                        <input
                          type="datetime-local"
                          value={expectedDate}
                          onChange={e => setExpectedDate(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                        />
                      </div>
                    )}

                    <button
                      onClick={async () => {
                        const statusToUpdate = pendingStatus || inspectOrder.orderStatus || inspectOrder.status;
                        if (!statusToUpdate) return;
                        
                        if ((statusToUpdate === 'PROCESSING' || statusToUpdate === 'SHIPPED') && !expectedDate) {
                          alert('Please provide an expected timeline date before updating.');
                          return;
                        }

                        try {
                          await updateOrderStatus(inspectOrder.id, statusToUpdate as any, expectedDate);
                          setInspectOrder({ ...inspectOrder, orderStatus: statusToUpdate, status: statusToUpdate as any });
                          setAdminOrders(prev => prev.map(o => o.id === inspectOrder.id ? { ...o, orderStatus: statusToUpdate, status: statusToUpdate as any } : o));
                          setExpectedDate('');
                          alert('Status updated successfully');
                        } catch (err) {
                          alert('Failed to update status');
                        }
                      }}
                      className="w-full py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 mt-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm Status Update</span>
                    </button>
                  </div>

                  {/* Financial Summary */}
                  <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-3 shadow-lg">
                    <h4 className="text-sm font-bold text-slate-300 border-b border-slate-700 pb-2">Financial Summary</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subtotal</span>
                        <span className="font-semibold">₹{inspectOrder.subtotal?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">GST (18%)</span>
                        <span className="font-semibold">₹{inspectOrder.gstAmount?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Shipping</span>
                        <span className="font-semibold">
                          {inspectOrder.shippingFee === 0 ? 'FREE' : `₹${inspectOrder.shippingFee}`}
                        </span>
                      </div>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-700 flex justify-between items-baseline">
                      <span className="font-bold">Total Payable</span>
                      <span className="text-2xl font-extrabold text-brand-green">
                        ₹{inspectOrder.totalAmount?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
