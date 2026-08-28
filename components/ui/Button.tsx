import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'dark' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
}

const BASE = 'inline-flex items-center justify-center gap-2 font-display font-700 rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

const VARIANTS: Record<string, string> = {
  primary: 'bg-ocean text-white hover:bg-ocean-dark active:scale-[0.98] shadow-sm',
  secondary: 'bg-surface text-ink border border-gray-200 hover:bg-surface-dark active:scale-[0.98]',
  ghost: 'bg-transparent text-ocean hover:bg-ocean/8 active:bg-ocean/12',
  outline: 'border-2 border-ocean text-ocean hover:bg-ocean hover:text-white active:scale-[0.98]',
  dark: 'bg-ink text-white hover:bg-ink/85 active:scale-[0.98]',
  gold: 'bg-horizon text-ink hover:bg-horizon-dark active:scale-[0.98] shadow-sm',
};

const SIZES: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-sm',
  xl: 'px-8 py-4 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, fullWidth = false, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
