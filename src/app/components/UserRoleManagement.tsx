import { useState, useEffect } from 'react';
import {
  Users, Shield, UserPlus, Search, Edit2, Key, X,
  CheckCircle, Clock, AlertCircle, Settings, Lock,
  Eye, Activity, Briefcase, DollarSign, TrendingUp
} from 'lucide-react';
import { getRoles } from '../../api/roles.api';

type UserStatus = 'ACTIVE' | 'IDLE' | 'INACTIVE';
type UserRole = 'ADMIN' | 'SALES' | 'OPERATIONS' | 'FINANCE' | 'GUEST_SUPPORT' | 'AI_AGENT';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastActive: string;
  phone?: string;
}

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

export function UserRoleManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleName>('Sales Executive');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [apiRoles, setApiRoles] = useState<any[]>([]);

  useEffect(() => {
    getRoles()
      .then((res) => {
        const roles = Array.isArray(res.data) ? res.data : (res.data?.roles || res.roles || []);
        setApiRoles(roles);
      })
      .catch(() => setApiRoles([]));
  }, []);

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

  const users: User[] = [
    {
      id: 1,
      name: 'Ravi Mehta',
      email: 'ravi@travelops.com',
      role: 'SALES',
      department: 'Sales',
      status: 'ACTIVE',
      lastActive: '5 mins ago',
      phone: '+91 98765 43210',
    },
    {
      id: 2,
      name: 'Kirana Dewi',
      email: 'kirana@travelops.com',
      role: 'OPERATIONS',
      department: 'Operations',
      status: 'ACTIVE',
      lastActive: '10 mins ago',
      phone: '+62 812 3456 7890',
    },
    {
      id: 3,
      name: 'Sari',
      email: 'sari@travelops.com',
      role: 'GUEST_SUPPORT',
      department: 'Guest Experience',
      status: 'IDLE',
      lastActive: '2 hrs ago',
      phone: '+62 813 9876 5432',
    },
    {
      id: 4,
      name: 'Finance Team',
      email: 'finance@travelops.com',
      role: 'FINANCE',
      department: 'Finance',
      status: 'ACTIVE',
      lastActive: '1 hr ago',
      phone: '+91 98123 45678',
    },
    {
      id: 5,
      name: 'Priya Sharma',
      email: 'priya@travelops.com',
      role: 'SALES',
      department: 'Sales',
      status: 'ACTIVE',
      lastActive: '20 mins ago',
      phone: '+91 97654 32109',
    },
    {
      id: 6,
      name: 'Dewa Putu',
      email: 'dewa@travelops.com',
      role: 'SALES',
      department: 'Sales',
      status: 'ACTIVE',
      lastActive: '30 mins ago',
      phone: '+62 814 5678 9012',
    },
    {
      id: 7,
      name: 'Admin User',
      email: 'admin@travelops.com',
      role: 'ADMIN',
      department: 'Management',
      status: 'ACTIVE',
      lastActive: 'Just now',
      phone: '+91 98765 00000',
    },
  ];

  const initialRolePermissions: Record<RoleName, RolePermissions> = {
    'Admin': {
      salesCRM: { view: true, edit: true, delete: true, approve: true },
      tripManagement: { view: true, edit: true, delete: true, approve: true },
      reservations: { view: true, edit: true, delete: true, approve: true },
      payments: { view: true, edit: true, delete: true, approve: true },
      analytics: { view: true, edit: true, delete: true, approve: true },
    },
    'Sales Executive': {
      salesCRM: { view: true, edit: true, delete: false, approve: false },
      tripManagement: { view: true, edit: true, delete: false, approve: false },
      reservations: { view: true, edit: true, delete: false, approve: false },
      payments: { view: true, edit: false, delete: false, approve: false },
      analytics: { view: true, edit: false, delete: false, approve: false },
    },
    'Operations Manager': {
      salesCRM: { view: true, edit: false, delete: false, approve: false },
      tripManagement: { view: true, edit: true, delete: false, approve: true },
      reservations: { view: true, edit: true, delete: false, approve: true },
      payments: { view: true, edit: false, delete: false, approve: false },
      analytics: { view: true, edit: false, delete: false, approve: false },
    },
    'Finance': {
      salesCRM: { view: true, edit: false, delete: false, approve: false },
      tripManagement: { view: true, edit: false, delete: false, approve: false },
      reservations: { view: true, edit: false, delete: false, approve: false },
      payments: { view: true, edit: true, delete: false, approve: true },
      analytics: { view: true, edit: false, delete: false, approve: false },
    },
    'Guest Support': {
      salesCRM: { view: true, edit: false, delete: false, approve: false },
      tripManagement: { view: true, edit: false, delete: false, approve: false },
      reservations: { view: true, edit: true, delete: false, approve: false },
      payments: { view: false, edit: false, delete: false, approve: false },
      analytics: { view: false, edit: false, delete: false, approve: false },
    },
    'AI Agent': {
      salesCRM: { view: true, edit: true, delete: false, approve: false },
      tripManagement: { view: true, edit: false, delete: false, approve: false },
      reservations: { view: true, edit: false, delete: false, approve: false },
      payments: { view: false, edit: false, delete: false, approve: false },
      analytics: { view: true, edit: false, delete: false, approve: false },
    },
  };

  const [rolePermissions, setRolePermissions] = useState<Record<RoleName, RolePermissions>>(initialRolePermissions);

  const activityLogs = [
    { id: 1, user: 'Ravi', action: 'changed booking TR-0842', time: '5 mins ago' },
    { id: 2, user: 'Finance', action: 'approved payment ₹84,000', time: '15 mins ago' },
    { id: 3, user: 'AI Agent', action: 'sent 22 follow-ups', time: '1 hr ago' },
    { id: 4, user: 'Kirana', action: 'updated trip itinerary TR-0856', time: '2 hrs ago' },
    { id: 5, user: 'Priya', action: 'created new lead for Dubai package', time: '3 hrs ago' },
  ];

  const roleTemplates = [
    { name: 'Sales Agent', description: 'Perfect for sales team members', icon: TrendingUp },
    { name: 'Ops Executive', description: 'Operations and trip management', icon: Settings },
    { name: 'Finance Controller', description: 'Payments and accounting', icon: DollarSign },
    { name: 'Admin', description: 'Full system access', icon: Shield },
  ];

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'IDLE':
        return 'bg-yellow-100 text-yellow-700';
      case 'INACTIVE':
        return 'bg-red-100 text-red-700';
    }
  };

  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-3 h-3" />;
      case 'IDLE':
        return <Clock className="w-3 h-3" />;
      case 'INACTIVE':
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-600 text-white';
      case 'SALES':
        return 'bg-blue-600 text-white';
      case 'OPERATIONS':
        return 'bg-orange-600 text-white';
      case 'FINANCE':
        return 'bg-green-600 text-white';
      case 'GUEST_SUPPORT':
        return 'bg-pink-600 text-white';
      case 'AI_AGENT':
        return 'bg-gray-700 text-white';
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'Admin';
      case 'SALES':
        return 'Sales';
      case 'OPERATIONS':
        return 'Operations';
      case 'FINANCE':
        return 'Finance';
      case 'GUEST_SUPPORT':
        return 'Guest Support';
      case 'AI_AGENT':
        return 'AI Agent';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    activeToday: users.filter(u => u.status === 'ACTIVE').length,
    totalRoles: 6,
    admins: users.filter(u => u.role === 'ADMIN').length,
  };

  return (
    <div className="flex-1 bg-[#f5f7ff] p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-foreground mb-1">User & Role Management</h2>
            <p className="text-sm text-muted-foreground">Manage team access, permissions, and responsibilities</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search user"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg hover:bg-[#4b49ac]/90 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm">Add User</span>
            </button>
            <button
              onClick={() => setShowCreateRoleModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[#4b49ac] text-[#4b49ac] rounded-lg hover:bg-[#4b49ac]/10 transition-colors"
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
            <p className="text-sm text-muted-foreground">Total Users</p>
            <Users className="w-5 h-5 text-[#4b49ac]" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.totalUsers}</p>
          <p className="text-xs text-green-600">Active</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Roles Created</p>
            <Shield className="w-5 h-5 text-[#7978e9]" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.totalRoles}</p>
          <p className="text-xs text-muted-foreground">Roles</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active Today</p>
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.activeToday}</p>
          <p className="text-xs text-muted-foreground">Users</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Admins</p>
            <Lock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.admins}</p>
          <p className="text-xs text-muted-foreground">Users</p>
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 mb-6 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-100">
          <Activity className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground mb-1">🤖 AI-Based Access Suggestions</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Suggested Role: <span className="text-blue-600 font-medium">Sales Executive</span> for Ravi (based on activity)
          </p>
          <p className="text-sm text-muted-foreground">
            Finance Team accessing reports frequently — <span className="text-orange-600 font-medium">recommend upgrade to Analytics access</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Users Table */}
        <div className="col-span-7 bg-white rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-foreground">Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sidebar-accent">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Last Active</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-sidebar-accent transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded text-xs w-fit ${getRoleBadgeColor(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                        <span className="text-xs text-muted-foreground">{user.department}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded text-xs ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.lastActive}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 rounded hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-purple-100 transition-colors"
                          title="Change Role"
                        >
                          <Key className="w-4 h-4 text-purple-600" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-red-100 transition-colors"
                          title="Deactivate"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role & Permissions Panel */}
        <div className="col-span-5 bg-white rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-foreground">Role & Permissions</h3>
          </div>
          <div className="grid grid-cols-5 h-[500px]">
            {/* Role List */}
            <div className="col-span-2 border-r border-border overflow-y-auto">
              {(['Admin', 'Sales Executive', 'Operations Manager', 'Finance', 'Guest Support', 'AI Agent'] as RoleName[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors border-b border-border ${
                    selectedRole === role
                      ? 'bg-[#4b49ac] text-white'
                      : 'hover:bg-sidebar-accent text-foreground'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Permissions Matrix */}
            <div className="col-span-3 p-4 overflow-y-auto">
              <div className="space-y-4">
                {Object.entries(rolePermissions[selectedRole]).map(([module, permissions]) => (
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
                            onChange={(e) => {
                              setRolePermissions({
                                ...rolePermissions,
                                [selectedRole]: {
                                  ...rolePermissions[selectedRole],
                                  [module]: {
                                    ...rolePermissions[selectedRole][module as keyof RolePermissions],
                                    [action]: e.target.checked
                                  }
                                }
                              });
                            }}
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

      {/* Activity Logs */}
      <div className="mt-6 bg-white rounded-lg border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-[#4b49ac]" />
          <h3 className="text-foreground">Activity Logs</h3>
        </div>
        <div className="space-y-3">
          {activityLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors">
              <div className="w-2 h-2 rounded-full bg-[#4b49ac] mt-1.5"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{log.user}</span> {log.action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {(showAddUserModal || selectedUser) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowAddUserModal(false); setSelectedUser(null); }}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-foreground">{selectedUser ? 'Edit User' : 'Add New User'}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedUser ? 'Update user details and permissions' : 'Create a new team member account'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setSelectedUser(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedUser?.name}
                      placeholder="e.g., John Doe"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      defaultValue={selectedUser?.email}
                      placeholder="john@travelops.com"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue={selectedUser?.phone}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Department <span className="text-red-600">*</span>
                    </label>
                    <select
                      defaultValue={selectedUser?.department}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    >
                      <option value="">Select Department</option>
                      <option value="Sales">Sales</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                      <option value="Guest Experience">Guest Experience</option>
                      <option value="Management">Management</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Role <span className="text-red-600">*</span>
                    </label>
                    <select
                      defaultValue={selectedUser?.role}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    >
                      <option value="">Select Role</option>
                      {apiRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.role_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Status
                    </label>
                    <select
                      defaultValue={selectedUser?.status || 'ACTIVE'}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="IDLE">Idle</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-border p-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setSelectedUser(null);
                }}
                className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setSelectedUser(null);
                }}
                className="px-6 py-2.5 rounded-lg bg-[#4b49ac] text-white hover:bg-[#4b49ac]/90 transition-colors flex items-center gap-2"
              >
                {selectedUser ? (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Update User
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Add User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateRoleModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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
                {/* Role Details */}
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

                {/* Permissions Section */}
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

                {/* Permission Summary */}
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
                onClick={() => {
                  if (newRole.name.trim()) {
                    // Here you would save the role to your backend/state
                    alert(`Role "${newRole.name}" created successfully!`);
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
                  }
                }}
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
    </div>
  );
}
