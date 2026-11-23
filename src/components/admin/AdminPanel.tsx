import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Search,
  Filter,
  Eye,
  FileText,
  UserCheck,
  Building2,
  AlertCircle,
  RefreshCw,
  Activity,
  History,
  FileCheck,
  ExternalLink,
  LogOut,
  HelpCircle,
  Download,
  Check,
  Building,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { PartnerBusiness, ApprovalStatus, PartnerCategory, PartnerDocument } from '../../types';

export const AdminPanel: React.FC = () => {
  const {
    partners,
    updatePartnerStatus,
    auditLogs,
    switchPresetAccount,
    logout,
    activeAdminTab,
    setActiveAdminTab,
    refreshPartners
  } = useApp();

  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(partners[0]?.id || null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const authpanelUrl =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3000/authpanel'
      : 'https://cinevenue.com/authpanel';

  // Modal / Action states
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const [moreInfoModalOpen, setMoreInfoModalOpen] = useState(false);
  const [moreInfoInput, setMoreInfoInput] = useState('');

  const [docPreviewModalOpen, setDocPreviewModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<PartnerDocument | null>(null);

  const selectedPartner = partners.find(p => p.id === selectedPartnerId) || partners[0];

  const filteredPartners = partners.filter(p => {
    if (filterCategory !== 'ALL' && p.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.businessName.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApprove = (partnerId: string) => {
    updatePartnerStatus(partnerId, 'APPROVED');
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPartner && rejectionReasonInput) {
      updatePartnerStatus(selectedPartner.id, 'REJECTED', rejectionReasonInput);
      setRejectionModalOpen(false);
      setRejectionReasonInput('');
    }
  };

  const handleMoreInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPartner && moreInfoInput) {
      updatePartnerStatus(selectedPartner.id, 'MORE_INFO_REQUIRED', moreInfoInput);
      setMoreInfoModalOpen(false);
      setMoreInfoInput('');
    }
  };

  const handleSuspend = (partnerId: string) => {
    updatePartnerStatus(partnerId, 'SUSPENDED', 'Account suspended by Admin compliance team.');
  };

  const handleReactivate = (partnerId: string) => {
    updatePartnerStatus(partnerId, 'APPROVED', 'Reactivated by Admin.');
  };

  const openDocumentPreview = (doc: PartnerDocument) => {
    setSelectedDoc(doc);
    setDocPreviewModalOpen(true);
  };

  // Stats
  const totalCount = partners.length;
  const pendingCount = partners.filter(p => p.status === 'PENDING' || p.status === 'UNDER_REVIEW').length;
  const approvedCount = partners.filter(p => p.status === 'APPROVED').length;
  const rejectedCount = partners.filter(p => p.status === 'REJECTED').length;
  const moreInfoCount = partners.filter(p => p.status === 'MORE_INFO_REQUIRED').length;
  const suspendedCount = partners.filter(p => p.status === 'SUSPENDED').length;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Banner with Logout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold shadow-lg shadow-amber-500/10 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-cinzel text-zinc-100">
                CineVenue Super Admin & Founder Authority Hub
              </h1>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500 text-zinc-950">
                MASTER CONTROL
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Review partner onboarding dossiers, inspect tax compliance proofs, approve operations, or manage canonical /authpanel.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <button
            onClick={() => setActiveAdminTab('AUTHPANEL')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'AUTHPANEL'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Live Admin Panel (/authpanel)</span>
          </button>
          
          <button
            onClick={() => setActiveAdminTab('PARTNERS')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'PARTNERS'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Partner Requests ({partners.length})</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('AUDIT_LOGS')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'AUDIT_LOGS'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Logs ({auditLogs.length})</span>
          </button>

          <button
            onClick={logout}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-500/30 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Lock session and return to Welcome screen"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Exit Admin</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: EXACT CANONICAL AUTHPANEL EMBED                    */}
      {/* ======================================================== */}
      {activeAdminTab === 'AUTHPANEL' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center gap-2.5 text-xs text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Exact Central Founder Admin Panel Connection:</span>
              <code className="bg-zinc-950 px-2.5 py-1 rounded text-amber-400 font-mono text-[11px] border border-zinc-800">
                {authpanelUrl}
              </code>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  const iframe = document.getElementById('founder-authpanel-frame') as HTMLIFrameElement;
                  if (iframe) iframe.src = authpanelUrl;
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Panel</span>
              </button>

              <a
                href={authpanelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/10 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Full Dedicated Window</span>
              </a>
            </div>
          </div>

          <div className="w-full h-[82vh] rounded-3xl overflow-hidden border border-amber-500/30 bg-zinc-950 shadow-2xl relative">
            <iframe
              id="founder-authpanel-frame"
              src={authpanelUrl}
              title="CineVenue Founder Central Admin Panel"
              className="w-full h-full border-0"
              allow="clipboard-write; camera"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PARTNER REGISTRATIONS & MANAGEMENT DOSSIER        */}
      {/* ======================================================== */}
      {activeAdminTab === 'PARTNERS' && (
        <div className="space-y-6">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">Total Partners</div>
              <div className="text-2xl font-bold font-cinzel text-zinc-100 mt-1">{totalCount}</div>
            </div>
            
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
              <div className="text-[10px] text-amber-400 uppercase font-semibold">Pending Audit</div>
              <div className="text-2xl font-bold font-cinzel text-amber-300 mt-1">{pendingCount}</div>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
              <div className="text-[10px] text-emerald-400 uppercase font-semibold">Approved & Active</div>
              <div className="text-2xl font-bold font-cinzel text-emerald-300 mt-1">{approvedCount}</div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
              <div className="text-[10px] text-blue-400 uppercase font-semibold">More Info Requested</div>
              <div className="text-2xl font-bold font-cinzel text-blue-300 mt-1">{moreInfoCount}</div>
            </div>

            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
              <div className="text-[10px] text-rose-400 uppercase font-semibold">Rejected / Suspended</div>
              <div className="text-2xl font-bold font-cinzel text-rose-300 mt-1">{rejectedCount + suspendedCount}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Filterable Partners List */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Search & Filter Bar */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search partner name, owner, city, ID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-zinc-400 font-medium">Status Filter</label>
                    <select
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-xs text-zinc-200"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="PENDING">Pending Verification</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="MORE_INFO_REQUIRED">More Info Required</option>
                      <option value="APPROVED">Approved & Active</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 font-medium">Category</label>
                    <select
                      value={filterCategory}
                      onChange={e => setFilterCategory(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-xs text-zinc-200"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="THEATRE_PARTNER">Theatre Partner</option>
                      <option value="EVENT_ORGANIZER">Event Organizer</option>
                      <option value="EVENT_MANAGEMENT">Event Management</option>
                      <option value="PRODUCTION_HOUSE">Production House</option>
                      <option value="ENTERTAINMENT_PARTNER">Entertainment Partner</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* List Cards */}
              <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                {filteredPartners.map(partner => {
                  const isSelected = partner.id === selectedPartnerId;
                  return (
                    <div
                      key={partner.id}
                      onClick={() => setSelectedPartnerId(partner.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-xs text-zinc-100">{partner.businessName}</div>
                          <div className="text-[11px] text-zinc-400">{partner.ownerName} · {partner.city}</div>
                        </div>

                        {/* Status Tag */}
                        {partner.status === 'APPROVED' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            APPROVED
                          </span>
                        )}
                        {(partner.status === 'PENDING' || partner.status === 'UNDER_REVIEW') && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                            PENDING
                          </span>
                        )}
                        {partner.status === 'MORE_INFO_REQUIRED' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            MORE INFO
                          </span>
                        )}
                        {partner.status === 'REJECTED' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            REJECTED
                          </span>
                        )}
                        {partner.status === 'SUSPENDED' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                            SUSPENDED
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/60">
                        <span className="font-medium text-zinc-400">{partner.category.replace('_', ' ')}</span>
                        <span>Applied: {partner.appliedAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right Column: Deep Verification Detail Dossier */}
            <div className="lg:col-span-7">
              {selectedPartner ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
                  
                  {/* Partner Detail Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase font-mono">
                        Dossier #{selectedPartner.id}
                      </span>
                      <h2 className="text-xl font-bold font-cinzel text-zinc-100">
                        {selectedPartner.businessName}
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Category: <strong className="text-zinc-200">{selectedPartner.category.replace('_', ' ')}</strong>
                      </p>
                    </div>

                    {/* Action Buttons based on status */}
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedPartner.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleApprove(selectedPartner.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve Account</span>
                        </button>
                      )}

                      {selectedPartner.status !== 'MORE_INFO_REQUIRED' && selectedPartner.status !== 'APPROVED' && (
                        <button
                          onClick={() => setMoreInfoModalOpen(true)}
                          className="px-3.5 py-2 rounded-xl bg-blue-500/20 text-blue-300 font-bold text-xs hover:bg-blue-500/30 transition-colors flex items-center gap-1.5 border border-blue-500/30 cursor-pointer"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Request More Info</span>
                        </button>
                      )}

                      {selectedPartner.status !== 'REJECTED' && selectedPartner.status !== 'APPROVED' && (
                        <button
                          onClick={() => setRejectionModalOpen(true)}
                          className="px-3.5 py-2 rounded-xl bg-rose-500/20 text-rose-300 font-bold text-xs hover:bg-rose-500/30 transition-colors flex items-center gap-1.5 border border-rose-500/30 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject Application</span>
                        </button>
                      )}

                      {selectedPartner.status === 'APPROVED' && (
                        <button
                          onClick={() => handleSuspend(selectedPartner.id)}
                          className="px-4 py-2 rounded-xl bg-red-950 text-red-400 font-bold text-xs hover:bg-red-900 transition-colors flex items-center gap-1.5 border border-red-800 cursor-pointer"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Suspend Access</span>
                        </button>
                      )}

                      {selectedPartner.status === 'SUSPENDED' && (
                        <button
                          onClick={() => handleReactivate(selectedPartner.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Reactivate Account</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
                      <div className="font-semibold text-amber-400 uppercase tracking-wider text-[10px]">
                        Contact & Ownership
                      </div>
                      <div><span className="text-zinc-500">Owner Name:</span> <strong className="text-zinc-200">{selectedPartner.ownerName}</strong></div>
                      <div><span className="text-zinc-500">Mobile Phone:</span> <span className="text-zinc-200">{selectedPartner.mobile}</span></div>
                      <div><span className="text-zinc-500">Email Address:</span> <span className="text-zinc-200">{selectedPartner.email}</span></div>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
                      <div className="font-semibold text-amber-400 uppercase tracking-wider text-[10px]">
                        Registered Address
                      </div>
                      <div><span className="text-zinc-500">Address:</span> <span className="text-zinc-200">{selectedPartner.businessAddress}</span></div>
                      <div><span className="text-zinc-500">City / State:</span> <span className="text-zinc-200">{selectedPartner.city}, {selectedPartner.state} ({selectedPartner.pinCode})</span></div>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
                      <div className="font-semibold text-amber-400 uppercase tracking-wider text-[10px]">
                        Tax Identifiers
                      </div>
                      <div><span className="text-zinc-500">GST Number:</span> <code className="text-amber-300 font-mono">{selectedPartner.gstNumber || 'Not provided'}</code></div>
                      <div><span className="text-zinc-500">PAN Details:</span> <code className="text-amber-300 font-mono">{selectedPartner.panNumber || 'Not provided'}</code></div>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
                      <div className="font-semibold text-amber-400 uppercase tracking-wider text-[10px]">
                        Settlement Bank Account
                      </div>
                      <div><span className="text-zinc-500">Bank:</span> <span className="text-zinc-200">{selectedPartner.bankDetails?.bankName} ({selectedPartner.bankDetails?.branchName || 'Main'})</span></div>
                      <div><span className="text-zinc-500">A/C Number:</span> <code className="text-zinc-200 font-mono">{selectedPartner.bankDetails?.accountNumber}</code></div>
                      <div><span className="text-zinc-500">IFSC Code:</span> <code className="text-zinc-200 font-mono">{selectedPartner.bankDetails?.ifscCode}</code></div>
                    </div>

                  </div>

                  {/* Reason & Notes Display */}
                  {selectedPartner.rejectionReason && (
                    <div className="p-4 bg-rose-950/30 border border-rose-900/40 rounded-2xl text-xs space-y-1">
                      <div className="font-bold text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>Active Rejection Reason:</span>
                      </div>
                      <p className="text-zinc-300 font-mono text-[11px] bg-zinc-950 p-2.5 rounded-lg border border-rose-900/30">
                        "{selectedPartner.rejectionReason}"
                      </p>
                    </div>
                  )}

                  {selectedPartner.moreInfoRequiredText && (
                    <div className="p-4 bg-blue-950/30 border border-blue-900/40 rounded-2xl text-xs space-y-1">
                      <div className="font-bold text-blue-400 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4" />
                        <span>Requested Information / Clarification:</span>
                      </div>
                      <p className="text-zinc-300 text-[11px] bg-zinc-950 p-2.5 rounded-lg border border-blue-900/30">
                        "{selectedPartner.moreInfoRequiredText}"
                      </p>
                    </div>
                  )}

                  {/* Uploaded Documents Inspection Panel */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      <span>Uploaded Verification Documents ({selectedPartner.documents?.length || 0})</span>
                      <span className="text-[10px] text-zinc-500">Click document to preview & verify</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {selectedPartner.documents && selectedPartner.documents.length > 0 ? (
                        selectedPartner.documents.map(doc => (
                          <div
                            key={doc.id}
                            onClick={() => openDocumentPreview(doc)}
                            className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 hover:border-amber-500/40 flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                              <div>
                                <div className="font-semibold text-zinc-200 truncate max-w-[150px]">{doc.name}</div>
                                <div className="text-[10px] text-zinc-500">Type: {doc.type} · {doc.uploadedAt}</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                              {doc.status || 'VERIFIED'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="sm:col-span-2 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 text-center text-xs text-zinc-500">
                          Standard business proof documents provided during registration.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Direct Role Test Switcher Button */}
                  <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                    <div className="text-xs text-zinc-400">
                      Simulate Partner Dashboard View:
                    </div>
                    <button
                      onClick={() => {
                        if (selectedPartner.category === 'THEATRE_PARTNER') switchPresetAccount('THEATRE_OWNER');
                        else if (selectedPartner.category === 'EVENT_ORGANIZER') switchPresetAccount('EVENT_ORGANIZER');
                        else if (selectedPartner.category === 'PRODUCTION_HOUSE') switchPresetAccount('PRODUCTION_HOUSE');
                        else if (selectedPartner.category === 'ENTERTAINMENT_PARTNER') switchPresetAccount('ENTERTAINMENT_PARTNER');
                        else switchPresetAccount('EVENT_MANAGEMENT');
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-xs flex items-center gap-2 border border-amber-500/30 cursor-pointer transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Launch Authorized Dashboard View</span>
                    </button>
                  </div>

                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-500 text-sm">
                  Select a partner application from the list to inspect details.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: AUDIT LOGS VIEW                                   */}
      {/* ======================================================== */}
      {activeAdminTab === 'AUDIT_LOGS' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>CineVenue Partner Activity & Audit Ledger</span>
            </h2>
            <span className="text-xs text-zinc-500 font-mono">Total Recorded Events: {auditLogs.length}</span>
          </div>

          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300 font-mono text-[11px]">{log.action}</span>
                    <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">
                      {log.actorName} ({log.actorRole})
                    </span>
                  </div>
                  <div className="text-zinc-300">{log.details}</div>
                </div>

                <div className="text-right text-[10px] text-zinc-500 font-mono shrink-0">
                  <div>{log.timestamp}</div>
                  <div>IP: {log.ipAddress}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRejectSubmit} className="bg-zinc-900 border border-rose-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-rose-400 font-cinzel">
              Reject Partner Application
            </h3>
            <p className="text-xs text-zinc-400">
              Provide a clear reason for rejecting <strong className="text-zinc-200">{selectedPartner?.businessName}</strong>. The applicant will see this reason on their tracking screen with resubmission instructions.
            </p>

            <textarea
              value={rejectionReasonInput}
              onChange={e => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. Expired GST Certificate or PAN details mismatch. Please re-upload verified document."
              rows={4}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectionModalOpen(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-500 text-zinc-950 font-bold text-xs hover:bg-rose-400 transition-colors cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Request More Information Modal */}
      {moreInfoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleMoreInfoSubmit} className="bg-zinc-900 border border-blue-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-blue-400 font-cinzel flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              <span>Request Additional Verification Information</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Specify what additional documentation or explanation is required from <strong className="text-zinc-200">{selectedPartner?.businessName}</strong>.
            </p>

            <textarea
              value={moreInfoInput}
              onChange={e => setMoreInfoInput(e.target.value)}
              placeholder="e.g. Please provide your renewed Municipal Trade License and clear bank cancelled cheque copy showing account holder name."
              rows={4}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMoreInfoModalOpen(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-500 text-zinc-950 font-bold text-xs hover:bg-blue-400 transition-colors cursor-pointer"
              >
                Send Request to Partner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Document Inspection & Preview Modal */}
      {docPreviewModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">{selectedDoc.name}</h3>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">Category: {selectedDoc.type}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDocPreviewModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Document Details & Simulated View */}
            <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <FileCheck className="w-8 h-8" />
              </div>

              <div>
                <div className="font-bold text-zinc-200 text-sm">{selectedDoc.name}</div>
                <div className="text-xs text-zinc-400 mt-1">Uploaded: {selectedDoc.uploadedAt}</div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Check className="w-3.5 h-3.5" />
                <span>Digitally Verified by CineVenue Risk Engine</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-zinc-500">Document ID: {selectedDoc.id}</span>
              <button
                type="button"
                onClick={() => setDocPreviewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
