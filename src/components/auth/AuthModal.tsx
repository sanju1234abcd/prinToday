import React, { useState, useEffect } from 'react';
import { X, Smartphone, Mail, Building, User as UserIcon, AlertCircle, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  
  const [regType, setRegType] = useState<'INDIVIDUAL' | 'ORGANIZATION'>('INDIVIDUAL');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login Form
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState(''); // Keep for registration

  // Register Form
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState({
    name: '',
    companyName: '',
    contactName: '',
    designation: '',
    houseNo: '',
    streetName: '',
    area: '',
    pin: '',
    gstin: ''
  });
  
  const [hasGstin, setHasGstin] = useState(true);
  const [addressProofFile, setAddressProofFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTab('LOGIN');
      setIdentifier('');
      setEmail('');
      setAddressProofFile(null);
      setHasGstin(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- LOGIN FLOW ---

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(identifier);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // --- REGISTER FLOW ---

  const handleRegisterDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (regType === 'ORGANIZATION' && !hasGstin && !addressProofFile) {
      setError('Please upload an address proof if you do not have a GSTIN.');
      setLoading(false);
      return;
    }

    const address = {
      houseNo: details.houseNo || 'N/A',
      streetName: details.streetName,
      area: details.area,
      pin: details.pin
    };

    let addressProofUrl = '';
    try {
      if (regType === 'ORGANIZATION' && !hasGstin && addressProofFile) {
        addressProofUrl = await uploadToCloudinary(addressProofFile);
      }

      await register({
        email,
        mobile: phone,
        accountType: regType,
        name: details.name,
        companyName: details.companyName,
        contactName: details.contactName,
        designation: details.designation,
        gstin: hasGstin ? details.gstin : undefined,
        hasGstin,
        addressProofUrl: addressProofUrl || undefined,
        address
      });
      onClose();
    } catch (err: any) {
      if (err.code === 'EMAIL_ALREADY_EXISTS') {
        setTab('LOGIN');
        setError('Email registered. Please log in.');
      } else if (err.code === 'MOBILE_ALREADY_EXISTS') {
        setError('Phone linked to existing account. Log in or use another number.');
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-extrabold text-brand-blue">PrinToday</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            className={`flex-1 py-4 font-bold text-sm text-center ${tab === 'LOGIN' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => { setTab('LOGIN'); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-4 font-bold text-sm text-center ${tab === 'REGISTER' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => { setTab('REGISTER'); setError(''); }}
          >
            Create Account
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ----- LOGIN TAB ----- */}
          {tab === 'LOGIN' && (
            <div>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email or Mobile Number</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="you@example.com or 9999999999"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-blue outline-none transition"
                    />
                  </div>
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-3 bg-brand-blue text-white font-bold rounded-xl shadow hover:bg-brand-blue-dark transition disabled:opacity-50"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </div>
          )}

          {/* ----- REGISTER TAB ----- */}
          {tab === 'REGISTER' && (
            <div>
              <form onSubmit={handleRegisterDetails} className="space-y-4 h-96 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Account Type Selection */}
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setRegType('INDIVIDUAL')}
                    className={`flex-1 p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${regType === 'INDIVIDUAL' ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-bold' : 'border-slate-200 text-slate-500'}`}
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="text-xs">Individual</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegType('ORGANIZATION')}
                    className={`flex-1 p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${regType === 'ORGANIZATION' ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-bold' : 'border-slate-200 text-slate-500'}`}
                  >
                    <Building className="w-5 h-5" />
                    <span className="text-xs">Business / Org</span>
                  </button>
                </div>

                {/* Email & Phone */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                  </div>
                </div>

                {/* Account Type Specific Details */}
                {regType === 'INDIVIDUAL' ? (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input type="text" required name="name" value={details.name} onChange={handleDetailChange} placeholder="John Doe" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                  </div>
                ) : (
                  <>
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Business Details</h4>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Company / Organization Name</label>
                        <input type="text" required name="companyName" value={details.companyName} onChange={handleDetailChange} placeholder="e.g. Acme Corp" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Contact Person</label>
                          <input type="text" required name="contactName" value={details.contactName} onChange={handleDetailChange} placeholder="Full Name" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Designation</label>
                          <input type="text" required name="designation" value={details.designation} onChange={handleDetailChange} placeholder="e.g. Manager" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">GST Verification</h4>
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600">
                          <input type="checkbox" checked={hasGstin} onChange={(e) => setHasGstin(e.target.checked)} className="rounded text-brand-blue focus:ring-brand-blue" />
                          <span>I have a GSTIN</span>
                        </label>
                      </div>

                      {hasGstin ? (
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">GSTIN Number</label>
                          <input type="text" required name="gstin" value={details.gstin} onChange={handleDetailChange} placeholder="15-digit GSTIN" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue font-mono" />
                        </div>
                      ) : (
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Upload Business Address Proof</label>
                          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-brand-blue transition bg-slate-50">
                            <UploadCloud className="w-8 h-8 text-brand-blue mb-2" />
                            <span className="text-xs font-bold text-slate-600">{addressProofFile ? addressProofFile.name : 'Upload PDF / Image'}</span>
                            <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setAddressProofFile(e.target.files[0]);
                              }
                            }} />
                          </label>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="pt-2">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Address</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Street Address / Building</label>
                      <input type="text" required name="streetName" value={details.streetName} onChange={handleDetailChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">City / Area</label>
                        <input type="text" required name="area" value={details.area} onChange={handleDetailChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Pincode</label>
                        <input type="text" required name="pin" value={details.pin} onChange={handleDetailChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-3 mt-4 bg-brand-blue text-white font-bold rounded-xl shadow hover:bg-brand-blue-dark transition disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
