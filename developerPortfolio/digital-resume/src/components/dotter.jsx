import React from 'react'
import { useState , useEffect } from 'react'

const dotter = ({ timeGap }) => {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
        setDots((prevdot) => prevdot.length === 3 ? '' : prevdot += '.');
    },timeGap * 1000);
    return () => clearInterval(interval);
  }, [])
  
  return (
        <>{dots}</>
  )
}

export default dotter
