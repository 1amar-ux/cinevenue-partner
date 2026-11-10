import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  AlertTriangle,
  XCircle,
  Lock,
  RefreshCw,
  FileCheck,
  ShieldAlert,
  ChevronRight,
  Upload,
  CheckCircle2,
  Building2,
  FileText,
  PhoneCall
} from 'lucide-react';
import { ApprovalStatus } from '../../types';

export const StatusBanner: React.FC = () => {
  const { currentPartner, updatePartnerStatus, switchPresetAccount } = useApp();
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  if (!currentPartner || currentPartner.status === 'APPROVED') {
    return null;
  }

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePartnerStatus(currentPartner.id, 'PENDING', 'Resubmitted updated business proof documents');
    setIsResubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
      
      {/* Pending Status Screen */}
      {currentPartner.status === 'PENDING' && (
        <div className="bg-zinc-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Clock className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-wider uppercase border border-amber-500/20">
              Application Under Verification
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-zinc-100">
              Application Status: PENDING
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto">
              Your partner registration for <strong className="text-zinc-200">{currentPartner.businessName}</strong> ({currentPartner.category.replace('_', ' ')}) has been submitted to the CineVenue Admin Verification Team.
            </p>
          </div>

          {/* Progress Timeline Stepper */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 text-left space-y-4 max-w-lg mx-auto">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Verification Progress Tracker
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-zinc-200">Registration Submitted</div>
                  <div className="text-[11px] text-zinc-400">Received on {currentPartner.appliedAt}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 animate-pulse">
                  2
                </div>
                <div>
                  <div className="font-semibold text-amber-400">Document & GST Audit in Progress</div>
                  <div className="text-[11px] text-zinc-400">CineVenue Compliance Team is inspecting GST ({currentPartner.gstNumber || 'Provided'}), PAN ({currentPartner.panNumber || 'Provided'}), and Bank proof.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 opacity-50">
                <div className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-semibold text-zinc-300">Account Activation</div>
                  <div className="text-[11px] text-zinc-500">Upon approval, access to your specialized dashboard will be unlocked immediately.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => switchPresetAccount('CINEVENUE_ADMIN')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              Switch to Admin Panel (Approve this Partner)
            </button>
          </div>
        </div>
      )}

      {/* Rejection Status Screen */}
      {currentPartner.status === 'REJECTED' && (
        <div className="bg-zinc-900/90 border border-rose-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
            <XCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold tracking-wider uppercase border border-rose-500/20">
              Application Action Required
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-zinc-100">
              Application Rejected
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto">
              Your application for <strong className="text-zinc-200">{currentPartner.businessName}</strong> could not be approved due to compliance discrepancies.
            </p>
          </div>

          {/* Rejection Reason Card */}
          <div className="bg-rose-950/30 border border-rose-800/40 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-2">
            <div className="text-xs font-semibold text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Official Rejection Reason:
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-zinc-950/60 p-3 rounded-lg border border-rose-900/30">
              "{currentPartner.rejectionReason || 'Uploaded business proof documents did not pass validation.'}"
            </p>
          </div>

          {!isResubmitting ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsResubmitting(true)}
                className="px-6 py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Resubmit Updated Documents
              </button>
            </div>
          ) : (
            <form onSubmit={handleResubmit} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 max-w-lg mx-auto text-left space-y-4">
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                Resubmit Partner Verification Documents
              </h3>
              
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-medium">Additional Clarification / Notes</label>
                <textarea
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  placeholder="Provide updated GST details or reference for new document upload..."
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center gap-3 text-xs text-zinc-300">
                <Upload className="w-5 h-5 text-amber-400" />
                <div className="flex-1">
                  <div className="font-semibold text-zinc-200">Attach Verified File PDF</div>
                  <div className="text-[10px] text-zinc-400">GST Certificate / Pan Card / Bank Cheque</div>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-1 rounded">Simulated</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResubmitting(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                >
                  Submit for Re-Evaluation
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Suspended Status Screen */}
      {currentPartner.status === 'SUSPENDED' && (
        <div className="bg-zinc-900/90 border border-red-800/50 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-red-950 border border-red-800 text-red-500 flex items-center justify-center mx-auto shadow-lg shadow-red-950/50">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 text-red-400 text-xs font-semibold tracking-wider uppercase border border-red-800">
              Account Suspended
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-zinc-100">
              Business Operations Frozen
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto">
              Partner account for <strong className="text-zinc-200">{currentPartner.businessName}</strong> has been suspended by CineVenue Risk Management due to policy compliance review.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 max-w-md mx-auto text-xs text-zinc-400 space-y-2">
            <div className="font-semibold text-zinc-200 flex items-center justify-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              Need Assistance?
            </div>
            <div>Please contact your account manager or email partner-support@cinevenue.com</div>
          </div>
        </div>
      )}

    </div>
  );
};
