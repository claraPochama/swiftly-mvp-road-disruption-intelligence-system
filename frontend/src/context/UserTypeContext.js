import { createContext, useContext, useState } from 'react';

const UserTypeContext = createContext(null);

// Wrap the app in this once (see App.js) so any screen can read/set which
// role the user picked, without threading it through every navigation
// call as a param.
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