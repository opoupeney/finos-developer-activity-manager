
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ambassador } from '@/types/ambassador';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const ambassadorFormSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  location: z.string().nullable().optional(),
  linkedin_profile: z.string().nullable().optional(),
  github_id: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  headshot_url: z.string().nullable().optional(),
});

type AmbassadorFormValues = z.infer<typeof ambassadorFormSchema>;

interface AmbassadorFormProps {
  initialData?: Partial<Ambassador>;
  onSubmit: (data: AmbassadorFormValues) => void;
  isSubmitting: boolean;
}

const AmbassadorForm: React.FC<AmbassadorFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const form = useForm<AmbassadorFormValues>({
    resolver: zodResolver(ambassadorFormSchema),
    defaultValues: {
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      location: initialData?.location || '',
      linkedin_profile: initialData?.linkedin_profile || '',
      github_id: initialData?.github_id || '',
      company: initialData?.company || '',
      title: initialData?.title || '',
      bio: initialData?.bio || '',
      headshot_url: initialData?.headshot_url || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter job title" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="headshot_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headshot URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter headshot image URL" 
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormDescription>
                URL to the ambassador's profile image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="linkedin_profile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile</FormLabel>
                <FormControl>
                  <Input placeholder="Enter LinkedIn profile URL" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  The full URL to the ambassador's LinkedIn profile
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter GitHub username" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  The ambassador's GitHub username
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter bio information" 
                  className="min-h-[120px]" 
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormDescription>
                A short biography of the ambassador
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Ambassador' : 'Create Ambassador'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AmbassadorForm;
