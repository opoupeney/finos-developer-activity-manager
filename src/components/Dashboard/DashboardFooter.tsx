
import React from 'react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="border-t py-6 mt-12">
      <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-muted-foreground mb-4 md:mb-0">
          © {new Date().getFullYear()} FINOS - Fintech Open Source Foundation
        </div>
        
        <div className="flex space-x-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
