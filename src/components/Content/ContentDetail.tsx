
import React from 'react';
import { Link } from 'react-router-dom';
import { Content } from '@/types/content';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, ExternalLink, Calendar, FileText, Film, Presentation, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ContentDetailProps {
  content: Content;
  isAdmin: boolean;
}

const ContentDetail: React.FC<ContentDetailProps> = ({ content, isAdmin }) => {
  const getTypeIcon = () => {
    switch(content.type) {
      case 'document': return <FileText className="h-5 w-5" />;
      case 'presentation': return <Presentation className="h-5 w-5" />;
      case 'video': return <Film className="h-5 w-5" />;
      default: return null;
    }
  };

  const getStatusBadge = () => {
    let variant: "default" | "destructive" | "outline" | "secondary" = "outline";
    
    switch(content.status) {
      case 'published': variant = "default"; break;
      case 'in progress': variant = "secondary"; break;
      case 'archived': variant = "secondary"; break;
      case 'draft': variant = "outline"; break;
      default: variant = "outline";
    }
    
    return <Badge variant={variant} className="ml-2">{content.status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {getTypeIcon()}
            <CardTitle className="ml-2">{content.title}</CardTitle>
            {getStatusBadge()}
          </div>
          {isAdmin && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/content/edit/${content.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          )}
        </div>
        <CardDescription>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center text-sm">
              <User className="mr-1 h-4 w-4 text-muted-foreground" />
              {content.author || 'No author specified'}
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
              Last updated: {formatDate(content.updated_at)}
            </div>
            {content.publication_date && (
              <div className="flex items-center text-sm">
                <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                Published: {formatDate(content.publication_date)}
              </div>
            )}
            <div className="flex items-center text-sm">
              <Badge variant="outline" className="capitalize">
                {content.provider}
              </Badge>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{content.description || 'No description provided.'}</p>
          </div>
        </div>
      </CardContent>
      {content.url && (
        <CardFooter className="flex justify-end">
          <Button asChild>
            <a href={content.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Content
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ContentDetail;
