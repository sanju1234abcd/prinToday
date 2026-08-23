import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_SUBCATEGORIES } from '../data/mockData';

export const HeaderSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 100% Client-side filtering using useMemo
  const { filteredCategories, filteredSubcategories } = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return { filteredCategories: [], filteredSubcategories: [] };
    }

    // Match categories
    const matchedCategories = MOCK_CATEGORIES.filter(
      cat =>
        cat.name.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query)
    );

    // Match subcategories (also match by parent category name)
    const matchedSubcategories = MOCK_SUBCATEGORIES.filter(sub => {
      const parentCat = MOCK_CATEGORIES.find(c => c.id === sub.categoryId);
      return (
        sub.name.toLowerCase().includes(query) ||
        sub.description.toLowerCase().includes(query) ||
        (parentCat && parentCat.name.toLowerCase().includes(query))
      );
    });

    return {
      filteredCategories: matchedCategories,
      filteredSubcategories: matchedSubcategories
    };
  }, [searchQuery]);

  const handleSelectCategory = (categoryId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/subcategories?catId=${categoryId}`);
  };

  const handleSelectSubcat = (subcatId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/products?subId=${subcatId}`);
  };

  return (
    <div ref={containerRef} className="w-full relative">
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
          placeholder="Search Services & Products..."
          className="w-full pl-10 pr-10 py-2.5 bg-slate-100/90 focus:bg-white text-slate-900 text-sm rounded-full border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition outline-none shadow-inner"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              searchInputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 focus:outline-none rounded-full hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Floating Popover Displaying Matches */}
      {isSearchOpen && searchQuery.trim() !== '' && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[60vh] overflow-y-auto z-50 p-3 space-y-4">
          {filteredCategories.length === 0 && filteredSubcategories.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs sm:text-sm">
              No matching categories or services found for "{searchQuery}".
            </div>
          ) : (
            <>
              {/* Categories Matches */}
              {filteredCategories.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                    Categories
                  </p>
                  <div className="space-y-1">
                    {filteredCategories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.id)}
                        className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-100"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{cat.name}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{cat.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Subcategories (Services & Products) Matches */}
              {filteredSubcategories.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 mt-3">
                    Services & Products (Subcategories)
                  </p>
                  <div className="space-y-1">
                    {filteredSubcategories.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => handleSelectSubcat(sub.id)}
                        className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition text-left group"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={sub.image}
                            alt={sub.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-100"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-900 group-hover:text-brand-blue transition-colors">{sub.name}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{sub.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
