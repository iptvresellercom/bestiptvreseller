import React from 'react';

// Minimal language context used by some components in the project.
export type LanguageContextType = {
  t: (key: string) => string;
};

export const LanguageContext = React.createContext<LanguageContextType | null>({
  t: (k: string) => k,
});

export default LanguageContext;
