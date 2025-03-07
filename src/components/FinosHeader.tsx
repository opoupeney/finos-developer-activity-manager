
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from './Auth/UserAvatar';

const FinosHeader = () => {
  const { user, userDetails, loading } = useAuth();

  return (
    <header className="border-b">
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-xl flex items-center text-finos-blue">
            FINOS
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/masterclass" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Developer Events
            </Link>
            {userDetails?.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {!loading && (
            <UserAvatar user={user} userDetails={userDetails} />
          )}
        </div>
      </div>
    </header>
  );
};

export default FinosHeader;
