import React from 'react';
import { Zap, Palette, PackageCheck, Receipt } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-7 h-7 text-amber-500" />,
    title: '⚡ Fast Turnaround Time',
    description: 'Same-day flex printing & 24-hour dispatch for visiting cards and standees.'
  },
  {
    icon: <Palette className="w-7 h-7 text-brand-green" />,
    title: '🎨 1440 DPI HD Printing',
    description: 'Ultra-vibrant eco-solvent inks and Japanese precision printing hardware.'
  },
  {
    icon: <PackageCheck className="w-7 h-7 text-brand-blue" />,
    title: '📦 Damage-Proof Packaging',
    description: 'Heavy-duty hard tubes and bubble reinforced boxes prevent transit damage.'
  },
  {
    icon: <Receipt className="w-7 h-7 text-emerald-600" />,
    title: '💰 Corporate GST Invoicing',
    description: 'Input tax credit ready tax invoices emailed automatically with every order.'
  }
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Thousands Trust PrinToday
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            The gold standard in Indian commercial print-on-demand.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                {feat.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
