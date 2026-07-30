import React from 'react';
import { Star, Quote } from 'lucide-react';
import { MOCK_TESTIMONIALS } from '../data/mockData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-white border-t border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-blue font-extrabold text-xs uppercase tracking-wider px-3.5 py-1 bg-brand-blue-soft rounded-full inline-block mb-3">
            Real Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Loved by 10,000+ Businesses & Families
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_TESTIMONIALS.map(t => (
            <div
              key={t.id}
              className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-200" />
              
              <div className="space-y-4">
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-slate-200/60 mt-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-brand-green/30"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{t.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
