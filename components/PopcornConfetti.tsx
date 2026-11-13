'use client';

import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';

export interface PopcornConfettiRef {
  trigger: () => void;
}

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
}

export const PopcornConfetti = forwardRef<PopcornConfettiRef, {}>((_, ref) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const trigger = useCallback(() => {
    const emojis = ['🍿', '✨', '🎟️', '💛', '🎉', '🍿', '🔥'];
    const newParticles: Particle[] = [];
    
    // Spawn 28 bouncy particles from bottom center
    for (let i = 0; i < 28; i++) {
      const angle = (Math.PI / 6) + (Math.random() * (Math.PI * 2 / 3)); // upward spread
      const speed = 12 + Math.random() * 16;
      newParticles.push({
        id: Math.random() + i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: window.innerWidth / 2 + (Math.random() * 200 - 100),
        y: window.innerHeight - 80,
        size: 18 + Math.random() * 22,
        vx: Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1) * (speed * 0.7),
        vy: -Math.sin(angle) * speed,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  useImperativeHandle(ref, () => ({
    trigger,
  }));

  // Physics animation loop
  useEffect(() => {
    if (particles.length === 0) return;

    const gravity = 0.55;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + gravity,
            rotation: p.rotation + p.rotSpeed,
            opacity: p.y > window.innerHeight ? 0 : p.opacity - 0.012,
          }))
          .filter((p) => p.opacity > 0 && p.y < window.innerHeight + 100)
      );
    }, 24);

    return () => clearInterval(interval);
  }, [particles.length]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}px`,
            top: `${p.y}px`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            transform: `rotate(${p.rotation}deg)`,
            userSelect: 'none',
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
});

PopcornConfetti.displayName = 'PopcornConfetti';
