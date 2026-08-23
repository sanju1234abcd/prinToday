import React, { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  X,
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
  ShieldCheck,
  FileText,
  ChevronRight,
  Phone,
  Megaphone,
  Gift,
  Sparkles,
  Briefcase,
  Settings,
  ArrowUpRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MOCK_CATEGORIES } from '../data/mockData';
import { Logo } from './Logo';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const mobileSheetRef = useRef<HTMLDivElement>(null);
  const desktopPanelRef = useRef<HTMLElement>(null);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const isMobile = () =>
    typeof window !== 'undefined' && window.innerWidth < 768;

  // Animate open/close based on viewport
  useGSAP(() => {
    const backdrop = backdropRef.current;
    const mobileSheet = mobileSheetRef.current;
    const desktopPanel = desktopPanelRef.current;

    if (!backdrop) return;

    if (isOpen) {
      // Show backdrop
      gsap.killTweensOf(backdrop);
      gsap.set(backdrop, { display: 'block', pointerEvents: 'auto' });
      gsap.to(backdrop, { opacity: 1, duration: 0.28, ease: 'power2.out' });

      if (isMobile() && mobileSheet) {
        // Mobile: slide up from bottom
        gsap.killTweensOf(mobileSheet);
        gsap.to(mobileSheet, { y: 0, duration: 0.42, ease: 'power3.out' });
      } else if (!isMobile() && desktopPanel) {
        // Desktop: slide in from left
        gsap.killTweensOf(desktopPanel);
        gsap.to(desktopPanel, { x: 0, duration: 0.38, ease: 'power3.out' });
      }
    } else {
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => gsap.set(backdrop, { display: 'none', pointerEvents: 'none' })
      });

      if (mobileSheet) {
        gsap.killTweensOf(mobileSheet);
        gsap.to(mobileSheet, { y: '100%', duration: 0.32, ease: 'power3.in' });
      }
      if (desktopPanel) {
        gsap.killTweensOf(desktopPanel);
        gsap.to(desktopPanel, { x: '-100%', duration: 0.28, ease: 'power3.in' });
      }
    }
  }, [isOpen]);

  const handleNavClick = useCallback((path: string) => {
    onClose();
    navigate(path);
  }, [onClose, navigate]);

  const navItems = [
    { label: 'Home', icon: <Home className="w-5 h-5" />, path: '/' },
    { label: 'All Products', icon: <ShoppingBag className="w-5 h-5" />, path: '/products' },
    { label: 'My Orders', icon: <FileText className="w-5 h-5" />, path: '/orders' },
  ];

  const categoryIconMap: Record<string, React.ReactNode> = {
    Briefcase: <Briefcase className="w-5 h-5" />,
    Megaphone: <Megaphone className="w-5 h-5" />,
    Sparkles: <Sparkles className="w-5 h-5" />,
    Gift: <Gift className="w-5 h-5" />
  };

  // ───────────────────────────────────────────────────────────────
  // SHARED CONTENT — reused by both mobile sheet and desktop panel
  // ───────────────────────────────────────────────────────────────
  const DrawerHeader = () => (
    <div className="px-5 py-4 bg-gradient-to-r from-brand-navy to-brand-blue flex items-center justify-between flex-shrink-0">
      <div className="flex items-center space-x-3 bg-white p-1.5 rounded-xl shadow-inner">
        <Logo className="h-10 w-auto" />
      </div>
      <button
        onClick={onClose}
        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  const CartBanner = () => (
    <button
      onClick={() => handleNavClick('/checkout')}
      className="w-full flex items-center justify-between px-5 py-3.5 bg-brand-green/10 border-b border-brand-green/20 hover:bg-brand-green/15 active:bg-brand-green/20 transition flex-shrink-0"
    >
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-brand-green/20 flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-brand-green-dark" />
        </div>
        <div className="text-left">
          <p className="font-bold text-slate-900 text-sm">My Cart</p>
          <p className="text-xs text-slate-500">
            {cartCount > 0 ? `${cartCount} item${cartCount !== 1 ? 's' : ''} awaiting checkout` : 'No items yet'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {cartCount > 0 && (
          <span className="w-6 h-6 bg-brand-green text-white text-xs font-extrabold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
        <ArrowUpRight className="w-4 h-4 text-brand-green" />
      </div>
    </button>
  );

  const NavGrid = () => (
    <div className="px-4 pt-4 pb-2 flex-shrink-0">
      <p className="text-[11px] uppercase tracking-widest font-extrabold text-slate-400 mb-3 px-1">
        Navigation
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className="flex items-center space-x-2.5 p-3.5 bg-slate-50 hover:bg-slate-100 active:scale-95 rounded-2xl border border-slate-200/80 transition text-left"
          >
            <span className="text-brand-blue">{item.icon}</span>
            <span className="font-semibold text-slate-800 text-xs leading-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const CategoryGrid = () => (
    <div className="px-4 pt-4 pb-2 flex-shrink-0">
      <p className="text-[11px] uppercase tracking-widest font-extrabold text-slate-400 mb-3 px-1">
        Print Categories
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {MOCK_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleNavClick(`/subcategories?catId=${cat.id}`)}
            className="relative rounded-2xl overflow-hidden h-24 active:scale-95 transition group"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              <p className="text-white font-bold text-[11px] leading-tight line-clamp-2">{cat.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const DesktopCategoryList = () => (
    <div className="px-4 pt-4 pb-2 flex-shrink-0">
      <p className="text-[11px] uppercase tracking-widest font-extrabold text-slate-400 mb-3 px-1">
        Print Categories
      </p>
      <div className="space-y-1">
        {MOCK_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleNavClick(`/subcategories?catId=${cat.id}`)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-xs leading-tight">{cat.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{cat.productCount}+ products</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-blue transition" />
          </button>
        ))}
      </div>
    </div>
  );

  const SupportFooter = () => (
    <div className="mx-4 mt-2 mb-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-brand-green/15 flex items-center justify-center">
          <Phone className="w-4 h-4 text-brand-green-dark" />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-xs">Customer Support</p>
          <p className="text-brand-blue font-semibold text-xs">+91 75950 31319</p>
        </div>
      </div>
      <ShieldCheck className="w-5 h-5 text-brand-green opacity-70" />
    </div>
  );

  return (
    <>
      {/* ── Shared Backdrop ── */}
      <div
        ref={backdropRef}
        onClick={onClose}
        style={{ display: 'none', opacity: 0, pointerEvents: 'none' }}
        className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50"
      />

      {/* ──────────────────────────────────────────────────────────────
           MOBILE: Bottom Sheet (< md)
           Starts off-screen at translateY(100%)
      ────────────────────────────────────────────────────────────── */}
      <div
        ref={mobileSheetRef}
        className="fixed left-0 right-0 bottom-0 z-[60] md:hidden"
        style={{ transform: 'translateY(100%)' }}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation Menu"
      >
        {/* Drag Handle */}
        <div className="flex justify-center bg-white pt-2.5 rounded-t-3xl">
          <div className="w-10 h-1.5 bg-slate-300 rounded-full mb-1" />
        </div>

        <div className="bg-white max-h-[88vh] flex flex-col overflow-hidden">
          <DrawerHeader />
          <div className="overflow-y-auto overscroll-contain flex-1 pb-safe">
            <CartBanner />
            <NavGrid />
            <CategoryGrid />
            <SupportFooter />
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────
           DESKTOP: Side Panel (md+)
           Starts off-screen at translateX(-100%)
      ────────────────────────────────────────────────────────────── */}
      <aside
        ref={desktopPanelRef}
        className="fixed top-0 left-0 bottom-0 w-80 bg-white z-[60] shadow-2xl hidden md:flex flex-col"
        style={{ transform: 'translateX(-100%)' }}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation Menu"
      >
        <DrawerHeader />
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <CartBanner />
          {/* Desktop nav list */}
          <div className="px-4 pt-4 pb-2">
            <p className="text-[11px] uppercase tracking-widest font-extrabold text-slate-400 mb-3 px-1">
              Navigation
            </p>
            <div className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 transition text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-brand-blue">{item.icon}</span>
                    <span className="font-semibold text-slate-800 text-sm">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-blue transition" />
                </button>
              ))}
            </div>
          </div>
          <DesktopCategoryList />
          <SupportFooter />
        </div>
      </aside>
    </>
  );
};
