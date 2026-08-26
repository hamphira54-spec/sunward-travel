import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

const VARIANTS: Record<string, string> = {
  primary:
    'bg-ocean text-white hover:bg-ocean-dark active:scale-[0.98] shadow-sm',
  secondary:
    'bg-horizon text-ink hover:bg-horizon-dark active:scale-[0.98] shadow-sm',
  ghost:
    'bg-transparent text-ocean hover:bg-ocean/8',
  outline:
    'border-2 border-ocean text-ocean hover:bg-ocean hover:text-white',
};

const SIZES: Record<string, string> = {
  sm:  'px-3 py-1.5 text-sm',
  md:  'px-5 py-2.5 text-sm',
  lg:  'px-7 py-3.5 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
