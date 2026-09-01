import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { MobileFrame } from './components/layout/MobileFrame';
import { HeaderBar } from './components/common/HeaderBar';
import { BottomNav } from './components/common/BottomNav';
import { HomeScreen } from './components/patient/HomeScreen';
import { AppointmentsScreen } from './components/patient/AppointmentsScreen';
import { ClinicInfoScreen } from './components/patient/ClinicInfoScreen';
import { ProfileScreen } from './components/patient/ProfileScreen';
import { BookAppointmentModal } from './components/patient/BookAppointmentModal';
import { AuthModal } from './components/patient/AuthModal';
import { NotificationsDrawer } from './components/patient/NotificationsDrawer';
import { AuthScreen } from './components/patient/AuthScreen';
import { StaffSyncSimulator } from './components/staff/StaffSyncSimulator';
import { ThesisRoadmapHub } from './components/roadmap/ThesisRoadmapHub';

const MainAppContent: React.FC = () => {
  const { viewMode, setViewMode, activeTab, setActiveTab, isLoggedIn } = useClinic();
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState<boolean>(false);

  // If viewing the Dedicated Login & Registration Screen (per reference image)
  if (viewMode === 'auth-preview') {
    return (
      <MobileFrame>
        <AuthScreen
          initialMode="login"
          onSuccess={() => setViewMode('mobile-app')}
        />
      </MobileFrame>
    );
  }

  // If viewing the Thesis Roadmap or Staff Web Desk
  if (viewMode === 'thesis-roadmap') {
    return (
      <MobileFrame>
        <ThesisRoadmapHub />
      </MobileFrame>
    );
  }

  if (viewMode === 'staff-portal') {
    return (
      <MobileFrame>
        <StaffSyncSimulator />
      </MobileFrame>
    );
  }

  // Otherwise, render the Patient Mobile application inside the device frame
  return (
    <MobileFrame>
      <div className="flex flex-col h-full w-full bg-[#F4F8FD] relative overflow-hidden">
        {/* Header Bar */}
        <HeaderBar
          title={
            activeTab === 'home'
              ? 'M-Care Patient'
              : activeTab === 'appointments'
              ? 'My Visits'
              : activeTab === 'clinic'
              ? 'Clinic & Map'
              : activeTab === 'auth'
              ? 'Sign In / Register'
              : 'Patient Profile'
          }
          onOpenNotifications={() => setShowNotificationsDrawer(true)}
        />

        {/* Scrollable Tab Content Viewport */}
        <main className="flex-1 min-h-0 overflow-y-auto relative scrollbar-none">
          {activeTab === 'home' && (
            <HomeScreen
              onOpenBooking={() => setShowBookingModal(true)}
              onOpenAppointments={() => setActiveTab('appointments')}
              onOpenClinicInfo={() => setActiveTab('clinic')}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsScreen onOpenBooking={() => setShowBookingModal(true)} />
          )}

          {activeTab === 'book' && (
            <div className="p-4 space-y-4">
              <HomeScreen
                onOpenBooking={() => setShowBookingModal(true)}
                onOpenAppointments={() => setActiveTab('appointments')}
                onOpenClinicInfo={() => setActiveTab('clinic')}
              />
            </div>
          )}

          {activeTab === 'clinic' && <ClinicInfoScreen />}

          {activeTab === 'profile' && (
            <ProfileScreen onOpenAuth={() => setShowAuthModal(true)} />
          )}

          {activeTab === 'auth' && (
            <AuthScreen
              onSuccess={() => setActiveTab('home')}
            />
          )}
        </main>

        {/* Bottom Mobile Tab Bar (Always fixed & stick to bottom) */}
        <BottomNav />

        {/* Modal Overlays */}
        {(showBookingModal || activeTab === 'book') && (
          <BookAppointmentModal
            onClose={() => {
              setShowBookingModal(false);
              if (activeTab === 'book') setActiveTab('home');
            }}
            onSuccess={() => {
              setShowBookingModal(false);
              setActiveTab('appointments');
            }}
          />
        )}

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}

        {showNotificationsDrawer && (
          <NotificationsDrawer
            onClose={() => setShowNotificationsDrawer(false)}
            onNavigateToAppointment={() => {
              setShowNotificationsDrawer(false);
              setActiveTab('appointments');
            }}
          />
        )}
      </div>
    </MobileFrame>
  );
};

export default function App() {
  return (
    <ClinicProvider>
      <MainAppContent />
    </ClinicProvider>
  );
}
