import React, { useState } from "react";

export default function Tooltip({ children, text }) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-block w-full"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      aria-describedby="tooltip"
    >
      {/* The Trigger */}
      {children}
      {/* The Tooltip Box */}
      <span
        id="tooltip"
        role="tooltip"
        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 w-max max-w-xs px-3 py-2 rounded-md text-sm text-white bg-black shadow-lg transition-opacity duration-200 ease-in-out pointer-events-none
          ${visible ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        {text}
      </span>
    </span>
  );
}
