"use client";

import React, { useState, useEffect } from 'react';

interface DotCardProps {
  target?: number;
  duration?: number;
  label?: string;
}

export default function DotCard({ target = 777000, duration = 2000, label = "Views" }: DotCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    const range = end - start;
    if (range <= 0) return;
    const increment = Math.ceil(end / (duration / 50));
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, 50);
    return () => clearInterval(timer);
  }, [target, duration]);

  const display = count < 1000 ? count : `${Math.floor(count / 1000)}k`;

  return (
    <div className="moving-dot-card-outer">
      <div className="moving-dot-card-dot"></div>
      <div className="moving-dot-card">
        <div className="moving-dot-card-ray"></div>
        <div className="moving-dot-card-text">{display}</div>
        <div className="moving-dot-card-label">{label}</div>
        <div className="moving-dot-card-line moving-dot-card-topl"></div>
        <div className="moving-dot-card-line moving-dot-card-leftl"></div>
        <div className="moving-dot-card-line moving-dot-card-bottoml"></div>
        <div className="moving-dot-card-line moving-dot-card-rightl"></div>
      </div>
    </div>
  );
}

