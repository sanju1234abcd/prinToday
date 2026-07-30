import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ChevronDown, ShieldCheck, Lock, Headphones } from 'lucide-react';
import { MOCK_FAQS } from '../data/mockData';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  useGSAP(() => {
    contentRefs.current.forEach((el, index) => {
      if (!el) return;
      if (openIdx === index) {
        gsap.to(el, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' });
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
      }
    });
  }, [openIdx]);

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-brand-green font-extrabold text-xs uppercase tracking-wider px-3.5 py-1 bg-brand-green/10 rounded-full inline-block mb-3">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {MOCK_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-slate-900 text-sm sm:text-base hover:text-brand-blue transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transform transition-transform duration-300 ${
                    openIdx === idx ? 'rotate-180 text-brand-green' : ''
                  }`}
                />
              </button>

              <div
                ref={el => (contentRefs.current[idx] = el)}
                className="h-0 opacity-0 overflow-hidden"
              >
                <div className="p-4 sm:p-5 pt-0 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Row Badges */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-slate-700">
            <ShieldCheck className="w-5 h-5 text-brand-green" />
            <span>100% Quality Guarantee</span>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-slate-700">
            <Lock className="w-5 h-5 text-brand-blue" />
            <span>256-Bit Secure Checkout</span>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-slate-700">
            <Headphones className="w-5 h-5 text-purple-600" />
            <span>24/7 Priority Phone Support</span>
          </div>
        </div>

      </div>
    </section>
  );
};
