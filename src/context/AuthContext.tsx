import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface UserProfile {
  _id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  accountType: 'INDIVIDUAL' | 'ORGANIZATION';
  mobileNumber?: string;
  individual?: {
    name: string;
    address?: {
      houseNo: string;
      buildingName?: string;
      streetName: string;
      area: string;
      pin: string;
    };
  };
  organization?: {
    companyName: string;
    contactName: string;
    designation?: string;
    creditEligible: boolean;
    physicalVerificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
    gstin?: string;
    address?: {
      houseNo: string;
      buildingName?: string;
      streetName: string;
      area: string;
      pin: string;
    };
  };
}

interface RegisterPayload {
  email: string;
  mobile: string;
  accountType: 'INDIVIDUAL' | 'ORGANIZATION';
  name?: string;
  companyName?: string;
  contactName?: string;
  designation?: string;
  gstin?: string;
  hasGstin?: boolean;
  addressProofUrl?: string;
  address: { houseNo: string; buildingName?: string; streetName: string; area: string; pin: string };
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (identifier: string) => Promise<void>;
  findAccount: (mobile: string) => Promise<{ maskedEmail: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (payload: { individual?: any, organization?: any }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const register = async (payload: RegisterPayload) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || 'Registration failed');
      (err as any).code = data.code;
      throw err;
    }
    await refreshUser();
  };

  const login = async (identifier: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ identifier })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    await refreshUser();
  };

  const findAccount = async (mobile: string) => {
    const res = await fetch(`${API}/auth/find-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to find account');
    return { maskedEmail: data.maskedEmail };
  };

  const logout = async () => {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  const updateProfile = async (payload: { individual?: any, organization?: any }) => {
    const res = await fetch(`${API}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    setUser(data.data);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      register,
      login,
      findAccount,
      logout,
      refreshUser,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
