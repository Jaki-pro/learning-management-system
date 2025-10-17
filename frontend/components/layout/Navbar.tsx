'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle'; 
import { navLinks } from '../../config/navlinks';
// import Logo from './Logo';

export default function Navbar({ title }: { title: string }) {
  const { role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  const links = navLinks[role || 'default'] || navLinks.default;

  const toggleDropdown = (label: string) => {
    setDropdown(dropdown === label ? null : label);
  };

  return (
    <header className="sticky top-0  z-50 w-full border-b border-border nav-bg transition-all duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-8 px-4">
        <div className="flex items-center space-x-2">
          {/* <Logo title={title} /> */}
          <div className="text-lg font-bold">{title}</div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center space-x-8">
          {links.map((link) => (
            <div key={link.label} className="relative group">
              <Link
                href={link.href}
                className="flex items-center gap-1 text-sm font-medium text-foreground/90 hover:text-primary transition"
              >
                {/* {link.icon && <link.icon/>} */}
                <span>{link.label}</span>
                {link.children && <ChevronDown className="h-4 w-4 ml-1" />}
              </Link>

              {/* Dropdown */}
              {link.children && (
                <div className="absolute left-0  hidden pt-1  group-hover:block bg-secondary  rounded-lg shadow-lg border border-border py-2 min-w-[150px]">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {role !== 'public' ? (
            <button
              onClick={logout}
              className="px-3 py-2 rounded-lg text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => (window.location.href = '/auth/login')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
            >
              Login
            </button>
          )}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-card border-t border-border overflow-hidden"
          >
            <div className="flex flex-col space-y-1 p-4">
              {links.map((link) => (
                <div key={link.label}>
                  <button
                    className="flex justify-between items-center w-full text-left text-foreground/90 font-medium py-2 px-2 hover:bg-muted rounded-md"
                    onClick={() =>
                      link.children ? toggleDropdown(link.label) : (window.location.href = link.href)
                    }
                  >
                    <span className="flex items-center gap-2">
                      {link.icon && <link.icon/>}
                      {link.label}
                    </span>
                    {link.children && (
                      <ChevronDown
                        className={`h-4 w-4 transform transition-transform ${
                          dropdown === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Mobile Dropdown */}
                  {link.children && dropdown === link.label && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-6 mt-1 flex flex-col space-y-1"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="text-sm text-foreground/80 hover:text-primary py-1 px-2 transition"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
