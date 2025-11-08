import React from 'react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

const ChatWidget: React.FC = () => {
  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number (format: country code + number, no spaces or special characters)
    // Example: For +1 234-567-8900, use: 12345678900
    const phoneNumber = '1234567890'; // Replace with your actual WhatsApp number
    const message = encodeURIComponent('Hello! I would like to know more about your IPTV reseller services.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 cursor-pointer hover:scale-110 transition-all duration-300 z-50 hover:bg-[#128C7E] hover:shadow-green-500/60 animate-pulse hover:animate-none"
    >
      <WhatsAppIcon />
    </button>
  );
};

export default ChatWidget;