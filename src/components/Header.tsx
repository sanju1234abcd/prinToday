import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  Menu,
  ShoppingCart,
  User,
  Sparkles,
  Layers
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { MOCK_CATEGORIES } from '../data/mockData';
import { SideDrawer } from './SideDrawer';
import { Logo } from './Logo';
import { HeaderSearch } from './HeaderSearch';
import { AuthModal } from './auth/AuthModal';

export const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { cartCount, lastAddedItemId } = useCart();
  const { user, logout } = useAuth();
  const badgeRef = useRef<HTMLSpanElement>(null);

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



  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between py-2 md:h-20 gap-x-3 gap-y-2">
            
            {/* Left: Drawer Toggle & Brand Logo */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 rounded-xl text-slate-700 hover:text-brand-blue hover:bg-slate-100 transition focus:outline-none"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link to="/" className="flex flex-shrink-0">
                <Logo className="h-10 md:h-14 lg:h-16 w-auto" />
              </Link>
            </div>

            {/* Center: Real-Time Search Bar */}
            {/* order-last + w-full forces it to a new row on mobile. md:order-none puts it in the middle on desktop */}
            <div className="w-full md:flex-1 md:max-w-xl relative order-last md:order-none pb-1 md:pb-0">
              <HeaderSearch />
            </div>

            {/* Right: Cart & Admin Button */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
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

              {/* Auth Button */}
              {user ? (
                <div className="relative group hidden sm:block">
                  <button className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200 transition">
                    <User className="w-3.5 h-3.5 text-brand-blue" />
                    <span>{user.individual?.name || user.organization?.companyName || 'Profile'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                    {user.role === 'ADMIN' && (
                      <Link to="/admin" className="block px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-blue border-b border-slate-50">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/profile" className="block px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-blue border-b border-slate-50">
                      My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-blue border-b border-slate-50">
                      My Orders
                    </Link>
                    <button onClick={logout} className="w-full text-left px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50">
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-brand-blue to-brand-navy text-white text-xs font-bold rounded-xl shadow hover:shadow-glow-blue transition"
                >
                  <User className="w-3.5 h-3.5 text-brand-green" />
                  <span>Sign In</span>
                </button>
              )}
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

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};
