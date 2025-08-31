'use client';
import { useEffect } from 'react';
import fluidCursor from '@/app/hooks/use-FluidCursor';
const cursortrailwrapper = ({children}) => {
  useEffect(() => {
    fluidCursor();
  }, []);
  return (
    <>
      <div className="fixed top-0 left-0 z-2 pointer-events-none">
        <canvas id="fluid" className="w-screen h-screen pointer-events-none" />
      </div>
      {children}
    </>
  );
};
export default cursortrailwrapper;
