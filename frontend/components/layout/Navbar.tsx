'use client';
import ThemeToggle from '../ui/ThemeToggle';
import { motion, Variants } from 'framer-motion';
const Logo = ({title}) => {
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
        {title?.split('').map((char, index) => (
          <motion.span key={index} variants={letterVariants}>
            {char}
          </motion.span>
        ))}
      </span>
    </motion.div>
  );
};
export default function Navbar({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between p-6 bg-card border-b border-border">
      <Logo title={title}/>
      <div className="flex items-center space-x-4">
        {/* I will add search here for extra featuer*/}
        <ThemeToggle />
      </div>
    </header>
  );
}