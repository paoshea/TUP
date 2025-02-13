import React, { createContext, useState, useContext } from 'react';

interface SyncContextType {
  syncState: any;
  setSyncState: React.Dispatch<React.SetStateAction<any>>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const [syncState, setSyncState] = useState(null);

  return (
    <SyncContext.Provider value={{ syncState, setSyncState }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  return useContext(SyncContext);
};
