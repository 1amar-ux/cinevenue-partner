import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  UserCheck,
  AlertTriangle,
  Sliders,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { UserRole, Permission } from '../../../types';

export const EmployeeManagementTab: React.FC = () => {
  const { employees, inviteEmployee, updateEmployeePermissions, toggleEmployeeStatus, currentPartner } = useApp();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState<UserRole>('EMPLOYEE');
  const [designationInput, setDesignationInput] = useState('Box Office Usher & Scanner');

  // Selected permissions state for modal
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([
    'QR_SCANNING',
    'TICKET_VERIFICATION',
    'POS_BOOKING',
    'SHOW_TIMINGS',
    'VIEW_SCREENS',
    'CUSTOMER_ASSIST'
  ]);

  const allAvailablePermissions: { id: Permission; label: string; desc: string; isSensitive?: boolean }[] = [
    { id: 'QR_SCANNING', label: 'QR Ticket Scanning', desc: 'Scan customer entry QR codes at gate' },
    { id: 'TICKET_VERIFICATION', label: 'Ticket Code Lookup', desc: 'Verify booking code status & check-ins' },
    { id: 'POS_BOOKING', label: 'POS Box Office Counter', desc: 'Issue tickets & print thermal passes' },
    { id: 'SHOW_TIMINGS', label: 'Check Show Timings', desc: 'View scheduled movie start times' },
    { id: 'VIEW_SCREENS', label: 'View Screens & Capacity', desc: 'Check auditorium seat layouts' },
    { id: 'CUSTOMER_ASSIST', label: 'Customer Assistance', desc: 'Handle seat reassignments' },
    
    // Sensitive permissions (restricted from regular staff by default!)
    { id: 'REVENUE_VIEW', label: 'Revenue Reports (Sensitive)', desc: 'Access financial daily revenue totals', isSensitive: true },
    { id: 'EMPLOYEE_ADMIN', label: 'Employee Administration (Sensitive)', desc: 'Invite or modify staff access', isSensitive: true },
    { id: 'BANK_SETTINGS', label: 'Bank & Payouts (Owner Only)', desc: 'View settlement accounts & bank details', isSensitive: true },
    { id: 'BUSINESS_SETTINGS', label: 'Business Settings (Owner Only)', desc: 'Modify company legal profile', isSensitive: true }
  ];

  const handlePermissionToggle = (permId: Permission) => {
    setSelectedPermissions(prev =>
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPartner || !nameInput || !phoneInput) return;

    inviteEmployee(
      currentPartner.id,
      nameInput,
      phoneInput,
      emailInput || `${nameInput.toLowerCase().replace(/\s+/g, '.')}@partner.com`,
      roleInput,
      designationInput,
      selectedPermissions
    );

    setIsInviteModalOpen(false);
    setNameInput('');
    setPhoneInput('');
    setEmailInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Employee & Staff Access Control
          </span>
          <h2 className="text-xl font-bold font-cinzel text-zinc-100">
            Employee Administration & Permission Matrix
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Invite employees via mobile number and grant granular operational permissions (QR Scanning, POS counter, Gate verification).
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Invite New Employee by Mobile #
        </button>
      </div>

      {/* Account Levels Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">OWNER Account</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">Full Control</span>
          </div>
          <p className="text-zinc-400">Complete access to business settings, revenue, bank payouts, multi-location switching & staff management.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">MANAGER Account</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">Operational</span>
          </div>
          <p className="text-zinc-400">Location operational management, POS counter issuance, screen scheduling & ticket cancellations.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-300 uppercase tracking-wider text-[11px]">EMPLOYEE Account</span>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-bold">Restricted</span>
          </div>
          <p className="text-zinc-400">Assigned functions only (QR Scanner, Ticket Verification, POS). Financials & Bank details strictly hidden.</p>
        </div>

      </div>

      {/* Active Staff Roster */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-base font-bold font-cinzel text-zinc-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            Active & Invited Staff Roster ({employees.length})
          </h3>
          <span className="text-xs text-zinc-400">Role-based Access Enforced</span>
        </div>

        <div className="space-y-3">
          {employees.map(emp => (
            <div key={emp.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 text-amber-400 flex items-center justify-center font-bold text-sm">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-100">{emp.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        emp.role === 'MANAGER' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {emp.role}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                        {emp.status}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {emp.designation} · <span className="font-mono text-amber-300">{emp.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => toggleEmployeeStatus(emp.id, emp.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      emp.status === 'ACTIVE'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                    }`}
                  >
                    {emp.status === 'ACTIVE' ? 'Suspend Access' : 'Reactivate Access'}
                  </button>
                </div>
              </div>

              {/* Granted Permissions Tags */}
              <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-zinc-500 font-medium">Assigned Permissions:</span>
                {emp.permissions.map(perm => (
                  <span key={perm} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {perm.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Employee Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSendInvite} className="bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-amber-400 font-cinzel">
                Send Employee Invitation via Mobile #
              </h3>
              <p className="text-xs text-zinc-400">
                The employee will log in using this mobile number and gain assigned permissions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Employee Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Role Access Level</label>
                <select
                  value={roleInput}
                  onChange={e => setRoleInput(e.target.value as UserRole)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                >
                  <option value="EMPLOYEE">EMPLOYEE (Operational Only)</option>
                  <option value="MANAGER">MANAGER (Location Operations)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Designation</label>
                <input
                  type="text"
                  value={designationInput}
                  onChange={e => setDesignationInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100"
                />
              </div>
            </div>

            {/* Permissions Matrix Checklist */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Custom Permission Assignment
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {allAvailablePermissions.map(p => {
                  const isChecked = selectedPermissions.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => handlePermissionToggle(p.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-amber-500/15 border-amber-500/40 text-zinc-100'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 accent-amber-500"
                      />
                      <div>
                        <div className="font-semibold text-zinc-200">{p.label}</div>
                        <div className="text-[10px] text-zinc-400">{p.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Send Mobile Invitation
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
