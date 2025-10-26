import React from 'react';

const IconWrapper: React.FC<{bgColor: string, children: React.ReactNode}> = ({bgColor, children}) => (
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${bgColor}`}>
        {children}
    </div>
);

const BaseIcon: React.FC<{ path: string }> = ({ path }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);


export const AppIcons = {
    HomeAssistant: () => <IconWrapper bgColor="bg-blue-500"><BaseIcon path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></IconWrapper>,
    Jellyfin: () => <IconWrapper bgColor="bg-purple-600"><BaseIcon path="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>,
    Nextcloud: () => <IconWrapper bgColor="bg-sky-500"><BaseIcon path="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></IconWrapper>,
    Immich: () => <IconWrapper bgColor="bg-green-500"><BaseIcon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></IconWrapper>,
    LightningNode: () => <IconWrapper bgColor="bg-yellow-500"><BaseIcon path="M13 10V3L4 14h7v7l9-11h-7z" /></IconWrapper>,
    Vaultwarden: () => <IconWrapper bgColor="bg-indigo-600"><BaseIcon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></IconWrapper>,
    Radarr: () => <IconWrapper bgColor="bg-amber-500"><BaseIcon path="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></IconWrapper>,
    Syncthing: () => <IconWrapper bgColor="bg-cyan-500"><BaseIcon path="M4 4v5h5M5.293 9.293a1 1 0 011.414 0l8 8a1 1 0 01-1.414 1.414l-8-8a1 1 0 010-1.414zM20 20v-5h-5" /></IconWrapper>,
    Tailscale: () => <IconWrapper bgColor="bg-gray-700"><BaseIcon path="M12 1.5a10.5 10.5 0 100 21 10.5 10.5 0 000-21z" /><path d="M12 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" /></IconWrapper>,
}
