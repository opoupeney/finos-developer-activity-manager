
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Content, ContentType, ContentProvider, ContentStatus } from '@/types/content';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, ArrowUp, Edit, ExternalLink, FileText, Film, Presentation } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/Content/SearchBar';

interface ContentGridProps {
  contents: Content[];
  isAdmin: boolean;
}

type SortField = 'title' | 'type' | 'provider' | 'author' | 'status' | 'updated_at';
type SortDirection = 'asc' | 'desc';

const ContentGrid: React.FC<ContentGridProps> = ({ contents, isAdmin }) => {
  const [sortField, setSortField] = useState<SortField>('updated_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | null>(null);
  const [providerFilter, setProviderFilter] = useState<ContentProvider | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContentStatus | null>(null);

  // Extract unique types and providers for filter dropdowns
  const typeOptions = useMemo(() => {
    return [...new Set(contents.map(content => content.type))].sort() as ContentType[];
  }, [contents]);

  const providerOptions = useMemo(() => {
    return [...new Set(contents.map(content => content.provider))].sort() as ContentProvider[];
  }, [contents]);

  const statusOptions = useMemo(() => {
    return [...new Set(contents.map(content => content.status))].sort() as ContentStatus[];
  }, [contents]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredContents = contents.filter(content => {
    // Text search filter
    const titleMatch = !searchText || 
      content.title.toLowerCase().includes(searchText.toLowerCase());
    
    // Type filter
    const typeMatch = !typeFilter || content.type === typeFilter;
    
    // Provider filter
    const providerMatch = !providerFilter || content.provider === providerFilter;
    
    // Status filter
    const statusMatch = !statusFilter || content.status === statusFilter;
    
    return titleMatch && typeMatch && providerMatch && statusMatch;
  });

  const sortedContents = [...filteredContents].sort((a, b) => {
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
      case 'provider':
        valueA = a.provider?.toLowerCase() || '';
        valueB = b.provider?.toLowerCase() || '';
        break;
      case 'author':
        valueA = a.author?.toLowerCase() || '';
        valueB = b.author?.toLowerCase() || '';
        break;
      case 'status':
        valueA = a.status?.toLowerCase() || '';
        valueB = b.status?.toLowerCase() || '';
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

  const getTypeIcon = (type: ContentType) => {
    switch(type) {
      case 'document': return <FileText className="h-4 w-4" />;
      case 'presentation': return <Presentation className="h-4 w-4" />;
      case 'video': return <Film className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: ContentStatus) => {
    let variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | null = "outline";
    
    switch(status) {
      case 'published': variant = "default"; break;
      case 'in progress': variant = "secondary"; break;
      case 'archived': variant = "ghost"; break;
      case 'draft': variant = "outline"; break;
      default: variant = "outline";
    }
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-muted-foreground">No content found</h2>
        <p className="text-muted-foreground mt-2">There is no content available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <SearchBar 
        onSearch={setSearchText}
        onTypeFilter={setTypeFilter}
        onProviderFilter={setProviderFilter}
        onStatusFilter={setStatusFilter}
        typeOptions={typeOptions}
        providerOptions={providerOptions}
        statusOptions={statusOptions}
      />
      
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead field="title">Title</SortableTableHead>
            <SortableTableHead field="type">Type</SortableTableHead>
            <SortableTableHead field="provider">Provider</SortableTableHead>
            <SortableTableHead field="author">Author</SortableTableHead>
            <SortableTableHead field="status">Status</SortableTableHead>
            <SortableTableHead field="updated_at">Last Updated</SortableTableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedContents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <p className="text-muted-foreground">No content found with the current filters</p>
              </TableCell>
            </TableRow>
          ) : (
            sortedContents.map((content) => (
              <TableRow key={content.id}>
                <TableCell className="font-medium">{content.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(content.type)}
                    <span className="capitalize">{content.type}</span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{content.provider}</TableCell>
                <TableCell>{content.author || 'N/A'}</TableCell>
                <TableCell>{getStatusBadge(content.status)}</TableCell>
                <TableCell>{formatDate(content.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {content.url && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={content.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View External</span>
                        </a>
                      </Button>
                    )}
                    {isAdmin && (
                      <Button asChild variant="ghost" size="icon">
                        <Link to={`/content/${content.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/content/${content.id}`}>
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

export default ContentGrid;
