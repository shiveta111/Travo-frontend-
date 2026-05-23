import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Briefcase, Shield, ChevronDown, ChevronRight, 
  LucideIcon, Globe, Building2, Map, Plus, Calendar, FolderTree, Circle 
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { getMyMenus } from '../../api/menus.api';

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

const IconMap: Record<string, any> = {
  'LayoutDashboard': LayoutDashboard,
  'Users': Users,
  'Briefcase': Briefcase,
  'Shield': Shield,
  'Globe': Globe,
  'Building2': Building2,
  'Map': Map,
  'Plus': Plus,
  'Calendar': Calendar,
  'FolderTree': FolderTree,
  'Settings': Shield, // Map to Shield if Settings icon is not available
  'FileText': Globe,
  'Search': Users,
  'Bell': Users,
};

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [dynamicMenus, setDynamicMenus] = useState<MenuItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserMenus = async () => {
      try {
        const res = await getMyMenus();
        if (res?.success && Array.isArray(res.data)) {
          const transformed = res.data.map((m: any) => ({
            id: m.path || String(m.id),
            label: m.title,
            icon: IconMap[m.icon] || Circle,
            subItems: Array.isArray(m.subMenus) ? m.subMenus.map((sm: any) => ({
              id: sm.path || String(sm.id),
              label: sm.title,
              icon: IconMap[sm.icon] || Circle,
            })) : []
          }));
          setDynamicMenus(transformed);
        }
      } catch (error) {
        console.error('Failed to fetch menus:', error);
      }
    };

    fetchUserMenus();
  }, [user]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenu(prev => prev === menuId ? null : menuId);
  };

  useEffect(() => {
    const parentItem = dynamicMenus.find(item => 
      item.subItems?.some(sub => sub.id === activeModule)
    );
    if (parentItem) {
      setExpandedMenu(parentItem.id);
    }
  }, [activeModule, dynamicMenus]);

  return (
    <aside className="w-64 bg-white border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-primary">DMC Hub Travo AI</h1>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {dynamicMenus.map((item) => {
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
                      toggleMenu(item.id);
                      // Only navigate if it's a functional module, not just a category label
                      if (item.id && !['user_and_role_management', 'settings'].includes(item.id)) {
                        onModuleChange(item.id);
                      }
                    } else {
                      onModuleChange(item.id);
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