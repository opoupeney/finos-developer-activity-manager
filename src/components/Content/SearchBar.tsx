
import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ContentType, ContentProvider, ContentStatus } from '@/types/content';

interface SearchBarProps {
  onSearch: (searchText: string) => void;
  onTypeFilter: (type: ContentType | null) => void;
  onProviderFilter: (provider: ContentProvider | null) => void;
  onStatusFilter: (status: ContentStatus | null) => void;
  typeOptions: ContentType[];
  providerOptions: ContentProvider[];
  statusOptions: ContentStatus[];
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch,
  onTypeFilter,
  onProviderFilter,
  onStatusFilter,
  typeOptions,
  providerOptions,
  statusOptions
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ContentProvider | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ContentStatus | null>(null);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchText('');
    onSearch('');
  };

  const handleTypeChange = (value: string) => {
    const type = value === 'all' ? null : value as ContentType;
    setSelectedType(type);
    onTypeFilter(type);
  };

  const handleProviderChange = (value: string) => {
    const provider = value === 'all' ? null : value as ContentProvider;
    setSelectedProvider(provider);
    onProviderFilter(provider);
  };

  const handleStatusChange = (value: string) => {
    const status = value === 'all' ? null : value as ContentStatus;
    setSelectedStatus(status);
    onStatusFilter(status);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-10 pr-10"
            value={searchText}
            onChange={handleSearchChange}
          />
          {searchText && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-0"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[120px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Type</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {typeOptions.map(type => (
                <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={handleProviderChange}>
            <SelectTrigger className="w-[120px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Provider</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providerOptions.map(provider => (
                <SelectItem key={provider} value={provider} className="capitalize">{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[120px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Status</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active filters */}
      {(selectedType || selectedProvider || selectedStatus) && (
        <div className="flex flex-wrap gap-2">
          {selectedType && (
            <Badge variant="outline" className="px-3 py-1">
              Type: <span className="capitalize">{selectedType}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-5 w-5 p-0" 
                onClick={() => handleTypeChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {selectedProvider && (
            <Badge variant="outline" className="px-3 py-1">
              Provider: <span className="capitalize">{selectedProvider}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-5 w-5 p-0" 
                onClick={() => handleProviderChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {selectedStatus && (
            <Badge variant="outline" className="px-3 py-1">
              Status: <span className="capitalize">{selectedStatus}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-5 w-5 p-0" 
                onClick={() => handleStatusChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
