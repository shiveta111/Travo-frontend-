import { useState, useEffect, useRef } from 'react';
import {
  Shield, Search, Edit2, X, Activity, Settings, DollarSign,
  TrendingUp, Eye, CheckCircle, Filter, AlertCircle
} from 'lucide-react';
import { getActiveDepartments } from '../../api/department.api';
import { getRoles, newRole as createRoleApi, updateRole, deleteRole } from '../../api/roles.api';
import { getMenus } from '../../api/menus.api';

export function AddRole() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [permissionsChanged, setPermissionsChanged] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    if (showFilterDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterDropdown]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [activeDepartments, setActiveDepartments] = useState<any[]>([]);
  const [allMenus, setAllMenus] = useState<any[]>([]);

  useEffect(() => {
    fetchDepartments();
    fetchRoles();
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await getMenus(false); // flat list
      if (res?.success) setAllMenus(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await getActiveDepartments();
      if (res?.success) {
        setActiveDepartments(res.data || []);
      } else {
        setActiveDepartments([]);
      }
    } catch (error) {
      console.error(error);
      setActiveDepartments([]);
    }
  };
  const [newRole, setNewRole] = useState<any>({
    name: '',
    description: '',
    permissions: {},
    menu_ids: []
  });

  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const fetchRoles = async () => {
    try {

      const res = await getRoles();

      if (res?.success) {

        setRoles(res.data || []);

        if (res.data?.length > 0) {
          setSelectedRole(res.data[0]);
        }

      } else {

        setRoles([]);

      }

    } catch (error) {

      console.error(error);

      setRoles([]);

    }

  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.role_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterModule === 'all') return matchesSearch;

    const hasModulePermission =
      role.permissions?.[filterModule] &&
      Object.values(role.permissions[filterModule]).some((v: any) => v);

    return matchesSearch && hasModulePermission;
  });

  const stats = {
    totalRoles: roles.length,
    activeRoles: roles.length,
    totalUsers: 0,
    customRoles: roles.length
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateRole = async () => {

    try {

      if (!newRole.name.trim()) {
        return;
      }

      const permissionsArray = activeDepartments.map(
        (department: any) => {

          const deptKey = department.name
            .toLowerCase()
            .replace(/\s+/g, '_');

          const permission =
            newRole.permissions?.[deptKey] || {};

          return {

            department_id: department.id,

            can_view: permission.view || false,

            can_add: permission.add || false,

            can_edit: permission.edit || false,

            can_delete: permission.delete || false

          };

        }
      );

      const res = await createRoleApi(
        newRole.name,
        newRole.description,
        permissionsArray,
        newRole.menu_ids
      );

      if (res?.success) {

        showToast('Role created successfully');

        fetchRoles();

        setShowCreateRoleModal(false);

        setNewRole({
          name: '',
          description: '',
          permissions: {},
          menu_ids: []
        });

      }

    } catch (error) {

      console.error(error);

      showToast('Failed to create role', 'error');

    }

  };

  const handleEditRole = (role: any) => {
    setEditingRole({
      ...role,
      permissions: role.permissions || {},
      menu_ids: role.menu_ids || []
    });
    setShowEditRoleModal(true);
  };

  const handleUpdateRole = async () => {

    try {

      if (!editingRole) return;

      const permissionsArray = activeDepartments.map(
        (department: any) => {

          const deptKey = department.name
            .toLowerCase()
            .replace(/\s+/g, '_');

          const permission =
            editingRole.permissions?.[deptKey] || {};

          return {

            department_id: department.id,

            can_view: permission.view || false,

            can_add: permission.add || false,

            can_edit: permission.edit || false,

            can_delete: permission.delete || false

          };

        }
      );

      const payload = {
        role_name: editingRole.role_name,
        description: editingRole.description,
        permissions: permissionsArray,
        menu_ids: editingRole.menu_ids || []
      };

      const res = await updateRole(
        editingRole.id,
        payload
      );

      if (res?.success) {

        showToast('Role updated successfully');

        fetchRoles();

        setShowEditRoleModal(false);

        setEditingRole(null);

      } else {

        showToast('Failed to update role', 'error');

      }

    } catch (error) {

      console.error(error);

      showToast('Failed to update role', 'error');

    }

  };

  const handleDeleteRole = (role: any) => {
    setRoleToDelete(role);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRole = async () => {

    try {

      if (!roleToDelete) return;

      const res = await deleteRole(roleToDelete.id);

      if (res?.success) {

        showToast('Role deleted successfully');

        fetchRoles();

        setShowDeleteConfirm(false);

        setRoleToDelete(null);

      }

    } catch (error) {

      console.error(error);

      showToast('Failed to delete role', 'error');

    }

  };

  const handleUpdatePermission = (module: string, action: string, value: boolean) => {
    const updatedRole = {
      ...selectedRole,
      permissions: {
        ...selectedRole.permissions,
        [module]: {
          ...selectedRole.permissions?.[module],
          [action]: value
        }
      }
    };

    setSelectedRole(updatedRole);
    setPermissionsChanged(true);
  };

  const handleSavePermissions = async () => {

    try {

      if (!selectedRole) return;

      const permissionsArray = activeDepartments.map(
        (department: any) => {

          const deptKey = department.name
            .toLowerCase()
            .replace(/\s+/g, '_');

          const permission =
            selectedRole.permissions?.[deptKey] || {};

          return {

            department_id: department.id,

            can_view: permission.view || false,

            can_add: permission.add || false,

            can_edit: permission.edit || false,

            can_delete: permission.delete || false

          };

        }
      );

      const payload = {

        role_name: selectedRole.role_name,

        description: selectedRole.description,

        permissions: permissionsArray

      };

      const res = await updateRole(
        selectedRole.id,
        payload
      );

      if (res?.success) {

        fetchRoles();

        setPermissionsChanged(false);

        showToast(
          `Permissions updated successfully`
        );

      }

    } catch (error) {

      console.error(error);

      showToast(
        'Failed to update permissions',
        'error'
      );

    }

  };

  const handleCancelPermissions = () => {
    const originalRole = roles.find(r => r.name === selectedRole?.role_name);
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
            <div ref={filterRef} className="relative">
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

                    <p className="text-xs text-muted-foreground px-2 py-1">
                      Filter by Department
                    </p>

                    <button
                      onClick={() => {
                        setFilterModule('all');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-sidebar-accent transition-colors ${filterModule === 'all'
                          ? 'bg-[#4b49ac]/10 text-[#4b49ac]'
                          : 'text-foreground'
                        }`}
                    >
                      All Departments
                    </button>

                    {activeDepartments.map((department: any) => {

                      const deptKey = department.name
                        .toLowerCase()
                        .replace(/\s+/g, '_');

                      return (

                        <button
                          key={department.id}

                          onClick={() => {
                            setFilterModule(deptKey);
                            setShowFilterDropdown(false);
                          }}

                          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-sidebar-accent transition-colors ${filterModule === deptKey
                              ? 'bg-[#4b49ac]/10 text-[#4b49ac]'
                              : 'text-foreground'
                            }`}
                        >
                          {department.name}
                        </button>

                      );

                    })}

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
                  <tr key={role.id} className="hover:bg-sidebar-accent transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#4b49ac]" />
                        <span className="text-sm font-medium text-foreground">{role.role_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">{0} users</span>
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
                          title={0 > 0 ? "Cannot delete role with assigned users" : "Delete"}
                          disabled={false}
                        >
                          <X className={`w-4 h-4 ${0 > 0 ? 'text-gray-300' : 'text-red-600'}`} />
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
              <p className="text-xs text-muted-foreground mt-1">Viewing: {selectedRole?.role_name || 'No Role Selected'}</p>
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
              {selectedRole?.permissions && Object.entries(selectedRole.permissions).map(([module, permissions]) => (
                <div key={module} className="border border-border rounded-lg p-3">
                  <p className="text-sm font-medium text-foreground mb-3 capitalize">
                    {module.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <div className="space-y-2">
                    {Object.entries((permissions as any) || {}).map(([action, enabled]: [string, any]) => (
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
                    permissions: {}
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
                      Description & KPIs
                    </label>

                    <textarea
                      value={newRole.description}
                      onChange={(e) =>
                        setNewRole({
                          ...newRole,
                          description: e.target.value
                        })
                      }
                      placeholder="Enter role description, responsibilities, targets, and KPIs"
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac] resize-none"
                    />
                  </div>
                </div>

                {/* Menu Selection */}
                <div>
                  <h4 className="text-foreground mb-4">Assigned Menus</h4>
                  <div className="bg-[#f5f7ff] rounded-lg border border-border p-4">
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 border border-border rounded-lg bg-white">
                      {allMenus.map((menu) => (
                        <label key={menu.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newRole.menu_ids?.includes(menu.id)}
                            onChange={(e) => {
                              const currentIds = newRole.menu_ids || [];
                              const updatedIds = e.target.checked
                                ? [...currentIds, menu.id]
                                : currentIds.filter((id: number) => id !== menu.id);
                              setNewRole({ ...newRole, menu_ids: updatedIds });
                            }}
                            className="w-4 h-4 rounded border-border text-[#4b49ac] focus:ring-[#4b49ac]"
                          />
                          <span className="text-sm text-foreground">{menu.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-foreground mb-4">Department Permissions</h4>

                  <div className="bg-[#f5f7ff] rounded-lg border border-border p-4">

                    <div className="space-y-4">

                      {activeDepartments.map((department: any) => {

                        const deptKey = department.name
                          .toLowerCase()
                          .replace(/\s+/g, '_');

                        const permissions = newRole.permissions?.[deptKey] || {
                          view: false,
                          add: false,
                          edit: false,
                          delete: false
                        };

                        return (

                          <div
                            key={department.id}
                            className="bg-white rounded-lg border border-border p-4"
                          >

                            <div className="flex items-center justify-between mb-4">

                              <h5 className="text-sm font-semibold text-foreground">
                                {department.name}
                              </h5>

                              <button
                                type="button"
                                onClick={() => {

                                  const allEnabled =
                                    Object.values(permissions).every(v => v);

                                  setNewRole({
                                    ...newRole,

                                    permissions: {
                                      ...newRole.permissions,

                                      [deptKey]: {
                                        view: !allEnabled,
                                        add: !allEnabled,
                                        edit: !allEnabled,
                                        delete: !allEnabled
                                      }
                                    }
                                  });

                                }}
                                className="text-xs px-3 py-1 rounded-lg border border-[#4b49ac] text-[#4b49ac] hover:bg-[#4b49ac]/10 transition-colors"
                              >
                                {Object.values(permissions).every(v => v)
                                  ? 'Deselect All'
                                  : 'Select All'}
                              </button>

                            </div>

                            <div className="grid grid-cols-4 gap-3">

                              {['view', 'add', 'edit', 'delete'].map((action) => (

                                <label
                                  key={action}
                                  className="flex items-center gap-2 text-sm cursor-pointer"
                                >

                                  <input
                                    type="checkbox"

                                    checked={permissions[action]}

                                    onChange={(e) => {

                                      setNewRole({
                                        ...newRole,

                                        permissions: {
                                          ...newRole.permissions,

                                          [deptKey]: {
                                            ...permissions,

                                            [action]: e.target.checked
                                          }
                                        }
                                      });

                                    }}

                                    className="w-4 h-4 rounded border-border text-[#4b49ac] focus:ring-[#4b49ac]"
                                  />

                                  <span className="text-muted-foreground capitalize">
                                    {action}
                                  </span>

                                </label>

                              ))}

                            </div>

                          </div>
                        );
                      })}

                    </div>

                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Permission Summary</h5>
                      <p className="text-sm text-muted-foreground">
                        {
                          Object.values(newRole.permissions as any).reduce(
                            (count, perms: any) =>
                              count +
                              Object.values(perms).filter((v: any) => v).length,
                            0
                          )
                        }

                        {' '}permissions enabled across{' '}

                        {
                          Object.values(newRole.permissions as any).filter(
                            (perms: any) =>
                              Object.values(perms).some((v: any) => v)
                          ).length
                        }

                        {' '}modules

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
                    permissions: {}
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
                      value={editingRole.role_name}
                      onChange={(e) =>
                        setEditingRole({
                          ...editingRole,
                          role_name: e.target.value
                        })
                      }
                      placeholder="e.g., Marketing Manager"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description & KPIs
                    </label>

                    <textarea
                      value={editingRole.description}
                      onChange={(e) =>
                        setEditingRole({
                          ...editingRole,
                          description: e.target.value
                        })
                      }
                      placeholder="Enter role description, responsibilities, targets, and KPIs"
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac] resize-none"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-foreground mb-4">Permissions</h4>
                  <div className="bg-[#f5f7ff] rounded-lg border border-border p-4">
                    <div className="space-y-4">
                      {activeDepartments.map((department: any) => {

                        const deptKey = department.name
                          .toLowerCase()
                          .replace(/\s+/g, '_');

                        const permissions =
                          editingRole.permissions?.[deptKey] || {
                            view: false,
                            add: false,
                            edit: false,
                            delete: false
                          };

                        return (

                          <div
                            key={department.id}
                            className="bg-white rounded-lg border border-border p-4"
                          >

                            <div className="flex items-center justify-between mb-4">

                              <h5 className="text-sm font-semibold text-foreground">
                                {department.name}
                              </h5>

                              <button
                                type="button"
                                onClick={() => {

                                  const allEnabled =
                                    Object.values(permissions).every(v => v);

                                  setEditingRole({
                                    ...editingRole,

                                    permissions: {
                                      ...editingRole.permissions,

                                      [deptKey]: {
                                        view: !allEnabled,
                                        add: !allEnabled,
                                        edit: !allEnabled,
                                        delete: !allEnabled
                                      }
                                    }
                                  });

                                }}
                                className="text-xs px-3 py-1 rounded-lg border border-[#4b49ac] text-[#4b49ac] hover:bg-[#4b49ac]/10 transition-colors"
                              >
                                {Object.values(permissions).every(v => v)
                                  ? 'Deselect All'
                                  : 'Select All'}
                              </button>

                            </div>

                            <div className="grid grid-cols-4 gap-3">

                              {['view', 'add', 'edit', 'delete'].map((action) => (

                                <label
                                  key={action}
                                  className="flex items-center gap-2 text-sm cursor-pointer"
                                >

                                  <input
                                    type="checkbox"

                                    checked={permissions[action]}

                                    onChange={(e) => {

                                      setEditingRole({
                                        ...editingRole,

                                        permissions: {
                                          ...editingRole.permissions,

                                          [deptKey]: {
                                            ...permissions,

                                            [action]: e.target.checked
                                          }
                                        }
                                      });

                                    }}

                                    className="w-4 h-4 rounded border-border text-[#4b49ac] focus:ring-[#4b49ac]"
                                  />

                                  <span className="text-muted-foreground capitalize">
                                    {action}
                                  </span>

                                </label>

                              ))}

                            </div>

                          </div>

                        );

                      })}
                    </div>
                  </div>
                </div>

                {/* Menu Selection */}
                <div>
                  <h4 className="text-foreground mb-4">Assigned Menus</h4>
                  <div className="bg-[#f5f7ff] rounded-lg border border-border p-4">
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 border border-border rounded-lg bg-white">
                      {allMenus.map((menu) => (
                        <label key={menu.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingRole.menu_ids?.includes(menu.id)}
                            onChange={(e) => {
                              const currentIds = editingRole.menu_ids || [];
                              const updatedIds = e.target.checked
                                ? [...currentIds, menu.id]
                                : currentIds.filter((id: number) => id !== menu.id);
                              setEditingRole({ ...editingRole, menu_ids: updatedIds });
                            }}
                            className="w-4 h-4 rounded border-border text-[#4b49ac] focus:ring-[#4b49ac]"
                          />
                          <span className="text-sm text-foreground">{menu.title}</span>
                        </label>
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
                disabled={!editingRole?.role_name?.trim()}
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
                    Are you sure you want to delete the role <span className="font-semibold">"{roleToDelete.role_name}"</span>? This action cannot be undone.
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
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
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
