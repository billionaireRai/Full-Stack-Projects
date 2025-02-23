import React, { useState, useEffect ,useCallback } from "react";

const Doter = ({ interval = 2 }) => {
  const [dot, setDot] = useState("");

  useEffect(useCallback(() => {
    if (interval <= 0) {
      console.warn("Interval must be greater than 0");
      return;
    }
    const timer = setInterval(() => {
      setDot((prevDot) => prevDot.endsWith("...") ? "" : prevDot + ".");
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [interval]));

  return (
    <>
      <span className="text-white font-poppins font-bold">{dot}</span>
    </>
  );
};

export default Doter;
