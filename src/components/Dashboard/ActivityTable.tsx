
import React, { useState, useMemo } from 'react';
import { Activity } from '@/types/activity';
import { Link } from 'react-router-dom';
import { formatDate, compareValues } from '@/lib/utils';
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
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';
import SearchBar from './SearchBar';
import { parseISO } from 'date-fns';

interface ActivityTableProps {
  activities: Activity[];
  isAdmin: boolean;
}

type SortField = 'title' | 'type' | 'date' | 'location' | 'status' | 'finosLead';
type SortDirection = 'asc' | 'desc';

const ActivityTable: React.FC<ActivityTableProps> = ({ activities, isAdmin }) => {
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Extract unique types and statuses for filter dropdowns
  const typeOptions = useMemo(() => {
    return [...new Set(activities.map(activity => activity.type))].sort();
  }, [activities]);

  const statusOptions = useMemo(() => {
    return [...new Set(activities.map(activity => activity.status))].sort();
  }, [activities]);

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-muted-foreground">No developer activities found</h2>
        <p className="text-muted-foreground mt-2">There are no developer activities available at the moment.</p>
      </div>
    );
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredActivities = activities.filter(activity => {
    // Text search filter
    const titleMatch = !searchText || 
      activity.title.toLowerCase().includes(searchText.toLowerCase());
    
    // Date filter
    const dateMatch = !dateFilter || 
      (activity.date && isSameDay(parseISO(activity.date), dateFilter));
    
    // Type filter
    const typeMatch = !typeFilter || activity.type === typeFilter;
    
    // Status filter
    const statusMatch = !statusFilter || activity.status === statusFilter;
    
    return titleMatch && dateMatch && typeMatch && statusMatch;
  });

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    let valueA, valueB;

    switch (sortField) {
      case 'title':
        valueA = a.title?.toLowerCase() || '';
        valueB = b.title?.toLowerCase() || '';
        break;
      case 'type':
        valueA = a.type?.toLowerCase() || '';
        valueB = b.type?.toLowerCase() || '';
        break;
      case 'date':
        valueA = a.date || '';
        valueB = b.date || '';
        break;
      case 'location':
        valueA = a.location?.toLowerCase() || '';
        valueB = b.location?.toLowerCase() || '';
        break;
      case 'status':
        valueA = a.status?.toLowerCase() || '';
        valueB = b.status?.toLowerCase() || '';
        break;
      case 'finosLead':
        valueA = a.ownership?.finosLead?.toLowerCase() || '';
        valueB = b.ownership?.finosLead?.toLowerCase() || '';
        break;
      default:
        valueA = '';
        valueB = '';
    }

    if (valueA === valueB) return 0;
    
    const comparison = valueA < valueB ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Helper function to check if two dates are the same day
  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
      <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  const SortableTableHead = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/30 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {children}
        <SortIcon field={field} />
      </div>
    </TableHead>
  );

  return (
    <div className="w-full space-y-4">
      <SearchBar 
        onSearch={setSearchText}
        onDateFilter={setDateFilter}
        onTypeFilter={setTypeFilter}
        onStatusFilter={setStatusFilter}
        typeOptions={typeOptions}
        statusOptions={statusOptions}
      />
      
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead field="title">Title</SortableTableHead>
            <SortableTableHead field="type">Type</SortableTableHead>
            <SortableTableHead field="date">Date</SortableTableHead>
            <SortableTableHead field="location">Location</SortableTableHead>
            <SortableTableHead field="status">Status</SortableTableHead>
            <SortableTableHead field="finosLead">Lead</SortableTableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedActivities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <p className="text-muted-foreground">No activities found with the current filters</p>
              </TableCell>
            </TableRow>
          ) : (
            sortedActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.title}</TableCell>
                <TableCell>{activity.type}</TableCell>
                <TableCell>{activity.date ? formatDate(activity.date) : 'TBD'}</TableCell>
                <TableCell>{activity.location}</TableCell>
                <TableCell><StatusBadge status={activity.status} /></TableCell>
                <TableCell>{activity.ownership.finosLead}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/activity/${activity.id}`}>
                      <span>View</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivityTable;
