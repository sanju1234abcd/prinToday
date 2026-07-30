import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Grid } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_SUBCATEGORIES } from '../data/mockData';

export const SubcategoriesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const catId = searchParams.get('catId') || MOCK_CATEGORIES[0].id;

  const currentCategory = MOCK_CATEGORIES.find(c => c.id === catId) || MOCK_CATEGORIES[0];
  const subcategories = MOCK_SUBCATEGORIES.filter(s => s.categoryId === currentCategory.id);

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-6">
          <Link to="/" className="hover:text-brand-blue">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">{currentCategory.name}</span>
        </nav>

        {/* Category Header Banner */}
        <div className="bg-gradient-to-r from-brand-navy via-brand-blue-dark to-slate-900 rounded-3xl p-6 sm:p-10 text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3">
            <span className="text-brand-green font-extrabold text-xs uppercase tracking-wider px-3.5 py-1 bg-brand-green/20 rounded-full inline-block">
              Category Explore
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {currentCategory.name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {currentCategory.description}
            </p>
          </div>
          <div className="absolute top-0 right-0 bottom-0 w-1/3 opacity-20 hidden lg:block">
            <img
              src={currentCategory.image}
              alt={currentCategory.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Subcategories Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Grid className="w-5 h-5 text-brand-green" />
              <span>Available Subcategories</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {subcategories.length} Subcategories Found
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map(sub => (
              <Link
                key={sub.id}
                to={`/products?subId=${sub.id}`}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <h3 className="font-extrabold text-lg text-white group-hover:text-brand-green transition-colors">
                      {sub.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {sub.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-blue group-hover:text-brand-green transition-colors">
                    <span>Browse Products</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
