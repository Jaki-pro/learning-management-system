'use client';
 
import { Sun, Moon } from 'lucide-react'; // npm install lucide-react
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
   console.log('Current theme:', theme);
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-muted hover:bg-border transition-colors duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}