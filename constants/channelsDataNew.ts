// Extract and export the data from chnls.ts
import { data } from './chnls';

export interface ChannelCategory {
  name: string;
  image: string;
  sublist: string[];
}

// Export the full data from chnls.ts
export const channelsData: ChannelCategory[] = data;