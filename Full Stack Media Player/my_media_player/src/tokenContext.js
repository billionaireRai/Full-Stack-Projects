import React, { createContext, useContext, useState} from "react";

const tokenContext = createContext();
// Function to trigger tokenContext...
export const useToken = () => {
    return useContext(tokenContext);
}

// Create the tokenProvider component...
export const TokenProvider = ({ children }) => {
    const [AccessToken, setAccessToken] = useState(null) ;
    return (
        <tokenContext.Provider value={{AccessToken , setAccessToken }}>
            {children}
        </tokenContext.Provider>
    );
}