import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Film,
  Calendar,
  Building2,
  Tv,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Upload,
  ShieldCheck,
  Building,
  CreditCard,
  FileText,
  UserCheck,
  ArrowLeft
} from 'lucide-react';
import { PartnerCategory } from '../../types';

export const RegistrationWizard: React.FC = () => {
  const { registerPartner, switchPresetAccount, logout } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<PartnerCategory | null>(null);
  const [step, setStep] = useState<'CATEGORY_SELECT' | 'FORM'>('CATEGORY_SELECT');

  // Form Fields
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');

  // Bank details
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');

  // Document Upload states
  const [gstDocumentName, setGstDocumentName] = useState<string | null>(null);
  const [panDocumentName, setPanDocumentName] = useState<string | null>(null);
  const [chequeDocumentName, setChequeDocumentName] = useState<string | null>(null);

  const categories: {
    id: PartnerCategory;
    title: string;
    subtitle: string;
    icon: React.FC<{ className?: string }>;
    description: string;
    badge: string;
  }[] = [
    {
      id: 'THEATRE_PARTNER',
      title: 'Theatre Partner',
      subtitle: 'Single Screen, Multiplex Chains & IMAX Theatres',
      icon: Film,
      description: 'Manage show schedules, multi-screen seating maps, real-time ticket bookings, box office POS counters, and daily occupancy reports.',
      badge: 'Most Popular'
    },
    {
      id: 'EVENT_ORGANIZER',
      title: 'Event Organizer',
      subtitle: 'Concerts, Standup Shows, Music & Cultural Fests',
      icon: Calendar,
      description: 'Host ticketed live events, configure VIP & General admission passes, run venue gate check-ins, and track settlements.',
      badge: 'High Revenue'
    },
    {
      id: 'EVENT_MANAGEMENT',
      title: 'Event Management Company',
      subtitle: 'Corporate Galas, Exhibitions & Wedding Expos',
      icon: Building2,
      description: 'Manage venue client contracts, staff allocation, multi-vendor logistics, and ticketing integration.',
      badge: 'Enterprise'
    },
    {
      id: 'PRODUCTION_HOUSE',
      title: 'Production House',
      subtitle: 'Film Studios, Distributors & Screening Partners',
      icon: Tv,
      description: 'Submit theatrical screening requests, track premiere ticket sales, trailer launch events, and box office revenue splits.',
      badge: 'Media & Film'
    },
    {
      id: 'ENTERTAINMENT_PARTNER',
      title: 'Entertainment Partner',
      subtitle: 'VR Gaming Hubs, Theme Parks & Experience Zones',
      icon: Sparkles,
      description: 'Offer hourly experience passes, fast-track VIP access, visitor scan verification, and live attraction stats.',
      badge: 'Leisure'
    }
  ];

  const handleDocumentSimulatedUpload = (docType: 'GST' | 'PAN' | 'CHEQUE') => {
    const fakeFileName = `${docType}_Verification_Proof_${Math.floor(1000 + Math.random() * 9000)}.pdf`;
    if (docType === 'GST') setGstDocumentName(fakeFileName);
    if (docType === 'PAN') setPanDocumentName(fakeFileName);
    if (docType === 'CHEQUE') setChequeDocumentName(fakeFileName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) return;

    const newPartnerId = registerPartner({
      businessName,
      ownerName,
      category: selectedCategory,
      mobile,
      email,
      businessAddress,
      city,
      state,
      pinCode,
      gstNumber: gstNumber || undefined,
      panNumber: panNumber || undefined,
      bankDetails: {
        accountNumber,
        accountHolderName: accountHolderName || ownerName,
        ifscCode,
        bankName: bankName || 'Standard Chartered Bank',
        branchName: branchName || 'Main Branch'
      },
      documents: [
        {
          id: `DOC-GST-${Date.now()}`,
          name: gstDocumentName || 'GST_Registration_Proof.pdf',
          type: 'GST',
          fileUrl: '#gst.pdf',
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'PENDING'
        },
        {
          id: `DOC-PAN-${Date.now()}`,
          name: panDocumentName || 'PAN_Card_Copy.pdf',
          type: 'PAN',
          fileUrl: '#pan.pdf',
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'PENDING'
        }
      ]
    });

    // Session automatically redirects to Pending status screen
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-8 space-y-6 sm:space-y-8">
      
      {/* Top Exit Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Return to Welcome / Login Screen</span>
        </button>
        <span className="text-[11px] text-zinc-500 font-mono">New Partner Registration Flow</span>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="w-4 h-4 text-amber-400" />
          CineVenue Entertainments Partner Onboarding
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
          Become a CineVenue Partner
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Join India’s premier entertainment, ticketing & venue management ecosystem. Power your business with dynamic role-based dashboards, POS counter tools, live seat mapping, and direct settlements.
        </p>
      </div>

      {/* Step 1: Category Selection Grid */}
      {step === 'CATEGORY_SELECT' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Step 1 of 2: Select Your Business Category
            </span>
            <span className="text-xs text-zinc-400">Choose 1 Category</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-500/15 to-zinc-900 border-amber-400 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-amber-500/40 hover:bg-zinc-900'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-amber-400 text-zinc-950 font-bold' : 'bg-zinc-800 text-amber-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {cat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-zinc-100">{cat.title}</h3>
                      <p className="text-xs text-amber-400/90 font-medium mt-0.5">{cat.subtitle}</p>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs font-semibold">
                    <span className={isSelected ? 'text-amber-400' : 'text-zinc-500'}>
                      {isSelected ? 'Category Selected' : 'Select Category'}
                    </span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-amber-400 border-amber-400 text-zinc-950' : 'border-zinc-700'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={!selectedCategory}
              onClick={() => setStep('FORM')}
              className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all w-full sm:w-auto ${
                selectedCategory
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              Continue to Registration Form
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Comprehensive Registration Form */}
      {step === 'FORM' && selectedCategory && (
        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/90 border border-amber-500/20 rounded-3xl p-4 sm:p-8 shadow-2xl">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Step 2 of 2: Business & Verification Details
              </span>
              <h2 className="text-xl font-bold text-zinc-100 font-cinzel">
                Registering as: {categories.find(c => c.id === selectedCategory)?.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setStep('CATEGORY_SELECT')}
              className="text-xs text-amber-400 hover:underline"
            >
              Change Category
            </button>
          </div>

          {/* Section A: Business Profile */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4" />
              1. Business Profile Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Business / Trade Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Cineplexes Pvt Ltd"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Primary Owner / Director Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Rao"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Mobile Number (OTP Verification) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Official Business Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="contact@royalcinemas.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section B: Location & Address */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              2. Business Registered Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3 space-y-1">
                <label className="text-xs font-medium text-zinc-300">Full Business Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street name, Premises No., Landmark..."
                  value={businessAddress}
                  onChange={e => setBusinessAddress(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune / Mumbai / Bengaluru"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">PIN Code *</label>
                <input
                  type="text"
                  required
                  placeholder="411045"
                  value={pinCode}
                  onChange={e => setPinCode(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section C: Tax & Banking Credentials */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              3. Tax & Direct Settlement Account
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">GST Registration Number (GSTIN)</label>
                <input
                  type="text"
                  placeholder="27AABCC1234H1Z5"
                  value={gstNumber}
                  onChange={e => setGstNumber(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Company / Business PAN Number *</label>
                <input
                  type="text"
                  required
                  placeholder="AABCC1234H"
                  value={panNumber}
                  onChange={e => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Bank Account Number *</label>
                <input
                  type="text"
                  required
                  placeholder="918020048192834"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Bank IFSC Code *</label>
                <input
                  type="text"
                  required
                  placeholder="HDFC0001234"
                  value={ifscCode}
                  onChange={e => setIfscCode(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section D: Supporting Documents Upload */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              4. Document Verification Uploads
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                <div className="text-xs font-semibold text-zinc-200">GST Certificate PDF</div>
                <div className="text-[11px] text-zinc-400">Proof of tax registration</div>
                <button
                  type="button"
                  onClick={() => handleDocumentSimulatedUpload('GST')}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-amber-300 font-medium flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {gstDocumentName ? 'Replace GST File' : 'Upload GST PDF'}
                </button>
                {gstDocumentName && (
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {gstDocumentName}
                  </div>
                )}
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                <div className="text-xs font-semibold text-zinc-200">PAN Card Copy</div>
                <div className="text-[11px] text-zinc-400">Identity & business tax proof</div>
                <button
                  type="button"
                  onClick={() => handleDocumentSimulatedUpload('PAN')}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-amber-300 font-medium flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {panDocumentName ? 'Replace PAN File' : 'Upload PAN PDF'}
                </button>
                {panDocumentName && (
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {panDocumentName}
                  </div>
                )}
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                <div className="text-xs font-semibold text-zinc-200">Cancelled Cheque</div>
                <div className="text-[11px] text-zinc-400">Bank account validation</div>
                <button
                  type="button"
                  onClick={() => handleDocumentSimulatedUpload('CHEQUE')}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-amber-300 font-medium flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {chequeDocumentName ? 'Replace Cheque' : 'Upload Cheque PDF'}
                </button>
                {chequeDocumentName && (
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {chequeDocumentName}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setStep('CATEGORY_SELECT')}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 font-medium"
            >
              Back to Category Selection
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Submit Application to CineVenue Admin
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
