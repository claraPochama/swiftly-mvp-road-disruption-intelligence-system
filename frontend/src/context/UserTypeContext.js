import { createContext, useContext, useState } from 'react';

const UserTypeContext = createContext(null);

export function UserTypeProvider({ children }) {
  const [userType, setUserType] = useState('driver'); // sensible default while testing

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
}

// Usage: const { userType, setUserType } = useUserType();
export function useUserType() {
  const context = useContext(UserTypeContext);
  if (!context) {
    throw new Error('useUserType must be used within a UserTypeProvider');
  }
  return context;
}