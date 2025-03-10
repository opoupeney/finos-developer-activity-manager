
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  isAdmin: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isAdmin }) => {
  return (
    <div className="flex justify-between items-center mb-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">FINOS Developer Activities</h1>
        <p className="text-muted-foreground mt-1">Manage and monitor all developer activities</p>
      </div>
      
      {isAdmin && (
        <Button asChild className="bg-finos-blue hover:bg-finos-blue/90 animate-scale">
          <Link to="/create">
            <Plus className="mr-2 h-4 w-4" />
            New Activity
          </Link>
        </Button>
      )}
    </div>
  );
};

export default DashboardHeader;
