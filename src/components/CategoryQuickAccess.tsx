import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Briefcase, Megaphone, Sparkles, Gift, ChevronRight } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

const iconMap: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />,
  Megaphone: <Megaphone className="w-6 h-6 sm:w-7 sm:h-7" />,
  Sparkles: <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />,
  Gift: <Gift className="w-6 h-6 sm:w-7 sm:h-7" />
};

const categoryColors = [
  { bg: 'bg-brand-blue', text: 'text-brand-blue', glow: 'shadow-brand-blue/20', border: 'border-brand-blue/20', iconBg: 'bg-brand-blue/10' },
  { bg: 'bg-orange-500', text: 'text-orange-600', glow: 'shadow-orange-500/20', border: 'border-orange-200', iconBg: 'bg-orange-50' },
  { bg: 'bg-rose-500', text: 'text-rose-600', glow: 'shadow-rose-500/20', border: 'border-rose-200', iconBg: 'bg-rose-50' },
  { bg: 'bg-brand-green', text: 'text-brand-green-dark', glow: 'shadow-brand-green/20', border: 'border-brand-green/20', iconBg: 'bg-brand-green/10' },
];

export const CategoryQuickAccess: React.FC = () => {
  const { categories, loadingCatalog } = useCatalog();
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = barRef.current?.querySelectorAll('.cat-card');
    if (cards?.length) {
      gsap.fromTo(
        cards,
        { y: 18, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, { scope: barRef });

  return (
    <section className="bg-white border-b border-slate-200/80 shadow-sm md:sticky md:top-[72px] md:z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Section Label */}
        <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-400 text-center mb-3 hidden sm:block">
          Our Print Collections
        </p>

        {/* 4-Column grid — all visible at once */}
        {loadingCatalog ? (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 animate-pulse">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-24 sm:h-32 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div ref={barRef} className="grid grid-cols-4 gap-2 sm:gap-4">
            {categories.slice(0, 4).map((cat, idx) => {
              const color = categoryColors[idx % categoryColors.length];
              return (
                <Link
                  key={cat.id}
                  to={`/subcategories?catId=${cat.id}`}
                  className={`cat-card group relative flex flex-col items-center text-center gap-1.5 sm:gap-2.5 p-2.5 sm:p-4 rounded-2xl border ${color.border} bg-white hover:bg-slate-50 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md ${color.glow} overflow-hidden`}
                >
                  <div className={`absolute -bottom-3 -right-3 w-16 h-16 rounded-full ${color.bg} opacity-5 group-hover:opacity-10 transition-opacity`} />

                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${color.iconBg} ${color.text} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                    {iconMap[cat.iconName || 'Briefcase'] || <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />}
                  </div>

                  <div className="space-y-0.5">
                    <p className={`font-extrabold text-[10px] sm:hidden text-slate-800 leading-tight line-clamp-2`}>
                      {cat.name.split('&')[0].trim().split(' ').slice(0, 2).join(' ')}
                    </p>
                    <p className={`hidden sm:block font-extrabold text-xs sm:text-sm text-slate-800 leading-tight`}>
                      {cat.name}
                    </p>
                    <p className="hidden sm:block text-[10px] text-slate-500 font-medium">
                      Explore
                    </p>
                  </div>

                  <div className={`hidden sm:flex items-center space-x-1 text-[11px] font-bold ${color.text} opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all`}>
                    <span>Explore</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
