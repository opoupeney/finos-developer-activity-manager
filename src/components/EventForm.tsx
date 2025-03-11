import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from '@/types/activity';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash, GraduationCap, Code, Building, Users, MessageSquareCode, PenTool, UserPlus } from 'lucide-react';
import { format, parse } from 'date-fns';
import MDEditor from '@uiw/react-md-editor';

const eventFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
  date: z.date({
    required_error: 'Date is required',
  }),
  kickOffDate: z.date({
    required_error: 'Kick-off date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  location: z.string().min(1, { message: 'Location is required' }),
  marketingCampaign: z.string().min(1, { message: 'Marketing campaign is required' }),
  marketingDescription: z.string().min(1, { message: 'Description is required' }),
  status: z.enum(['Approved', 'Pending', 'Rejected', 'Done']),
  
  finosLead: z.string().min(1, { message: 'FINOS lead is required' }),
  finosTeam: z.string().min(1, { message: 'FINOS team is required' }),
  marketingLiaison: z.string().min(1, { message: 'Marketing liaison is required' }),
  memberSuccessLiaison: z.string().min(1, { message: 'Member success liaison is required' }),
  sponsorsPartners: z.string().min(1, { message: 'Sponsors/partners are required' }),
  channel: z.string().min(1, { message: 'Channel is required' }),
  ambassador: z.string().min(1, { message: 'Ambassador is required' }),
  toc: z.string().min(1, { message: 'TOC is required' }),
  
  useCase: z.string(),
  strategicInitiative: z.string().min(1, { message: 'Strategic initiative is required' }),
  projects: z.string().min(1, { message: 'Projects are required' }),
  targetedPersonas: z.string().min(1, { message: 'Targeted personas are required' }),
  
  targetedRegistrations: z.number().min(0),
  currentRegistrations: z.number().min(0),
  targetedParticipants: z.number().min(0),
  currentParticipants: z.number().min(0),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  initialData?: Activity;
  onSubmit: (data: Activity) => Promise<void>;
  onDelete?: () => Promise<void>;
  isEditing?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ 
  initialData, 
  onSubmit, 
  onDelete, 
  isEditing = false 
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mdDescription, setMdDescription] = useState(initialData?.marketingDescription || '');

  const parseDate = (dateValue: string | Date | null | undefined): Date | undefined => {
    if (!dateValue) return undefined;
    
    if (dateValue instanceof Date) return dateValue;
    
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) return date;
    
    console.error("Could not parse date:", dateValue);
    return undefined;
  };

  const defaultValues: Partial<EventFormValues> = {
    title: initialData?.title || '',
    type: initialData?.type || '',
    date: parseDate(initialData?.date) || undefined,
    kickOffDate: parseDate(initialData?.kickOffDate) || undefined,
    endDate: parseDate(initialData?.endDate) || undefined,
    location: initialData?.location || '',
    marketingCampaign: initialData?.marketingCampaign || '',
    marketingDescription: initialData?.marketingDescription || '',
    status: initialData?.status || 'Pending',
    
    finosLead: initialData?.ownership.finosLead || '',
    finosTeam: initialData?.ownership.finosTeam.join(', ') || '',
    marketingLiaison: initialData?.ownership.marketingLiaison || '',
    memberSuccessLiaison: initialData?.ownership.memberSuccessLiaison || '',
    sponsorsPartners: initialData?.ownership.sponsorsPartners.join(', ') || '',
    channel: initialData?.ownership.channel || '',
    ambassador: initialData?.ownership.ambassador || '',
    toc: initialData?.ownership.toc || '',
    
    useCase: initialData?.impacts.useCase || '',
    strategicInitiative: initialData?.impacts.strategicInitiative || '',
    projects: initialData?.impacts.projects.join(', ') || '',
    targetedPersonas: initialData?.impacts.targetedPersonas.join(', ') || '',
    
    targetedRegistrations: initialData?.metrics.targetedRegistrations || 0,
    currentRegistrations: initialData?.metrics.currentRegistrations || 0,
    targetedParticipants: initialData?.metrics.targetedParticipants || 0,
    currentParticipants: initialData?.metrics.currentParticipants || 0,
  };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues
  });

  const handleSubmit = async (values: EventFormValues) => {
    try {
      setIsSubmitting(true);
      
      const eventData: Activity = {
        id: initialData?.id || '',
        title: values.title,
        type: values.type,
        date: values.date.toISOString(),
        kickOffDate: values.kickOffDate.toISOString(),
        endDate: values.endDate.toISOString(),
        location: values.location,
        marketingCampaign: values.marketingCampaign,
        marketingDescription: mdDescription,
        status: values.status,
        ownership: {
          finosLead: values.finosLead,
          finosTeam: values.finosTeam.split(',').map(item => item.trim()),
          marketingLiaison: values.marketingLiaison,
          memberSuccessLiaison: values.memberSuccessLiaison,
          sponsorsPartners: values.sponsorsPartners.split(',').map(item => item.trim()),
          channel: values.channel,
          ambassador: values.ambassador,
          toc: values.toc,
        },
        impacts: {
          useCase: values.useCase,
          strategicInitiative: values.strategicInitiative,
          projects: values.projects.split(',').map(item => item.trim()),
          targetedPersonas: values.targetedPersonas.split(',').map(item => item.trim()),
        },
        metrics: {
          targetedRegistrations: values.targetedRegistrations,
          currentRegistrations: values.currentRegistrations,
          registrationPercentage: values.targetedRegistrations > 0 
            ? Math.round((values.currentRegistrations / values.targetedRegistrations) * 100) 
            : 0,
          targetedParticipants: values.targetedParticipants,
          currentParticipants: values.currentParticipants,
          participationPercentage: values.targetedParticipants > 0 
            ? Math.round((values.currentParticipants / values.targetedParticipants) * 100) 
            : 0,
        }
      };
      
      await onSubmit(eventData);
      
      toast({
        title: `Developer Activity ${isEditing ? 'Updated' : 'Created'}`,
        description: `Successfully ${isEditing ? 'updated' : 'created'} developer activity "${values.title}"`,
      });
      
      navigate('/');
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} developer activity`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      setIsDeleting(true);
      await onDelete();
      
      toast({
        title: "Developer Activity Deleted",
        description: "Successfully deleted the developer activity",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete developer activity",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Developer Activity Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormItem>
            <FormLabel>Description</FormLabel>
            <div data-color-mode="light" style={{ height: "250px" }}>
              <MDEditor
                value={mdDescription}
                onChange={(val) => setMdDescription(val || '')}
                height={250}
                preview="edit"
              />
            </div>
          </FormItem>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Masterclass">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>Masterclass</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Hackathon">
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            <span>Hackathon</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Conference">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>Conference</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="TechTalk">
                          <div className="flex items-center gap-2">
                            <MessageSquareCode className="h-4 w-4" />
                            <span>TechTalk</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Workshop">
                          <div className="flex items-center gap-2">
                            <PenTool className="h-4 w-4" />
                            <span>Workshop</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Meetup">
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            <span>Meetup</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Date</FormLabel>
                    <DatePicker 
                      date={field.value} 
                      onDateChange={field.onChange}
                      placeholder="Select activity month/year" 
                      dateFormat="MMMM yyyy"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="kickOffDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kick-off Date</FormLabel>
                    <DatePicker 
                      date={field.value} 
                      onDateChange={field.onChange}
                      placeholder="Select kick-off date" 
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <DatePicker 
                      date={field.value} 
                      onDateChange={field.onChange}
                      placeholder="Select end date" 
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="London + Virtual" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="marketingCampaign"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketing Campaign</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select marketing campaign" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DevExpand">DevExpand</SelectItem>
                        <SelectItem value="DevConnect">DevConnect</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ownership</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="finosLead"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FINOS Lead</FormLabel>
                    <FormControl>
                      <Input placeholder="FINOS Lead" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="finosTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FINOS Team (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="LB, OP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="marketingLiaison"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketing Liaison</FormLabel>
                    <FormControl>
                      <Input placeholder="Marketing Liaison" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="memberSuccessLiaison"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member Success Liaison</FormLabel>
                    <FormControl>
                      <Input placeholder="Member Success Liaison" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sponsorsPartners"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sponsors/Partners (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="Moody, IBM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel</FormLabel>
                    <FormControl>
                      <Input placeholder="Channel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ambassador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ambassador</FormLabel>
                    <FormControl>
                      <Input placeholder="Ambassador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="toc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TOC</FormLabel>
                    <FormControl>
                      <Input placeholder="TOC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Impacts & Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="useCase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Use Case</FormLabel>
                    <FormControl>
                      <Input placeholder="Use Case" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="strategicInitiative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strategic Initiative</FormLabel>
                    <FormControl>
                      <Input placeholder="Strategic Initiative" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projects (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="AIR, OpenFin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetedPersonas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Targeted Personas (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineers, Architects" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetedRegistrations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Targeted Registrations</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="50" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentRegistrations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Registrations</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="35" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetedParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Targeted Participants</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="35" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Participants</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="24" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          
          <div className="flex items-center gap-2">
            {isEditing && onDelete && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
              >
                {isDeleting ? (
                  <>Deleting...</>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Activity
                  </>
                )}
              </Button>
            )}
            
            <Button 
              type="submit" 
              className="bg-finos-blue hover:bg-finos-blue/90"
              disabled={isSubmitting || isDeleting}
            >
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Update Activity' : 'Create Activity'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
