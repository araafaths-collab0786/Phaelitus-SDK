import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

/**
 * 5 Core Animation Variants for Cinematic Visual Effects
 */
export const ANIMATIONS = {
  // 1. Entrance (Fast start, cushioned/decelerated end)
  entrance: {
    initial: { opacity: 0, y: 15, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.98 },
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
  },

  // 2. Pulse (Drift indicator glow, status alerts)
  pulse: {
    animate: {
      scale: [1, 1.03, 1],
      opacity: [0.9, 1, 0.9],
      filter: [
        "drop-shadow(0 0 4px rgba(255, 59, 92, 0.4))",
        "drop-shadow(0 0 12px rgba(255, 59, 92, 0.8))",
        "drop-shadow(0 0 4px rgba(255, 59, 92, 0.4))"
      ],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // 3. Shimmer (Futuristic scan & loading skeleton states)
  shimmer: {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },

  // 4. Stagger Container
  container: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  },

  // 5. Drawer/Slide-Over entrance
  slideIn: {
    initial: { x: "100%", opacity: 0.5 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0.5 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
};

/**
 * Interactive Typewriter component for MLOps Agent reveals
 */
export const Typewriter: React.FC<{ text: string; speed?: number; className?: string }> = ({
  text,
  speed = 12,
  className = ""
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(prev => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={className}>{displayedText}</span>;
};
