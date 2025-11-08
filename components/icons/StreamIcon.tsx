import React from 'react';

export const StreamIcon: React.FC = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="streamIconGradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F97316"/>
        <stop offset="1" stopColor="#A855F7"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#streamIconGradient)"/>
    <path d="M24 18H40C41.1046 18 42 18.8954 42 20V32C42 33.1046 41.1046 34 40 34H24C22.8954 34 22 33.1046 22 32V20C22 18.8954 22.8954 18 24 18Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 40H34" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26 46H38" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
