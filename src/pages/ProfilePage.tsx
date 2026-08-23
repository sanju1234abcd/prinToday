import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Mail, Phone, MapPin, Building2, Save, FileCheck, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  // State for forms
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [designation, setDesignation] = useState('');
  const [gstin, setGstin] = useState('');
  
  // Address State
  const [houseNo, setHouseNo] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [streetName, setStreetName] = useState('');
  const [area, setArea] = useState('');
  const [pin, setPin] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (user.accountType === 'INDIVIDUAL' && user.individual) {
      setName(user.individual.name || '');
      setHouseNo(user.individual.address?.houseNo || '');
      setBuildingName(user.individual.address?.buildingName || '');
      setStreetName(user.individual.address?.streetName || '');
      setArea(user.individual.address?.area || '');
      setPin(user.individual.address?.pin || '');
    } else if (user.accountType === 'ORGANIZATION' && user.organization) {
      setCompanyName(user.organization.companyName || '');
      setContactName(user.organization.contactName || '');
      setDesignation(user.organization.designation || '');
      setGstin(user.organization.gstin || '');
      setHouseNo(user.organization.address?.houseNo || '');
      setBuildingName(user.organization.address?.buildingName || '');
      setStreetName(user.organization.address?.streetName || '');
      setArea(user.organization.address?.area || '');
      setPin(user.organization.address?.pin || '');
    }
  }, [user, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const address = { houseNo, buildingName, streetName, area, pin };

    try {
      if (user?.accountType === 'INDIVIDUAL') {
        await updateProfile({ individual: { name, address } });
      } else {
        await updateProfile({
          organization: { companyName, contactName, designation, gstin, address }
        });
      }
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="py-8 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center space-x-3">
              <User className="w-8 h-8 text-brand-blue" />
              <span>My Profile Dashboard</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Manage your personal and business details.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/orders" className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-brand-blue hover:border-brand-blue font-bold text-sm rounded-xl transition flex items-center space-x-2 shadow-sm">
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-sm rounded-xl transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Read Only Important Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Email</p>
              <p className="font-semibold text-slate-900 mt-0.5">{user.email}</p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-brand-green" />
                <span>Verified • Contact support to change</span>
              </p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-brand-green/10 rounded-xl text-brand-green">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile Number</p>
              <p className="font-semibold text-slate-900 mt-0.5">{user.mobileNumber || 'Not provided'}</p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-brand-green" />
                <span>Verified • Contact support to change</span>
              </p>
            </div>
          </div>
        </div>

        {/* Editable Profile Form */}
        <form onSubmit={handleUpdate} className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              {user.accountType === 'ORGANIZATION' ? (
                <><Building2 className="w-5 h-5 text-brand-navy" /> <span>Business Details</span></>
              ) : (
                <><User className="w-5 h-5 text-brand-blue" /> <span>Personal Details</span></>
              )}
            </h2>
            <span className="px-3 py-1 bg-slate-200 text-slate-700 text-[10px] font-extrabold rounded uppercase tracking-widest">
              {user.accountType} ACCOUNT
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Conditional Fields based on Account Type */}
            {user.accountType === 'INDIVIDUAL' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">GSTIN Number (Optional)</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={e => setGstin(e.target.value.toUpperCase())}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Representative Contact Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition"
                  />
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-4">
                <MapPin className="w-4 h-4 text-brand-blue" />
                <span>Default Address</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Flat / House No.</label>
                  <input
                    type="text"
                    required
                    value={houseNo}
                    onChange={e => setHouseNo(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Building Name (Optional)</label>
                  <input
                    type="text"
                    value={buildingName}
                    onChange={e => setBuildingName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Street Address</label>
                  <input
                    type="text"
                    required
                    value={streetName}
                    onChange={e => setStreetName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Locality / Area</label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition"
                  />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-bold">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-brand-green/10 border border-brand-green/20 text-brand-green rounded-xl text-sm font-bold flex items-center space-x-2">
                <FileCheck className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center space-x-2 disabled:opacity-60"
              >
                {loading ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
