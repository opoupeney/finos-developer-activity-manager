
import React from 'react';
import { Masterclass } from '@/types/masterclass';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface ActivityTableProps {
  activities: Masterclass[];
  isAdmin: boolean;
}

const ActivityTable: React.FC<ActivityTableProps> = ({ activities, isAdmin }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-muted-foreground">No developer activities found</h2>
        <p className="text-muted-foreground mt-2">There are no developer activities available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{activity.title}</TableCell>
              <TableCell>{activity.type}</TableCell>
              <TableCell>{activity.date ? formatDate(activity.date) : 'TBD'}</TableCell>
              <TableCell>{activity.location}</TableCell>
              <TableCell><StatusBadge status={activity.status} /></TableCell>
              <TableCell>{activity.ownership.finosLead}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link to={`/masterclass/${activity.id}`}>
                    <span>View</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivityTable;
