
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Content, ContentType, ContentProvider, ContentStatus } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MDEditor from '@uiw/react-md-editor';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const contentFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable(),
  author: z.string().nullable(),
  url: z.string().refine(val => val === '' || /^https?:\/\//.test(val), {
    message: 'Must be a valid URL or empty',
  }).nullable().optional(),
  source: z.string().nullable().optional(),
  type: z.enum(['document', 'presentation', 'video'] as const),
  provider: z.enum(['gdoc', 'gslide', 'linkedin', 'youtube'] as const),
  status: z.enum(['logged', 'in progress', 'draft', 'published', 'archived'] as const),
  publication_date: z.date().nullable(),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

interface ContentFormProps {
  initialData?: Partial<Content>;
  onSubmit: (data: ContentFormValues) => void;
  isSubmitting: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      author: initialData?.author || '',
      url: initialData?.url || '',
      source: initialData?.source || '',
      type: initialData?.type || 'document',
      provider: initialData?.provider || 'gdoc',
      status: initialData?.status || 'draft',
      publication_date: initialData?.publication_date ? new Date(initialData.publication_date) : null,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter content title" {...field} />
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
                <div data-color-mode="light" className="w-full">
                  <MDEditor
                    value={field.value || ''}
                    onChange={(value) => field.onChange(value || '')}
                    height={200}
                    preview="edit"
                  />
                </div>
              </FormControl>
              <FormDescription>
                You can use Markdown syntax to format the description
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Enter author name" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <Input placeholder="Enter content source" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  The URL where the source of the content is located (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter content URL" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  The URL where the content can be accessed (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publication_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Publication Date</FormLabel>
                <DatePicker 
                  date={field.value || undefined} 
                  onDateChange={field.onChange}
                  placeholder="Select publication date"
                />
                <FormDescription>
                  When the content was or will be published
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gdoc">Google Docs</SelectItem>
                    <SelectItem value="gslide">Google Slides</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="logged">Logged</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Content' : 'Create Content'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContentForm;
