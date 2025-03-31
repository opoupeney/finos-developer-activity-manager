
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb as UIBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbProps {
  // No items prop needed - we'll generate from the current path
}

const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((path) => path);

  return (
    <UIBreadcrumb className="py-2">
      <BreadcrumbList>
        <BreadcrumbItem key="home">
          <BreadcrumbLink asChild>
            <Link to="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {pathnames.map((path, index) => {
          // Don't include ID segments in the breadcrumb
          if (path.match(/^[a-f0-9-]{36}$/)) return null;
          
          const route = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          // Display a friendly name instead of the route
          let displayName = path.charAt(0).toUpperCase() + path.slice(1);
          
          if (path === 'activity') displayName = 'Activities';
          
          return (
            <div key={route}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={route}>{displayName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </UIBreadcrumb>
  );
};

export default Breadcrumb;
