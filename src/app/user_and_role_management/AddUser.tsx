import { useState, useEffect } from 'react';
import {
  Users, UserPlus, Search, Edit2, Key, X, CheckCircle, Clock,
  AlertCircle, Activity, Lock, Filter, Eye, Mail, Phone, Calendar,
  Shield, MapPin, Briefcase, TrendingUp, Plane, DollarSign, BarChart3,
  Upload, Camera
} from 'lucide-react';
import { getActiveCountries, getActiveStatesByCountry, getActiveCitiesByState } from '../../api/location.api';
import { getActiveDepartments } from '../../api/department.api';
import { getActiveRoles } from '../../api/roles.api';

type UserStatus = 'ACTIVE' | 'IDLE' | 'INACTIVE';
type UserRole = 'ADMIN' | 'SALES' | 'OPERATIONS' | 'FINANCE' | 'GUEST_SUPPORT' | 'AI_AGENT';

interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastActive: string;
  phone?: string;
  joinDate?: string;
  reportingTo?: string;
  location?: string;
  profilePicture?: string;

  country_id?: number | string;
  state_id?: number | string;
  city_id?: number | string;
}

export function AddUser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const [allCountries, setAllCountries] = useState<any[]>([]);
  const [allStates, setAllStates] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);
  const [activeDepartments, setActiveDepartments] = useState<any[]>([]);
  const [activeRoles, setActiveRoles] = useState<any[]>([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    password: '',
    confirm_password: ''
  });

  const generatePassword = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';

    let generatedPassword = '';

    for (let i = 0; i < 10; i++) {
      generatedPassword += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }

    setPasswords({
      password: generatedPassword,
      confirm_password: generatedPassword
    });
  };
  
  useEffect(() => {
    fetchCountries();
    fetchDepartments();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await getActiveRoles();
      console.log('Active roles fetched:', res);
      if (res?.success) {
        // setActiveRoles(res.roles || []);
        setActiveRoles(res.data?.roles || []);
      } else {
        setActiveRoles([]);
      }
    } catch (error) {
      console.error(error);
      setActiveRoles([]);
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

  const fetchCountries = async () => {
    try {
      const res = await getActiveCountries();
      if (res?.success) {
        setAllCountries(res.data || []);
      } else {
        setAllCountries([]);
      }
    } catch (error) {
      console.error(error);
      setAllCountries([]);
    }
  };

  const fetchStates = async (
    countryId: number,
    resetCities: boolean = true
  ) => {

    try {

      const res = await getActiveStatesByCountry(countryId);

      if (res?.success) {
        setAllStates(res.data || []);
      } else {
        setAllStates([]);
      }

      if (resetCities) {
        setAllCities([]);
      }

    } catch (error) {

      console.error(error);

      setAllStates([]);

      if (resetCities) {
        setAllCities([]);
      }
    }
  };

  const fetchCities = async (stateId: number) => {
    try {
      const res = await getActiveCitiesByState(stateId);

      if (res?.success) {
        setAllCities(res.data || []);
      } else {
        setAllCities([]);
      }

    } catch (error) {
      console.error(error);
      setAllCities([]);
    }
  };

  const [userForm, setUserForm] = useState<any>({
    name: '',
    employeeId: '',
    joinDate: '',
    email: '',
    phone: '',
    country_id: '',
    state_id: '',
    city_id: '',
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);

    setUserForm({
      ...user,
      country_id: user.country_id || '',
      state_id: user.state_id || '',
      city_id: user.city_id || '',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      employeeId: 'EMP001',
      joinDate: '2024-01-15',
      reportingTo: 'Admin User',
      location: 'Mumbai, India',
      profilePicture: 'https://i.pravatar.cc/150?img=12',
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
      employeeId: 'EMP002',
      joinDate: '2024-02-01',
      reportingTo: 'Admin User',
      location: 'Bali, Indonesia',
      profilePicture: 'https://i.pravatar.cc/150?img=47',
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
      employeeId: 'EMP003',
      joinDate: '2024-03-10',
      reportingTo: 'Kirana Dewi',
      location: 'Jakarta, Indonesia',
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
      employeeId: 'EMP004',
      joinDate: '2023-12-01',
      reportingTo: 'Admin User',
      location: 'Delhi, India',
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
      employeeId: 'EMP005',
      joinDate: '2024-04-05',
      reportingTo: 'Ravi Mehta',
      location: 'Bangalore, India',
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
      employeeId: 'EMP006',
      joinDate: '2024-05-20',
      reportingTo: 'Ravi Mehta',
      location: 'Ubud, Indonesia',
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
      employeeId: 'EMP000',
      joinDate: '2023-10-01',
      reportingTo: 'Self',
      location: 'Mumbai, India',
      profilePicture: 'https://i.pravatar.cc/150?img=33',
    },
  ];

  const activityLogs = [
    { id: 1, user: 'Ravi', action: 'changed booking TR-0842', time: '5 mins ago' },
    { id: 2, user: 'Finance', action: 'approved payment ₹84,000', time: '15 mins ago' },
    { id: 3, user: 'AI Agent', action: 'sent 22 follow-ups', time: '1 hr ago' },
    { id: 4, user: 'Kirana', action: 'updated trip itinerary TR-0856', time: '2 hrs ago' },
    { id: 5, user: 'Priya', action: 'created new lead for Dubai package', time: '3 hrs ago' },
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

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
            <h2 className="text-foreground mb-1">User Management</h2>
            <p className="text-sm text-muted-foreground">Manage team members and their access</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users"
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
                    <p className="text-xs text-muted-foreground px-2 py-1">Filter by Role</p>
                    {['all', 'ADMIN', 'SALES', 'OPERATIONS', 'FINANCE', 'GUEST_SUPPORT'].map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setFilterRole(role);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-sidebar-accent transition-colors ${
                          filterRole === role ? 'bg-[#4b49ac]/10 text-[#4b49ac]' : 'text-foreground'
                        }`}
                      >
                        {role === 'all' ? 'All Roles' : getRoleDisplayName(role as UserRole)}
                      </button>
                    ))}
                    <div className="border-t border-border my-2"></div>
                    <p className="text-xs text-muted-foreground px-2 py-1">Filter by Status</p>
                    {['all', 'ACTIVE', 'IDLE', 'INACTIVE'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-sidebar-accent transition-colors ${
                          filterStatus === status ? 'bg-[#4b49ac]/10 text-[#4b49ac]' : 'text-foreground'
                        }`}
                      >
                        {status === 'all' ? 'All Status' : status.charAt(0) + status.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setShowAddUserModal(true);
                setProfilePreview(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg hover:bg-[#4b49ac]/90 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm">Add User</span>
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

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Idle Users</p>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{users.filter(u => u.status === 'IDLE').length}</p>
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

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-border">
          <h3 className="text-foreground">Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sidebar-accent">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Last Active</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-sidebar-accent transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4b49ac] to-[#7978e9] flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs w-fit ${getRoleBadgeColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{user.department}</span>
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
                        onClick={() => setViewingUser(user)}
                        className="p-1.5 rounded hover:bg-green-100 transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setProfilePreview(null);
                        }}
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

      {/* Activity Logs */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-6">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                  setProfilePreview(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Profile Picture Section */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2 pb-2 border-b border-border">
                    <Camera className="w-4 h-4 text-[#4b49ac]" />
                    Profile Picture
                  </h4>
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      {profilePreview || selectedUser?.profilePicture ? (
                        <>
                          <img
                            src={profilePreview || selectedUser?.profilePicture}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-border"
                          />
                          <button
                            onClick={() => setProfilePreview(null)}
                            className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                            title="Remove picture"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4b49ac] to-[#7978e9] flex items-center justify-center text-white text-3xl font-semibold border-4 border-border">
                          {selectedUser?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block">
                        <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg hover:border-[#4b49ac] transition-colors cursor-pointer bg-[#f5f7ff]">
                          <Upload className="w-4 h-4 text-[#4b49ac]" />
                          <span className="text-sm text-foreground">Upload Profile Picture</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        Recommended: Square image, at least 400x400px. Max size: 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Information Section */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2 pb-2 border-b border-border">
                    <Users className="w-4 h-4 text-[#4b49ac]" />
                    Basic Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">

                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          First Name <span className="text-red-600">*</span>
                        </label>

                        <input
                          type="text"
                          defaultValue={selectedUser?.first_name}
                          placeholder="Enter First Name"
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Last Name <span className="text-red-600">*</span>
                        </label>

                        <input
                          type="text"
                          defaultValue={selectedUser?.last_name}
                          placeholder="Enter Last Name"
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Join Date
                        </label>
                        <input
                          type="date"
                          defaultValue={selectedUser?.joinDate}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Select Country
                        </label>

                        <select
                          value={userForm.country_id}
                          onChange={(e) => {
                            const countryId = e.target.value;

                            setUserForm({
                              ...userForm,
                              country_id: countryId,
                              state_id: '',
                              city_id: ''
                            });

                            if (countryId) {
                              fetchStates(Number(countryId));
                            } else {
                              setAllStates([]);
                              setAllCities([]);
                            }
                          }}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        >
                          <option value="">Select Country</option>

                          {allCountries.length > 0 ? (
                            allCountries.map((country: any) => (
                              <option key={country.id} value={country.id}>
                                {country.name}
                              </option>
                            ))
                          ) : (
                            <option value="">No countries available</option>
                          )}
                        </select>

                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Select State
                        </label>
                        <select
                          value={userForm.state_id}
                          onChange={(e) => {
                            const stateId = e.target.value;

                            setUserForm({
                              ...userForm,
                              state_id: stateId,
                              city_id: ''
                            });

                            if (stateId) {
                              fetchCities(Number(stateId));
                            } else {
                              setAllCities([]);
                            }
                          }}
                          disabled={!userForm.country_id}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac] disabled:bg-gray-100"
                        >
                          <option value="">Select State</option>

                          {allStates.length > 0 ? (
                            allStates.map((state: any) => (
                              <option key={state.id} value={state.id}>
                                {state.name}
                              </option>
                            ))
                          ) : (
                            <option value="">No states available</option>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Select City
                        </label>
                        <select
                          value={userForm.city_id}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              city_id: e.target.value
                            })
                          }
                          disabled={!userForm.state_id}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac] disabled:bg-gray-100"
                        >
                          <option value="">Select City</option>

                          {allCities.length > 0 ? (
                            allCities.map((city: any) => (
                              <option key={city.id} value={city.id}>
                                {city.name}
                              </option>
                            ))
                          ) : (
                            <option value="">No cities available</option>
                          )}
                        </select>
                      </div>
                    </div>


                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2 pb-2 border-b border-border">
                    <Mail className="w-4 h-4 text-[#4b49ac]" />
                    Contact Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="email"
                          defaultValue={selectedUser?.email}
                          placeholder="Enter email address"
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          defaultValue={selectedUser?.phone}
                          placeholder="Enter phone number"
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role & Department Section */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2 pb-2 border-b border-border">
                    <Briefcase className="w-4 h-4 text-[#4b49ac]" />
                    Role & Department
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Department <span className="text-red-600">*</span>
                        </label>
                        <select
                          defaultValue={selectedUser?.department}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        >
                          <option value="">Select Department</option>
                          {activeDepartments.map((dept) => (
                            <option key={dept.id} value={dept.name}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Role <span className="text-red-600">*</span>
                        </label>
                        <select
                          defaultValue={selectedUser?.role}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        >
                          <option value="">Select Role</option>
                          {activeRoles.map((role) => (
                            console.log('Active role:', role),
                            <option key={role.id} value={role.role_name}>
                              {role.role_name}
                              {/* {getRoleDisplayName(role.name as UserRole)} */}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Password <span className="text-red-600">*</span>
                        </label>

                        <div className="relative">

                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwords.password}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                password: e.target.value
                              })
                            }
                            placeholder="Enter password"
                            className="w-full px-3 py-2 pr-20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                          />

                          {/* Eye Button */}
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500"
                          >
                            {showPassword ? '🙈' : '👁'}
                          </button>

                          {/* Generate */}
                          <button
                            type="button"
                            onClick={generatePassword}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-[#4b49ac] text-white px-2 py-1 rounded"
                          >
                            Auto
                          </button>

                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>

                        <label className="block text-sm font-medium text-foreground mb-2">
                          Confirm Password <span className="text-red-600">*</span>
                        </label>

                        <div className="relative">

                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwords.confirm_password}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                confirm_password: e.target.value
                              })
                            }
                            placeholder="Confirm password"
                            className="w-full px-3 py-2 pr-12 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                          />

                          {/* Eye Button */}
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          >
                            {showConfirmPassword ? '🙈' : '👁'}
                          </button>

                        </div>

                        {/* Password Match */}
                        {passwords.confirm_password &&
                          passwords.password !== passwords.confirm_password && (
                            <p className="text-red-500 text-xs mt-1">
                              Passwords do not match
                            </p>
                          )}

                      </div>

                    </div>

                    <div className="grid grid-cols-1 gap-4">
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

              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-border p-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setSelectedUser(null);
                  setProfilePreview(null);
                }}
                className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setSelectedUser(null);
                  setProfilePreview(null);
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

      {/* View User Profile Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header with gradient background */}
            <div className="sticky top-0 bg-gradient-to-r from-[#4b49ac] to-[#7978e9] text-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {viewingUser.profilePicture ? (
                    <img
                      src={viewingUser.profilePicture}
                      alt={viewingUser.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-semibold border-4 border-white/10">
                      {viewingUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{viewingUser.name}</h3>
                    <p className="text-white/80 text-sm">{viewingUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingUser(null)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  viewingUser.status === 'ACTIVE'
                    ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                    : viewingUser.status === 'IDLE'
                    ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30'
                    : 'bg-red-500/20 text-red-100 border border-red-400/30'
                }`}>
                  {getStatusIcon(viewingUser.status)}
                  {viewingUser.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(viewingUser.role)}`}>
                  {getRoleDisplayName(viewingUser.role)}
                </span>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#4b49ac]" />
                    Basic Information
                  </h4>
                  <div className="space-y-3">
                    {viewingUser.employeeId && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Employee ID</p>
                        <p className="text-sm text-foreground font-medium">{viewingUser.employeeId}</p>
                      </div>
                    )}
                    {viewingUser.joinDate && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Join Date</p>
                        <p className="text-sm text-foreground font-medium">
                          {new Date(viewingUser.joinDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                    {viewingUser.location && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Location</p>
                        <p className="text-sm text-foreground font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                          {viewingUser.location}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-[#f5f7ff] rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#4b49ac]" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Email Address</p>
                        <p className="text-sm text-foreground font-medium">{viewingUser.email}</p>
                      </div>
                    </div>
                    {viewingUser.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Phone Number</p>
                          <p className="text-sm text-foreground font-medium">{viewingUser.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Role & Department */}
                <div className="bg-white rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#4b49ac]" />
                    Role & Department
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Department</p>
                      <p className="text-sm text-foreground font-medium">{viewingUser.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Role</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${getRoleBadgeColor(viewingUser.role)}`}>
                        {getRoleDisplayName(viewingUser.role)}
                      </span>
                    </div>
                    {viewingUser.reportingTo && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Reporting To</p>
                        <p className="text-sm text-foreground font-medium">{viewingUser.reportingTo}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Status */}
                <div className="bg-white rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#4b49ac]" />
                    Activity Status
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Current Status</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(viewingUser.status)}`}>
                        {getStatusIcon(viewingUser.status)}
                        {viewingUser.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last Active</p>
                      <p className="text-sm text-foreground font-medium">{viewingUser.lastActive}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions Summary */}
              <div className="bg-white rounded-lg border border-border p-4 mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#4b49ac]" />
                  Permissions & Access
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Sales CRM', granted: viewingUser.role === 'ADMIN' || viewingUser.role === 'SALES' },
                    { name: 'Trip Management', granted: viewingUser.role === 'ADMIN' || viewingUser.role === 'OPERATIONS' || viewingUser.role === 'SALES' },
                    { name: 'Reservations', granted: viewingUser.role === 'ADMIN' || viewingUser.role === 'OPERATIONS' || viewingUser.role === 'GUEST_SUPPORT' },
                    { name: 'Payments', granted: viewingUser.role === 'ADMIN' || viewingUser.role === 'FINANCE' },
                    { name: 'Analytics', granted: viewingUser.role === 'ADMIN' || viewingUser.role === 'FINANCE' },
                    { name: 'User Management', granted: viewingUser.role === 'ADMIN' },
                  ].map((permission) => (
                    <div
                      key={permission.name}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        permission.granted
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {permission.granted ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`text-xs font-medium ${
                        permission.granted ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {permission.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#4b49ac]" />
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  {activityLogs
                    .filter(log => log.user === viewingUser.name.split(' ')[0])
                    .slice(0, 3)
                    .map((log) => (
                      <div key={log.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#4b49ac] mt-1.5"></div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{log.action}</p>
                          <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
                        </div>
                      </div>
                    ))}
                  {activityLogs.filter(log => log.user === viewingUser.name.split(' ')[0]).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-border p-4 flex gap-3 justify-end">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedUser(viewingUser);
                  setViewingUser(null);
                  setProfilePreview(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#4b49ac] text-white hover:bg-[#4b49ac]/90 transition-colors flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
