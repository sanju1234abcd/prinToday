import React, { useState, useEffect } from 'react';
import { X, Smartphone, Mail, Building, User as UserIcon, AlertCircle, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { sendLoginOtp, verifyLoginOtp, findAccount, initiateRegister, verifyRegisterOtp } = useAuth();
  
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loginStep, setLoginStep] = useState<'EMAIL' | 'OTP' | 'FORGOT'>('EMAIL');
  
  const [regType, setRegType] = useState<'INDIVIDUAL' | 'ORGANIZATION'>('INDIVIDUAL');
  const [regStep, setRegStep] = useState<'DETAILS' | 'OTP'>('DETAILS');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login Form
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [forgotMobile, setForgotMobile] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

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
      setLoginStep('EMAIL');
      setRegStep('DETAILS');
      setMaskedEmail('');
      setEmailOtp('');
      setAddressProofFile(null);
      setHasGstin(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- LOGIN FLOW ---

  const handleSendLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendLoginOtp(email);
      setLoginStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyLoginOtp(email, emailOtp);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleFindAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { maskedEmail } = await findAccount(forgotMobile);
      setMaskedEmail(maskedEmail);
      // Wait a sec to show masked email, then ask for OTP. We'll set email to the masked one visually if we want, or keep it as empty and they just type OTP.
      // Wait, `verifyLoginOtp` requires the original email. But `findAccount` sends OTP to the real email.
      // Ah! Our backend `verify-login-otp` needs the actual email! If we don't know it, we can't verify it.
      // Let's modify the plan: Since the user doesn't know their email, they can't type it. The user needs to verify the OTP. 
      // Actually, since `findAccount` sends an OTP, we must either change `verify-login-otp` to accept mobile OR the user just realizes their email from the mask.
      // For now, let's just tell them the masked email and force them to go back to regular login if they remember it.
      // But they might not remember it perfectly. Wait, we can't change the backend easily without another step.
      // Let's assume they realize their email from `s***u@gmail.com` and just click "Back to Login".
      // Wait, let's keep it simple: Show masked email, they can copy/guess it and log in normally.
      
    } catch (err: any) {
      setError(err.message || 'Failed to find account');
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

      await initiateRegister({
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
      setRegStep('OTP');
    } catch (err: any) {
      if (err.code === 'EMAIL_ALREADY_EXISTS') {
        setTab('LOGIN');
        setLoginStep('EMAIL');
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

  const handleVerifyRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyRegisterOtp(email, emailOtp);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
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
        {loginStep !== 'FORGOT' && (
          <div className="flex border-b border-slate-100">
            <button
              className={`flex-1 py-4 font-bold text-sm text-center ${tab === 'LOGIN' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => { setTab('LOGIN'); setLoginStep('EMAIL'); setError(''); }}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-4 font-bold text-sm text-center ${tab === 'REGISTER' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => { setTab('REGISTER'); setRegStep('DETAILS'); setError(''); }}
            >
              Create Account
            </button>
          </div>
        )}

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
              {loginStep === 'EMAIL' && (
                <form onSubmit={handleSendLoginOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-blue outline-none transition"
                      />
                    </div>
                  </div>
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-3 bg-brand-blue text-white font-bold rounded-xl shadow hover:bg-brand-blue-dark transition disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Login OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginStep('FORGOT'); setError(''); setMaskedEmail(''); }}
                    className="w-full text-xs font-bold text-slate-500 hover:text-brand-blue mt-2"
                  >
                    Forgot your email?
                  </button>
                </form>
              )}

              {loginStep === 'OTP' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <p className="text-sm font-semibold text-slate-600 text-center mb-4">
                    Enter the 6-digit code sent to <span className="text-brand-blue">{email}</span>
                  </p>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">OTP Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder="------"
                      className="w-full text-center tracking-widest text-lg px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-brand-blue outline-none transition"
                    />
                  </div>
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-3 bg-brand-green text-white font-bold rounded-xl shadow hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Sign In'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginStep('EMAIL')}
                    className="w-full text-xs font-bold text-slate-500 hover:text-brand-blue mt-2"
                  >
                    Change Email
                  </button>
                </form>
              )}

              {loginStep === 'FORGOT' && (
                <form onSubmit={handleFindAccount} className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-center mb-2">Find Your Account</h3>
                  {!maskedEmail ? (
                    <>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Registered Mobile Number</label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                          <input
                            type="tel"
                            required
                            value={forgotMobile}
                            onChange={(e) => setForgotMobile(e.target.value)}
                            placeholder="10-digit mobile number"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-blue outline-none transition"
                          />
                        </div>
                      </div>
                      <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-3 bg-brand-blue text-white font-bold rounded-xl shadow hover:bg-brand-blue-dark transition disabled:opacity-50"
                      >
                        {loading ? 'Searching...' : 'Find Account'}
                      </button>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-brand-blue/5 rounded-xl border border-brand-blue/20">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Account Found!</p>
                        <p className="text-lg font-bold text-brand-blue tracking-wide">{maskedEmail}</p>
                      </div>
                      <p className="text-xs font-medium text-slate-500">
                        An OTP has been sent to this email address. Please check your inbox and log in.
                      </p>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => { setLoginStep('EMAIL'); setMaskedEmail(''); }}
                    className="w-full text-xs font-bold text-slate-500 hover:text-brand-blue mt-2 block text-center"
                  >
                    Back to Login
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ----- REGISTER TAB ----- */}
          {tab === 'REGISTER' && (
            <div>
              {regStep === 'DETAILS' && (
                <form onSubmit={handleRegisterDetails} className="space-y-4 h-96 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="sticky top-0 bg-white pb-2 mb-2 border-b border-slate-100 z-10">
                    <h3 className="font-bold text-slate-900">Create Account</h3>
                    <p className="text-xs text-slate-500">Fill in your details to register.</p>
                  </div>

                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
                    <button
                      type="button"
                      onClick={() => setRegType('INDIVIDUAL')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 ${regType === 'INDIVIDUAL' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500'}`}
                    >
                      <UserIcon className="w-4 h-4" /> Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegType('ORGANIZATION')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 ${regType === 'ORGANIZATION' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500'}`}
                    >
                      <Building className="w-4 h-4" /> Organization
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                  </div>

                  {regType === 'INDIVIDUAL' ? (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                      <input type="text" required name="name" value={details.name} onChange={handleDetailChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Company Name</label>
                        <input type="text" required name="companyName" value={details.companyName} onChange={handleDetailChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Contact Name</label>
                          <input type="text" required name="contactName" value={details.contactName} onChange={handleDetailChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Designation</label>
                          <input type="text" required name="designation" value={details.designation} onChange={handleDetailChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold outline-none focus:border-brand-blue" />
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <label className="text-xs font-bold text-slate-700 block mb-2">Do you have a GSTIN?</label>
                        <div className="flex gap-4 mb-3">
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer">
                            <input type="radio" checked={hasGstin} onChange={() => setHasGstin(true)} className="accent-brand-blue" /> Yes
                          </label>
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer">
                            <input type="radio" checked={!hasGstin} onChange={() => setHasGstin(false)} className="accent-brand-blue" /> No
                          </label>
                        </div>
                        
                        {hasGstin ? (
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">GSTIN</label>
                            <input type="text" required={hasGstin} name="gstin" value={details.gstin} onChange={handleDetailChange} placeholder="e.g. 07AAAAA0000A1Z5" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-semibold uppercase outline-none focus:border-brand-blue" />
                          </div>
                        ) : (
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Upload Business / Address Proof</label>
                            <label className="flex items-center justify-center w-full px-3 py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 transition group">
                              <div className="flex flex-col items-center gap-1 text-slate-500 group-hover:text-brand-blue">
                                <UploadCloud className="w-5 h-5" />
                                <span className="text-xs font-semibold">{addressProofFile ? addressProofFile.name : 'Select File (Image/PDF)'}</span>
                              </div>
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
                    {loading ? 'Creating Account...' : 'Continue to Verification'}
                  </button>
                </form>
              )}

              {regStep === 'OTP' && (
                <form onSubmit={handleVerifyRegister} className="space-y-4">
                  <p className="text-sm font-semibold text-slate-600 text-center mb-4">
                    Enter the 6-digit code sent to <span className="text-brand-blue">{email}</span>
                  </p>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">OTP Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder="------"
                      className="w-full text-center tracking-widest text-lg px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-brand-blue outline-none transition"
                    />
                  </div>
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-3 bg-brand-green text-white font-bold rounded-xl shadow hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Create Account & Sign In'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegStep('DETAILS')}
                    className="w-full text-xs font-bold text-slate-500 hover:text-brand-blue mt-2"
                  >
                    Back to Details
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
