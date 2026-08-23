import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Category, Subcategory, Product } from '../types';
import { MOCK_CATEGORIES, MOCK_SUBCATEGORIES, MOCK_PRODUCTS } from '../data/mockData';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

interface CatalogContextType {
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  loadingCatalog: boolean;
  refreshCatalog: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

// Categories & subcategories are real and hardcoded — no backend call needed, reduces load
const CATEGORIES: Category[] = MOCK_CATEGORIES;
const SUBCATEGORIES: Subcategory[] = MOCK_SUBCATEGORIES;

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const refreshCatalog = useCallback(async () => {
    setLoadingCatalog(true);
    try {
      const prodRes = await fetch(`${API}/catalog/products`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        const fetched = prodData.data?.map((p: any) => ({ ...p, id: p._id || p.id })) || [];
        if (fetched.length > 0) setProducts(fetched);
      }
    } catch (err) {
      console.error('Failed to fetch products, using mock data:', err);
      // Keep MOCK_PRODUCTS as fallback
    } finally {
      setLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  return (
    <CatalogContext.Provider
      value={{
        categories: CATEGORIES,
        subcategories: SUBCATEGORIES,
        products,
        loadingCatalog,
        refreshCatalog,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return ctx;
};
