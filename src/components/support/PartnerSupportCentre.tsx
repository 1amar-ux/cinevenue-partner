import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  Plus,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  CreditCard,
  Cpu,
  Ticket,
  ShieldCheck,
  Search,
  X
} from 'lucide-react';
import { SupportTicket, TicketCategory, TicketPriority, TicketStatus } from '../../types';

export const PartnerSupportCentre: React.FC = () => {
  const { currentPartner, supportTickets, createSupportTicket, addTicketReply } = useApp();

  const [activeTab, setActiveTab] = useState<'TICKETS' | 'NEW_TICKET' | 'FAQS'>('TICKETS');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // New ticket form states
  const [category, setCategory] = useState<TicketCategory>('PAYMENTS_SETTLEMENTS');
  const [priority, setPriority] = useState<TicketPriority>('NORMAL');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'When do theatre and event ticket settlements get credited to my bank?',
      a: 'CineVenue operates an automated T+1 daily settlement cycle. Box office revenues collected for shows and experiences are reconciled every midnight and dispatched directly via NEFT/RTGS to your verified bank IFSC before 11:00 AM the following business day.'
    },
    {
      q: 'How do I synchronize original curved amphitheatre seat layouts with CineVenue?',
      a: 'Open your Screen Management tab, choose your screen, and edit the Seat Layout matrix. You can visually configure row curvatures, aisle walkways, VIP recliner classifications, and wheelchair accessibility bays. Once saved, all online and POS counters reflect the exact layout in real-time.'
    },
    {
      q: 'Can our gate staff validate QR tickets without internet connectivity?',
      a: 'Yes. The authorized QR Gate Scanner caches the daily admission roster locally on staff devices. When an offline ticket is scanned, the security signature is cryptographically verified locally and automatically queued to sync once connectivity resumes.'
    },
    {
      q: 'How do I add a new branch or multi-location multiplex under our partner entity?',
      a: 'Go to My Theatres or the Location Switcher in the top navigation bar, click "+ Add Business Location", submit the facility address and municipal license number. CineVenue Admin will verify and activate the branch within 24 hours.'
    },
    {
      q: 'What is the platform commission rate on special festivals and concerts?',
      a: 'Contractual commission splits are locked transparently in your partner agreement (typically 10-15%). There are zero hidden listing or per-transaction gateway penalties. All fees are clearly itemized on your downloadable statements.'
    }
  ];

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    createSupportTicket({
      partnerId: currentPartner?.id || 'PARTNER-THEATRE-001',
      partnerName: currentPartner?.businessName || 'Authorized Business Partner',
      category,
      priority,
      subject: subject.trim(),
      description: description.trim()
    });

    setTicketSuccess(true);
    setSubject('');
    setDescription('');
    setTimeout(() => {
      setTicketSuccess(false);
      setActiveTab('TICKETS');
    }, 1500);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    addTicketReply(selectedTicket.id, replyMessage.trim());
    setReplyMessage('');

    // Update local modal state
    setSelectedTicket(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `MSG-${Date.now()}`,
            senderName: currentPartner?.businessName || 'You (Partner)',
            senderRole: 'PARTNER',
            message: replyMessage.trim(),
            timestamp: 'Just now'
          }
        ]
      };
    });
  };

  const getCategoryBadge = (cat: TicketCategory) => {
    switch (cat) {
      case 'PAYMENTS_SETTLEMENTS':
        return <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">Payments & Settlements</span>;
      case 'TECHNICAL_SUPPORT':
        return <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-bold">Technical Support</span>;
      case 'BOOKING_DISCREPANCY':
        return <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-bold">Booking Discrepancy</span>;
      case 'DOCUMENT_VERIFICATION':
        return <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono font-bold">Verification Help</span>;
      default:
        return <span className="text-[10px] bg-white/5 text-zinc-300 border border-white/10 px-2 py-0.5 rounded font-mono font-bold">Feature Request</span>;
    }
  };

  const getStatusBadge = (st: TicketStatus) => {
    switch (st) {
      case 'RESOLVED':
        return <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase"><Clock className="w-3 h-3 animate-pulse" /> In Progress</span>;
      case 'CLOSED':
        return <span className="inline-flex items-center gap-1 text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded-full font-bold uppercase">Closed</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold uppercase"><AlertCircle className="w-3 h-3" /> Open</span>;
    }
  };

  return (
    <div className="space-y-6 text-left select-none animate-fade-in text-zinc-100">
      
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-gold" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-zinc-100 tracking-wide">
              Partner Support Centre & Helpdesk
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            24/7 dedicated operational assistance for settlements, POS systems, ticketing gate issues, and verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('TICKETS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'TICKETS'
                ? 'bg-gold/20 text-gold border border-gold/40'
                : 'bg-white/5 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            My Support Tickets ({supportTickets.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('NEW_TICKET')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'NEW_TICKET'
                ? 'bg-gold/20 text-gold border border-gold/40'
                : 'bg-gold text-zinc-950 font-bold hover:bg-gold-light'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Raise Ticket</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('FAQS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'FAQS'
                ? 'bg-gold/20 text-gold border border-gold/40'
                : 'bg-white/5 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Knowledge Base
          </button>
        </div>
      </div>

      {/* ======================= TAB 1: SUPPORT TICKETS LIST ======================= */}
      {activeTab === 'TICKETS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#121215] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Active Inquiries</div>
                <div className="text-xl font-bold font-mono text-zinc-100">
                  {supportTickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length}
                </div>
              </div>
            </div>

            <div className="bg-[#121215] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Resolved Tickets</div>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {supportTickets.filter(t => t.status === 'RESOLVED').length}
                </div>
              </div>
            </div>

            <div className="bg-[#121215] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gold/10 text-gold border border-gold/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Avg. Resolution Time</div>
                <div className="text-xl font-bold font-mono text-gold">2.4 Hours</div>
              </div>
            </div>
          </div>

          {/* Tickets Table / List */}
          <div className="bg-[#121215] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 flex items-center justify-between text-xs font-bold text-zinc-300 uppercase tracking-wider">
              <span>Support Inquiries Ledger</span>
              <span className="text-[10px] text-zinc-500 font-mono">CineVenue Admin Dispatch</span>
            </div>

            <div className="divide-y divide-white/5">
              {supportTickets.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-gold font-bold text-[11px]">{ticket.id}</span>
                      {getCategoryBadge(ticket.category)}
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        ticket.priority === 'URGENT'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : ticket.priority === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {ticket.priority} Priority
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-100 truncate">
                      {ticket.subject}
                    </h4>

                    <p className="text-zinc-400 text-[11px] line-clamp-1">
                      {ticket.description}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                    {getStatusBadge(ticket.status)}
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {ticket.updatedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: RAISE NEW TICKET ======================= */}
      {activeTab === 'NEW_TICKET' && (
        <div className="max-w-2xl bg-[#121215] border border-white/5 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-base font-bold text-zinc-100">Raise New Operational Request</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Specify your issue details. A support specialist will respond within 30 minutes.
            </p>
          </div>

          {ticketSuccess && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ticket submitted successfully! Assigned reference tracking ID.</span>
            </div>
          )}

          <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300 uppercase tracking-wider text-[10px]">Issue Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as TicketCategory)}
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-2.5 text-zinc-100 text-xs focus:outline-none focus:border-gold cursor-pointer"
                >
                  <option value="PAYMENTS_SETTLEMENTS">Payments & Settlements (Bank IFSC, UTR)</option>
                  <option value="TECHNICAL_SUPPORT">Technical & POS Box Office Issue</option>
                  <option value="BOOKING_DISCREPANCY">Booking or Seat Allocation Discrepancy</option>
                  <option value="DOCUMENT_VERIFICATION">PAN / GST Verification Assistance</option>
                  <option value="FEATURE_REQUEST">Feature Request / Capacity Expansion</option>
                  <option value="OTHER">General Inquiries</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300 uppercase tracking-wider text-[10px]">Priority Level</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as TicketPriority)}
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-2.5 text-zinc-100 text-xs focus:outline-none focus:border-gold cursor-pointer"
                >
                  <option value="NORMAL">Normal Priority (Standard response)</option>
                  <option value="HIGH">High Priority (Urgent show/event impact)</option>
                  <option value="URGENT">Urgent (Live box office down)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300 uppercase tracking-wider text-[10px]">Subject Summary</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Verify secondary HDFC branch IFSC for weekend settlement"
                required
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-2.5 text-zinc-100 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300 uppercase tracking-wider text-[10px]">Detailed Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Please describe the exact issue, transaction reference, screen number, or booking ID..."
                required
                rows={4}
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-2 text-zinc-100 text-xs focus:outline-none focus:border-gold resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('TICKETS')}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-zinc-950 font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-gold/10"
              >
                Submit Support Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================= TAB 3: FAQS & KNOWLEDGE BASE ======================= */}
      {activeTab === 'FAQS' && (
        <div className="space-y-4 max-w-3xl">
          <div className="bg-[#121215] border border-white/5 p-5 rounded-2xl space-y-1">
            <h3 className="text-base font-bold text-zinc-100">Frequently Asked Operational Questions</h3>
            <p className="text-xs text-zinc-400">
              Clear guidelines on settlement routing, seat layout synchronizations, POS printers, and compliance.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#121215] border border-white/5 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-zinc-100 hover:text-gold cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gold shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================= TICKET DETAIL MODAL ======================= */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#121215] border border-gold/30 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gold font-bold">{selectedTicket.id}</span>
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <h3 className="text-sm font-bold text-zinc-100">{selectedTicket.subject}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Original Request Details */}
            <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Submitted by: <strong>{selectedTicket.partnerName}</strong></span>
                <span>{selectedTicket.createdAt}</span>
              </div>
              <p className="text-zinc-300 leading-relaxed">{selectedTicket.description}</p>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Support Activity Thread ({selectedTicket.messages.length})
              </span>
              <div className="space-y-2.5 max-h-56 overflow-y-auto no-scrollbar pr-1">
                {selectedTicket.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl text-xs space-y-1 ${
                      msg.senderRole === 'SUPPORT_ADMIN'
                        ? 'bg-gold/10 border border-gold/20 text-zinc-200'
                        : 'bg-white/5 border border-white/5 text-zinc-300'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className={`font-bold ${msg.senderRole === 'SUPPORT_ADMIN' ? 'text-gold' : 'text-zinc-400'}`}>
                        {msg.senderName}
                      </span>
                      <span className="text-zinc-500 font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="pt-2 border-t border-white/5 space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  placeholder="Type an update or reply to support..."
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl pl-3 pr-20 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={!replyMessage.trim()}
                  className="absolute right-1.5 top-1.5 px-3 py-1 bg-gold text-zinc-950 rounded-lg text-xs font-bold hover:bg-gold-light cursor-pointer disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default PartnerSupportCentre;
