/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { DeviceFrame } from './components/common/DeviceFrame';
import { StatusBanner } from './components/common/StatusBanner';
import { RegistrationWizard } from './components/registration/RegistrationWizard';
import { WelcomeEntryScreen } from './components/auth/WelcomeEntryScreen';
import { AdminPanel } from './components/admin/AdminPanel';
import { TheatreDashboard } from './components/dashboards/theatre/TheatreDashboard';
import { EventOrganizerDashboard } from './components/dashboards/event/EventOrganizerDashboard';
import { ProductionHouseDashboard } from './components/dashboards/production/ProductionHouseDashboard';
import { EntertainmentDashboard } from './components/dashboards/entertainment/EntertainmentDashboard';
import { EventMgmtDashboard } from './components/dashboards/event_mgmt/EventMgmtDashboard';
import { EmployeePortal } from './components/employee/EmployeePortal';

const MainAppContent: React.FC = () => {
  const { userSession, currentPartner } = useApp();
  const [activeTab, setActiveTab] = useState<string>('overview');

  const renderRoleDashboard = () => {
    // 0. Welcome Entry Screen (Dual Gateway: Partner Login vs Admin Login)
    if (userSession.type === 'WELCOME') {
      return <WelcomeEntryScreen />;
    }

    // 1. CineVenue Admin Verification Portal
    if (userSession.type === 'ADMIN') {
      return <AdminPanel />;
    }

    // 2. New Partner Registration Wizard Flow
    if (userSession.type === 'REGISTRATION') {
      return <RegistrationWizard />;
    }

    // 3. Approval Status Verification Lock (Pending, More Info, Rejected, Suspended)
    if (userSession.type === 'STATUS_CHECK' || (currentPartner && currentPartner.status !== 'APPROVED')) {
      return <StatusBanner />;
    }

    // 4. Employee Account Portal (Restricted operational functions only)
    if (userSession.role === 'EMPLOYEE') {
      return <EmployeePortal activeTab={activeTab} />;
    }

    // 5. Approved Partner Category-Specific Dashboards (Strict Access Control)
    const category = currentPartner?.category;

    switch (category) {
      case 'THEATRE_PARTNER':
        return <TheatreDashboard activeTab={activeTab} />;

      case 'EVENT_ORGANIZER':
        return <EventOrganizerDashboard activeTab={activeTab} />;

      case 'PRODUCTION_HOUSE':
        return <ProductionHouseDashboard />;

      case 'ENTERTAINMENT_PARTNER':
        return <EntertainmentDashboard />;

      case 'EVENT_MANAGEMENT':
        return <EventMgmtDashboard />;

      default:
        return <TheatreDashboard activeTab={activeTab} />;
    }
  };

  return (
    <DeviceFrame>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col pb-20">
        {/* Top Header Contract */}
        <Header />

        {/* Dynamic Main View */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
          {renderRoleDashboard()}
        </main>

        {/* Dynamic Mobile Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
