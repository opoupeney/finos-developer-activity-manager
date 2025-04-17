
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from './Auth/UserAvatar';

const FinosHeader = () => {
  const { user, userDetails, loading } = useAuth();
  const location = useLocation();
  
  return (
    <header className="border-b">
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-6 overflow-hidden">
          <Link to="/" className="font-bold text-xl flex items-center text-finos-blue flex-shrink-0">
            FINOS
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 overflow-hidden">
            <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'} transition-colors flex-shrink-0`}>
              Dashboard
            </Link>
            <Link to="/activity" className={`text-sm font-medium ${location.pathname === '/activity' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'} transition-colors flex-shrink-0`}>
              Developer Activities
            </Link>
            <Link to="/content" className={`text-sm font-medium ${location.pathname.startsWith('/content') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'} transition-colors flex-shrink-0`}>
              Content Library
            </Link>
            <Link to="/ambassadors" className={`text-sm font-medium ${location.pathname.startsWith('/ambassadors') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'} transition-colors flex-shrink-0`}>
              Ambassadors
            </Link>
            <Link to="/schedule" className={`text-sm font-medium ${location.pathname === '/schedule' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'} transition-colors flex-shrink-0`}>
              Schedule
            </Link>
            {userDetails?.role === 'admin' && (
              <Link to="/admin" className={`text-sm font-medium ${location.pathname === '/admin' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'} transition-colors flex-shrink-0`}>
                Admin
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-4 flex-shrink-0">
          {!loading && (
            <UserAvatar user={user} userDetails={userDetails} />
          )}
        </div>
      </div>
    </header>
  );
};

export default FinosHeader;
