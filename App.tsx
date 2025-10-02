import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './components/SplashScreen'; // Back to original
import HomePage from './components/HomePage';
import DebrisTracking from './components/DebrisTracking';
import BusinessDashboard from './components/BusinessDashboard';
import RecyclingHub from './components/RecyclingHub';
import ServiceDrones from './components/ServiceDrones';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'debris' | 'business' | 'recycling' | 'servicedrones'>('home');

  const handleSplashFinish = () => {
    console.log('App: handleSplashFinish called, hiding splash screen');
    setShowSplash(false);
  };

  const navigateToDebrisTracking = () => {
    setCurrentScreen('debris');
  };

  const navigateToBusinessDashboard = () => {
    setCurrentScreen('business');
  };

  const navigateToRecyclingHub = () => {
    setCurrentScreen('recycling');
  };

  const navigateToServiceDrones = () => {
    setCurrentScreen('servicedrones');
  };

  const navigateToHome = () => {
    setCurrentScreen('home');
  };

  console.log('App: Rendering with showSplash =', showSplash);

  if (showSplash) {
    console.log('App: Showing splash screen');
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  console.log('App: Showing', currentScreen, 'screen');
  
  if (currentScreen === 'debris') {
    return (
      <>
        <DebrisTracking onNavigateBack={navigateToHome} />
        <StatusBar style="light" />
      </>
    );
  }

  if (currentScreen === 'business') {
    return (
      <>
        <BusinessDashboard onNavigateBack={navigateToHome} />
        <StatusBar style="light" />
      </>
    );
  }

  if (currentScreen === 'recycling') {
    return (
      <>
        <RecyclingHub onNavigateBack={navigateToHome} />
        <StatusBar style="light" />
      </>
    );
  }

  if (currentScreen === 'servicedrones') {
    return (
      <>
        <ServiceDrones onNavigateBack={navigateToHome} />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <>
      <HomePage 
        onNavigateToDebris={navigateToDebrisTracking}
        onNavigateToBusiness={navigateToBusinessDashboard}
        onNavigateToRecycling={navigateToRecyclingHub}
        onNavigateToServiceDrones={navigateToServiceDrones}
      />
      <StatusBar style="light" />
    </>
  );
}
