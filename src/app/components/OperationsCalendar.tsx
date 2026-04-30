import { useState } from 'react';
import {
  Calendar, Phone, CreditCard, Plane, AlertTriangle,
  CheckCircle, Clock, Users, ChevronLeft, ChevronRight,
  Plus, Filter, X
} from 'lucide-react';

type TaskType = 'FOLLOW_UP' | 'PAYMENT' | 'CHECK_IN' | 'DEPARTURE' | 'CONFIRMATION' | 'GENERAL';
type TaskStatus = 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'WARNING';

interface Task {
  id: number;
  date: string;
  type: TaskType;
  title: string;
  description?: string;
  assignedTo: string;
  time?: string;
  status: TaskStatus;
  relatedTrip?: string;
  amount?: number;
  pax?: number;
}

type ViewMode = 'week' | 'day';

export function OperationsCalendar() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState('2026-04-08');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const initialTasks: Task[] = [
    {
      id: 1,
      date: '2026-04-07',
      type: 'FOLLOW_UP',
      title: 'Follow up — Vikram Joshi',
      description: 'COLD lead 6 days',
      assignedTo: 'Dewa',
      time: '9:00 AM',
      status: 'PENDING',
    },
    {
      id: 2,
      date: '2026-04-07',
      type: 'PAYMENT',
      title: 'PAY — Kuta Paradiso ₹84,000',
      description: 'TR-0842, check-in Apr 8',
      assignedTo: 'Finance team',
      time: '',
      status: 'OVERDUE',
      relatedTrip: '#TR-0842',
      amount: 84000,
    },
    {
      id: 3,
      date: '2026-04-08',
      type: 'DEPARTURE',
      title: 'Ravi Mehta group — DEPARTURE Bali 7N',
      description: '28 pax',
      assignedTo: 'Putu',
      time: '',
      status: 'PENDING',
      relatedTrip: '#TR-0842',
      pax: 28,
    },
    {
      id: 4,
      date: '2026-04-08',
      type: 'CONFIRMATION',
      title: 'Kuta Paradiso check-in — CNF number not yet received',
      description: 'Alert for Putu',
      assignedTo: 'Putu',
      time: '',
      status: 'WARNING',
      relatedTrip: '#TR-0842',
    },
    {
      id: 5,
      date: '2026-04-09',
      type: 'FOLLOW_UP',
      title: 'Follow up — Priya Sharma',
      description: 'Quote sent 3 days ago',
      assignedTo: 'Dewa',
      time: '10:30 AM',
      status: 'PENDING',
    },
    {
      id: 6,
      date: '2026-04-09',
      type: 'PAYMENT',
      title: 'PAY — Seminyak Beach Resort ₹45,000',
      description: 'TR-0856, check-in Apr 12',
      assignedTo: 'Finance team',
      time: '',
      status: 'PENDING',
      relatedTrip: '#TR-0856',
      amount: 45000,
    },
    {
      id: 7,
      date: '2026-04-10',
      type: 'CHECK_IN',
      title: 'Check-in — Anjali Desai group',
      description: '15 pax at Ubud Villa',
      assignedTo: 'Made',
      time: '2:00 PM',
      status: 'PENDING',
      pax: 15,
    },
    {
      id: 8,
      date: '2026-04-10',
      type: 'FOLLOW_UP',
      title: 'Follow up — Rohan Gupta',
      description: 'HOT lead, interested in Maldives',
      assignedTo: 'Dewa',
      time: '11:00 AM',
      status: 'PENDING',
    },
    {
      id: 9,
      date: '2026-04-11',
      type: 'DEPARTURE',
      title: 'Anjali Desai group — DEPARTURE',
      description: '15 pax from Ubud',
      assignedTo: 'Made',
      time: '10:00 AM',
      status: 'PENDING',
      pax: 15,
    },
    {
      id: 10,
      date: '2026-04-12',
      type: 'CHECK_IN',
      title: 'Check-in — Seminyak Beach Resort',
      description: 'Confirm CNF number',
      assignedTo: 'Putu',
      time: '3:00 PM',
      status: 'WARNING',
      relatedTrip: '#TR-0856',
    },
    {
      id: 11,
      date: '2026-04-12',
      type: 'PAYMENT',
      title: 'PAY — Nusa Dua Hotel ₹125,000',
      description: 'TR-0871, check-in Apr 15',
      assignedTo: 'Finance team',
      time: '',
      status: 'PENDING',
      relatedTrip: '#TR-0871',
      amount: 125000,
    },
    {
      id: 12,
      date: '2026-04-13',
      type: 'FOLLOW_UP',
      title: 'Follow up — Kavita Patel',
      description: 'WARM lead, Thailand package',
      assignedTo: 'Dewa',
      time: '9:30 AM',
      status: 'PENDING',
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const weekDays = [
    { date: '2026-04-07', day: 'MON', dayNum: '7' },
    { date: '2026-04-08', day: 'TUE', dayNum: '8' },
    { date: '2026-04-09', day: 'WED', dayNum: '9' },
    { date: '2026-04-10', day: 'THU', dayNum: '10' },
    { date: '2026-04-11', day: 'FRI', dayNum: '11' },
    { date: '2026-04-12', day: 'SAT', dayNum: '12' },
    { date: '2026-04-13', day: 'SUN', dayNum: '13' },
  ];

  const getTasksForDate = (date: string) => {
    return tasks.filter(task => task.date === date);
  };

  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case 'FOLLOW_UP':
        return Phone;
      case 'PAYMENT':
        return CreditCard;
      case 'CHECK_IN':
      case 'DEPARTURE':
        return Plane;
      case 'CONFIRMATION':
        return AlertTriangle;
      default:
        return Calendar;
    }
  };

  const getTaskColor = (status: TaskStatus) => {
    switch (status) {
      case 'OVERDUE':
        return 'bg-red-50 border-red-500 text-red-900';
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-500 text-yellow-900';
      case 'COMPLETED':
        return 'bg-green-50 border-green-500 text-green-900';
      default:
        return 'bg-blue-50 border-blue-500 text-blue-900';
    }
  };

  const getStatusBadgeColor = (status: TaskStatus) => {
    switch (status) {
      case 'OVERDUE':
        return 'bg-red-600 text-white';
      case 'WARNING':
        return 'bg-yellow-600 text-white';
      case 'COMPLETED':
        return 'bg-green-600 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const toggleTaskStatus = (taskId: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
        };
      }
      return task;
    }));
  };

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newTask: Task = {
      id: tasks.length + 1,
      date: formData.get('date') as string,
      type: formData.get('type') as TaskType,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      assignedTo: formData.get('assignedTo') as string,
      time: formData.get('time') as string,
      status: 'PENDING',
    };

    setTasks([...tasks, newTask]);
    setShowNewTaskModal(false);
  };

  const getSummaryStats = () => {
    const today = new Date('2026-04-08');
    const todayStr = '2026-04-08';

    return {
      todayTasks: tasks.filter(t => t.date === todayStr && t.status !== 'COMPLETED').length,
      overdue: tasks.filter(t => t.status === 'OVERDUE').length,
      warnings: tasks.filter(t => t.status === 'WARNING').length,
      completed: tasks.filter(t => t.status === 'COMPLETED').length,
    };
  };

  const stats = getSummaryStats();

  return (
    <div className="flex-1 bg-background p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-foreground mb-1">Operations Calendar</h2>
            <p className="text-sm text-muted-foreground">Week of April 7 - April 13, 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">New Task</span>
            </button>
            <div className="flex items-center gap-2 bg-white rounded-lg border border-border p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'week'
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-sidebar-accent'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'day'
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-sidebar-accent'
                }`}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Today's Tasks</p>
                <p className="text-2xl font-semibold text-foreground">{stats.todayTasks}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overdue</p>
                <p className="text-2xl font-semibold text-foreground">{stats.overdue}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Warnings</p>
                <p className="text-2xl font-semibold text-foreground">{stats.warnings}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-2xl font-semibold text-foreground">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Week Calendar View */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {weekDays.map((day) => (
              <div
                key={day.date}
                className={`p-4 text-center border-r border-border last:border-r-0 ${
                  day.date === '2026-04-08' ? 'bg-primary/10' : ''
                }`}
              >
                <p className="text-sm text-muted-foreground mb-1">{day.day}</p>
                <p className="text-lg font-semibold text-foreground">{day.dayNum}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {getTasksForDate(day.date).filter(t => t.status !== 'COMPLETED').length} tasks
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {weekDays.map((day) => {
              const dayTasks = getTasksForDate(day.date);
              return (
                <div
                  key={day.date}
                  className={`p-3 border-r border-border last:border-r-0 min-h-[400px] ${
                    day.date === '2026-04-08' ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="space-y-2">
                    {dayTasks.map((task) => {
                      const Icon = getTaskIcon(task.type);
                      return (
                        <div
                          key={task.id}
                          className={`p-3 rounded-lg border-l-4 ${getTaskColor(task.status)} cursor-pointer hover:shadow-md transition-shadow`}
                          onClick={() => toggleTaskStatus(task.id)}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold leading-tight mb-1">
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-xs opacity-80 leading-tight">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="opacity-70">{task.assignedTo}</span>
                            {task.time && (
                              <span className="opacity-70">{task.time}</span>
                            )}
                          </div>
                          <div className="mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadgeColor(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day View (Mobile Accordion Style) */}
      {viewMode === 'day' && (
        <div className="space-y-3">
          {weekDays.map((day) => {
            const dayTasks = getTasksForDate(day.date);
            const isExpanded = expandedDay === day.date;
            const isToday = day.date === '2026-04-08';

            return (
              <div
                key={day.date}
                className={`bg-white rounded-lg border border-border overflow-hidden ${
                  isToday ? 'ring-2 ring-primary' : ''
                }`}
              >
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : day.date)}
                  className="w-full p-4 flex items-center justify-between hover:bg-sidebar-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-center ${isToday ? 'text-primary' : 'text-foreground'}`}>
                      <p className="text-sm font-medium">{day.day}</p>
                      <p className="text-2xl font-semibold">{day.dayNum}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">
                        {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                      </p>
                      {dayTasks.filter(t => t.status === 'OVERDUE').length > 0 && (
                        <p className="text-xs text-red-600 font-medium">
                          {dayTasks.filter(t => t.status === 'OVERDUE').length} overdue
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-border bg-background space-y-3">
                    {dayTasks.map((task) => {
                      const Icon = getTaskIcon(task.type);
                      return (
                        <div
                          key={task.id}
                          className={`p-4 rounded-lg border-l-4 ${getTaskColor(task.status)} cursor-pointer hover:shadow-md transition-shadow`}
                          onClick={() => toggleTaskStatus(task.id)}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold mb-1">{task.title}</p>
                              {task.description && (
                                <p className="text-sm opacity-80 mb-2">{task.description}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 text-xs">
                                <span className="opacity-70">
                                  <Users className="w-3 h-3 inline mr-1" />
                                  {task.assignedTo}
                                </span>
                                {task.time && (
                                  <span className="opacity-70">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    {task.time}
                                  </span>
                                )}
                                {task.amount && (
                                  <span className="opacity-70">
                                    <CreditCard className="w-3 h-3 inline mr-1" />
                                    ₹{task.amount.toLocaleString()}
                                  </span>
                                )}
                                {task.pax && (
                                  <span className="opacity-70">
                                    <Users className="w-3 h-3 inline mr-1" />
                                    {task.pax} pax
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-3 py-1 rounded ${getStatusBadgeColor(task.status)}`}>
                              {task.status}
                            </span>
                            {task.relatedTrip && (
                              <span className="text-xs text-muted-foreground">{task.relatedTrip}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <h3 className="text-foreground">Create New Task</h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Task Type
                </label>
                <select
                  name="type"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="FOLLOW_UP">Follow Up</option>
                  <option value="PAYMENT">Payment</option>
                  <option value="CHECK_IN">Check In</option>
                  <option value="DEPARTURE">Departure</option>
                  <option value="CONFIRMATION">Confirmation</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Follow up — Customer Name"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Additional details..."
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Assigned To
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  required
                  placeholder="e.g., Dewa, Putu, Finance team"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 text-sm text-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
