import React, { useState } from 'react';
import { StoreProvider, useStore } from './lib/store';
import { CropType, ServiceType } from './types';
import { DemoModeBanner } from './components/DemoModeBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { HeroSection } from './components/landing/HeroSection';
import { StatsSection } from './components/landing/StatsSection';
import { ServicesSection } from './components/landing/ServicesSection';
import { CropsSection } from './components/landing/CropsSection';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { CooperativeBanner } from './components/landing/CooperativeBanner';
import { OperatorPartnerBanner } from './components/landing/OperatorPartnerBanner';
import { CoverageSection } from './components/landing/CoverageSection';
import { AcademySection } from './components/landing/AcademySection';
import { FaqSection } from './components/landing/FaqSection';
import { ContactSection } from './components/landing/ContactSection';
import { BookingWizardModal } from './components/landing/BookingWizardModal';
import { FarmerDashboard } from './components/dashboards/FarmerDashboard';
import { CooperativeDashboard } from './components/dashboards/CooperativeDashboard';
import { OperatorDashboard } from './components/dashboards/OperatorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

const MainAppContent: React.FC = () => {
  const { currentUser, switchUser } = useStore();
  const [currentTab, setCurrentTab] = useState<'landing' | 'dashboard' | 'academy' | 'faq' | 'coverage'>('landing');

  // Booking wizard modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingInitialCrop, setBookingInitialCrop] = useState<CropType | undefined>(undefined);
  const [bookingInitialService, setBookingInitialService] = useState<ServiceType | undefined>(undefined);

  const handleOpenBooking = (crop?: CropType, service?: ServiceType) => {
    setBookingInitialCrop(crop);
    setBookingInitialService(service);
    setIsBookingOpen(true);
  };

  const handleSelectService = (service: ServiceType) => {
    handleOpenBooking(undefined, service);
  };

  const handleSelectCrop = (crop: CropType) => {
    handleOpenBooking(crop, undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* 1. Top Demo Mode / Role Switcher Banner */}
      <DemoModeBanner />

      {/* 2. Responsive Sticky Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* 3. Main Views Switching */}
      <main className="flex-1">
        {currentTab === 'dashboard' ? (
          <div>
            {currentUser.role === 'farmer' && (
              <FarmerDashboard onOpenBooking={() => handleOpenBooking()} />
            )}
            {currentUser.role === 'cooperative' && (
              <CooperativeDashboard onOpenBooking={() => handleOpenBooking()} />
            )}
            {currentUser.role === 'operator' && (
              <OperatorDashboard />
            )}
            {(currentUser.role === 'admin' || currentUser.role === 'super_admin') && (
              <AdminDashboard />
            )}
          </div>
        ) : currentTab === 'academy' ? (
          <div>
            <AcademySection />
            <ContactSection />
          </div>
        ) : currentTab === 'coverage' ? (
          <div>
            <CoverageSection onOpenBooking={() => handleOpenBooking()} />
            <ContactSection />
          </div>
        ) : currentTab === 'faq' ? (
          <div>
            <FaqSection />
            <ContactSection />
          </div>
        ) : (
          /* Public Landing Page */
          <>
            {/* Hero Section with Quick Estimator */}
            <HeroSection
              onOpenBooking={handleOpenBooking}
              onExploreServices={() => {
                const el = document.getElementById('services');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Dynamic Real Statistics */}
            <StatsSection />

            {/* Complete Services Showcase with Pricing */}
            <ServicesSection onSelectService={handleSelectService} />

            {/* Cameroonian Crops Showcase */}
            <CropsSection onOpenBookingWithCrop={handleSelectCrop} />

            {/* 5-Step Process */}
            <HowItWorksSection onOpenBooking={() => handleOpenBooking()} />

            {/* Cooperative Banner */}
            <CooperativeBanner
              onOpenBooking={() => handleOpenBooking()}
              onSwitchToCoop={() => {
                switchUser('cooperative');
                setCurrentTab('dashboard');
              }}
            />

            {/* Drone Operator Partner Onboarding */}
            <OperatorPartnerBanner
              onSwitchToOperator={() => {
                switchUser('operator');
                setCurrentTab('dashboard');
              }}
            />

            {/* Coverage & Interactive SVG Map */}
            <CoverageSection onOpenBooking={() => handleOpenBooking()} />

            {/* AgriFly Academy Blog & Agronomic Guides */}
            <AcademySection />

            {/* FAQ */}
            <FaqSection />

            {/* Contact with WhatsApp & Offices */}
            <ContactSection />
          </>
        )}
      </main>

      {/* 4. Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onSelectTab={setCurrentTab}
      />

      {/* 5. Booking Wizard Modal */}
      <BookingWizardModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialCrop={bookingInitialCrop}
        initialService={bookingInitialService}
      />

      {/* 6. Global Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
