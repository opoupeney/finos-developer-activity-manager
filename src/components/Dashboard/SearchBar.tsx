
import React, { useState } from 'react';
import { Search, X, Calendar, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface SearchBarProps {
  onSearch: (searchText: string) => void;
  onDateFilter: (date: Date | undefined) => void;
  onTypeFilter: (type: string | null) => void;
  onStatusFilter: (status: string | null) => void;
  typeOptions: string[];
  statusOptions: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch,
  onDateFilter,
  onTypeFilter,
  onStatusFilter,
  typeOptions,
  statusOptions
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchText('');
    onSearch('');
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateFilter(date);
  };

  const handleClearDate = () => {
    setSelectedDate(undefined);
    onDateFilter(undefined);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value === 'all' ? null : value);
    onTypeFilter(value === 'all' ? null : value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value === 'all' ? null : value);
    onStatusFilter(value === 'all' ? null : value);
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
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Select onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[120px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Type</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {typeOptions.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
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
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active filters */}
      {(selectedDate || selectedType || selectedStatus) && (
        <div className="flex flex-wrap gap-2">
          {selectedDate && (
            <Badge variant="outline" className="px-3 py-1">
              Date: {format(selectedDate, 'MMM d, yyyy')}
              <Button variant="ghost" size="sm" className="ml-2 h-5 w-5 p-0" onClick={handleClearDate}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {selectedType && (
            <Badge variant="outline" className="px-3 py-1">
              Type: {selectedType}
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
          {selectedStatus && (
            <Badge variant="outline" className="px-3 py-1">
              Status: {selectedStatus}
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
