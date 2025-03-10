
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          {items.map((item, index) => (
            <div key={index} className="py-2">
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              <p className="font-medium">{formatValue(item.value)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailCard;
