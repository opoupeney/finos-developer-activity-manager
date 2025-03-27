
import React from 'react';
import { format } from 'date-fns';
import { KeyDate } from '@/types/activity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KeyDatesProps {
  keyDates: KeyDate[];
  isEditable?: boolean;
  onAddKeyDate?: () => void;
  onEditKeyDate?: (keyDate: KeyDate) => void;
  onDeleteKeyDate?: (keyDateId: string) => void;
}

const KeyDates: React.FC<KeyDatesProps> = ({ 
  keyDates, 
  isEditable = false,
  onAddKeyDate,
  onEditKeyDate,
  onDeleteKeyDate
}) => {
  const { toast } = useToast();
  
  // Format the date string
  const formatDateString = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return format(date, 'MMMM d, yyyy h:mm a');
      }
      return dateStr;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };

  if (!keyDates || keyDates.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Key Dates</CardTitle>
            {isEditable && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onAddKeyDate}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Key Date
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No key dates available for this activity.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Key Dates</CardTitle>
          {isEditable && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onAddKeyDate}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Key Date
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {keyDates.map((keyDate) => (
            <div key={keyDate.id} className="border rounded-md p-4 bg-background">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-finos-blue" />
                    <span className="font-medium">{formatDateString(keyDate.date)}</span>
                  </div>
                  <p className="text-sm mb-2">{keyDate.description}</p>
                  <p className="text-xs text-muted-foreground">Owner: {keyDate.owner}</p>
                </div>
                {isEditable && (
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => onEditKeyDate && onEditKeyDate(keyDate)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => {
                        if (onDeleteKeyDate) {
                          onDeleteKeyDate(keyDate.id);
                          toast({
                            title: "Key date removed",
                            description: "The key date has been successfully removed.",
                          });
                        }
                      }}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyDates;
