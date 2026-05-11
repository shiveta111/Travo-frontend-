import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Users, UserPlus, Search, Edit2, X, CheckCircle, Clock,
  AlertCircle, Activity, Lock, Filter, Eye, Mail, Phone, Calendar,
  MapPin, Briefcase, Upload
} from 'lucide-react';
import { getActiveCountries, getActiveStatesByCountry, getActiveCitiesByState } from '../../api/location.api';
import { getActiveDepartments } from '../../api/department.api';
import { getRoles } from '../../api/roles.api';
import { getUsers, createUser, updateUser, uploadProfilePicture, checkUsernameAvailability, generateUsername } from '../../api/user.api';

type UserStatus = 'ACTIVE' | 'IDLE' | 'INACTIVE';

interface User {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: string;
  department: string;
  status: UserStatus;
  lastActive: string;
  username?: string;
  secondary_email?: string;
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
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [filterRole, setFilterRole] = useState<number>(0);
  const [hoveredRoleId, setHoveredRoleId] = useState<number | null>(null);
  const [roleUsersCache, setRoleUsersCache] = useState<Record<number, User[]>>({});
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
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
    fetchUsers(0);
  }, []);

  const normalizeUsers = (res: any): User[] => {
    const data = Array.isArray(res.data) ? res.data : (res.data?.users || res.users || []);
    return data.map((u: any) => {
      const locationParts = [u.city_name, u.state_name, u.country_name].filter(Boolean);
      return {
        ...u,
        username: u.username || u.user_name || '',
        secondary_email: u.secondary_email || u.secondaryEmail || '',
        name: u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
        role: u.role_name || u.role || '',
        status: (u.status || 'ACTIVE').toUpperCase() as UserStatus,
        lastActive: u.last_active || u.lastActive || '-',
        department: u.department_name || u.department || '-',
        profilePicture: u.profile_picture || u.profilePicture || '',
        joinDate: u.join_date || u.joinDate || '',
        location: locationParts.length > 0 ? locationParts.join(', ') : (u.location || ''),
        country_id: u.country_id || u.country || '',
        state_id: u.state_id || u.state || '',
        city_id: u.city_id || u.city || '',
      };
    });
  };

  const fetchUsers = async (roleId: number) => {
    setUsersLoading(true);
    try {
      const res = await getUsers(roleId);
      const normalized = normalizeUsers(res);
      setUsers(normalized);
      setRoleUsersCache(prev => ({ ...prev, [roleId]: normalized }));
    } catch {
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      const roles = Array.isArray(res.data) ? res.data : (res.data?.roles || res.roles || []);
      setActiveRoles(roles);
    } catch {
      setActiveRoles([]);
    }
  };

  useEffect(() => {
    if (activeRoles.length === 0) return;
    activeRoles.forEach(async (role: any) => {
      if (roleUsersCache[role.id] !== undefined) return;
      try {
        const res = await getUsers(role.id);
        const normalized = normalizeUsers(res);
        setRoleUsersCache(prev => ({ ...prev, [role.id]: normalized }));
      } catch { /* silent — hover preview just won't show */ }
    });
  }, [activeRoles]);

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

  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<{ available: boolean | null; checking: boolean }>({ available: null, checking: false });

  type ActivityComment = { id: number; text: string; date: string };
  const [activityComments, setActivityComments] = useState<Record<number, ActivityComment[]>>(() => {
    try { return JSON.parse(localStorage.getItem('userActivityComments') || '{}'); } catch { return {}; }
  });
  const [newComment, setNewComment] = useState('');

  const addComment = (userId: number, text: string) => {
    if (!text.trim()) return;
    const comment: ActivityComment = { id: Date.now(), text: text.trim(), date: new Date().toISOString() };
    const updated = { ...activityComments, [userId]: [...(activityComments[userId] || []), comment] };
    setActivityComments(updated);
    localStorage.setItem('userActivityComments', JSON.stringify(updated));
  };


  const getProfileImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;

    let normalizedPath = path.trim().replace(/\\/g, '/');

    // Convert backend file system paths to a web-accessible uploads path
    const uploadsIndex = normalizedPath.toLowerCase().indexOf('/uploads/');
    if (uploadsIndex !== -1) {
      normalizedPath = normalizedPath.slice(uploadsIndex + 1);
    }

    normalizedPath = normalizedPath.replace(/^\/+/, '');
    if (normalizedPath.toLowerCase().startsWith('uploads/')) {
      normalizedPath = normalizedPath.slice('uploads/'.length);
    }

    const uploadsUrl = ((import.meta as any).env?.VITE_UPLOADS_URL as string) || '';
    const apiUrl = ((import.meta as any).env?.VITE_API_URL as string) || '';

    if (uploadsUrl) {
      const cleanedUploadsUrl = uploadsUrl.replace(/\/+$/, '');
      return `${cleanedUploadsUrl}/${normalizedPath}`;
    }

    if (apiUrl && !apiUrl.startsWith('/')) {
      const cleanedApiUrl = apiUrl.replace(/\/+$/, '').replace(/\/api$/i, '');
      return `${cleanedApiUrl}/uploads/${normalizedPath}`;
    }

    // Fallback to proxied uploads URL in dev
    return `/uploads/${normalizedPath}`;
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validateForm = (isEdit = false): string | null => {
    if (!newUserForm.first_name.trim()) return 'First name is required.';
    if (!newUserForm.last_name.trim()) return 'Last name is required.';
    if (!newUserForm.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserForm.email)) return 'Enter a valid email address.';
    if (newUserForm.secondary_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserForm.secondary_email)) return 'Enter a valid secondary email address.';
    if (newUserForm.phone && !/^\+?[\d\s\-()]{7,15}$/.test(newUserForm.phone)) return 'Enter a valid phone number.';
    if (!newUserForm.department) return 'Department is required.';
    if (!newUserForm.role) return 'Role is required.';
    if (!isEdit && !passwords.password) return 'Password is required.';
    if (passwords.password && passwords.password.length < 8) return 'Password must be at least 8 characters.';
    if (passwords.password && passwords.password !== passwords.confirm_password) return 'Passwords do not match.';
    return null;
  };

  const defaultNewUserForm = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    secondary_email: '',
    phone: '',
    join_date: '',
    department: '',
    role: '',
    status: 'active',
  };
  const [newUserForm, setNewUserForm] = useState<any>(defaultNewUserForm);

  const handleNewUserChange = (field: string, value: string) => {
    setNewUserForm((prev: any) => ({ ...prev, [field]: value }));
    if (field === 'username') {
      if (value.trim().length >= 3) {
        debouncedCheckUsername(value.trim());
      } else {
        setUsernameStatus({ available: null, checking: false });
      }
    }
  };

  const handleGenerateUsername = async () => {
    if (!newUserForm.first_name || !newUserForm.last_name) {
      showToast('Please enter first and last name first', 'error');
      return;
    }
    try {
      const res = await generateUsername(newUserForm.first_name, newUserForm.last_name);
      if (res?.success) {
        handleNewUserChange('username', res.data);
        setUsernameStatus({ available: true, checking: false });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkUsernameTimer = useRef<any>(null);
  const debouncedCheckUsername = (username: string) => {
    if (checkUsernameTimer.current) clearTimeout(checkUsernameTimer.current);
    setUsernameStatus(prev => ({ ...prev, checking: true }));
    checkUsernameTimer.current = setTimeout(async () => {
      try {
        const res = await checkUsernameAvailability(username);
        setUsernameStatus({ available: res.data.available, checking: false });
      } catch (error) {
        setUsernameStatus({ available: null, checking: false });
      }
    }, 500);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  };


  const resetForm = () => {
    setNewUserForm(defaultNewUserForm);
    setPasswords({ password: '', confirm_password: '' });
    setProfilePreview(null);
    setProfileFile(null);
    setUserForm({ country_id: '', state_id: '', city_id: '' });
    setAllStates([]);
    setAllCities([]);
    setFormError('');
  };

  const handleCreateUser = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError('');
    setFormSubmitting(true);
    try {
      let uploadedPicture = '';
      if (profileFile) {
        try {
          const uploadRes = await uploadProfilePicture(profileFile);
          uploadedPicture = uploadRes?.data?.path || uploadRes?.path || uploadRes?.url || '';
        } catch {
          // non-fatal — proceed without picture
        }
      }

      const payload = {
        username: newUserForm.username.trim(),
        first_name: newUserForm.first_name.trim(),
        last_name: newUserForm.last_name.trim(),
        email: newUserForm.email.trim(),
        secondary_email: newUserForm.secondary_email.trim(),
        phone: newUserForm.phone.trim(),
        password: passwords.password,
        confirm_password: passwords.confirm_password,
        profile_picture: uploadedPicture,
        join_date: formatDate(newUserForm.join_date),
        country: Number(userForm.country_id) || 0,
        state: Number(userForm.state_id) || 0,
        city: Number(userForm.city_id) || 0,
        department: Number(newUserForm.department),
        role_id: Number(newUserForm.role),
        status: newUserForm.status,
      };
      const res = await createUser(payload);
      if (res?.success) {
        resetForm();
        setShowAddUserModal(false);
        fetchUsers(filterRole);
        showToast('User created successfully!', 'success');
      } else {
        setFormError(res?.message || res?.error || 'Failed to create user. Please try again.');
      }
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdateUser = async () => {
    const validationError = validateForm(true);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError('');
    setFormSubmitting(true);
    try {
      let uploadedPicture = (selectedUser as any)?.profile_picture || selectedUser?.profilePicture || '';
      if (profileFile) {
        try {
          const uploadRes = await uploadProfilePicture(profileFile);
          uploadedPicture =
            uploadRes?.data?.path ||
            uploadRes?.data?.url ||
            uploadRes?.data?.filename ||
            uploadRes?.path ||
            uploadRes?.url ||
            uploadRes?.filename ||
            '';
        } catch {
          // non-fatal
        }
      }

      const payload = {
        username: newUserForm.username.trim(),
        first_name: newUserForm.first_name.trim(),
        last_name: newUserForm.last_name.trim(),
        email: newUserForm.email.trim(),
        secondary_email: newUserForm.secondary_email.trim(),
        phone: newUserForm.phone.trim(),
        password: passwords.password,
        confirm_password: passwords.confirm_password,
        profile_picture: uploadedPicture,
        join_date: formatDate(newUserForm.join_date),
        country: Number(userForm.country_id) || 0,
        state: Number(userForm.state_id) || 0,
        city: Number(userForm.city_id) || 0,
        department: Number(newUserForm.department),
        role_id: Number(newUserForm.role),
        status: newUserForm.status,
      };

      const res = await updateUser(selectedUser!.id, payload);
      if (res?.success) {
        resetForm();
        setSelectedUser(null);
        fetchUsers(filterRole);
        showToast('User updated successfully!', 'success');
      } else {
        setFormError(res?.message || res?.error || 'Failed to update user. Please try again.');
      }
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const [userForm, setUserForm] = useState<any>({
    country_id: '',
    state_id: '',
    city_id: '',
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setProfilePreview((user as any).profile_picture || user.profilePicture || null);
    setProfileFile(null);
    setFormError('');
    setPasswords({ password: '', confirm_password: '' });

    setNewUserForm({
      username: user.username || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      secondary_email: (user as any).secondary_email || user.secondary_email || '',
      phone: user.phone || '',
      join_date: (user as any).join_date || user.joinDate || '',
      department: String((user as any).department_id || ''),
      role: String((user as any).role_id || ''),
      status: user.status?.toLowerCase() || 'active',
    });

    const countryId = Number((user as any).country_id || (user as any).country || 0);
    const stateId = Number((user as any).state_id || (user as any).state || 0);
    const cityId = Number((user as any).city_id || (user as any).city || 0);

    setUserForm({
      country_id: countryId ? String(countryId) : '',
      state_id: stateId ? String(stateId) : '',
      city_id: cityId ? String(cityId) : '',
    });

    if (countryId) fetchStates(countryId, false);
    if (stateId) fetchCities(stateId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };




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

  const getRoleBadgeColor = (role: string): string => {
    const r = (role || '').toUpperCase().replace(/[\s-]/g, '_');
    if (r.includes('ADMIN')) return 'bg-purple-600 text-white';
    if (r.includes('SALES')) return 'bg-blue-600 text-white';
    if (r.includes('OPERAT')) return 'bg-orange-600 text-white';
    if (r.includes('FINANC')) return 'bg-green-600 text-white';
    if (r.includes('GUEST') || r.includes('SUPPORT')) return 'bg-pink-600 text-white';
    if (r.includes('AI') || r.includes('AGENT')) return 'bg-gray-700 text-white';
    return 'bg-indigo-600 text-white';
  };

  const getRoleDisplayName = (role: string): string => role || '-';

  const enrichUser = (user: User): User => {
    const deptRaw = (user as any).department_id ?? user.department;
    const roleRaw = (user as any).role_id ?? user.role;
    const dept = activeDepartments.find((d: any) =>
      String(d.id) === String(deptRaw) || d.name === user.department
    );
    const rol = activeRoles.find((r: any) =>
      String(r.id) === String(roleRaw) || r.role_name === user.role
    );
    return {
      ...user,
      department: dept?.name || user.department,
      role: rol?.role_name || user.role,
    };
  };

  const filteredUsers = useMemo(() => {
    const base = hoveredRoleId !== null
      ? (roleUsersCache[hoveredRoleId] ?? users)
      : users;
    return base
      .map(enrichUser)
      .filter(user => {
        const matchesSearch =
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesStatus;
      });
  }, [users, hoveredRoleId, roleUsersCache, activeDepartments, activeRoles, searchQuery, filterStatus]);

  const previewLabel = hoveredRoleId !== null
    ? (hoveredRoleId === 0 ? 'All Roles' : activeRoles.find((r: any) => r.id === hoveredRoleId)?.role_name)
    : null;

  const stats = {
    totalUsers: users.length,
    activeToday: users.filter(u => u.status === 'ACTIVE').length,
    totalRoles: activeRoles.length,
    admins: users.filter(u => u.role?.toLowerCase().includes('admin')).length,
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
            <div ref={filterRef} className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-border bg-white rounded-lg hover:bg-sidebar-accent transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
              {showFilterDropdown && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border z-10"
                  onMouseLeave={() => setHoveredRoleId(null)}
                >
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground px-2 py-1">Filter by Role</p>
                    <button
                      key="all"
                      onMouseEnter={() => setHoveredRoleId(0)}
                      onClick={() => { setFilterRole(0); fetchUsers(0); setHoveredRoleId(null); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${filterRole === 0 ? 'bg-[#4b49ac]/10 text-[#4b49ac]' : 'text-foreground hover:bg-sidebar-accent'
                        }`}
                    >
                      All Roles
                    </button>
                    {activeRoles.map((role) => (
                      <button
                        key={role.id}
                        onMouseEnter={() => setHoveredRoleId(role.id)}
                        onClick={() => { setFilterRole(role.id); fetchUsers(role.id); setHoveredRoleId(null); setShowFilterDropdown(false); }}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${filterRole === role.id ? 'bg-[#4b49ac]/10 text-[#4b49ac]' : 'text-foreground hover:bg-sidebar-accent'
                          }`}
                      >
                        {role.role_name}
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
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-sidebar-accent transition-colors ${filterStatus === status ? 'bg-[#4b49ac]/10 text-[#4b49ac]' : 'text-foreground'
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
                resetForm();
                setShowAddUserModal(true);
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

      {/* AI Suggestion Banner - commented out, preserved for future use
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
      */}

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-foreground">Users</h3>
          {previewLabel && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#4b49ac]/10 text-[#4b49ac] font-medium animate-pulse">
              Previewing: {previewLabel}
            </span>
          )}
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
              {usersLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : null}
              {!usersLoading && filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-sidebar-accent transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.profilePicture ? (
                        <img
                          src={getProfileImageUrl(user.profilePicture)}
                          alt={user.name}
                          onError={(e) => {
                            const el = e.currentTarget;
                            el.style.display = 'none';
                            (el.nextElementSibling as HTMLElement).style.display = 'flex';
                          }}
                          className="w-10 h-10 rounded-full object-cover border-2 border-border"
                        />
                      ) : null}
                      <div
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4b49ac] to-[#7978e9] items-center justify-center text-white font-semibold"
                        style={{ display: user.profilePicture ? 'none' : 'flex' }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
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
                        onClick={() => handleEditUser(user)}
                        className="p-1.5 rounded hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Logs - commented out, preserved for future use
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
      */}

      {/* Add/Edit User Modal */}
      {(showAddUserModal || selectedUser) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 z-10">
              <h3 className="text-foreground">{selectedUser ? 'Edit User' : 'Add New User'}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedUser ? 'Update user details and permissions' : 'Create a new team member account'}
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Profile Picture Section */}
                <div className="sticky top-[89px] bg-white z-[5] pb-4 border-b border-border">
                  <div className="flex items-center gap-6 pt-2">
                    <div className="relative group">
                      {profilePreview || selectedUser?.profilePicture ? (
                        <>
                          <img
                            src={getProfileImageUrl(profilePreview || selectedUser?.profilePicture)}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-border"
                          />
                          <button
                            onClick={() => { setProfilePreview(null); setProfileFile(null); }}
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
                          value={newUserForm.first_name}
                          onChange={(e) => handleNewUserChange('first_name', e.target.value)}
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
                          value={newUserForm.last_name}
                          onChange={(e) => handleNewUserChange('last_name', e.target.value)}
                          placeholder="Enter Last Name"
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        />
                      </div>

                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={newUserForm.username}
                          onChange={(e) => handleNewUserChange('username', e.target.value)}
                          placeholder="Enter username"
                          className={`w-full px-3 py-2 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac] ${
                            usernameStatus.available === true ? 'border-green-500 bg-green-50' : 
                            usernameStatus.available === false ? 'border-red-500 bg-red-50' : 'border-border'
                          }`}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          {usernameStatus.checking ? (
                            <Clock className="w-4 h-4 text-gray-400 animate-spin" />
                          ) : usernameStatus.available === true ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : usernameStatus.available === false ? (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          ) : null}
                          <button
                            type="button"
                            onClick={handleGenerateUsername}
                            className="text-[10px] bg-[#4b49ac] text-white px-2 py-1 rounded hover:bg-[#4b49ac]/90 transition-colors"
                          >
                            Auto
                          </button>
                        </div>
                      </div>
                      {usernameStatus.available === false && (
                        <p className="text-red-500 text-[10px] mt-1">Username is already taken</p>
                      )}
                      {usernameStatus.available === true && (
                        <p className="text-green-600 text-[10px] mt-1">Username is available</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Join Date
                        </label>
                        <input
                          type="date"
                          value={newUserForm.join_date}
                          onChange={(e) => handleNewUserChange('join_date', e.target.value)}
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
                          value={newUserForm.email}
                          onChange={(e) => handleNewUserChange('email', e.target.value)}
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
                          value={newUserForm.phone}
                          onChange={(e) => handleNewUserChange('phone', e.target.value)}
                          placeholder="Enter phone number"
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Secondary Email
                      </label>
                      <input
                        type="email"
                        value={newUserForm.secondary_email}
                        onChange={(e) => handleNewUserChange('secondary_email', e.target.value)}
                        placeholder="Enter secondary email"
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                      />
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
                          value={newUserForm.department}
                          onChange={(e) => handleNewUserChange('department', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        >
                          <option value="">Select Department</option>
                          {activeDepartments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
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
                          value={newUserForm.role}
                          onChange={(e) => handleNewUserChange('role', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        >
                          <option value="">Select Role</option>
                          {activeRoles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.role_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {!selectedUser && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Password <span className="text-red-600">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={passwords.password}
                              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                              placeholder="Enter password"
                              className="w-full px-3 py-2 pr-20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500">
                              {showPassword ? '🙈' : '👁'}
                            </button>
                            <button type="button" onClick={generatePassword} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-[#4b49ac] text-white px-2 py-1 rounded">
                              Auto
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Confirm Password <span className="text-red-600">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwords.confirm_password}
                              onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                              placeholder="Confirm password"
                              className="w-full px-3 py-2 pr-12 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                              {showConfirmPassword ? '🙈' : '👁'}
                            </button>
                          </div>
                          {passwords.confirm_password && passwords.password !== passwords.confirm_password && (
                            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Status
                        </label>
                        <select
                          value={newUserForm.status}
                          onChange={(e) => handleNewUserChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        >
                          <option value="active">Active</option>
                          <option value="idle">Idle</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-border p-6 flex flex-col gap-3">
              {formError && (
                <p className="text-sm text-red-500 text-right">{formError}</p>
              )}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setSelectedUser(null);
                    resetForm();
                  }}
                  className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedUser ? handleUpdateUser : handleCreateUser}
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-lg bg-[#4b49ac] text-white hover:bg-[#4b49ac]/90 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formSubmitting ? (
                    'Saving...'
                  ) : selectedUser ? (
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
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm transition-all ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* View User Profile Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-[#4b49ac] to-[#7978e9] text-white p-6 rounded-t-lg shrink-0">
              <div className="flex items-center gap-4 mb-4">
                {(viewingUser as any).profile_picture || viewingUser.profilePicture ? (
                  <img
                    src={getProfileImageUrl((viewingUser as any).profile_picture || viewingUser.profilePicture)}
                    alt={viewingUser.name}
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.style.display = 'none';
                      (el.nextElementSibling as HTMLElement).style.display = 'flex';
                    }}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg"
                  />
                ) : null}
                <div
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center text-2xl font-semibold border-4 border-white/10"
                  style={{ display: (viewingUser as any).profile_picture || viewingUser.profilePicture ? 'none' : 'flex' }}
                >
                  {viewingUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{viewingUser.name}</h3>
                  <p className="text-white/80 text-sm">{viewingUser.email}</p>
                </div>
              </div>

              {/* Status & Role Badges */}
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${viewingUser.status === 'ACTIVE'
                  ? 'bg-green-400/25 text-green-100 border border-green-300/40'
                  : viewingUser.status === 'IDLE'
                    ? 'bg-yellow-400/25 text-yellow-100 border border-yellow-300/40'
                    : 'bg-red-400/25 text-red-100 border border-red-300/40'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${viewingUser.status === 'ACTIVE' ? 'bg-green-400 animate-pulse' :
                    viewingUser.status === 'IDLE' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                  {viewingUser.status}
                </span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${getRoleBadgeColor(viewingUser.role)}`}>
                  {getRoleDisplayName(viewingUser.role)}
                </span>
              </div>
            </div>

            {/* Profile Details — scrollable body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#4b49ac]" />
                    Basic Information
                  </h4>
                  <div className="space-y-3">
                    {/* First Name */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">First Name</p>
                      <p className="text-sm text-foreground font-medium">{viewingUser.first_name || '—'}</p>
                    </div>
                    {/* Last Name */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last Name</p>
                      <p className="text-sm text-foreground font-medium">{viewingUser.last_name || '—'}</p>
                    </div>
                    {/* Join Date */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Join Date</p>
                      <p className="text-sm text-foreground font-medium">
                        {viewingUser.joinDate
                          ? (() => { try { return new Date(viewingUser.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); } catch { return viewingUser.joinDate; } })()
                          : '—'}
                      </p>
                    </div>
                    {/* Location */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="text-sm text-foreground font-medium flex items-center gap-1">
                        {viewingUser.location ? (
                          <><MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />{viewingUser.location}</>
                        ) : '—'}
                      </p>
                    </div>
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

              {/* Activity Log */}
              <div className="bg-white rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#4b49ac]" />
                  Activity Log
                </h4>

                {/* Last Active */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-[#f5f7ff] rounded-lg border border-border">
                  <Clock className="w-4 h-4 text-[#4b49ac] shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Active</p>
                    <p className="text-sm font-medium text-foreground">{viewingUser.lastActive}</p>
                  </div>
                </div>

                {/* Comments */}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Comments</p>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {(activityComments[viewingUser.id] || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
                  ) : (
                    (activityComments[viewingUser.id] || []).map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3 p-3 bg-[#f5f7ff] rounded-lg border border-border">
                        <div className="w-2 h-2 rounded-full bg-[#4b49ac] mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground break-words">{comment.text}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(comment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { addComment(viewingUser.id, newComment); setNewComment(''); }
                    }}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                  />
                  <button
                    onClick={() => { addComment(viewingUser.id, newComment); setNewComment(''); }}
                    className="px-4 py-2 bg-[#4b49ac] text-white rounded-lg text-sm hover:bg-[#4b49ac]/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 border-t border-border p-4 flex gap-3 justify-end shrink-0 rounded-b-lg">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { handleEditUser(viewingUser); setViewingUser(null); }}
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
