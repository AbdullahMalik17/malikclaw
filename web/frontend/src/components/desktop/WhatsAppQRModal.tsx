import React, { useEffect, useState } from 'react';

// Assuming Wails runtime is available globally or through a bridge
declare global {
  interface Window {
    runtime: {
      EventsOn: (eventName: string, callback: (data: any) => void) => void;
    };
  }
}

export const WhatsAppQRModal: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    if (window.runtime) {
      window.runtime.EventsOn('whatsapp-qr', (code: string) => {
        setQrCode(code);
      });
    }
  }, []);

  if (!qrCode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Scan WhatsApp QR</h2>
        <div className="bg-gray-100 p-4 rounded-xl mb-4 flex justify-center">
          {/* Simple placeholder for QR code - in a real app, use qrcode.react */}
          <div className="w-48 h-48 bg-gray-300 flex items-center justify-center overflow-hidden">
            <span className="text-xs break-all p-2">{qrCode}</span>
          </div>
        </div>
        <p className="text-gray-600 mb-6">Open WhatsApp on your phone and scan this code to link your device.</p>
        <button 
          onClick={() => setQrCode(null)}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
