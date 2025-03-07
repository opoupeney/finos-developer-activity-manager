
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from '@supabase/supabase-js';

interface UserAvatarProps {
  user: User | null;
  userDetails: { full_name?: string; email?: string; avatar_url?: string; role?: string } | null;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, userDetails }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      
      navigate('/auth');
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // If no user, show sign in button
  if (!user) {
    return (
      <Button variant="outline" onClick={() => navigate('/auth')}>
        Sign In
      </Button>
    );
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (userDetails?.full_name) {
      return userDetails.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    
    return user.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={userDetails?.avatar_url || ''} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="font-medium">{userDetails?.full_name || 'User'}</div>
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {userDetails?.role === 'admin' && (
          <>
            <DropdownMenuItem onClick={() => navigate('/admin')}>
              Admin Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          Profile Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
