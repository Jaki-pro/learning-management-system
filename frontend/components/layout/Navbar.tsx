import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between p-6 bg-card border-b border-border">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <div className="flex items-center space-x-4">
        {/* I will add search here for extra featuer*/}
        <ThemeToggle />
      </div>
    </header>
  );
}