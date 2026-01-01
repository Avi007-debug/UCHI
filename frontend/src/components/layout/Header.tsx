import { Link, useLocation } from 'react-router-dom';
import { Leaf, Home, MapPin, Upload, BarChart3, GitCompare } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/study-area', label: 'Study Area', icon: MapPin },
  { path: '/upload', label: 'Upload', icon: Upload },
  { path: '/results', label: 'Results', icon: BarChart3 },
  { path: '/compare', label: 'Compare', icon: GitCompare },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display text-lg font-semibold text-foreground">
              UCHI
            </h1>
            <p className="text-xs text-muted-foreground -mt-0.5">
              Urban Canopy Health Index
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
