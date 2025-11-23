'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize particles
  const initParticles = (width: number, height: number, count: number) => {
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 60 + 20, // 20-80px
        speedX: (Math.random() - 0.5) * 0.5, // -0.25 to 0.25
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    particlesRef.current = particles;
  };

  // Handle resize and mouse movement only on client
  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });

      // Adjust particle count based on screen size
      const particleCount = Math.min(
        Math.floor((width * height) / 15000), // Scale with screen area
        50 // Max 50 particles for performance
      );

      initParticles(width, height, Math.max(particleCount, 10)); // Min 10 particles
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isClient]);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;

        // Calculate distance from mouse for subtle interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        // Gentle mouse repulsion
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 0.02;
          particle.x -= (dx / distance) * force;
          particle.y -= (dy / distance) * force;
        }

        // Pulsing opacity
        const pulseOpacity = particle.opacity + Math.sin(time * particle.pulseSpeed + particle.pulsePhase) * 0.05;

        // Create gradient for each particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );

        // Dark mode aware colors
        const isDarkMode = isClient && window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (isDarkMode) {
          gradient.addColorStop(0, `rgba(59, 130, 246, ${pulseOpacity * 0.3})`); // blue
          gradient.addColorStop(0.5, `rgba(147, 51, 234, ${pulseOpacity * 0.2})`); // purple
          gradient.addColorStop(1, 'rgba(236, 72, 153, 0)'); // pink, transparent
        } else {
          gradient.addColorStop(0, `rgba(96, 165, 250, ${pulseOpacity * 0.3})`); // light blue
          gradient.addColorStop(0.5, `rgba(167, 139, 250, ${pulseOpacity * 0.2})`); // light purple
          gradient.addColorStop(1, 'rgba(251, 207, 232, 0)'); // light pink, transparent
        }

        // Draw particle
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  // Respect reduced motion preference
  useEffect(() => {
    if (!isClient) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery.matches) {
      particlesRef.current.forEach(particle => {
        particle.speedX = 0;
        particle.speedY = 0;
        particle.pulseSpeed = 0;
      });
    }
  }, [isClient]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        opacity: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.3 : 0.8
      }}
      aria-hidden="true"
    />
  );
};