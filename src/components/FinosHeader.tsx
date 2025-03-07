
import React from 'react';
import { cn } from "@/lib/utils";

interface FinosHeaderProps {
  className?: string;
}

const FinosHeader: React.FC<FinosHeaderProps> = ({ className }) => {
  return (
    <header className={cn("py-4 px-6 border-b flex items-center justify-between sticky top-0 z-10 glassmorphism backdrop-blur-md", className)}>
      <div className="flex items-center">
        <span className="text-finos-blue font-bold text-xl tracking-tight">FINOS</span>
        <span className="text-sm ml-2 text-muted-foreground">Fintech Open Source Foundation</span>
      </div>
      
      <div className="flex items-center gap-4">
        <a href="https://finos.org" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
          finos.org
        </a>
      </div>
    </header>
  );
};

export default FinosHeader;
