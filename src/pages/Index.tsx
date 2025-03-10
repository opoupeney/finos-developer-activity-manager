
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, Presentation, Users } from 'lucide-react';
import FinosHeader from '@/components/FinosHeader';
import ActivityTable from '@/components/Dashboard/ActivityTable';
import ActivityGrid from '@/components/Dashboard/ActivityGrid';
import DashboardFooter from '@/components/Dashboard/DashboardFooter';
import DashboardLoading from '@/components/Dashboard/DashboardLoading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { getAllMasterclasses } from '@/services/masterclassService';
import { useAuth } from '@/contexts/AuthContext';

const typeToIconMap = {
  'Meetup': <Users className="h-5 w-5" />,
  'Conference': <Presentation className="h-5 w-5" />,
  'Webinar': <Presentation className="h-5 w-5" />,
  'Workshop': <Calendar className="h-5 w-5" />,
};

const defaultIcon = <Calendar className="h-5 w-5" />;

const Index = () => {
  const { toast } = useToast();
  const { userDetails } = useAuth();
  const isAdmin = userDetails?.role === 'admin';
  const [viewType, setViewType] = useState<"grid" | "table">("table");

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['masterclasses'],
    queryFn: getAllMasterclasses,
  });

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load developer activities.',
      variant: 'destructive',
    });
    return (
      <div className="min-h-screen flex flex-col">
        <FinosHeader />
        <div className="flex-1 container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-destructive">Error loading data</h2>
            <p className="text-muted-foreground mt-2">Please try again later.</p>
          </div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <FinosHeader />
      <div className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Developer Activities</h1>
          {isAdmin && (
            <Button asChild>
              <Link to="/create">Create Activity</Link>
            </Button>
          )}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Activities</CardTitle>
              <Tabs defaultValue="table" value={viewType} onValueChange={(value) => setViewType(value as "grid" | "table")}>
                <TabsList>
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {viewType === "table" ? (
              <ActivityTable 
                activities={activities || []} 
                isAdmin={isAdmin} 
              />
            ) : (
              <ActivityGrid
                activities={activities || []}
                typeToIconMap={typeToIconMap}
                defaultIcon={defaultIcon}
                isAdmin={isAdmin}
                title=""
                icon={<></>}
                defaultOpen={true}
              />
            )}
          </CardContent>
        </Card>
      </div>
      <DashboardFooter />
    </div>
  );
};

export default Index;
