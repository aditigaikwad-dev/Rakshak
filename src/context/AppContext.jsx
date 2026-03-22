import { createContext, useMemo, useState } from 'react';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [selectedWard, setSelectedWard] = useState('ALL');

  const value = useMemo(
    () => ({
      selectedWard,
      setSelectedWard
    }),
    [selectedWard]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
