
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllMasterclasses } from '../services/masterclassService';
import FinosHeader from '../components/FinosHeader';
import StatusBadge from '../components/StatusBadge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, Plus, Edit, ChartPieIcon } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import PieCharts from '@/components/PieCharts';

const Dashboard = () => {
  const { user, userDetails } = useAuth();
  const { toast } = useToast();
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: () => getAllMasterclasses(),
    meta: {
      onSuccess: () => {
        toast({
          title: "Dashboard loaded",
          description: "Developer activities dashboard data has been retrieved",
        });
      },
      onError: (err: any) => {
        console.error("Error loading dashboard data:", err);
        toast({
          title: "Error loading dashboard",
          description: err.message || "There was a problem retrieving the developer activities information",
          variant: "destructive",
        });
      }
    }
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <FinosHeader />
        <div className="container max-w-7xl mx-auto px-4 py-12 flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-finos-blue/30 border-t-finos-blue animate-spin"></div>
            <p className="mt-4 text-muted-foreground animate-pulse">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FinosHeader />
      
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">FINOS Developer Activities</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor all developer activities</p>
          </div>
          
          {userDetails?.role === 'admin' && (
            <Button asChild className="bg-finos-blue hover:bg-finos-blue/90 animate-scale">
              <Link to="/create">
                <Plus className="mr-2 h-4 w-4" />
                New Activity
              </Link>
            </Button>
          )}
        </div>
        
        {/* Charts Section */}
        {activities && activities.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-4 mt-8">
              <ChartPieIcon className="h-5 w-5 text-finos-blue" />
              <h2 className="text-xl font-semibold">Activity Analytics</h2>
            </div>
            <PieCharts activities={activities} />
          </>
        )}
        
        {!activities || activities.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-muted-foreground">No developer activities found</h2>
            <p className="text-muted-foreground mt-2">There are no developer activities available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4 mt-8">
              <Eye className="h-5 w-5 text-finos-blue" />
              <h2 className="text-xl font-semibold">Activity Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity, index) => (
                <Card key={activity.id} className="stats-card overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-semibold">{activity.title}</CardTitle>
                      <StatusBadge status={activity.status} />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finos-blue">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                        {new Date(activity.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long'
                        })}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finos-blue">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {activity.location}
                      </div>
                      
                      <div className="mt-4">
                        <div className="text-sm font-medium flex justify-between mb-1">
                          <span>Registration Progress</span>
                          <span>{activity.metrics.registrationPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-finos-blue transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${activity.metrics.registrationPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {activity.metrics.currentRegistrations} of {activity.metrics.targetedRegistrations} registrations
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0 flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link to={`/masterclass/${activity.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </Button>
                    
                    {userDetails?.role === 'admin' && (
                      <Button asChild variant="outline" className="w-10 p-0 flex-none">
                        <Link to={`/edit/${activity.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
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

export default Dashboard;
