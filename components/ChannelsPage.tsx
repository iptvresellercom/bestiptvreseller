import React, { useContext, useState } from 'react';
import { LanguageContext } from '../types.ts';

// Import the full data from chnls.ts
import { data as channelsData } from '../constants/chnls.ts';

// Define a type for channel data
interface Channel {
  id: number;
  name: string;
  category: string;
  logo: string;
  isHD?: boolean;
  isPopular?: boolean;
  channels: string[];
}

const ChannelsPage: React.FC = () => {
  const langContext = useContext(LanguageContext);
  if (!langContext) return null;
  const { t } = langContext;

  // State to track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Transform the data to match our component structure
  const transformedChannels: Channel[] = channelsData.map((category, index) => ({
    id: index,
    name: category.name,
    category: category.name,
    logo: category.image,
    channels: category.sublist,
    isPopular: index < 3 // Mark first 3 categories as popular
  }));

  // Group channels by category
  const channelsByCategory: Record<string, Channel> = {};
  transformedChannels.forEach(channel => {
    channelsByCategory[channel.category] = channel;
  });

  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Get logo for a channel
  const getChannelLogo = (channelName: string) => {
    // For now, we'll use a simple approach to get logos
    // In a full implementation, this would map to actual logo assets
    return '/placeholder-logo.png';
  };

  return (
    <section className="pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-light-text-primary dark:text-white mb-4">
            {t('channelsPage.title')}
          </h1>
          <p className="max-w-2xl mx-auto text-brand-light-text-secondary dark:text-gray-400">
            {t('channelsPage.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-12">
            {/* Channels by Category - Grid Layout */}
            <div className="flex flex-col gap-6">
              {Object.entries(channelsByCategory).map(([category, channelData]) => (
                <div key={channelData.id} className="flex flex-col h-full">
                  <div 
                    className="flex justify-between items-center bg-white dark:bg-brand-deep-purple/50 border border-brand-light-border dark:border-brand-light-violet/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                    onClick={() => toggleCategory(channelData.name)}
                  >
                    <div className="flex items-center">
                      <img 
                        src={channelData.logo} 
                        alt={channelData.name} 
                        className="w-8 h-8 rounded-full mr-3 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div>
                        <h2 className="text-lg font-bold text-brand-light-text-primary dark:text-white">
                          {channelData.name}
                        </h2>
                        <span className="text-xs text-brand-light-text-secondary dark:text-gray-400">
                          {channelData.channels.length} channels
                        </span>
                      </div>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-brand-light-text-secondary dark:text-gray-400 transform transition-transform duration-200 ${
                        expandedCategories[channelData.name] ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* Channels List - shown when category is expanded */}
                  {expandedCategories[channelData.name] && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {channelData.channels.map((channel, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white dark:bg-brand-deep-purple/30 border border-brand-light-border dark:border-brand-light-violet/30 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-md bg-gray-200 dark:bg-brand-deep-purple/70 flex items-center justify-center mr-3 flex-shrink-0">
                              <span className="text-white text-xs font-bold">
                                {idx + 1}
                              </span>
                            </div>
                            <h3 className="text-sm font-medium text-brand-light-text-primary dark:text-white truncate">
                              {channel}
                            </h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChannelsPage;