
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'Approved' | 'Pending' | 'Rejected' | 'Done';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusStyles = {
    Approved: "bg-finos-green text-white hover:bg-finos-darkGreen",
    Pending: "bg-yellow-500 text-white hover:bg-yellow-600",
    Rejected: "bg-red-500 text-white hover:bg-red-600",
    Done: "bg-gray-400 text-white hover:bg-gray-500", // New "Done" status with gray styling
  };

  return (
    <Badge className={cn("px-3 py-1 text-sm font-medium animate-scale", statusStyles[status], className)}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
