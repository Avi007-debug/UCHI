import { Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
              <img src="/image.png" alt="UCHI Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Dynamic Urban Canopy Health Index
              </p>
              <p className="text-xs text-muted-foreground">
                Academic Research Project
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span>Study Area:</span>
              <span className="text-foreground font-medium">Bengaluru & RVCE</span>
            </span>
            <span className="hidden sm:block">•</span>
            <span className="hidden sm:flex items-center gap-1">
              Developed for
              <span className="text-foreground font-medium">Environmental Analysis</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">Repository</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Documentation</span>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} UCHI Project. Built for academic evaluation purposes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
