import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, ChevronRight, SlidersHorizontal, ArrowRight, Check } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { MOCK_CATEGORIES, MOCK_SUBCATEGORIES } from '../data/mockData';

export const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const subIdParam = searchParams.get('subId');
  const catIdParam = searchParams.get('catId');
  const { products } = useOrders();

  const [selectedSubId, setSelectedSubId] = useState<string | null>(subIdParam);

  const selectedSub = MOCK_SUBCATEGORIES.find(s => s.id === selectedSubId);
  const selectedCat = MOCK_CATEGORIES.find(c => c.id === catIdParam) || (selectedSub ? MOCK_CATEGORIES.find(c => c.id === selectedSub.categoryId) : null);

  const filteredProducts = products.filter(p => {
    if (selectedSubId) return p.subcategoryId === selectedSubId;
    if (catIdParam) return p.categoryId === catIdParam;
    return true;
  });

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-6">
          <Link to="/" className="hover:text-brand-blue">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-brand-blue">Catalog</Link>
          {selectedCat && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-900">{selectedCat.name}</span>
            </>
          )}
          {selectedSub && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-brand-blue">{selectedSub.name}</span>
            </>
          )}
        </nav>

        {/* Page Title & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {selectedSub ? selectedSub.name : selectedCat ? selectedCat.name : 'Print-on-Demand Catalog'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select product configurations, upload custom artwork & instantly preview live pricing.
            </p>
          </div>

          {/* Subcategory Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedSubId(null)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedSubId === null
                  ? 'bg-brand-blue text-white shadow'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              All Products
            </button>
            {MOCK_SUBCATEGORIES.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubId(sub.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  selectedSubId === sub.id
                    ? 'bg-brand-blue text-white shadow'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No products found for this subcategory</h3>
            <p className="text-xs text-slate-500 mt-1">Try selecting a different filter above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col space-y-1">
                      {product.badges.map((b, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-brand-navy/90 backdrop-blur-md text-white text-[10px] font-extrabold rounded-md shadow"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-[11px] font-extrabold text-slate-900 flex items-center space-x-1 shadow">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-brand-blue transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Quick Specs Badges */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {product.requirements.requiresArtworkUpload && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold text-[10px] rounded-md">
                          Artwork Required
                        </span>
                      )}
                      {product.requirements.requiresCustomDimensions && (
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-[10px] rounded-md">
                          Custom SqFt Calc
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Price & Action */}
                <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Starting At
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-brand-blue">
                      ₹{product.basePrice}
                      <span className="text-xs text-slate-500 font-normal">
                        {product.pricingType === 'per_sqft' ? ' / sq.ft' : ''}
                      </span>
                    </span>
                  </div>

                  <Link
                    to={`/product/${product.id}`}
                    className="px-4 py-2 bg-gradient-to-r from-brand-green to-emerald-600 hover:from-emerald-600 hover:to-brand-green text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1"
                  >
                    <span>Customize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
