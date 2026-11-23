import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Event, EventOrganizer, EventRegistration } from '../../../types';
import EventManagerDashboard from './EventManagerDashboard';

interface EventOrganizerDashboardProps {
  activeTab?: string;
  onClose?: () => void;
}

export const EventOrganizerDashboard: React.FC<EventOrganizerDashboardProps> = ({
  activeTab: externalTab,
  onClose: externalOnClose
}) => {
  const { currentPartner, logout } = useApp();

  // Pre-seeded organizers matching authoritative CineVenue platform
  const [eventOrganizers, setEventOrganizers] = useState<EventOrganizer[]>(() => {
    const defaultList: EventOrganizer[] = [
      {
        id: 'EO-001',
        email: 'sunburn.org@cinevenue.com',
        passwordHash: 'Sunburn123',
        name: 'Sunburn Arena Events',
        contact: '+91 98765 43210',
        bankRouting: 'HDFC0000240',
        commissionPercent: 12,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
      },
      {
        id: 'EO-002',
        email: 'gala.org@cinevenue.com',
        passwordHash: 'Gala123',
        name: 'Epic Gala Organizers',
        contact: '+91 88888 77777',
        bankRouting: 'ICIC0000104',
        commissionPercent: 10,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
      }
    ];

    // If active partner is an event organizer, add or update them
    if (currentPartner && currentPartner.category === 'EVENT_ORGANIZER') {
      const existing = defaultList.find(o => o.id === currentPartner.id);
      if (!existing) {
        defaultList.unshift({
          id: currentPartner.id,
          name: currentPartner.businessName,
          email: currentPartner.email,
          contact: currentPartner.mobile,
          bankRouting: 'HDFC0000240',
          commissionPercent: 12,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
        });
      }
    }

    return defaultList;
  });

  // Selected organizerId (prioritize URL ?organizerId= parameter)
  const organizerId = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlOrgId = params.get('organizerId');
      if (urlOrgId && eventOrganizers.some(o => o.id === urlOrgId)) {
        return urlOrgId;
      }
    } catch {
      // fallback
    }
    if (currentPartner && currentPartner.category === 'EVENT_ORGANIZER') {
      const match = eventOrganizers.find(o => o.id === currentPartner.id);
      if (match) return match.id;
    }
    return 'EO-001';
  }, [eventOrganizers, currentPartner]);

  // Live events catalog
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('cine_partner_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  // Registrations ledger
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>(() => {
    const saved = localStorage.getItem('cine_partner_event_regs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  const handleAddEvent = (newEvent: Event) => {
    setEvents(prev => {
      const updated = [newEvent, ...prev];
      localStorage.setItem('cine_partner_events', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => {
      const updated = prev.filter(e => e.id !== id);
      localStorage.setItem('cine_partner_events', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateEventOrganizer = (updatedOrganizer: EventOrganizer) => {
    setEventOrganizers(prev =>
      prev.map(o => (o.id === updatedOrganizer.id ? updatedOrganizer : o))
    );
  };

  const handleUpdateEventRegistrationStatus = (
    regId: string,
    status:
      | 'Confirmed'
      | 'Cancelled'
      | 'ApprovedByOrganizer'
      | 'ApprovedBySuperAdmin'
      | 'DeclinedByOrganizer'
      | 'DeclinedBySuperAdmin'
  ) => {
    setEventRegistrations(prev =>
      prev.map(r => {
        if (r.id !== regId) return r;
        if (status === 'ApprovedByOrganizer') {
          return { ...r, organizerApproved: true };
        }
        if (status === 'DeclinedByOrganizer') {
          return { ...r, organizerApproved: false, status: 'Cancelled' };
        }
        return { ...r, status: status as 'Confirmed' | 'Cancelled' };
      })
    );
  };

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      logout();
    }
  };

  return (
    <div
      id="event-organizer-portal"
      className="fixed inset-0 z-50 bg-[#0A0A0B] flex overflow-hidden text-left font-sans text-zinc-100"
    >
      <EventManagerDashboard
        organizerId={organizerId}
        eventOrganizers={eventOrganizers}
        events={events}
        eventRegistrations={eventRegistrations}
        onClose={handleClose}
        onAddEvent={handleAddEvent}
        onDeleteEvent={handleDeleteEvent}
        onUpdateEventOrganizer={handleUpdateEventOrganizer}
        onUpdateEventRegistrationStatus={handleUpdateEventRegistrationStatus}
      />
    </div>
  );
};

export default EventOrganizerDashboard;
