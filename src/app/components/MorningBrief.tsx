import { Sun, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';

const briefItems = [
  { icon: Calendar, type: 'info', text: '8 trips scheduled for this week', color: 'text-primary' },
  { icon: AlertTriangle, type: 'warning', text: '3 payments overdue - total $12,450', color: 'text-accent' },
  { icon: CheckCircle2, type: 'success', text: '5 new leads converted yesterday', color: 'text-green-600' },
  { icon: Calendar, type: 'info', text: '2 trips departing today - all confirmed', color: 'text-secondary' },
];

export function MorningBrief() {
  return (
    <div className="bg-white rounded-lg p-6 border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Sun className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-foreground">Morning Brief</h3>
          <p className="text-sm text-muted-foreground">Tuesday, April 7, 2026</p>
        </div>
      </div>

      <div className="space-y-3">
        {briefItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors">
              <Icon className={`w-4 h-4 mt-0.5 ${item.color} flex-shrink-0`} />
              <p className="text-sm text-foreground">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
