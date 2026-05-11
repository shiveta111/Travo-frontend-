import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Briefcase, Shield, ChevronDown, ChevronRight, LucideIcon, Globe, Building2, Map, Plus, Calendar } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

interface SubMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  subItems?: SubMenuItem[];
}

interface SidebarProps {
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  {
    icon: Shield,
    label: 'User & Role Management',
    id: 'users',
    subItems: [
      { id: 'departments', label: 'Departments', icon: Briefcase },
      { id: 'add-role', label: 'Role Management', icon: Shield },
      { id: 'add-user', label: 'User Management', icon: Users },
    ]
  },
  {
    icon: Globe,
    label: 'Leads Management',
    id: 'leads-management',
    subItems: [
      { id: 'new-leads', label: 'New Leads', icon: Plus },
      { id: 'all-leads', label: 'All Leads', icon: Users }
    ]
  },
  {
    icon: Users,
    label: 'Customers',
    id: 'customers',
    subItems: [
      { id: 'all-customers', label: 'All Customers', icon: Users },
      { id: 'customer-profiles', label: 'Customer Profiles', icon: Briefcase }
    ]
  },
  {
    icon: Calendar,
    label: 'Bookings',
    id: 'bookings',
    subItems: [
      { id: 'flight-bookings', label: 'Flight Bookings', icon: Globe },
      { id: 'hotel-bookings', label: 'Hotel Bookings', icon: Building2 },
      { id: 'holiday-packages', label: 'Holiday Packages', icon: Map },
      { id: 'visa-bookings', label: 'Visa Bookings', icon: Shield },
      { id: 'transport-bookings', label: 'Transport Bookings', icon: Briefcase }
    ]
  },
  {
    icon: Shield,
    label: 'Settings',
    id: 'settings',
    subItems: [
      { id: 'countries', label: 'Countries', icon: Globe },
      { id: 'states', label: 'States', icon: Map },
      { id: 'cities', label: 'Cities', icon: Building2 },
    ]
  }
];

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const { user } = useAuth();

  console.log("DEBUG: Sidebar User Object:", user);
  console.log("DEBUG: department_id:", user?.department_id, "Type:", typeof user?.department_id);

  const isSuperAdmin = Number(user?.role_id) === 1;
  const isSalesExecutive = Number(user?.role_id) === 2;

  const toggleMenu = (menuId: string) => {
    setExpandedMenu(prev => prev === menuId ? null : menuId);
  };

  useEffect(() => {
    const parentItem = menuItems.find(item => 
      item.subItems?.some(sub => sub.id === activeModule)
    );
    if (parentItem) {
      setExpandedMenu(parentItem.id);
    }
  }, [activeModule]);

  const filteredMenuItems = menuItems.filter(item => {
    // Admin only menus
    if (item.id === 'users' || item.id === 'settings') {
      return isSuperAdmin;
    }
    // Admin and Sales Executive menus
    if (item.id === 'leads-management' || item.id === 'customers' || item.id === 'bookings') {
      const hasAccess = isSuperAdmin || isSalesExecutive;
      if (!hasAccess) return false;

      // Filter subitems based on role
      if (item.subItems) {
        item.subItems = item.subItems.filter(sub => {
          if (sub.id === 'all-leads' || sub.id === 'new-leads') {
            return isSuperAdmin || isSalesExecutive;
          }
          return true;
        });
      }
      return true;
    }
    // Dashboard is visible to all
    return true;
  });

  return (
    <aside className="w-64 bg-white border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-primary">DMC Hub Travo AI</h1>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const hasActiveSubItem = item.subItems?.some(sub => sub.id === activeModule);
            const isExpanded = expandedMenu === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      toggleMenu(item.id); // Toggle submenu visibility when clicked
                    } else {
                      onModuleChange(item.id); // Change module if no subitems
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive || hasActiveSubItem
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs flex-1 text-left">{item.label}</span>
                  {hasSubItems && (
                    isExpanded ?
                      <ChevronDown className="w-3 h-3" /> :
                      <ChevronRight className="w-3 h-3" />
                  )}
                </button>

                {/* Render Submenu if the menu has subitems and is expanded */}
                {hasSubItems && isExpanded && (
                  <ul className="mt-1 ml-4 space-y-1">
                    {item.subItems!.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeModule === subItem.id;

                      return (
                        <li key={subItem.id}>
                          <button
                            onClick={() => onModuleChange(subItem.id)} // When a subitem is clicked
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-xs ${isSubActive
                              ? 'bg-[#4b49ac]/90 text-white'
                              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                              }`}
                          >
                            <SubIcon className="w-3.5 h-3.5" />
                            <span>{subItem.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}