
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Ambassador } from '@/types/ambassador';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, ArrowUp, Edit, ExternalLink, MapPin, Building, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import AmbassadorSearchBar from '@/components/Ambassador/AmbassadorSearchBar';

interface AmbassadorGridProps {
  ambassadors: Ambassador[];
  isAdmin: boolean;
}

type SortField = 'first_name' | 'last_name' | 'location' | 'company' | 'title' | 'updated_at';
type SortDirection = 'asc' | 'desc';

const AmbassadorGrid: React.FC<AmbassadorGridProps> = ({ ambassadors, isAdmin }) => {
  const [sortField, setSortField] = useState<SortField>('last_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchText, setSearchText] = useState('');
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);

  const companyOptions = useMemo(() => {
    return [...new Set(ambassadors.map(ambassador => ambassador.company).filter(Boolean) as string[])].sort();
  }, [ambassadors]);

  const locationOptions = useMemo(() => {
    return [...new Set(ambassadors.map(ambassador => ambassador.location).filter(Boolean) as string[])].sort();
  }, [ambassadors]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAmbassadors = ambassadors.filter(ambassador => {
    const nameMatch = !searchText || 
      `${ambassador.first_name} ${ambassador.last_name}`.toLowerCase().includes(searchText.toLowerCase());
    
    const companyMatch = !companyFilter || ambassador.company === companyFilter;
    
    const locationMatch = !locationFilter || ambassador.location === locationFilter;
    
    return nameMatch && companyMatch && locationMatch;
  });

  const sortedAmbassadors = [...filteredAmbassadors].sort((a, b) => {
    let valueA, valueB;

    switch (sortField) {
      case 'first_name':
        valueA = a.first_name?.toLowerCase() || '';
        valueB = b.first_name?.toLowerCase() || '';
        break;
      case 'last_name':
        valueA = a.last_name?.toLowerCase() || '';
        valueB = b.last_name?.toLowerCase() || '';
        break;
      case 'location':
        valueA = a.location?.toLowerCase() || '';
        valueB = b.location?.toLowerCase() || '';
        break;
      case 'company':
        valueA = a.company?.toLowerCase() || '';
        valueB = b.company?.toLowerCase() || '';
        break;
      case 'title':
        valueA = a.title?.toLowerCase() || '';
        valueB = b.title?.toLowerCase() || '';
        break;
      case 'updated_at':
        valueA = a.updated_at || '';
        valueB = b.updated_at || '';
        break;
      default:
        valueA = '';
        valueB = '';
    }

    if (valueA === valueB) return 0;
    
    const comparison = valueA < valueB ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

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

  if (ambassadors.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-muted-foreground">No ambassadors found</h2>
        <p className="text-muted-foreground mt-2">There are no ambassadors available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <AmbassadorSearchBar 
        onSearch={setSearchText}
        onCompanyFilter={setCompanyFilter}
        onLocationFilter={setLocationFilter}
        companyOptions={companyOptions}
        locationOptions={locationOptions}
      />
      
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead field="first_name">First Name</SortableTableHead>
            <SortableTableHead field="last_name">Last Name</SortableTableHead>
            <SortableTableHead field="title">Title</SortableTableHead>
            <SortableTableHead field="company">Company</SortableTableHead>
            <SortableTableHead field="location">Location</SortableTableHead>
            <SortableTableHead field="updated_at">Last Updated</SortableTableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAmbassadors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <p className="text-muted-foreground">No ambassadors found with the current filters</p>
              </TableCell>
            </TableRow>
          ) : (
            sortedAmbassadors.map((ambassador) => (
              <TableRow key={ambassador.id}>
                <TableCell className="font-medium">{ambassador.first_name}</TableCell>
                <TableCell>{ambassador.last_name}</TableCell>
                <TableCell>{ambassador.title || 'N/A'}</TableCell>
                <TableCell>
                  {ambassador.company && (
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{ambassador.company}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {ambassador.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{ambassador.location}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{formatDate(ambassador.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {ambassador.linkedin_profile && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={ambassador.linkedin_profile} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">LinkedIn Profile</span>
                        </a>
                      </Button>
                    )}
                    {isAdmin && (
                      <Button asChild variant="ghost" size="icon">
                        <Link to={`/ambassadors/edit/${ambassador.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/ambassadors/${ambassador.id}`}>
                        <span>View</span>
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AmbassadorGrid;
