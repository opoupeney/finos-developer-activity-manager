
import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface AmbassadorSearchBarProps {
  onSearch: (searchText: string) => void;
  onCompanyFilter: (company: string | null) => void;
  onLocationFilter: (location: string | null) => void;
  companyOptions: string[];
  locationOptions: string[];
}

const AmbassadorSearchBar: React.FC<AmbassadorSearchBarProps> = ({ 
  onSearch,
  onCompanyFilter,
  onLocationFilter,
  companyOptions,
  locationOptions
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchText('');
    onSearch('');
  };

  const handleCompanyChange = (value: string) => {
    const company = value === 'all' ? null : value;
    setSelectedCompany(company);
    onCompanyFilter(company);
  };

  const handleLocationChange = (value: string) => {
    const location = value === 'all' ? null : value;
    setSelectedLocation(location);
    onLocationFilter(location);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
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
          <Select onValueChange={handleCompanyChange}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Company</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companyOptions.map(company => (
                <SelectItem key={company} value={company}>{company}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={handleLocationChange}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Location</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locationOptions.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active filters */}
      {(selectedCompany || selectedLocation) && (
        <div className="flex flex-wrap gap-2">
          {selectedCompany && (
            <Badge variant="outline" className="px-3 py-1">
              Company: {selectedCompany}
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-5 w-5 p-0" 
                onClick={() => handleCompanyChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {selectedLocation && (
            <Badge variant="outline" className="px-3 py-1">
              Location: {selectedLocation}
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-5 w-5 p-0" 
                onClick={() => handleLocationChange('all')}
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

export default AmbassadorSearchBar;
