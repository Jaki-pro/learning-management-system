import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`
      bg-card text-card-foreground 
      border border-border rounded-xl shadow-lg 
      transition-all duration-300 ease-in-out 
      hover:shadow-xl hover:-translate-y-1
      ${className}
    `}>
      {children}
    </div>
  );
}