

import React from 'react';

const IconContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-12 h-12 flex items-center justify-center">
        {children}
    </div>
);

export const RaspberryPiIcon: React.FC = () => (
    <IconContainer>
        <img src="https://www.svgrepo.com/show/306509/raspberry-pi.svg" alt="Raspberry Pi" className="w-10 h-10"/>
    </IconContainer>
);

export const HomeAssistantIcon: React.FC = () => (
    <IconContainer>
        <img src="https://www.svgrepo.com/show/306354/home-assistant.svg" alt="Home Assistant" className="w-10 h-10"/>
    </IconContainer>
);

export const PlexIcon: React.FC = () => (
    <IconContainer>
       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.356 12l-6.315 6.315a.997.997 0 000 1.414.997.997 0 001.414 0L20.1 12.356a.997.997 0 000-1.414L7.455 4.27a.997.997 0 00-1.414 0 .997.997 0 000 1.414L12.356 12z" />
            <path d="M3.9 12l4.24-4.24-4.24-4.24a.997.997 0 010-1.414.997.997 0 011.414 0l4.24 4.24 4.24-4.24a.997.997 0 011.414 0 .997.997 0 010 1.414l-4.24 4.24 4.24 4.24a.997.997 0 010 1.414.997.997 0 01-1.414 0l-4.24-4.24-4.24 4.24a.997.997 0 01-1.414 0 .997.997 0 010-1.414l4.24-4.24z" opacity="0.6"/>
        </svg>
    </IconContainer>
);

export const IptvPanelIcon: React.FC = () => (
    <IconContainer>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    </IconContainer>
);
