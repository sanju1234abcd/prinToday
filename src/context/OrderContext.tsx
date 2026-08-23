import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, Product, ShippingAddress, CartItem } from '../types';
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

interface OrderContextType {
  orders: Order[];
  loadingOrders: boolean;
  placeOrder: (shippingAddress: ShippingAddress, items: CartItem[], paymentMethod: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: Order['status'], expectedDate?: string) => Promise<void>;
  fetchAdminOrders: () => Promise<Order[]>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_KEY = 'printoday_orders';

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const refreshOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API}/orders/my-orders`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const normalized = (data.data || []).map((o: any) => ({ ...o, id: o._id || o.id }));
        setOrders(normalized);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);



  const placeOrder = async (shippingAddress: ShippingAddress, items: CartItem[], paymentMethod: string): Promise<Order> => {
    // Build complete API-compatible items array
    const apiItems = items.map(item => {
      const widthFt = item.customDimensions
        ? (item.customDimensions.unit === 'ft'
          ? item.customDimensions.width
          : item.customDimensions.width / 12)
        : undefined;
      const heightFt = item.customDimensions
        ? (item.customDimensions.unit === 'ft'
          ? item.customDimensions.height
          : item.customDimensions.height / 12)
        : undefined;

      return {
        productId: item.product._id || item.product.id,
        quantity: item.quantity,
        calculatedUnitPrice: item.unitPrice,
        widthFt,
        heightFt,
        totalSqFt: item.customDimensions?.totalSqFt,
        artworkUrl: item.artworkFile?.previewUrl || null,
        appliedTier: null // We don't track the exact tier object locally currently, but the backend recalculates it. If required, we can pass it.
      };
    });

    // Build backend shipping address from the unified ShippingAddress type
    const backendShippingAddress = {
      houseNo: shippingAddress.houseNo,
      buildingName: shippingAddress.buildingName,
      streetName: shippingAddress.streetName,
      area: shippingAddress.area,
      pin: shippingAddress.pin
    };

    const res = await fetch(`${API}/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        items: apiItems,
        shippingAddress: backendShippingAddress,
        paymentMethod,
        customerName: shippingAddress.fullName,
        customerEmail: shippingAddress.email,
        customerPhone: shippingAddress.phone,
        gstin: shippingAddress.gstin
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Checkout failed');
    }

    const newOrder: Order = { ...data.data, id: data.data._id };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const fetchAdminOrders = async (): Promise<Order[]> => {
    const res = await fetch(`${API}/admin/orders`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch admin orders');
    const data = await res.json();
    return (data.data || []).map((o: any) => ({ ...o, id: o._id || o.id }));
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status'], expectedDate?: string): Promise<void> => {
    const res = await fetch(`${API}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ orderStatus: newStatus, expectedDate }),
    });
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to update status');
    }

    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loadingOrders,
        placeOrder,
        updateOrderStatus,
        fetchAdminOrders,
        refreshOrders
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
