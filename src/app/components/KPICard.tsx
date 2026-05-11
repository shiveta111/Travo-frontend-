import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'accent';
}

export function KPICard({ title, value, change, icon: Icon, color = 'primary' }: KPICardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl mb-2">{value}</h3>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {change >= 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+{change}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">{change}%</span>
                </>
              )}
              <span className="text-sm text-muted-foreground ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
