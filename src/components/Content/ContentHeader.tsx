
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus, Printer } from "lucide-react";

interface ContentHeaderProps {
  isAdmin: boolean;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ isAdmin }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Content Library</h1>
        <p className="text-muted-foreground mt-1">Browse and manage all content resources</p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={() => window.print()}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print List
        </Button>
        
        {isAdmin && (
          <Button asChild>
            <Link to="/content/new">
              <Plus className="mr-2 h-4 w-4" />
              New Content
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContentHeader;
