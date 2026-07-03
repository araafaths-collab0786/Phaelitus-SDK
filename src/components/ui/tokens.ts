/**
 * Phaelitus SDK Cinematic Design Token System
 * Coordinates all colors, shadows, glows, typography, and motion configurations
 */

export const TOKENS = {
  colors: {
    bg: "#050810",
    surface: "#080C14",
    card: "#0C1120",
    outline: "rgba(255, 255, 255, 0.04)",
    outlineHover: "rgba(0, 217, 232, 0.2)",
    primary: "#00D9E8", // Cyber Cyan
    secondary: "#7B61FF", // Neon Violet
    critical: "#FF3B5C", // Neon Coral Red
    warning: "#F5A623", // Amber Gold
    success: "#00C48C", // Emerald Mint
    muted: "#8891A8", // Cool Gray
    darkMuted: "#4B5563" // Slate Gray
  },
  glows: {
    cyan: "shadow-[0_0_15px_rgba(0,217,232,0.15)]",
    violet: "shadow-[0_0_15px_rgba(123,97,255,0.15)]",
    critical: "shadow-[0_0_15px_rgba(255,59,92,0.15)]",
    warning: "shadow-[0_0_15px_rgba(245,166,35,0.15)]",
    success: "shadow-[0_0_15px_rgba(0,196,140,0.15)]"
  },
  typography: {
    display: "font-serif tracking-tight", // Space Grotesk
    body: "font-sans", // Inter
    mono: "font-mono text-xs tracking-wider" // JetBrains Mono
  }
};

// Reusable Framer Motion Variants
export const MOTION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } // Fast start, cushioned end
  },
  container: {
    animate: {
      transition: {
        staggerChildren: 0.04
      }
    }
  },
  pulseGlow: {
    animate: {
      boxShadow: [
        "0 0 10px rgba(0, 217, 232, 0.1)",
        "0 0 20px rgba(0, 217, 232, 0.3)",
        "0 0 10px rgba(0, 217, 232, 0.1)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  shimmer: {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }
};
