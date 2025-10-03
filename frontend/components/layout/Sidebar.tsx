'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  Code, 
  LogOut 
} from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';

// --- 1. Animated Logo Component (for that premium flair) ---
const Logo = () => {
  const logoVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="text-2xl font-bold h-16 flex items-center px-4"
      variants={logoVariants}
      initial="hidden"
      animate="visible"
    >
      <span className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent">
        {'Aura LMS'.split('').map((char, index) => (
          <motion.span key={index} variants={letterVariants}>
            {char}
          </motion.span>
        ))}
      </span>
    </motion.div>
  );
};

// --- 2. Main Sidebar Component ---
export default function Sidebar() {
//   const { user, logout } = useAuth();
    const user = { username: 'JohnDoe', role: { name: 'developer' } }; // Mocked user for demonstration
  const pathname = usePathname();

  // A simplified, flat navigation structure
  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['student', 'developer', 'social-manager', 'admin'] },
    { name: 'Courses', href: '/courses', icon: BookOpen, roles: ['student', 'developer', 'social-manager', 'admin'] },
    { name: 'Social', href: '/social', icon: MessageSquare, roles: ['student', 'developer', 'social-manager', 'admin'] },
    { name: 'Create Course', href: '/developer/new-course', icon: Code, roles: ['developer', 'admin'] },
    { name: 'Create Post', href: '/social/new', icon: MessageSquare, roles: ['social-manager', 'admin'] },
  ];

  return (
    <aside className="
        md:flex flex-col w-64 h-screen 
        dark:bg-slate-900 
      border-r border-slate-200 dark:border-slate-800
    ">
      <Logo /> 
      <nav className="flex-grow px-4 py-4 space-y-2">
        {navLinks.map((link) => {
          // Role-based filtering
          if (!user?.role || !link.roles.includes(user.role.name)) {
            return null;
          }

          const isActive = pathname.startsWith(link.href);

          return (
            <Link key={link.name} href={link.href} className="relative block">
              <div
                className={`
                  flex items-center space-x-3 px-4 py-2.5 rounded-lg
                  transition-colors duration-200
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-sky-500/10 text-blue-600 dark:text-sky-300' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
              >
                {/* The animated vertical bar for the active link */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-sky-400 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <link.icon size={20} />
                <span className="font-semibold">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </nav> 
      {/* User Account Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{user.username}</p>
                <p className="text-xs text-slate-500   capitalize">{user.role?.name.replace('-', ' ')}</p>
              </div>
            </div>
            <button
              onClick={/* logout */ () => {}}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="h-10 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg" />
        )}
      </div>
    </aside>
  );
}