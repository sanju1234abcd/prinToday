import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Heart } from 'lucide-react';
import { MOCK_CATEGORIES } from '../data/mockData';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-white pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5 bg-white p-2.5 rounded-2xl w-fit shadow-md">
              <Logo className="h-10 w-auto" />
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              PrinToday is India's leading print-on-demand platform for flex banners, visiting cards, roll-up standees, corporate promo tables, wedding invitations, and personalized gifts.
            </p>
            
            {/* WhatsApp & Call Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://wa.me/917595031319"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center space-x-2 transition shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Order Support</span>
              </a>
              <a
                href="tel:+917595031319"
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl flex items-center space-x-2 transition border border-white/15"
              >
                <Phone className="w-4 h-4 text-brand-green" />
                <span>+91 75950 31319</span>
              </a>
            </div>
          </div>

          {/* Core Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-green">
              Print Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {MOCK_CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <Link
                    to={`/subcategories?catId=${cat.id}`}
                    className="hover:text-brand-green transition"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-green">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition">All Products Catalog</Link></li>
              <li><Link to="/orders" className="hover:text-white transition">Track Order & Proofs</Link></li>
              <li><Link to="/checkout" className="hover:text-white transition">My Cart</Link></li>
              <li><Link to="/admin" className="hover:text-white transition">Admin Panel</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-green">
              Contact & Address
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <span>PrinToday Print Hub, Okhla Industrial Area Phase-III, New Delhi 110020</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-green shrink-0" />
                <span>support@printoday.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-green shrink-0" />
                <span>GSTIN: 07AAAAA0000A1Z5</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} PrinToday Inc. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for Indian Businesses & Individuals.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
