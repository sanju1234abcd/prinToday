import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { MOCK_CATEGORIES, MOCK_SUBCATEGORIES } from '../data/mockData';
import { SideDrawer } from './SideDrawer';

export const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount, lastAddedItemId } = useCart();
  const { products } = useOrders();
  const badgeRef = useRef<HTMLSpanElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // GSAP badge bounce when item is added
  useGSAP(() => {
    if (lastAddedItemId && badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 1.6, rotate: -15 },
        { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.4)' }
      );
    }
  }, [lastAddedItemId]);

  // Filter products and subcategories based on searchQuery
  const filteredProducts = searchQuery.trim()
    ? products.filter(
        p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredSubcats = searchQuery.trim()
    ? MOCK_SUBCATEGORIES.filter(
        s =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectProduct = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const handleSelectSubcat = (subcatId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/products?subId=${subcatId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            
            {/* Left: Drawer Toggle & Brand Logo */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 rounded-xl text-slate-700 hover:text-brand-blue hover:bg-slate-100 transition focus:outline-none"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link to="/" className="flex items-center space-x-2.5 group">
                {/* Logo Icon Graphic mimicking logo geometry */}
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
                  {/* Overlapping diamonds/triangles */}
                  <div className="absolute w-7 h-7 bg-brand-green rotate-45 rounded-sm transform transition group-hover:scale-105" />
                  <div className="absolute w-7 h-7 bg-brand-blue rotate-12 rounded-sm opacity-90 transform transition group-hover:-rotate-6" />
                  <span className="relative z-10 text-white font-extrabold text-lg sm:text-xl tracking-tighter drop-shadow">
                    P
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-brand-blue leading-none">
                    Prin<span className="text-brand-green">Today</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 tracking-wider italic mt-0.5">
                    Think it. Print it.
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Real-Time Search Bar */}
            <div className="flex-1 max-w-xl relative">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search Flex Banners, Visiting Cards, Mugs..."
                  className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-slate-100/90 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-full border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition outline-none shadow-inner"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Real-time Search Dropdown Modal */}
              {isSearchOpen && searchQuery.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[75vh] overflow-y-auto z-50 p-3 space-y-4">
                  {filteredProducts.length === 0 && filteredSubcats.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs sm:text-sm">
                      No matching products or categories found for "{searchQuery}".
                    </div>
                  ) : (
                    <>
                      {/* Subcategories matches */}
                      {filteredSubcats.length > 0 && (
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                            Categories
                          </p>
                          <div className="space-y-1">
                            {filteredSubcats.map(sub => (
                              <button
                                key={sub.id}
                                onClick={() => handleSelectSubcat(sub.id)}
                                className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition text-left"
                              >
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={sub.image}
                                    alt={sub.name}
                                    className="w-9 h-9 rounded-lg object-cover"
                                  />
                                  <div>
                                    <p className="text-xs font-semibold text-slate-900">{sub.name}</p>
                                    <p className="text-[10px] text-slate-500">{sub.description}</p>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Products matches */}
                      {filteredProducts.length > 0 && (
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                            Products
                          </p>
                          <div className="space-y-1.5">
                            {filteredProducts.map(prod => (
                              <button
                                key={prod.id}
                                onClick={() => handleSelectProduct(prod.id)}
                                className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition text-left"
                              >
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={prod.thumbnail}
                                    alt={prod.title}
                                    className="w-10 h-10 rounded-lg object-cover"
                                  />
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">{prod.title}</p>
                                    <p className="text-[11px] text-brand-blue font-semibold">
                                      Starting ₹{prod.basePrice}{' '}
                                      {prod.pricingType === 'per_sqft' ? '/ sq.ft' : ''}
                                    </p>
                                  </div>
                                </div>
                                <span className="px-2.5 py-1 bg-brand-green/10 text-brand-green-dark text-[10px] font-bold rounded-lg">
                                  Customize
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right: Cart & Admin Button */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* My Orders Button */}
              <Link
                to="/orders"
                className="hidden md:flex items-center space-x-1 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-blue hover:bg-slate-100 rounded-xl transition"
              >
                <Layers className="w-4 h-4 text-brand-blue" />
                <span>My Orders</span>
              </Link>

              {/* Cart Button */}
              <Link
                to="/checkout"
                className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition flex items-center justify-center group"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition" />
                {cartCount > 0 && (
                  <span
                    ref={badgeRef}
                    className="absolute -top-1.5 -right-1.5 bg-brand-green text-white text-[10px] font-extrabold min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1 shadow-md"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Admin CTA */}
              <Link
                to="/admin"
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-brand-blue to-brand-navy text-white text-xs font-bold rounded-xl shadow hover:shadow-glow-blue transition"
              >
                <User className="w-3.5 h-3.5 text-brand-green" />
                <span>Admin</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Desktop Category Sub-Nav Strip */}
        <div className="hidden md:block bg-slate-50 border-t border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 flex items-center space-x-8 text-xs font-semibold text-slate-600 py-2.5 overflow-x-auto">
            {MOCK_CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                to={`/subcategories?catId=${cat.id}`}
                className="hover:text-brand-blue whitespace-nowrap transition flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-green" />
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Side Drawer */}
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};
