import { div } from 'framer-motion/m';
import React from 'react';

export const BITRLogo: React.FC = () => (
  <div classList="flex justify-content items-center">
    <svg className="w-full text-white" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="currentColor" />
    <path d="M12 7L7 9.5L12 12L17 9.5L12 7Z" fill="currentColor" opacity="0.7" />
    <path d="M7 9.5V14.5L12 17L17 14.5V9.5" fill="currentColor" opacity="0.5" />
    {/* <text x="28" y="16" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="currentColor">BITR</text> */}
    {/* <text x="65" y="16" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="normal" fill="currentColor">Best IPTV Reseller</text> */}
  </svg>
  </div>
);