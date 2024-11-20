// defining a context for Authentication of a user...
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext() ;

export const AuthProvider = ({ children }) => {
    const [isAuth, setisAuth] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuth , setisAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthUser = () => useContext(AuthContext);
