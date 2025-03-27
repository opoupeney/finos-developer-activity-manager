
import React from 'react';
import { useForm } from 'react-hook-form';
import { KeyDate } from '@/types/activity';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface KeyDateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keyDate: Omit<KeyDate, 'id' | 'activityId'>) => void;
  keyDate?: KeyDate;
}

const KeyDateDialog: React.FC<KeyDateDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  keyDate 
}) => {
  const form = useForm<Omit<KeyDate, 'id' | 'activityId'>>({
    defaultValues: {
      date: keyDate?.date || new Date().toISOString().slice(0, 16),
      description: keyDate?.description || '',
      owner: keyDate?.owner || '',
    },
  });

  const isEditing = !!keyDate;

  React.useEffect(() => {
    if (isOpen && keyDate) {
      // Format date for datetime-local input (YYYY-MM-DDThh:mm)
      const formattedDate = keyDate.date ? new Date(keyDate.date).toISOString().slice(0, 16) : '';
      
      form.reset({
        date: formattedDate,
        description: keyDate.description,
        owner: keyDate.owner,
      });
    } else if (isOpen) {
      form.reset({
        date: new Date().toISOString().slice(0, 16),
        description: '',
        owner: '',
      });
    }
  }, [isOpen, keyDate, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSave({
      date: new Date(data.date).toISOString(),
      description: data.description,
      owner: data.owner,
    });
    onClose();
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Key Date' : 'Add Key Date'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date and Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe this key date..." 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Who is responsible for this date" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Save Changes' : 'Add Key Date'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default KeyDateDialog;
