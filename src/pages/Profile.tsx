
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import FinosHeader from '../components/FinosHeader';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  const { user, userDetails, loading } = useAuth();
  const [fullName, setFullName] = useState(userDetails?.full_name || '');
  const [email, setEmail] = useState(userDetails?.email || '');
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // If loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <FinosHeader />
        <div className="container max-w-7xl mx-auto px-4 py-12 flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-finos-blue/30 border-t-finos-blue animate-spin"></div>
            <p className="mt-4 text-muted-foreground animate-pulse">Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to auth page
  if (!user && !loading) {
    navigate('/auth');
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date(),
        })
        .eq('id', user?.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FinosHeader />
      
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4">
            <div onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </div>
          </Button>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={userDetails?.avatar_url || ''} />
                    <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={email}
                        disabled
                        className="bg-muted/50"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="p-3 border rounded-md bg-muted/20">
                    <div className="font-medium">{userDetails?.role === 'admin' ? 'Administrator' : 'Regular User'}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {userDetails?.role === 'admin' 
                        ? 'You have administrative privileges to manage masterclasses and other users.'
                        : 'You can view masterclasses and update your profile.'}
                    </p>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={updating}>
                  {updating ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
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
    </div>
  );
};

export default Profile;
