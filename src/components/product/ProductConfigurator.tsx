import React from 'react';
import { Product } from '../../types';

export interface ProductConfiguratorProps {
  product: Product;
  hideActions?: boolean;
}

export const ProductConfigurator: React.FC<ProductConfiguratorProps> = ({ product, hideActions }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
      <h3 className="font-extrabold text-slate-900 text-lg">Product Configurator Preview</h3>
      <p className="text-sm text-slate-600">Simulating {product.title}</p>
      
      {!hideActions && (
        <button className="px-4 py-2 bg-brand-blue text-white rounded-lg">
          Add to Cart
        </button>
      )}
    </div>
  );
};
