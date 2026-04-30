import { Mail, Send, CheckCircle, Clock } from 'lucide-react';

const emailSequences = [
  { name: 'New Query Response', sent: 45, pending: 3, status: 'active' },
  { name: 'Booking Confirmation', sent: 28, pending: 0, status: 'active' },
  { name: 'Follow-up Sequence', sent: 62, pending: 8, status: 'active' },
  { name: 'Payment Reminder', sent: 15, pending: 2, status: 'active' },
];

export function EmailAutomation() {
  return (
    <div className="bg-white rounded-lg p-6 border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Mail className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h3 className="text-foreground">Email Automation</h3>
          <p className="text-sm text-muted-foreground">Active sequences</p>
        </div>
      </div>

      <div className="space-y-4">
        {emailSequences.map((sequence, index) => (
          <div key={index} className="pb-4 border-b border-border last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm text-foreground">{sequence.name}</h4>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-full">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">Active</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{sequence.sent} sent</span>
              </div>
              {sequence.pending > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-secondary">{sequence.pending} pending</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
