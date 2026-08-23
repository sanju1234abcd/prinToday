import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowUpRight, Briefcase, Megaphone, Sparkles, Gift } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

const iconMap: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />,
  Megaphone: <Megaphone className="w-5 h-5 sm:w-6 sm:h-6" />,
  Sparkles: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
  Gift: <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
};

export const CoreCategoryGrid: React.FC = () => {
  const { categories, loadingCatalog } = useCatalog();
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gridRef.current?.querySelectorAll('.category-card');
      if (cards && cards.length) {
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.12, ease: 'power3.out' }
        );
      }
    },
    { scope: gridRef }
  );

  return (
    <section className="
      /* Mobile: no vertical padding, fill available viewport height */
      bg-slate-50 relative
      pt-0 pb-0
      /* Desktop: comfortable padding */
      sm:py-20
    ">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col sm:block">

        {/* ── Section Heading ── (hidden on mobile, shown on desktop) */}
        <div className="hidden sm:block text-center max-w-3xl mx-auto mb-14">
          <span className="text-brand-blue font-extrabold text-xs uppercase tracking-wider px-3.5 py-1 bg-brand-blue-soft/80 rounded-full">
            Core Collections
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            What Would You Like to Print Today?
          </h2>
        </div>

        {/* ── Mobile title (compact) ── */}
        <div className="sm:hidden pt-3 pb-3 px-1 flex-shrink-0">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight text-center">
            What Would You Like to <span className="text-brand-blue">Print Today?</span>
          </h2>
        </div>

        {/* ── 2×2 Grid ── */}
        {loadingCatalog ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-8 pb-3 sm:pb-0 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-slate-200 rounded-2xl sm:rounded-3xl h-40 sm:h-72"></div>
            ))}
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-2 gap-2.5 sm:gap-8 pb-3 sm:pb-0"
          >
            {categories.slice(0, 4).map(category => (
              <Link
                key={category.id}
                to={`/subcategories?catId=${category.id}`}
                className="category-card group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-slate-200/80 transition-all duration-300 hover:-translate-y-1 h-40 sm:h-72"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-900/10" />
                </div>

                {/* Icon badge — top left */}
                <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-md text-brand-blue flex items-center justify-center shadow-lg group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                  {iconMap[category.iconName || 'Briefcase'] || <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />}
                </div>

                {/* Arrow — top right */}
                <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-white group-hover:text-brand-navy transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Text overlay — bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-8 text-white space-y-1 sm:space-y-2">
                  <span className="hidden sm:inline-block text-[11px] font-extrabold uppercase tracking-wider text-brand-green bg-brand-green/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    Explore
                  </span>

                  <h3 className="text-sm sm:text-2xl font-extrabold tracking-tight leading-snug group-hover:text-brand-green transition-colors line-clamp-2">
                    {category.name}
                  </h3>

                  <p className="hidden sm:block text-slate-300 text-xs sm:text-sm line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
