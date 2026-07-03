import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TOKENS, MOTION_VARIANTS } from "./tokens";
import { Info, Sparkles } from "lucide-react";

/**
 * Cyber Card with customizable headers, status indicators, and background grids
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  statusColor?: "cyan" | "violet" | "critical" | "warning" | "success" | "none";
  headerActions?: React.ReactNode;
  isGlowHover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ title, subtitle, statusColor = "none", headerActions, isGlowHover = true, children, className = "", ...props }, ref) => {
    const statusDots = {
      cyan: "bg-[#00D9E8] shadow-[0_0_8px_#00D9E8]",
      violet: "bg-[#7B61FF] shadow-[0_0_8px_#7B61FF]",
      critical: "bg-[#FF3B5C] shadow-[0_0_8px_#FF3B5C] animate-pulse",
      warning: "bg-[#F5A623] shadow-[0_0_8px_#F5A623] animate-pulse",
      success: "bg-[#00C48C] shadow-[0_0_8px_#00C48C]",
      none: "hidden"
    };

    return (
      <div
        ref={ref}
        className={`bg-[#080C14] border border-white/4 rounded-lg relative overflow-hidden transition-all duration-300 ${
          isGlowHover ? "hover:border-[#00D9E8]/25 hover:shadow-[0_0_20px_rgba(0,217,232,0.03)]" : ""
        } ${className}`}
        {...props}
      >
        {/* Futuristic top-corner cyan highlight line */}
        <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#00D9E8]" />
        <div className="absolute top-0 left-0 w-[1px] h-4 bg-[#00D9E8]" />

        {/* Ambient subtle background scan grids */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

        {(title || headerActions) && (
          <div className="flex items-center justify-between border-b border-white/4 px-4 py-3.5 bg-[#0C1120]/40 relative z-10">
            <div className="flex items-center gap-2">
              {statusColor !== "none" && (
                <span className={`w-1.5 h-1.5 rounded-full ${statusDots[statusColor]}`} />
              )}
              <div>
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#F0F2F8]">{title}</h3>
                {subtitle && (
                  <p className="text-[10px] text-[#8891A8] font-mono uppercase tracking-widest mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
          </div>
        )}

        <div className="p-4 relative z-10">{children}</div>
      </div>
    );
  }
);
Card.displayName = "Card";


/**
 * MLOps/K8s Badge indicating cluster health, model status, and severities
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "critical" | "warning" | "success" | "muted";
  glow?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  glow = true,
  children,
  className = "",
  ...props
}) => {
  const styles = {
    primary: "bg-[#00D9E8]/10 text-[#00D9E8] border-[#00D9E8]/30",
    secondary: "bg-[#7B61FF]/10 text-[#7B61FF] border-[#7B61FF]/30",
    critical: "bg-[#FF3B5C]/10 text-[#FF3B5C] border-[#FF3B5C]/30 animate-pulse",
    warning: "bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/30",
    success: "bg-[#00C48C]/10 text-[#00C48C] border-[#00C48C]/30",
    muted: "bg-white/5 text-[#8891A8] border-white/10"
  };

  const glows = {
    primary: "shadow-[0_0_8px_rgba(0,217,232,0.12)]",
    secondary: "shadow-[0_0_8px_rgba(123,97,255,0.12)]",
    critical: "shadow-[0_0_8px_rgba(255,59,92,0.12)]",
    warning: "shadow-[0_0_8px_rgba(245,166,35,0.12)]",
    success: "shadow-[0_0_8px_rgba(0,196,140,0.12)]",
    muted: ""
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase tracking-wider ${
        styles[variant]
      } ${glow ? glows[variant] : ""} ${className}`}
      {...props}
    >
      <span className={`w-1 h-1 rounded-full bg-current`} />
      {children}
    </span>
  );
};


/**
 * Premium Sci-Fi Outline and Flat Cyber Button
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "warning";
  size?: "xs" | "sm" | "md";
  icon?: React.ComponentType<any>;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "sm",
  icon: Icon,
  children,
  className = "",
  ...props
}) => {
  const base = "inline-flex items-center justify-center gap-1.5 font-mono font-bold uppercase tracking-wider rounded transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const sizes = {
    xs: "text-[9px] px-2 py-1",
    sm: "text-[10px] px-3.5 py-1.5",
    md: "text-xs px-5 py-2.5"
  };

  const variants = {
    primary: "bg-[#00D9E8] text-[#050810] hover:bg-[#00D9E8]/90 shadow-[0_0_15px_rgba(0,217,232,0.15)] hover:shadow-[0_0_20px_rgba(0,217,232,0.35)]",
    secondary: "bg-[#7B61FF] text-white hover:bg-[#7B61FF]/90 shadow-[0_0_15px_rgba(123,97,255,0.15)]",
    ghost: "bg-transparent border border-white/10 hover:border-[#00D9E8]/30 text-[#8891A8] hover:text-[#F0F2F8]",
    danger: "bg-[#FF3B5C] text-white hover:bg-[#FF3B5C]/90 shadow-[0_0_15px_rgba(255,59,92,0.15)]",
    warning: "bg-[#F5A623] text-[#050810] hover:bg-[#F5A623]/90 shadow-[0_0_15px_rgba(245,166,35,0.15)]"
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </button>
  );
};


/**
 * Informative Interactive Custom Tooltip
 */
export const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.12 }}
            className="absolute z-[999] bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-[#0C1120] border border-[#00D9E8]/20 rounded-lg text-[10px] font-sans text-[#8891A8] shadow-2xl leading-normal pointer-events-none"
          >
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0C1120]" />
            <div className="flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#00D9E8] shrink-0 mt-0.5" />
              <span>{content}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


/**
 * Sleek holographic skeleton line
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`bg-gradient-to-r from-white/2 to-white/6 animate-pulse rounded ${className}`}
      style={{ backgroundSize: "200% 100%" }}
    />
  );
};
