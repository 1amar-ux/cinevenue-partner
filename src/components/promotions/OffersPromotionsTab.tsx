import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Plus,
  Tag,
  Check,
  Copy,
  Percent,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  Trash2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { PromotionCampaign, PromotionType, PromotionStatus } from '../../types';

export const OffersPromotionsTab: React.FC = () => {
  const { currentPartner, promotions, createPromotion, updatePromotionStatus } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<string>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form states
  const [campaignName, setCampaignName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<PromotionType>('PERCENT_DISCOUNT');
  const [discountValue, setDiscountValue] = useState('20');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState('400');
  const [maxDiscountCap, setMaxDiscountCap] = useState('150');
  const [maxUsageLimit, setMaxUsageLimit] = useState('500');
  const [startDate, setStartDate] = useState('2026-11-25');
  const [endDate, setEndDate] = useState('2026-12-25');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleCopyCode = (promoCode: string) => {
    navigator.clipboard.writeText(promoCode);
    setCopiedCode(promoCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim() || !code.trim()) return;

    createPromotion({
      partnerId: currentPartner?.id || 'PARTNER-THEATRE-001',
      partnerName: currentPartner?.businessName || 'Authorized Venue',
      campaignName: campaignName.trim(),
      code: code.trim().toUpperCase(),
      type,
      discountValue: Number(discountValue) || 10,
      minPurchaseAmount: Number(minPurchaseAmount) || 0,
      maxDiscountCap: maxDiscountCap ? Number(maxDiscountCap) : undefined,
      maxUsageLimit: Number(maxUsageLimit) || 100,
      startDate,
      endDate
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsAdding(false);
      setCampaignName('');
      setCode('');
    }, 1500);
  };

  // Filter campaigns
  const filteredPromotions = promotions.filter(p => {
    if (filter === 'ALL') return true;
    return p.status === filter;
  });

  // Calculate metrics
  const totalActive = promotions.filter(p => p.status === 'ACTIVE').length;
  const totalRedemptions = promotions.reduce((sum, p) => sum + (p.currentRedemptions || 0), 0);
  const totalRevenue = promotions.reduce((sum, p) => sum + (p.revenueGenerated || 0), 0);

  return (
    <div className="space-y-6 text-left select-none animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-[10px] text-gold font-bold uppercase tracking-[0.2em]">
              Promotions & Vouchers
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-zinc-100 tracking-wide mt-1">
            Marketing Campaigns & Special Offers
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Deploy audience discount codes, festival vouchers, and track real-time ticket conversion yield
          </p>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 bg-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all cursor-pointer border-0 shadow-lg shadow-gold/10"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Launch New Campaign</span>
          </button>
        )}
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121215] border border-white/5 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Campaigns</span>
            <Tag className="w-4 h-4 text-gold" />
          </div>
          <p className="text-3xl font-mono font-bold text-zinc-100">{totalActive}</p>
          <p className="text-[10px] text-zinc-500">Live across CineVenue booking channels</p>
        </div>

        <div className="bg-[#121215] border border-white/5 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Redemptions</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-mono font-bold text-purple-400">{totalRedemptions.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-zinc-500">Admissions claimed using coupon codes</p>
        </div>

        <div className="bg-[#121215] border border-white/5 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Campaign Gross Yield</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-mono font-bold text-emerald-400">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-zinc-500">Revenue driven by active discount codes</p>
        </div>
      </div>

      {/* Campaign Creation Drawer / Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateSubmit}
          className="bg-[#121215] border border-gold/30 rounded-2xl p-6 space-y-5 animate-fade-in shadow-2xl relative"
        >
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">
                Deploy Promotional Campaign Code
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-zinc-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {submittedSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Campaign submitted successfully! Awaiting fast CineVenue Admin compliance verification.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Campaign Title
              </label>
              <input
                type="text"
                required
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                placeholder="e.g. Festive Laser Recliner Offer"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Coupon Code (Audience Input)
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. FESTIVE50"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gold font-mono uppercase font-bold placeholder:text-zinc-600 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Discount Mechanism
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as PromotionType)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-zinc-200 focus:outline-none focus:border-gold"
              >
                <option value="PERCENT_DISCOUNT" className="bg-[#121215]">Percentage Off (%)</option>
                <option value="FLAT_DISCOUNT" className="bg-[#121215]">Flat Cash Discount (₹)</option>
                <option value="BUY_ONE_GET_ONE" className="bg-[#121215]">Buy One Get One (BOGO)</option>
                <option value="EARLY_BIRD" className="bg-[#121215]">Early Bird Advance Booking</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Discount Value {type === 'PERCENT_DISCOUNT' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                required
                min="1"
                value={discountValue}
                onChange={e => setDiscountValue(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Minimum Cart / Booking Value (₹)
              </label>
              <input
                type="number"
                value={minPurchaseAmount}
                onChange={e => setMinPurchaseAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Maximum Redemptions Quota
              </label>
              <input
                type="number"
                value={maxUsageLimit}
                onChange={e => setMaxUsageLimit(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Valid From
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-zinc-200 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Valid Until
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-zinc-200 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition-colors cursor-pointer border-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 shadow-lg shadow-gold/10"
            >
              Submit Campaign for Approval
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2 text-xs">
        {['ALL', 'ACTIVE', 'PENDING_APPROVAL', 'EXPIRED'].map(st => (
          <button
            key={st}
            type="button"
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
              filter === st
                ? 'bg-gold text-black shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {filteredPromotions.length === 0 ? (
          <div className="text-center py-12 bg-[#121215] border border-white/5 rounded-2xl space-y-2">
            <Tag className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No campaigns found matching selected status filter.</p>
          </div>
        ) : (
          filteredPromotions.map(promo => {
            const usagePercent = Math.min(
              100,
              Math.round(((promo.currentRedemptions || 0) / (promo.maxUsageLimit || 1)) * 100)
            );

            return (
              <div
                key={promo.id}
                className="bg-[#121215] border border-white/5 hover:border-gold/30 rounded-2xl p-6 transition-all space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-zinc-100">{promo.campaignName}</h3>
                      {promo.status === 'ACTIVE' && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                          ACTIVE
                        </span>
                      )}
                      {promo.status === 'PENDING_APPROVAL' && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          PENDING ADMIN APPROVAL
                        </span>
                      )}
                      {promo.status === 'EXPIRED' && (
                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-bold">
                          EXPIRED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">
                      Valid from <span className="text-zinc-200 font-medium">{promo.startDate}</span> to{' '}
                      <span className="text-zinc-200 font-medium">{promo.endDate}</span> · Min Purchase: ₹{promo.minPurchaseAmount || 0}
                    </p>
                  </div>

                  {/* Promo Code Badge */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(promo.code)}
                      className="px-3 py-1.5 rounded-lg bg-black/40 border border-gold/40 text-gold font-mono font-bold text-xs flex items-center gap-2 hover:bg-gold/10 transition-colors cursor-pointer"
                      title="Click to copy code"
                    >
                      <span>{promo.code}</span>
                      {copiedCode === promo.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                    </button>
                    {promo.status === 'ACTIVE' ? (
                      <button
                        type="button"
                        onClick={() => updatePromotionStatus(promo.id, 'EXPIRED')}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold cursor-pointer border-0"
                      >
                        Pause
                      </button>
                    ) : promo.status === 'EXPIRED' ? (
                      <button
                        type="button"
                        onClick={() => updatePromotionStatus(promo.id, 'ACTIVE')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold cursor-pointer border-0"
                      >
                        Activate
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Progress bar of redemptions */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">
                      Redemptions:{' '}
                      <span className="font-bold text-zinc-200">
                        {promo.currentRedemptions} / {promo.maxUsageLimit}
                      </span>{' '}
                      ({usagePercent}%)
                    </span>
                    <span className="text-zinc-400">
                      Revenue Generated:{' '}
                      <span className="font-bold text-emerald-400">
                        ₹{promo.revenueGenerated.toLocaleString('en-IN')}
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full transition-all duration-500"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OffersPromotionsTab;
