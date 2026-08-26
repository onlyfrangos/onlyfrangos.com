import { createContext, type PropsWithChildren, useContext } from 'react';

import { mobileTheme, type MobileTheme } from './theme';

const ThemeContext = createContext<MobileTheme>(mobileTheme);

export function ThemeProvider({ children }: PropsWithChildren) {
  return <ThemeContext.Provider value={mobileTheme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
