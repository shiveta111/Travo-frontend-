import { AlertCircle, Clock, Mail, Phone } from 'lucide-react';

const priorities = [
  {
    id: 1,
    title: 'Follow up with Sarah Johnson',
    type: 'Sales',
    priority: 'high',
    icon: Phone,
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'Review European tour itinerary',
    type: 'Operations',
    priority: 'medium',
    icon: Clock,
    time: '4 hours ago',
  },
  {
    id: 3,
    title: 'Send booking confirmation to Mike',
    type: 'Email',
    priority: 'high',
    icon: Mail,
    time: '5 hours ago',
  },
  {
    id: 4,
    title: 'Process pending payment - $8,500',
    type: 'Finance',
    priority: 'high',
    icon: AlertCircle,
    time: '1 day ago',
  },
];

export function PriorityQueue() {
  return (
    <div className="bg-white rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground">AI Priority Queue</h3>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {priorities.length} tasks
        </span>
      </div>

      <div className="space-y-2">
        {priorities.map((task) => {
          const Icon = task.icon;
          const priorityColors = {
            high: 'border-l-accent',
            medium: 'border-l-secondary',
            low: 'border-l-muted-foreground',
          };

          return (
            <div
              key={task.id}
              className={`p-4 rounded-lg border border-border border-l-4 ${priorityColors[task.priority as keyof typeof priorityColors]} hover:bg-sidebar-accent transition-colors cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground mb-1">{task.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{task.type}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{task.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors">
        View all tasks
      </button>
    </div>
  );
}
