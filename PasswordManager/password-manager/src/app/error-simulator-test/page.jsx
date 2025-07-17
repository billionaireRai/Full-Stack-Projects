'use client';

import React from 'react';
import ErrorSimulator from '@/components/error-simulator.jsx';

export default function ErrorSimulatorTestPage() {
  return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error Simulator Test Page</h1>
        <ErrorSimulator />
      </div>
  );
}
