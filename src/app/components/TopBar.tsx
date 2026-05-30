import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, CheckCheck, Info, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { logoutUser } from '../../api/auth.api';
import { useAuth } from '../../auth/AuthContext';

// ─── Notification shape ───────────────────────────────────────────────────────
type NotifType = 'lead' | 'package' | 'system' | 'alert';

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  is_read: boolean;
}

// ─── Demo notifications (swap this with GET /notifications once TL gives API) ─
const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'lead',
    title: 'New Lead Assigned',
    message: 'Lead #18 (Shiveta – Bali) has been assigned to you.',
    time: '2 min ago',
    is_read: false,
  },
  {
    id: 2,
    type: 'package',
    title: 'Package Ready',
    message: 'Shimla Manali Family Tour package is ready for sharing.',
    time: '15 min ago',
    is_read: false,
  },
  {
    id: 3,
    type: 'alert',
    title: 'SLA Breach Warning',
    message: 'Lead #16 (Sameer – Bali) is approaching SLA breach.',
    time: '1 hr ago',
    is_read: false,
  },
  {
    id: 4,
    type: 'system',
    title: 'User Added',
    message: 'A new team member has been added to your department.',
    time: '3 hr ago',
    is_read: true,
  },
  {
    id: 5,
    type: 'lead',
    title: 'Lead Converted',
    message: 'Lead #12 (Rahul – Kerala) has been marked as converted.',
    time: 'Yesterday',
    is_read: true,
  },
];

// ─── Icon per notification type ───────────────────────────────────────────────
const NotifIcon = ({ type }: { type: NotifType }) => {
  if (type === 'lead')    return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
  if (type === 'package') return <Info         className="w-4 h-4 text-indigo-600" />;
  if (type === 'alert')   return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  return                         <Info         className="w-4 h-4 text-gray-500" />;
};

const notifBg: Record<NotifType, string> = {
  lead:    'bg-blue-50',
  package: 'bg-indigo-50',
  alert:   'bg-amber-50',
  system:  'bg-gray-50',
};

// ─── Component ────────────────────────────────────────────────────────────────
export function TopBar() {
  const { user, logout } = useAuth();

  // ── Profile dropdown ──────────────────────────────────────────────────────
  const [isSubmenuOpen, setIsSubmenuOpen]     = useState(false);
  const dropdownRef                           = useRef<HTMLDivElement>(null);

  // ── Notification panel ────────────────────────────────────────────────────
  const [showNotifs, setShowNotifs]           = useState(false);
  const [notifications, setNotifications]     = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const notifRef                              = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Close notification panel on outside click (only active when panel is open)
  useEffect(() => {
    if (!showNotifs) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showNotifs]);

  // Close profile dropdown on outside click (only active when open)
  useEffect(() => {
    if (!isSubmenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSubmenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isSubmenuOpen]);

  // Close both panels on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsSubmenuOpen(false); setShowNotifs(false); }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

  const markOneRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

  const removeNotif = (id: number) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      if (user?.id) await logoutUser(user.id);
      logout();
      window.location.href = '/travo';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 relative z-30">

      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search modules, trips, clients..."
            className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">

        {/* ── Notification Bell ── */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => { setShowNotifs((p) => !p); setIsSubmenuOpen(false); }}
            className="relative p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {showNotifs && (
            <div className="absolute right-0 top-12 w-[360px] bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-[#4b49ac] hover:underline"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markOneRead(n.id)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-sidebar-accent transition-colors ${!n.is_read ? 'bg-blue-50/40' : ''}`}
                    >
                      {/* Icon */}
                      <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${notifBg[n.type]}`}>
                        <NotifIcon type={n.type} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.is_read ? 'font-semibold text-foreground' : 'font-medium text-foreground'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                      </div>

                      {/* Unread dot + dismiss */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        {!n.is_read && (
                          <span className="w-2 h-2 rounded-full bg-[#4b49ac] mt-1" />
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeNotif(n.id); }}
                          className="p-0.5 rounded hover:bg-gray-200 text-muted-foreground"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-border bg-[#f8fafc] text-center">
                  <button
                    onClick={() => setNotifications([])}
                    className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    Clear all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Profile Dropdown ── */}
        <div ref={dropdownRef} className="flex items-center gap-3 pl-4 border-l border-border relative">
          <div className="text-right">
            <p className="text-sm text-foreground">{user?.first_name || 'Admin'}</p>
            <p className="text-xs text-muted-foreground">{user?.department_name || user?.username || 'Administrator'}</p>
          </div>
          <div
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => { setIsSubmenuOpen((p) => !p); setShowNotifs(false); }}
          >
            <User className="w-5 h-5 text-white" />
          </div>

          {isSubmenuOpen && (
            <div className="absolute right-0 top-11 bg-white shadow-lg rounded-lg border border-border w-36 py-1 z-50">
              <button
                onClick={handleLogout}
                className="w-full text-center text-red-600 hover:bg-red-50 py-2 px-3 text-sm font-medium transition-colors rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
