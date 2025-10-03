import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  const baseStyles = 'px-6 py-2.5 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 focus:ring-indigo-500 dark:from-sky-500 dark:to-cyan-500 dark:hover:from-sky-600 dark:hover:to-cyan-600 dark:focus:ring-cyan-500',
    secondary: 'bg-muted text-foreground hover:bg-border focus:ring-accent-light dark:focus:ring-accent-dark',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]}`} {...props}>
      {children}
    </button>
  );
}