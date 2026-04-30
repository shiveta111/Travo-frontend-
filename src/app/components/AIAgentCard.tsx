import { Bot, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface AIAgentCardProps {
  name: string;
  status: 'active' | 'processing' | 'idle';
  tasksCompleted: number;
  description: string;
}

export function AIAgentCard({ name, status, tasksCompleted, description }: AIAgentCardProps) {
  const statusConfig = {
    active: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Active' },
    processing: { icon: Clock, color: 'text-secondary', bg: 'bg-secondary/10', label: 'Processing' },
    idle: { icon: AlertCircle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Idle' },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-lg p-5 border border-border">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bot className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-foreground">{name}</h4>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg}`}>
              <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
              <span className={`text-xs ${config.color}`}>{config.label}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3">{description}</p>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min((tasksCompleted / 50) * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {tasksCompleted} tasks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
