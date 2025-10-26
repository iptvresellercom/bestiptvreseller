import React from 'react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

const ChatWidget: React.FC = () => {
  return (
    <button
      aria-label="Open WhatsApp chat"
      className="fixed bottom-8 right-8 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 cursor-pointer hover:scale-105 transition-transform duration-200 z-50 hover:bg-[#128C7E] transition-colors duration-200"
    >
      <WhatsAppIcon />
    </button>
  );
};

export default ChatWidget;