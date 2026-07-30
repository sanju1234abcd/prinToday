import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { NoticeBar } from './components/NoticeBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { SubcategoriesPage } from './pages/SubcategoriesPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <OrderProvider>
          <div className="flex flex-col min-h-screen">
            <NoticeBar />
            <Header />
            
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/subcategories" element={<SubcategoriesPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </div>

            <Footer />
          </div>
        </OrderProvider>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
