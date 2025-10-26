import React from 'react';

// Simplified icon components for marquee
const MarqueeBaseIcon: React.FC<{ path: string; className?: string }> = ({ path, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const appMarqueeIcons = [
  { name: 'IPTV Panel', icon: <MarqueeBaseIcon path="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" className="text-green-400" /> },
  { name: 'Lightning Node', icon: <MarqueeBaseIcon path="M13 10V3L4 14h7v7l9-11h-7z" className="text-yellow-400" /> },
  { name: 'Plex', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12.356 12l-6.315 6.315a.997.997 0 000 1.414.997.997 0 001.414 0L20.1 12.356a.997.997 0 000-1.414L7.455 4.27a.997.997 0 00-1.414 0 .997.997 0 000 1.414L12.356 12z" /></svg> },
  { name: 'Nostr Relay', icon: <MarqueeBaseIcon path="M13 10V3L4 14h7v7l9-11h-7z" className="text-purple-400" /> },
  { name: 'Ghostfolio', icon: <MarqueeBaseIcon path="M7 16a5 5 0 01-.88-9.918 5.002 5.002 0 019.76 0A5 5 0 0117 16H7z" className="text-green-400" /> },
  { name: 'Torq', icon: <MarqueeBaseIcon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="text-red-400" /> },
  { name: 'SimpleTorrent', icon: <MarqueeBaseIcon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" className="text-blue-400" /> },
  { name: 'Bitcoin Node', icon: <MarqueeBaseIcon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m0 0c-1.11 0-2.08-.402-2.599-1M9.401 9c.023-.01.044-.02.067-.03M14.599 15c-.023.01-.044.02-.067.03m0-6a2 2 0 11-4 0 2 2 0 014 0z" className="text-orange-400" /> },
  { name: 'Lightning Shell', icon: <MarqueeBaseIcon path="M8 9l4-4 4 4m0 6l-4 4-4-4" className="text-gray-400" /> },
  { name: 'Samourai', icon: <MarqueeBaseIcon path="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.75 11" className="text-red-500" /> },
  { name: 'PhotoPrism', icon: <MarqueeBaseIcon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" className="text-cyan-400" /> },
  { name: 'Tailscale', icon: <MarqueeBaseIcon path="M12 1.5a10.5 10.5 0 100 21 10.5 10.5 0 000-21zM12 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" className="text-gray-300" /> },
  { name: 'Nextcloud', icon: <MarqueeBaseIcon path="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" className="text-sky-400" /> },
];

const MarqueeIcon: React.FC<{ icon: React.ReactNode; name: string }> = ({ icon, name }) => (
    <div className="flex flex-col items-center justify-center text-center gap-3 bg-[#0F0F0F]/80 border border-white/10 rounded-2xl w-36 h-36 p-4 mx-2 flex-shrink-0 backdrop-blur-sm">
      <div className="w-10 h-10 flex items-center justify-center">{icon}</div>
      <span className="text-sm text-white/80 font-medium">{name}</span>
    </div>
);

const MarqueeRow: React.FC<{ icons: typeof appMarqueeIcons; rtl?: boolean }> = ({ icons, rtl = false }) => {
    const marqueeContent = [...icons, ...icons]; // Duplicate for seamless loop
    return (
        <div className="flex w-max items-center">
            <div className={`flex w-max ${rtl ? 'animate-marquee-rtl' : 'animate-marquee-ltr'}`}>
                {marqueeContent.map((item, index) => (
                    <MarqueeIcon key={index} icon={item.icon} name={item.name} />
                ))}
            </div>
        </div>
    );
};


const AppStore: React.FC = () => {
  return (
    <section className="relative py-32 bg-[#0C0518] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent"></div>
        <div className="relative mt-24 space-y-4 -mx-6">
            <MarqueeRow icons={appMarqueeIcons} rtl={true} />
            <MarqueeRow icons={[...appMarqueeIcons].slice().reverse()} rtl={false} />
        </div>
    </section>
  );
};

export default AppStore;