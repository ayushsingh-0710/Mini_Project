import React, { createContext, useContext, useState, useCallback } from 'react';

const PortalContext = createContext();

export const PortalProvider = ({ children }) => {
  const [portal, setPortal] = useState('admin'); // 'admin' | 'user'
  const [refreshKey, setRefreshKey] = useState(0);
  const [userRole, setUserRole] = useState('normal'); // 'normal' | 'admin' (Normal User / User Admin)

  const switchPortal = (p) => setPortal(p);
  const switchUserRole = (r) => setUserRole(r);

  // Pages subscribe to this; bump the key to trigger a re-fetch
  const triggerRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  return (
    <PortalContext.Provider value={{ portal, switchPortal, refreshKey, triggerRefresh }}>
    <PortalContext.Provider value={{ portal, switchPortal, userRole, switchUserRole }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => useContext(PortalContext);
