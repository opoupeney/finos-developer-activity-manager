
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const routeMap: Record<string, string> = {
  '/': 'Dashboard',
  '/activity': 'Activities',
  '/schedule': 'Schedule',
  '/profile': 'Profile',
  '/create': 'Create Activity',
  '/admin': 'Admin',
  '/auth': 'Authentication'
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  const location = useLocation();
  
  // Generate breadcrumb items based on the current URL if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(location.pathname);

  return (
    <nav aria-label="Breadcrumb" className={cn('flex py-2', className)}>
      <ol className="flex items-center space-x-2 text-sm">
        <li className="flex items-center">
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
            <li>
              {item.current ? (
                <span className="font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  // Split the pathname into segments
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return [];
  }

  // Build breadcrumb items based on segments
  const breadcrumbItems: BreadcrumbItem[] = [];
  let currentPath = '';

  segments.forEach((segment, index) => {
    // Handle special cases like dynamic routes
    if (segment.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
      currentPath += `/${segment}`;
      breadcrumbItems.push({
        label: 'Details',
        href: currentPath,
        current: index === segments.length - 1
      });
    } else {
      currentPath += `/${segment}`;
      
      // Handle edit/:id route
      if (segment === 'edit' && segments[index + 1]) {
        breadcrumbItems.push({
          label: 'Edit',
          href: currentPath + `/${segments[index + 1]}`,
          current: index === segments.length - 1
        });
        return; // Skip the next segment (the ID)
      }
      
      const label = routeMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbItems.push({
        label,
        href: currentPath,
        current: index === segments.length - 1
      });
    }
  });

  return breadcrumbItems;
}

export default Breadcrumb;
