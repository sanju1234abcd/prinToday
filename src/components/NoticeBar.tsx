import React from 'react';
import { PhoneCall, ShieldCheck, Truck, FileText } from 'lucide-react';

export const NoticeBar: React.FC = () => {
  return (
    <div className="bg-brand-navy text-white text-xs font-medium py-2 overflow-hidden border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Mobile Marquee */}
        <div className="flex sm:hidden overflow-hidden whitespace-nowrap w-full">
          <div className="animate-marquee flex items-center space-x-8 text-slate-300">
            <span className="flex items-center space-x-1">
              <PhoneCall className="w-3.5 h-3.5 text-brand-green" />
              <span>For Enquiry Call: <strong className="text-white">+91 98765 43210</strong></span>
            </span>
            <span className="flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-brand-green" />
              <span>GSTIN: <strong className="text-white">07AAAAA0000A1Z5</strong></span>
            </span>
            <span className="flex items-center space-x-1">
              <Truck className="w-3.5 h-3.5 text-brand-green" />
              <span>Free Express Delivery on Orders &gt; ₹999</span>
            </span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
              <span>100% Print Satisfaction Guarantee</span>
            </span>
          </div>
        </div>

        {/* Desktop Static Items */}
        <div className="hidden sm:flex items-center space-x-6 text-slate-300">
          <span className="flex items-center space-x-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-brand-green" />
            <span>Hotline: <a href="tel:+919876543210" className="hover:text-brand-green font-semibold text-white transition">+91 98765 43210</a></span>
          </span>
          <span className="flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-brand-green" />
            <span>GSTIN: <span className="font-mono text-white">07AAAAA0000A1Z5</span></span>
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-6 text-slate-300">
          <span className="flex items-center space-x-1.5">
            <Truck className="w-3.5 h-3.5 text-brand-green" />
            <span>Free Shipping &gt; ₹999</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
            <span>Free 2D Digital Proofing</span>
          </span>
        </div>
      </div>
    </div>
  );
};
