import React from 'react';
import ThemeToggle from '../../components/ui/ThemeToggle';

const Page = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
      <ThemeToggle />
      <h1 className="text-3xl font-bold">Welcome to Aura LMS</h1>
      <p className="mt-4 text-lg">This is the home page</p>
    </div>
  );
}

export default Page;
