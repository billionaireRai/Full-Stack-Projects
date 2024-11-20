import React, { createContext, useState, useContext } from 'react';

const PaymentContext = createContext();

export const PaymentStat = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState(false);
  return (
    <PaymentContext.Provider value={{ paymentStatus, setPaymentStatus }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentStatus = () => useContext(PaymentContext);
