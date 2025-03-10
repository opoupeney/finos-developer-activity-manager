
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DetailItem {
  label: string;
  value: string | string[] | number | undefined;
}

interface DetailCardProps {
  title: string;
  items: DetailItem[];
  className?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({ title, items, className }) => {
  const formatValue = (value: string | string[] | number | undefined) => {
    if (value === undefined) return "Not specified";
    
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    
    return value.toString();
  };
  
  return (
    <Card className={cn("shadow-sm hover:shadow-md transition-shadow duration-300", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-finos-blue">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="text-sm font-medium text-muted-foreground mb-1">{item.label}</div>
              <div className="font-medium">
                {formatValue(item.value)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailCard;
