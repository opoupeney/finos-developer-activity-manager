
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMasterclassData } from '../services/masterclassService';
import { Masterclass } from '../types/masterclass';
import FinosHeader from '../components/FinosHeader';
import StatusBadge from '../components/StatusBadge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye } from "lucide-react";

const Dashboard = () => {
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        // In a real app, we'd fetch multiple masterclasses
        // For this demo, we'll use our single masterclass data and create duplicates
        const data = getMasterclassData();
        
        // Create a few variations for the dashboard
        const variations: Masterclass[] = [
          data,
          { ...data, id: "mc-002", title: "Financial API Masterclass", status: "Pending", 
            date: "June 2025", location: "New York + Virtual",
            metrics: { ...data.metrics, targetedRegistrations: 75, currentRegistrations: 30, registrationPercentage: 40,
            targetedParticipants: 50, currentParticipants: 15, participationPercentage: 30 } },
          { ...data, id: "mc-003", title: "Blockchain in Finance", status: "Approved", 
            date: "September 2025", location: "Singapore + Virtual",
            metrics: { ...data.metrics, targetedRegistrations: 100, currentRegistrations: 85, registrationPercentage: 85,
            targetedParticipants: 60, currentParticipants: 48, participationPercentage: 80 } },
          { ...data, id: "mc-004", title: "AI Ethics in Financial Systems", status: "Rejected", 
            date: "January 2026", location: "Virtual Only",
            metrics: { ...data.metrics, targetedRegistrations: 40, currentRegistrations: 0, registrationPercentage: 0,
            targetedParticipants: 25, currentParticipants: 0, participationPercentage: 0 } },
        ];
        
        setMasterclasses(variations);
        
        toast({
          title: "Dashboard loaded",
          description: "Masterclass dashboard data has been retrieved",
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error loading dashboard",
          description: "There was a problem retrieving the masterclass information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Loading state
  if (loading) {
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
            <h1 className="text-3xl font-bold tracking-tight">FINOS Masterclasses</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor all masterclass events</p>
          </div>
          
          <Button className="bg-finos-blue hover:bg-finos-blue/90 animate-scale">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New Masterclass
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masterclasses.map((masterclass, index) => (
            <Card key={masterclass.id} className="stats-card overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">{masterclass.title}</CardTitle>
                  <StatusBadge status={masterclass.status} />
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
                    {masterclass.date}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finos-blue">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {masterclass.location}
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-sm font-medium flex justify-between mb-1">
                      <span>Registration Progress</span>
                      <span>{masterclass.metrics.registrationPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-finos-blue transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${masterclass.metrics.registrationPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {masterclass.metrics.currentRegistrations} of {masterclass.metrics.targetedRegistrations} registrations
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/masterclass/${masterclass.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
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

export default Dashboard;
