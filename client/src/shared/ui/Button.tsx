import React, { forwardRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Button component with built-in loading state and debounce protection
 * Automatically prevents double-clicks while processing
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const [isProcessing, setIsProcessing] = useState(false);

    // Debounced click handler to prevent double-clicks
    const handleClick = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isProcessing || loading || disabled) return;

        setIsProcessing(true);

        try {
          if (onClick) {
            const result = onClick(e);
            // If onClick returns a promise, wait for it
            if (result instanceof Promise) {
              await result;
            }
          }
        } finally {
          // Small delay to prevent rapid re-clicking
          setTimeout(() => setIsProcessing(false), 300);
        }
      },
      [onClick, isProcessing, loading, disabled]
    );

    const isDisabled = disabled || loading || isProcessing;
    const showLoader = loading || isProcessing;

    const baseClasses =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      primary:
        "bg-brand-primary text-white hover:bg-blue-600 focus:ring-brand-primary shadow-lg shadow-brand-primary/30 disabled:hover:bg-brand-primary",
      secondary:
        "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-600/30",
      ghost:
        "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500",
      outline:
        "bg-transparent border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-500",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {showLoader ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
