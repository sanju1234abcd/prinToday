import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  Zap,
  ShieldCheck,
  Percent,
  ArrowRight,
  Star,
  Printer,
  CheckCircle2
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        headlineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
        .fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          badgesRef.current?.children ? Array.from(badgesRef.current.children) : [],
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1 },
          '-=0.2'
        );

      // Number Tween for Counter
      const counterObj = { val: 0 };
      gsap.to(counterObj, {
        val: 10480,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.floor(counterObj.val).toLocaleString() + '+';
          }
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-brand-navy via-[#161B33] to-brand-dark text-white pt-10 pb-16 sm:pt-16 sm:pb-24"
    >
      {/* Dynamic Background Patterns & Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue/30 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-green/20 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Quick Action Badges */}
            <div
              ref={badgesRef}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3"
            >
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-brand-green/15 border border-brand-green/30 text-brand-green text-xs font-extrabold rounded-full">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Same-Day Dispatch</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-brand-blue-soft/10 border border-brand-blue-light/30 text-blue-300 text-xs font-extrabold rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Free Digital Proof</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-extrabold rounded-full">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                <span>Bulk Discounts</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1
              ref={headlineRef}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none text-white"
            >
              High-Quality Custom Prints,{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-green via-emerald-300 to-teal-200">
                Delivered to Your Doorstep.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Flex Banners, Visiting Cards, Standees, Promo Tables & Customized Personal Gifts crafted with 1440 DPI precision.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-500 hover:to-brand-green text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-brand-green/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <span>Explore Printing Catalog</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/subcategories?catId=cat-marketing"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base rounded-2xl border border-white/20 transition-all flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4 text-brand-green" />
                <span>Order Flex Banners</span>
              </Link>
            </div>

            {/* Trust Counter Section */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <span
                  ref={counterRef}
                  className="text-2xl font-extrabold text-white font-mono"
                >
                  0+
                </span>
                <span className="leading-tight text-slate-400 font-medium">
                  Orders<br />Delivered
                </span>
              </div>

              <div className="w-px h-8 bg-slate-800 hidden sm:block" />

              <div className="flex items-center space-x-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-extrabold text-white text-sm">4.9★</span>
                <span className="text-slate-400">Customer Rating</span>
              </div>

              <div className="w-px h-8 bg-slate-800 hidden sm:block" />

              <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-brand-green" />
                <span>GST Tax Invoicing</span>
              </div>
            </div>

          </div>

          {/* Right Visual Showcase Card */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Banner Graphic Box */}
              <div className="glass-dark p-4 sm:p-6 rounded-3xl border border-white/15 shadow-2xl relative z-10 transform hover:rotate-1 transition-all duration-500">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                  <img
                    src="https://images.unsplash.com/photo-1542744094-3a3121699479?auto=format&fit=crop&w=1000&q=80"
                    alt="PrinToday Products Showcase"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <span className="px-2.5 py-1 bg-brand-green text-white font-extrabold text-[11px] rounded-md self-start mb-1">
                      1440 DPI HD PRINTING
                    </span>
                    <p className="text-white font-bold text-base sm:text-lg">
                      Outdoor Flex Banners & Standees
                    </p>
                    <p className="text-slate-300 text-xs">
                      Custom dimensions with live square footage price calculator.
                    </p>
                  </div>
                </div>

                {/* Floating Product Badges */}
                <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 p-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/15 text-brand-green-dark flex items-center justify-center font-bold text-lg">
                    ⚡
                  </div>
                  <div>
                    <p className="text-xs font-bold">24-Hour Dispatch</p>
                    <p className="text-[10px] text-slate-500">Pan-India Express Shipping</p>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-brand-navy text-white p-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-700">
                  <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center text-white font-bold text-sm">
                    3D
                  </div>
                  <div>
                    <p className="text-xs font-bold">Live Proofing</p>
                    <p className="text-[10px] text-slate-400">Free PDF Design Proof</p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
