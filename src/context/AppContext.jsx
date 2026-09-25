import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PROPERTIES,
  CONCIERGE_CATEGORIES,
  SERVICE_PROVIDERS,
  INITIAL_BOOKINGS,
  INITIAL_CONCIERGE_REQUESTS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MESSAGES,
  INITIAL_REVIEWS
} from '../data/mockData';

const AppContext = createContext(null);

const STORAGE_KEY = 'stayease_prototype_state_v2';

export function AppProvider({ children }) {
  // Current active role
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('stayease_role') || 'guest';
  });

  // Main interactive collections
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_properties`);
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bookings`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [conciergeRequests, setConciergeRequests] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_requests`);
    return saved ? JSON.parse(saved) : INITIAL_CONCIERGE_REQUESTS;
  });

  const [maintenanceTickets, setMaintenanceTickets] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_maintenance`);
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_TICKETS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Toast feedback state
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const closeToast = () => setToast((prev) => ({ ...prev, visible: false }));

  // Synchronize to localStorage
  useEffect(() => {
    localStorage.setItem('stayease_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_properties`, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_requests`, JSON.stringify(conciergeRequests));
  }, [conciergeRequests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_maintenance`, JSON.stringify(maintenanceTickets));
  }, [maintenanceTickets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(reviews));
  }, [reviews]);

  // Role info
  const usersByRole = {
    guest: {
      id: 'guest-1',
      name: 'Guest',
      role: 'guest',
      email: 'guest@stayease.in',
      altEmail: 'priya.sharma@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98201 55678',
      city: 'Bengaluru'
    },
    owner: {
      id: 'owner-1',
      name: 'Owner',
      role: 'owner',
      email: 'owner@stayease.in',
      altEmail: 'vikram.singhania@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98221 88390',
      city: 'Goa'
    },
    provider: {
      id: 'prov-1',
      name: 'Ramesh Kumar',
      role: 'provider',
      company: 'Coastal Mobility & Express Maintenance',
      email: 'provider@stayease.in',
      altEmail: 'ramesh.kumar@coastalmobility.in',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98221 44021',
      city: 'Goa'
    },
    admin: {
      id: 'admin-1',
      name: 'Ananya Deshmukh',
      role: 'admin',
      email: 'admin@stayease.in',
      altEmail: 'admin@stayease.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98190 00122',
      city: 'Mumbai'
    }
  };

  // Authentication & session state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('stayease_auth') !== 'false';
  });

  const currentUser = usersByRole[currentRole] || usersByRole.guest;

  const login = (role = 'guest') => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('stayease_auth', 'true');
    localStorage.setItem('stayease_role', role);
    showToast(`Signed in as ${usersByRole[role]?.name} (${role.toUpperCase()})`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('stayease_auth', 'false');
    showToast('You have been signed out of StayEase.', 'info');
  };

  const register = (userData) => {
    const role = userData.role || 'guest';
    setCurrentRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('stayease_auth', 'true');
    localStorage.setItem('stayease_role', role);
    showToast(`Account registered! Welcome to StayEase, ${userData.name || 'Traveler'}.`, 'success');
  };

  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    setIsAuthenticated(true);
    localStorage.setItem('stayease_auth', 'true');
    localStorage.setItem('stayease_role', newRole);
    showToast(`Switched account to ${usersByRole[newRole].name} (${newRole.toUpperCase()})`, 'info');
  };

  // State actions
  const createBooking = (bookingData) => {
    const newRef = `STY-2024-${String(Math.floor(100 + Math.random() * 900)).padStart(5, '0')}`;
    const newBooking = {
      id: `booking-${Date.now()}`,
      reference: newRef,
      guestId: currentUser.id,
      guestName: currentUser.name,
      guestEmail: currentUser.email,
      guestPhone: currentUser.phone,
      status: 'confirmed',
      paymentDate: new Date().toISOString().split('T')[0],
      wifiName: 'PalmGrove_HighSpeed_5G',
      wifiPass: 'ashwem2024',
      doorCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      emergencyContact: '+91 98221 00999 (StayEase Rapid Response)',
      ...bookingData
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Send notifications to Guest & Owner
    const newNotifs = [
      {
        id: `notif-${Date.now()}-1`,
        userId: currentUser.id,
        role: 'guest',
        title: `Booking Confirmed: ${newBooking.propertyName}`,
        message: `Your reservation (${newBooking.reference}) for ${newBooking.nights} nights is confirmed. Enjoy your stay!`,
        time: 'Just now',
        read: false,
        link: '/guest/stay'
      },
      {
        id: `notif-${Date.now()}-2`,
        userId: 'owner-1',
        role: 'owner',
        title: `New Reservation: ${newBooking.propertyName}`,
        message: `${currentUser.name} booked ${newBooking.nights} nights starting ${newBooking.checkIn}.`,
        time: 'Just now',
        read: false,
        link: '/owner/reservations'
      }
    ];
    setNotifications((prev) => [...newNotifs, ...prev]);

    showToast(`Booking ${newRef} confirmed! Concierge is at your service.`, 'success');
    return newBooking;
  };

  const createConciergeRequest = (requestData) => {
    const newReq = {
      id: `req-${Date.now()}`,
      guestId: currentUser.id,
      guestName: currentUser.name,
      guestPhone: currentUser.phone,
      status: 'requested',
      createdAt: new Date().toISOString(),
      statusTimeline: [
        {
          step: 'Requested',
          time: 'Just now',
          label: 'Requested by Guest'
        }
      ],
      ...requestData
    };

    setConciergeRequests((prev) => [newReq, ...prev]);

    // Owner notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: 'owner-1',
        role: 'owner',
        title: `New Concierge Request: ${newReq.serviceTitle}`,
        message: `Guest ${currentUser.name} submitted a request for ${newReq.date}.`,
        time: 'Just now',
        read: false,
        link: '/owner/concierge'
      },
      ...prev
    ]);

    showToast(`Concierge request for "${newReq.serviceTitle}" submitted.`, 'success');
    return newReq;
  };

  const acceptConciergeRequest = (requestId) => {
    setConciergeRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const updatedTimeline = [
            ...req.statusTimeline,
            { step: 'Accepted', time: 'Just now', label: 'Accepted by Owner' }
          ];
          return {
            ...req,
            status: 'accepted',
            statusTimeline: updatedTimeline
          };
        }
        return req;
      })
    );

    // Guest notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: 'guest-1',
        role: 'guest',
        title: 'Concierge Request Accepted',
        message: 'The villa host accepted your request and is coordinating local providers.',
        time: 'Just now',
        read: false,
        link: '/guest/requests'
      },
      ...prev
    ]);

    showToast('Request accepted. You can now assign a verified local provider.', 'success');
  };

  const assignProviderToRequest = (requestId, providerId) => {
    const provider = SERVICE_PROVIDERS.find((p) => p.id === providerId) || SERVICE_PROVIDERS[0];

    setConciergeRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const updatedTimeline = [
            ...req.statusTimeline,
            { step: 'Provider Assigned', time: 'Just now', label: `Assigned to ${provider.name}` }
          ];
          return {
            ...req,
            status: 'assigned',
            assignedProviderId: provider.id,
            assignedProviderName: provider.name,
            assignedProviderPhone: provider.phone,
            statusTimeline: updatedTimeline
          };
        }
        return req;
      })
    );

    // Notify Provider and Guest
    const newNotifs = [
      {
        id: `notif-${Date.now()}-prov`,
        userId: provider.id,
        role: 'provider',
        title: 'New Service Job Assigned',
        message: `You have been assigned to fulfill a concierge request for StayEase.`,
        time: 'Just now',
        read: false,
        link: '/provider/dashboard'
      },
      {
        id: `notif-${Date.now()}-guest`,
        userId: 'guest-1',
        role: 'guest',
        title: 'Provider Assigned',
        message: `${provider.name} (${provider.company}) has been assigned to your request.`,
        time: 'Just now',
        read: false,
        link: '/guest/requests'
      }
    ];
    setNotifications((prev) => [...newNotifs, ...prev]);

    showToast(`Assigned ${provider.name} to this request.`, 'success');
  };

  const advanceProviderJobStatus = (requestId, newStatus) => {
    const statusLabels = {
      in_progress: 'In Progress',
      completed: 'Completed'
    };

    setConciergeRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const updatedTimeline = [
            ...req.statusTimeline,
            { step: statusLabels[newStatus] || newStatus, time: 'Just now', label: `Service ${statusLabels[newStatus] || newStatus}` }
          ];
          return {
            ...req,
            status: newStatus,
            statusTimeline: updatedTimeline
          };
        }
        return req;
      })
    );

    // Guest notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: 'guest-1',
        role: 'guest',
        title: `Service Update: ${statusLabels[newStatus] || newStatus}`,
        message: `Your concierge service status has been updated to "${statusLabels[newStatus] || newStatus}".`,
        time: 'Just now',
        read: false,
        link: '/guest/requests'
      },
      ...prev
    ]);

    showToast(`Job status updated to ${statusLabels[newStatus] || newStatus}`, 'success');
  };

  const createMaintenanceTicket = (ticketData) => {
    const newTicket = {
      id: `maint-${Date.now()}`,
      guestName: currentUser.name,
      status: 'reported',
      reportedAt: new Date().toISOString(),
      resolvedAt: null,
      ...ticketData
    };

    setMaintenanceTickets((prev) => [newTicket, ...prev]);

    // Owner notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: 'owner-1',
        role: 'owner',
        title: `Maintenance Reported: ${newTicket.category}`,
        message: `${newTicket.title} reported at ${newTicket.propertyName}.`,
        time: 'Just now',
        read: false,
        link: '/owner/maintenance'
      },
      ...prev
    ]);

    showToast('Maintenance request logged. Concierge dispatched.', 'success');
    return newTicket;
  };

  const assignMaintenanceTechnician = (ticketId, providerId) => {
    const provider = SERVICE_PROVIDERS.find((p) => p.id === providerId) || SERVICE_PROVIDERS[0];

    setMaintenanceTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            status: 'assigned',
            assignedToId: provider.id,
            assignedToName: `${provider.name} (${provider.company})`
          };
        }
        return ticket;
      })
    );

    showToast(`Technician ${provider.name} assigned to maintenance ticket.`, 'success');
  };

  const resolveMaintenanceTicket = (ticketId) => {
    setMaintenanceTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            status: 'resolved',
            resolvedAt: new Date().toISOString()
          };
        }
        return ticket;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: 'guest-1',
        role: 'guest',
        title: 'Maintenance Issue Resolved',
        message: 'Your reported maintenance issue has been inspected and resolved.',
        time: 'Just now',
        read: false,
        link: '/guest/maintenance'
      },
      ...prev
    ]);

    showToast('Maintenance ticket marked as resolved.', 'success');
  };

  const addProperty = (newPropData) => {
    const newProp = {
      id: `prop-${Date.now()}`,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      ownerSuperhost: false,
      rating: 5.0,
      reviewsCount: 0,
      status: 'pending_approval', // pending_approval -> active
      featured: false,
      images: [newPropData.coverImage || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'],
      ...newPropData
    };

    setProperties((prev) => [newProp, ...prev]);

    // Admin notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: 'admin-1',
        role: 'admin',
        title: 'New Property Listing Submitted',
        message: `${newProp.name} in ${newProp.location} submitted by ${currentUser.name} for review.`,
        time: 'Just now',
        read: false,
        link: '/admin/dashboard'
      },
      ...prev
    ]);

    showToast(`Property "${newProp.name}" submitted for StayEase quality review.`, 'success');
    return newProp;
  };

  const updatePropertyStatus = (propertyId, status) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status } : p))
    );
    showToast(`Property status updated to ${status}.`, 'info');
  };

  const submitReview = (reviewData) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      guestName: currentUser.name,
      guestLocation: currentUser.city || 'India',
      date: 'Just now',
      ...reviewData
    };

    setReviews((prev) => [newRev, ...prev]);
    showToast('Thank you for sharing your experience! Review published.', 'success');
    return newRev;
  };

  const sendMessage = (conversationId, text) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: currentUser.name,
      senderRole: currentRole,
      text,
      time: 'Just now'
    };

    setMessages((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMsg]
          };
        }
        return conv;
      })
    );
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_properties`);
    localStorage.removeItem(`${STORAGE_KEY}_bookings`);
    localStorage.removeItem(`${STORAGE_KEY}_requests`);
    localStorage.removeItem(`${STORAGE_KEY}_maintenance`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);
    localStorage.removeItem(`${STORAGE_KEY}_messages`);
    localStorage.removeItem(`${STORAGE_KEY}_reviews`);

    setProperties(INITIAL_PROPERTIES);
    setBookings(INITIAL_BOOKINGS);
    setConciergeRequests(INITIAL_CONCIERGE_REQUESTS);
    setMaintenanceTickets(INITIAL_MAINTENANCE_TICKETS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setMessages(INITIAL_MESSAGES);
    setReviews(INITIAL_REVIEWS);

    showToast('Demo data successfully restored to pristine state.', 'info');
  };

  // Cross-role stats for quick glance badges
  const stats = {
    upcomingStays: bookings.filter((b) => b.status === 'confirmed').length,
    guestActiveRequests: conciergeRequests.filter((r) => r.status !== 'completed').length,
    ownerPendingRequests: conciergeRequests.filter((r) => r.status === 'requested').length,
    ownerOpenMaintenance: maintenanceTickets.filter((t) => t.status !== 'resolved').length,
    providerActiveJobs: conciergeRequests.filter(
      (r) => r.assignedProviderId === 'prov-1' && r.status !== 'completed'
    ).length,
    adminPendingApprovals: properties.filter((p) => p.status === 'pending_approval').length
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        register,
        currentRole,
        switchRole,
        currentUser,
        usersByRole,
        properties,
        addProperty,
        updatePropertyStatus,
        conciergeCategories: CONCIERGE_CATEGORIES,
        serviceProviders: SERVICE_PROVIDERS,
        bookings,
        createBooking,
        conciergeRequests,
        createConciergeRequest,
        acceptConciergeRequest,
        assignProviderToRequest,
        advanceProviderJobStatus,
        maintenanceTickets,
        createMaintenanceTicket,
        assignMaintenanceTechnician,
        resolveMaintenanceTicket,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        messages,
        sendMessage,
        reviews,
        submitReview,
        stats,
        toast,
        showToast,
        closeToast,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
