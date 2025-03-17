
import React from 'react';
import { Link } from 'react-router-dom';
import { Ambassador } from '@/types/ambassador';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, MapPin, Briefcase, Github, Linkedin, Building, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AmbassadorDetailProps {
  ambassador: Ambassador;
  isAdmin: boolean;
}

const AmbassadorDetail: React.FC<AmbassadorDetailProps> = ({ ambassador, isAdmin }) => {
  const initials = `${ambassador.first_name[0]}${ambassador.last_name[0]}`;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-muted">
              {ambassador.headshot_url ? (
                <AvatarImage src={ambassador.headshot_url} alt={`${ambassador.first_name} ${ambassador.last_name}`} />
              ) : (
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{ambassador.first_name} {ambassador.last_name}</CardTitle>
              {ambassador.title && ambassador.company && (
                <CardDescription className="text-lg mt-1">
                  {ambassador.title} at {ambassador.company}
                </CardDescription>
              )}
            </div>
          </div>
          {isAdmin && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/ambassadors/edit/${ambassador.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {ambassador.bio && (
            <div>
              <h3 className="font-medium mb-2">Bio</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{ambassador.bio}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ambassador.company && (
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p>{ambassador.company}</p>
                </div>
              </div>
            )}
            
            {ambassador.title && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p>{ambassador.title}</p>
                </div>
              </div>
            )}
            
            {ambassador.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{ambassador.location}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Online Profiles</h3>
            <div className="flex flex-wrap gap-3">
              {ambassador.linkedin_profile && (
                <Button asChild variant="outline" size="sm">
                  <a href={ambassador.linkedin_profile} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
              )}
              
              {ambassador.github_id && (
                <Button asChild variant="outline" size="sm">
                  <a href={`https://github.com/${ambassador.github_id}`} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground border-t pt-4">
        <div>Last updated: {formatDate(ambassador.updated_at)}</div>
      </CardFooter>
    </Card>
  );
};

export default AmbassadorDetail;
