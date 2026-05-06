import { useState } from 'react';
import { LayoutDashboard, Users, Briefcase, Shield, ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';

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
    icon: Shield,
    label: 'Settings',
    id: 'settings',
    subItems: [
      { id: 'countries', label: 'Countries', icon: Briefcase },
      { id: 'states', label: 'States', icon: Shield },
      { id: 'cities', label: 'Cities', icon: Users },
    ]
  },
  // More menu items can be added here
];

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]  // Toggle the submenu for the selected item
    }));
  };

  return (
    <aside className="w-64 bg-white border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-primary">DMC Hub Travo AI</h1>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus[item.id];
            const hasActiveSubItem = item.subItems?.some(sub => sub.id === activeModule);

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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive || hasActiveSubItem
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
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-xs ${
                              isSubActive
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