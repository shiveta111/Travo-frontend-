import { useState } from 'react';
import {
  Shield, Search, Edit2, X, Activity, Settings, DollarSign,
  TrendingUp, Eye, CheckCircle, Filter, AlertCircle
} from 'lucide-react';

interface Permission {
  view: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
}

interface RolePermissions {
  salesCRM: Permission;
  tripManagement: Permission;
  reservations: Permission;
  payments: Permission;
  analytics: Permission;
}

type RoleName = 'Admin' | 'Sales Executive' | 'Operations Manager' | 'Finance' | 'Guest Support' | 'AI Agent';

interface Role {
  name: RoleName;
  description: string;
  userCount: number;
  permissions: RolePermissions;
}

export function AddRole() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [permissionsChanged, setPermissionsChanged] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: {
      salesCRM: { view: false, edit: false, delete: false, approve: false },
      tripManagement: { view: false, edit: false, delete: false, approve: false },
      reservations: { view: false, edit: false, delete: false, approve: false },
      payments: { view: false, edit: false, delete: false, approve: false },
      analytics: { view: false, edit: false, delete: false, approve: false },
    }
  });

  const initialRoles: Role[] = [
    {
      name: 'Admin',
      description: 'Full system access and control',
      userCount: 1,
      permissions: {
        salesCRM: { view: true, edit: true, delete: true, approve: true },
        tripManagement: { view: true, edit: true, delete: true, approve: true },
        reservations: { view: true, edit: true, delete: true, approve: true },
        payments: { view: true, edit: true, delete: true, approve: true },
        analytics: { view: true, edit: true, delete: true, approve: true },
      }
    },
    {
      name: 'Sales Executive',
      description: 'Sales and CRM management',
      userCount: 3,
      permissions: {
        salesCRM: { view: true, edit: true, delete: false, approve: false },
        tripManagement: { view: true, edit: true, delete: false, approve: false },
        reservations: { view: true, edit: true, delete: false, approve: false },
        payments: { view: true, edit: false, delete: false, approve: false },
        analytics: { view: true, edit: false, delete: false, approve: false },
      }
    },
    {
      name: 'Operations Manager',
      description: 'Trip and operations management',
      userCount: 1,
      permissions: {
        salesCRM: { view: true, edit: false, delete: false, approve: false },
        tripManagement: { view: true, edit: true, delete: false, approve: true },
        reservations: { view: true, edit: true, delete: false, approve: true },
        payments: { view: true, edit: false, delete: false, approve: false },
        analytics: { view: true, edit: false, delete: false, approve: false },
      }
    },
    {
      name: 'Finance',
      description: 'Payment and accounting control',
      userCount: 1,
      permissions: {
        salesCRM: { view: true, edit: false, delete: false, approve: false },
        tripManagement: { view: true, edit: false, delete: false, approve: false },
        reservations: { view: true, edit: false, delete: false, approve: false },
        payments: { view: true, edit: true, delete: false, approve: true },
        analytics: { view: true, edit: false, delete: false, approve: false },
      }
    },
    {
      name: 'Guest Support',
      description: 'Customer service and support',
      userCount: 1,
      permissions: {
        salesCRM: { view: true, edit: false, delete: false, approve: false },
        tripManagement: { view: true, edit: false, delete: false, approve: false },
        reservations: { view: true, edit: true, delete: false, approve: false },
        payments: { view: false, edit: false, delete: false, approve: false },
        analytics: { view: false, edit: false, delete: false, approve: false },
      }
    },
    {
      name: 'AI Agent',
      description: 'Automated system agent',
      userCount: 0,
      permissions: {
        salesCRM: { view: true, edit: true, delete: false, approve: false },
        tripManagement: { view: true, edit: false, delete: false, approve: false },
        reservations: { view: true, edit: false, delete: false, approve: false },
        payments: { view: false, edit: false, delete: false, approve: false },
        analytics: { view: true, edit: false, delete: false, approve: false },
      }
    },
  ];

  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<Role>(initialRoles[1]);

  const roleTemplates = [
    { name: 'Sales Agent', description: 'Perfect for sales team members', icon: TrendingUp },
    { name: 'Ops Executive', description: 'Operations and trip management', icon: Settings },
    { name: 'Finance Controller', description: 'Payments and accounting', icon: DollarSign },
    { name: 'Admin', description: 'Full system access', icon: Shield },
  ];

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterModule === 'all') return matchesSearch;

    const hasModulePermission = role.permissions[filterModule as keyof RolePermissions] &&
      Object.values(role.permissions[filterModule as keyof RolePermissions]).some(v => v);

    return matchesSearch && hasModulePermission;
  });

  const stats = {
    totalRoles: roles.length,
    activeRoles: roles.filter(r => r.userCount > 0).length,
    totalUsers: roles.reduce((sum, r) => sum + r.userCount, 0),
    customRoles: roles.filter(r => !['Admin', 'Sales Executive', 'Operations Manager', 'Finance', 'Guest Support', 'AI Agent'].includes(r.name)).length,
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateRole = () => {
    if (!newRole.name.trim()) return;

    const roleToAdd: Role = {
      name: newRole.name as RoleName,
      description: newRole.description,
      userCount: 0,
      permissions: newRole.permissions
    };

    setRoles([...roles, roleToAdd]);
    setShowCreateRoleModal(false);
    setNewRole({
      name: '',
      description: '',
      permissions: {
        salesCRM: { view: false, edit: false, delete: false, approve: false },
        tripManagement: { view: false, edit: false, delete: false, approve: false },
        reservations: { view: false, edit: false, delete: false, approve: false },
        payments: { view: false, edit: false, delete: false, approve: false },
        analytics: { view: false, edit: false, delete: false, approve: false },
      }
    });
    showToast(`Role "${roleToAdd.name}" created successfully!`);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole({ ...role });
    setShowEditRoleModal(true);
  };

  const handleUpdateRole = () => {
    if (!editingRole) return;

    setRoles(roles.map(r => r.name === editingRole.name ? editingRole : r));

    if (selectedRole.name === editingRole.name) {
      setSelectedRole(editingRole);
    }

    setShowEditRoleModal(false);
    const roleName = editingRole.name;
    setEditingRole(null);
    showToast(`Role "${roleName}" updated successfully!`);
  };

  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRole = () => {
    if (!roleToDelete) return;

    const roleName = roleToDelete.name;
    setRoles(roles.filter(r => r.name !== roleToDelete.name));

    if (selectedRole.name === roleToDelete.name && roles.length > 1) {
      setSelectedRole(roles.find(r => r.name !== roleToDelete.name) || roles[0]);
    }

    setShowDeleteConfirm(false);
    setRoleToDelete(null);
    showToast(`Role "${roleName}" deleted successfully!`);
  };

  const handleUpdatePermission = (module: string, action: string, value: boolean) => {
    const updatedRole = {
      ...selectedRole,
      permissions: {
        ...selectedRole.permissions,
        [module]: {
          ...selectedRole.permissions[module as keyof RolePermissions],
          [action]: value
        }
      }
    };

    setSelectedRole(updatedRole);
    setPermissionsChanged(true);
  };

  const handleSavePermissions = () => {
    setRoles(roles.map(r => r.name === selectedRole.name ? selectedRole : r));
    setPermissionsChanged(false);
    showToast(`Permissions updated for "${selectedRole.name}"`);
  };

  const handleCancelPermissions = () => {
    const originalRole = roles.find(r => r.name === selectedRole.name);
    if (originalRole) {
      setSelectedRole(originalRole);
    }
    setPermissionsChanged(false);
  };

  const applyTemplate = (templateName: string) => {
    const templates: Record<string, Partial<typeof newRole>> = {
      'Sales Agent': {
        name: 'Sales Agent',
        description: 'Perfect for sales team members',
        permissions: {
          salesCRM: { view: true, edit: true, delete: false, approve: false },
          tripManagement: { view: true, edit: true, delete: false, approve: false },
          reservations: { view: true, edit: true, delete: false, approve: false },
          payments: { view: true, edit: false, delete: false, approve: false },
          analytics: { view: true, edit: false, delete: false, approve: false },
        }
      },
      'Ops Executive': {
        name: 'Ops Executive',
        description: 'Operations and trip management',
        permissions: {
          salesCRM: { view: true, edit: false, delete: false, approve: false },
          tripManagement: { view: true, edit: true, delete: false, approve: true },
          reservations: { view: true, edit: true, delete: false, approve: true },
          payments: { view: true, edit: false, delete: false, approve: false },
          analytics: { view: true, edit: false, delete: false, approve: false },
        }
      },
      'Finance Controller': {
        name: 'Finance Controller',
        description: 'Payments and accounting',
        permissions: {
          salesCRM: { view: true, edit: false, delete: false, approve: false },
          tripManagement: { view: true, edit: false, delete: false, approve: false },
          reservations: { view: true, edit: false, delete: false, approve: false },
          payments: { view: true, edit: true, delete: false, approve: true },
          analytics: { view: true, edit: false, delete: false, approve: false },
        }
      },
      'Admin': {
        name: 'System Admin',
        description: 'Full system access',
        permissions: {
          salesCRM: { view: true, edit: true, delete: true, approve: true },
          tripManagement: { view: true, edit: true, delete: true, approve: true },
          reservations: { view: true, edit: true, delete: true, approve: true },
          payments: { view: true, edit: true, delete: true, approve: true },
          analytics: { view: true, edit: true, delete: true, approve: true },
        }
      }
    };

    const template = templates[templateName];
    if (template) {
      setNewRole({
        ...newRole,
        ...template
      });
      setShowCreateRoleModal(true);
    }
  };

  return (
    <div className="flex-1 bg-[#f5f7ff] p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-foreground mb-1">Role Management</h2>
            <p className="text-sm text-muted-foreground">Create and manage roles with custom permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search roles"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-border bg-white rounded-lg hover:bg-sidebar-accent transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border z-10">
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground px-2 py-1">Filter by Module</p>
                    {['all', 'salesCRM', 'tripManagement', 'reservations', 'payments', 'analytics'].map((module) => (
                      <button
                        key={module}
                        onClick={() => {
                          setFilterModule(module);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-sidebar-accent transition-colors ${
                          filterModule === module ? 'bg-[#4b49ac]/10 text-[#4b49ac]' : 'text-foreground'
                        }`}
                      >
                        {module === 'all' ? 'All Modules' : module.replace(/([A-Z])/g, ' $1').trim()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowCreateRoleModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg hover:bg-[#4b49ac]/90 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm">Create Role</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Roles</p>
            <Shield className="w-5 h-5 text-[#4b49ac]" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.totalRoles}</p>
          <p className="text-xs text-muted-foreground">System-wide</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active Roles</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.activeRoles}</p>
          <p className="text-xs text-green-600">In use</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Assigned Users</p>
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.totalUsers}</p>
          <p className="text-xs text-muted-foreground">Users</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Custom Roles</p>
            <Settings className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.customRoles}</p>
          <p className="text-xs text-muted-foreground">Created</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Roles List */}
        <div className="col-span-7 bg-white rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-foreground">Roles</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sidebar-accent">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Role Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Users</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRoles.map((role) => (
                  <tr key={role.name} className="hover:bg-sidebar-accent transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#4b49ac]" />
                        <span className="text-sm font-medium text-foreground">{role.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">{role.userCount} users</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedRole(role)}
                          className="p-1.5 rounded hover:bg-blue-100 transition-colors"
                          title="View Permissions"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleEditRole(role)}
                          className="p-1.5 rounded hover:bg-purple-100 transition-colors"
                          title="Edit Role"
                        >
                          <Edit2 className="w-4 h-4 text-purple-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="p-1.5 rounded hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={role.userCount > 0 ? "Cannot delete role with assigned users" : "Delete"}
                          disabled={role.userCount > 0}
                        >
                          <X className={`w-4 h-4 ${role.userCount > 0 ? 'text-gray-300' : 'text-red-600'}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Permissions Panel */}
        <div className="col-span-5 bg-white rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-foreground">Role Permissions</h3>
              <p className="text-xs text-muted-foreground mt-1">Viewing: {selectedRole.name}</p>
            </div>
            {permissionsChanged && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelPermissions}
                  className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-sidebar-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePermissions}
                  className="px-3 py-1.5 text-xs bg-[#4b49ac] text-white rounded-lg hover:bg-[#4b49ac]/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
          <div className="p-4 overflow-y-auto max-h-[500px]">
            <div className="space-y-4">
              {Object.entries(selectedRole.permissions).map(([module, permissions]) => (
                <div key={module} className="border border-border rounded-lg p-3">
                  <p className="text-sm font-medium text-foreground mb-3 capitalize">
                    {module.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <div className="space-y-2">
                    {Object.entries(permissions).map(([action, enabled]) => (
                      <label key={action} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => handleUpdatePermission(module, action, e.target.checked)}
                          className="w-4 h-4 rounded border-border text-[#4b49ac] focus:ring-[#4b49ac] cursor-pointer"
                        />
                        <span className="text-muted-foreground capitalize">{action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Role Templates */}
      <div className="mt-6 bg-white rounded-lg border border-border shadow-sm p-6">
        <h3 className="text-foreground mb-4">Role Templates</h3>
        <p className="text-sm text-muted-foreground mb-4">Quick presets for common travel agency roles</p>
        <div className="grid grid-cols-4 gap-4">
          {roleTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.name}
                onClick={() => applyTemplate(template.name)}
                className="p-4 border border-border rounded-lg hover:border-[#4b49ac] hover:bg-[#4b49ac]/5 transition-colors text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[#4b49ac]/10">
                    <Icon className="w-5 h-5 text-[#4b49ac]" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{template.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-foreground">Create New Role</h3>
                <p className="text-sm text-muted-foreground">
                  Define a custom role with specific permissions
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateRoleModal(false);
                  setNewRole({
                    name: '',
                    description: '',
                    permissions: {
                      salesCRM: { view: false, edit: false, delete: false, approve: false },
                      tripManagement: { view: false, edit: false, delete: false, approve: false },
                      reservations: { view: false, edit: false, delete: false, approve: false },
                      payments: { view: false, edit: false, delete: false, approve: false },
                      analytics: { view: false, edit: false, delete: false, approve: false },
                    }
                  });
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Role Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      placeholder="e.g., Marketing Manager"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      placeholder="Brief description of this role's responsibilities"
                      rows={2}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac] resize-none"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-foreground mb-4">Permissions</h4>
                  <div className="bg-[#f5f7ff] rounded-lg border border-border p-4">
                    <div className="space-y-4">
                      {Object.entries(newRole.permissions).map(([module, permissions]) => (
                        <div key={module} className="bg-white rounded-lg border border-border p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-semibold text-foreground capitalize">
                              {module.replace(/([A-Z])/g, ' $1').trim()}
                            </h5>
                            <button
                              onClick={() => {
                                const allEnabled = Object.values(permissions).every(v => v);
                                setNewRole({
                                  ...newRole,
                                  permissions: {
                                    ...newRole.permissions,
                                    [module]: {
                                      view: !allEnabled,
                                      edit: !allEnabled,
                                      delete: !allEnabled,
                                      approve: !allEnabled,
                                    }
                                  }
                                });
                              }}
                              className="text-xs px-3 py-1 rounded-lg border border-[#4b49ac] text-[#4b49ac] hover:bg-[#4b49ac]/10 transition-colors"
                            >
                              {Object.values(permissions).every(v => v) ? 'Deselect All' : 'Select All'}
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            {Object.entries(permissions).map(([action, enabled]) => (
                              <label key={action} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={enabled}
                                  onChange={(e) => {
                                    setNewRole({
                                      ...newRole,
                                      permissions: {
                                        ...newRole.permissions,
                                        [module]: {
                                          ...newRole.permissions[module as keyof typeof newRole.permissions],
                                          [action]: e.target.checked
                                        }
                                      }
                                    });
                                  }}
                                  className="w-4 h-4 rounded border-border text-[#4b49ac] focus:ring-[#4b49ac]"
                                />
                                <span className="text-muted-foreground capitalize">{action}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Permission Summary</h5>
                      <p className="text-sm text-muted-foreground">
                        {Object.values(newRole.permissions).reduce((count, perms) =>
                          count + Object.values(perms).filter(v => v).length, 0
                        )} permissions enabled across {
                          Object.values(newRole.permissions).filter(perms =>
                            Object.values(perms).some(v => v)
                          ).length
                        } modules
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-border p-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateRoleModal(false);
                  setNewRole({
                    name: '',
                    description: '',
                    permissions: {
                      salesCRM: { view: false, edit: false, delete: false, approve: false },
                      tripManagement: { view: false, edit: false, delete: false, approve: false },
                      reservations: { view: false, edit: false, delete: false, approve: false },
                      payments: { view: false, edit: false, delete: false, approve: false },
                      analytics: { view: false, edit: false, delete: false, approve: false },
                    }
                  });
                }}
                className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                disabled={!newRole.name.trim()}
                className="px-6 py-2.5 rounded-lg bg-[#4b49ac] text-white hover:bg-[#4b49ac]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditRoleModal && editingRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-foreground">Edit Role</h3>
                <p className="text-sm text-muted-foreground">
                  Update role details and permissions
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEditRoleModal(false);
                  setEditingRole(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Role Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingRole.name}
                      onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value as RoleName })}
                      placeholder="e.g., Marketing Manager"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingRole.description}
                      onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                      placeholder="Brief description of this role's responsibilities"
                      rows={2}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac] resize-none"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-foreground mb-4">Permissions</h4>
                  <div className="bg-[#f5f7ff] rounded-lg border border-border p-4">
                    <div className="space-y-4">
                      {Object.entries(editingRole.permissions).map(([module, permissions]) => (
                        <div key={module} className="bg-white rounded-lg border border-border p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-semibold text-foreground capitalize">
                              {module.replace(/([A-Z])/g, ' $1').trim()}
                            </h5>
                            <button
                              onClick={() => {
                                const allEnabled = Object.values(permissions).every(v => v);
                                setEditingRole({
                                  ...editingRole,
                                  permissions: {
                                    ...editingRole.permissions,
                                    [module]: {
                                      view: !allEnabled,
                                      edit: !allEnabled,
                                      delete: !allEnabled,
                                      approve: !allEnabled,
                                    }
                                  }
                                });
                              }}
                              className="text-xs px-3 py-1 rounded-lg border border-[#4b49ac] text-[#4b49ac] hover:bg-[#4b49ac]/10 transition-colors"
                            >
                              {Object.values(permissions).every(v => v) ? 'Deselect All' : 'Select All'}
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            {Object.entries(permissions).map(([action, enabled]) => (
                              <label key={action} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={enabled}
                                  onChange={(e) => {
                                    setEditingRole({
                                      ...editingRole,
                                      permissions: {
                                        ...editingRole.permissions,
                                        [module]: {
                                          ...editingRole.permissions[module as keyof typeof editingRole.permissions],
                                          [action]: e.target.checked
                                        }
                                      }
                                    });
                                  }}
                                  className="w-4 h-4 rounded border-border text-[#4b49ac] focus:ring-[#4b49ac]"
                                />
                                <span className="text-muted-foreground capitalize">{action}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Permission Summary</h5>
                      <p className="text-sm text-muted-foreground">
                        {Object.values(editingRole.permissions).reduce((count, perms) =>
                          count + Object.values(perms).filter(v => v).length, 0
                        )} permissions enabled across {
                          Object.values(editingRole.permissions).filter(perms =>
                            Object.values(perms).some(v => v)
                          ).length
                        } modules
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-border p-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowEditRoleModal(false);
                  setEditingRole(null);
                }}
                className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={!editingRole.name.trim()}
                className="px-6 py-2.5 rounded-lg bg-[#4b49ac] text-white hover:bg-[#4b49ac]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && roleToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-red-100">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-2">Delete Role</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Are you sure you want to delete the role <span className="font-semibold">"{roleToDelete.name}"</span>? This action cannot be undone.
                  </p>
                  {roleToDelete.userCount > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-yellow-800">
                        This role has {roleToDelete.userCount} user{roleToDelete.userCount !== 1 ? 's' : ''} assigned and cannot be deleted.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-border p-4 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setRoleToDelete(null);
                }}
                className="px-4 py-2 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteRole}
                disabled={roleToDelete.userCount > 0}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Delete Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
