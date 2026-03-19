"use client";

import { useEffect, useState } from 'react';

export default function PWARegister() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    // Register service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        console.log('Service Worker registered successfully:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    registerSW();
  }, [isSupported]);

  return null; // This component doesn't render anything
}
