import React, { useState } from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { Product, Order } from '../types';
import { MOCK_CATEGORIES, MOCK_SUBCATEGORIES } from '../data/mockData';

export const AdminPage: React.FC = () => {
  const { orders, products, updateOrderStatus, addProduct } = useOrders();

  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategoryId, setNewCategoryId] = useState(MOCK_CATEGORIES[0].id);
  const [newSubcategoryId, setNewSubcategoryId] = useState(MOCK_SUBCATEGORIES[0].id);
  const [newBasePrice, setNewBasePrice] = useState(299);
  const [newPricingType, setNewPricingType] = useState<'fixed' | 'per_sqft'>('fixed');
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1542744094-3a3121699479?auto=format&fit=crop&w=800&q=80');
  const [requiresArtwork, setRequiresArtwork] = useState(true);
  const [requiresDimensions, setRequiresDimensions] = useState(false);
  const [newDescription, setNewDescription] = useState('Custom commercial print specification product.');
  const [successMsg, setSuccessMsg] = useState('');

  // Selected Order for Artwork Inspection Modal
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Product = {
      id: `prod-custom-${Date.now()}`,
      categoryId: newCategoryId,
      subcategoryId: newSubcategoryId,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      description: newDescription,
      basePrice: Number(newBasePrice),
      pricingType: newPricingType,
      minQuantity: 1,
      quantityPresets: [1, 5, 10, 25, 50],
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
      thumbnail: newThumbnail,
      badges: ['Custom Admin Added'],
      rating: 5.0,
      reviewsCount: 1,
      turnaroundTime: '24 Hours'
    };

    addProduct(created);
    setNewTitle('');
    setSuccessMsg('Product added successfully to live catalog!');
    setTimeout(() => setSuccessMsg(''), 4000);
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
              <span>Orders ({orders.length})</span>
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
          </div>
        </div>

        {/* TAB 1: ORDER MANAGEMENT TABLE */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-4">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Package className="w-5 h-5 text-brand-green" />
                <span>Customer Orders Queue</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Real-time Live Dispatch & Proofing Status
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-extrabold border-b border-slate-200">
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Items & Specs</th>
                    <th className="p-4">Uploaded Artwork</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(order => (
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
                        <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                        <p className="text-slate-500 text-[11px]">{order.shippingAddress.email}</p>
                        <p className="text-slate-500 text-[11px]">{order.shippingAddress.phone}</p>
                        {order.shippingAddress.gstin && (
                          <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono block mt-1">
                            GSTIN: {order.shippingAddress.gstin}
                          </span>
                        )}
                      </td>

                      {/* Items */}
                      <td className="p-4 align-top space-y-2">
                        {order.items.map(item => (
                          <div key={item.cartItemId} className="space-y-0.5">
                            <p className="font-bold text-slate-900 text-[11px]">
                              {item.product.title} <span className="text-brand-blue">x{item.quantity}</span>
                            </p>
                            {item.customDimensions && (
                              <p className="text-[10px] text-slate-500">
                                Dim: {item.customDimensions.width} × {item.customDimensions.height} {item.customDimensions.unit} ({item.customDimensions.totalSqFt} SqFt)
                              </p>
                            )}
                            {Object.entries(item.selectedVariants).map(([k, v]) => (
                              <p key={k} className="text-[10px] text-slate-500">
                                {k}: <strong className="text-slate-700">{v}</strong>
                              </p>
                            ))}
                          </div>
                        ))}
                      </td>

                      {/* Artwork File */}
                      <td className="p-4 align-top">
                        {order.items.some(i => i.artworkFile) ? (
                          <button
                            onClick={() => setInspectOrder(order)}
                            className="px-3 py-1.5 bg-brand-green/15 text-brand-green-dark hover:bg-brand-green hover:text-white font-bold text-[11px] rounded-lg transition flex items-center space-x-1.5"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>Inspect File</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No File Uploaded</span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="p-4 align-top font-extrabold text-slate-900 text-sm">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4 align-top">
                        <select
                          value={order.status}
                          onChange={e =>
                            updateOrderStatus(order.id, e.target.value as Order['status'])
                          }
                          className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-900 text-xs focus:ring-2 focus:ring-brand-blue outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Printing">Printing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                        </select>
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
                      onChange={e => setNewCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                    >
                      {MOCK_CATEGORIES.map(c => (
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
                    >
                      {MOCK_SUBCATEGORIES.map(s => (
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

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={newThumbnail}
                    onChange={e => setNewThumbnail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-blue outline-none"
                  />
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

                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4 text-brand-green" />
                  <span>Publish Product to Store</span>
                </button>
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
                    <Link
                      to={`/product/${p.id}`}
                      className="p-2 text-slate-500 hover:text-brand-blue"
                      title="View product"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Artwork Inspection Modal */}
        {inspectOrder && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-brand-green" />
                  <span>Artwork Inspection ({inspectOrder.id})</span>
                </h3>
                <button
                  onClick={() => setInspectOrder(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {inspectOrder.items.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <p className="font-bold text-xs text-slate-900">{item.product.title}</p>
                    
                    {item.artworkFile ? (
                      <div className="space-y-2">
                        {item.artworkFile.previewUrl && (
                          <img
                            src={item.artworkFile.previewUrl}
                            alt="Customer Artwork"
                            className="w-full h-48 object-contain bg-slate-200 rounded-xl border"
                          />
                        )}
                        <p className="text-xs font-mono text-slate-700">
                          Filename: {item.artworkFile.name}
                        </p>
                        <a
                          href={item.artworkFile.previewUrl || '#'}
                          download={item.artworkFile.name}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-green text-white font-bold text-xs rounded-xl shadow"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download High-Res Artwork File</span>
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No artwork attached.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
