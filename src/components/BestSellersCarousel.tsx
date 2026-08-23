import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Zap, ChevronRight, ArrowRight } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

export const BestSellersCarousel: React.FC = () => {
  const { products } = useCatalog();
  const topProducts = products.slice(0, 6);

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-brand-green font-extrabold text-xs uppercase tracking-wider px-3 py-1 bg-brand-green/10 rounded-full inline-block mb-2">
              Hot Picks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trending & Best Sellers
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-brand-blue hover:text-brand-blue-dark transition flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal Swipeable Container */}
        <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none">
          {topProducts.map((product: any) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="snap-start flex-shrink-0 w-[260px] sm:w-[300px] bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Product Thumbnail */}
              <div className="relative h-44 sm:h-52 overflow-hidden bg-slate-100">
                <img
                  src={optimizeCloudinaryUrl(product.thumbnail)}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-1">
                  {product.badges.slice(0, 2).map((badge: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-brand-navy/90 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-wide rounded-md shadow-sm"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[11px] font-extrabold text-slate-900 flex items-center space-x-1 shadow">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span>{product.rating}</span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-brand-blue transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
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
                    className="px-3 py-2 bg-brand-green hover:bg-brand-green-dark text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1"
                  >
                    <span>Customize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
