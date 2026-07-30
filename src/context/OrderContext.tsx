import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, Product, ShippingAddress, CartItem } from '../types';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../data/mockData';

interface OrderContextType {
  orders: Order[];
  products: Product[];
  placeOrder: (shippingAddress: ShippingAddress, items: CartItem[], paymentMethod: string) => Order;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  addProduct: (newProduct: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_KEY = 'printoday_orders';
const PRODUCTS_KEY = 'printoday_products';

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      return saved ? JSON.parse(saved) : MOCK_ORDERS;
    } catch {
      return MOCK_ORDERS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
    } catch {
      return MOCK_PRODUCTS;
    }
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  const placeOrder = (shippingAddress: ShippingAddress, items: CartItem[], paymentMethod: string): Order => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const gstAmount = subtotal * 0.18;
    const shippingFee = subtotal > 999 ? 0 : 99;
    const totalAmount = subtotal + gstAmount + shippingFee;

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      shippingAddress,
      items,
      subtotal,
      gstAmount,
      shippingFee,
      totalAmount,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      paymentMethod
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev =>
      prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        products,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
