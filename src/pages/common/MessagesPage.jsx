import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MessageCenter from '../../components/messaging/MessageCenter';

export default function MessagesPage() {
  return (
    <DashboardLayout
      title="Messages & Concierge Communications"
      subtitle="Direct line between guests, property hosts, and local service providers"
      noPadding
    >
      <MessageCenter />
    </DashboardLayout>
  );
}
