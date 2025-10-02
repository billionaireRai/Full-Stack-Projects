'use client';

import React, { useState } from 'react';

export default function ErrorSimulator() {
  const [triggerError, setTriggerError] = useState(false);

  if (triggerError) throw new Error('An error is triggered!');

  return (
    <div className="p-4 border border-red-400 rounded mb-4">
      <button
        onClick={() => setTriggerError(true)}
        className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Trigger Error
      </button>
    </div>
  );
}
