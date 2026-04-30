import { useState } from 'react';
import {
  Briefcase, Search, Edit2, X, Users, Building2, Filter,
  CheckCircle, AlertCircle, TrendingUp, Eye, Plus
} from 'lucide-react';

interface Department {
  id: number;
  name: string;
  description: string;
  headOfDepartment: string;
  employeeCount: number;
  budget?: string;
  location?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdDate: string;
}

export function DepartmentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [viewingDepartment, setViewingDepartment] = useState<Department | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    headOfDepartment: '',
    budget: '',
    location: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const initialDepartments: Department[] = [
    {
      id: 1,
      name: 'Sales',
      description: 'Customer acquisition and revenue generation',
      headOfDepartment: 'Ravi Mehta',
      employeeCount: 3,
      budget: '$250,000',
      location: 'Mumbai, India',
      status: 'ACTIVE',
      createdDate: '2023-10-01'
    },
    {
      id: 2,
      name: 'Operations',
      description: 'Trip planning and execution management',
      headOfDepartment: 'Kirana Dewi',
      employeeCount: 1,
      budget: '$180,000',
      location: 'Bali, Indonesia',
      status: 'ACTIVE',
      createdDate: '2023-10-01'
    },
    {
      id: 3,
      name: 'Finance',
      description: 'Financial planning and accounting',
      headOfDepartment: 'Finance Team',
      employeeCount: 1,
      budget: '$150,000',
      location: 'Delhi, India',
      status: 'ACTIVE',
      createdDate: '2023-11-15'
    },
    {
      id: 4,
      name: 'Guest Experience',
      description: 'Customer support and satisfaction',
      headOfDepartment: 'Sari',
      employeeCount: 1,
      budget: '$120,000',
      location: 'Jakarta, Indonesia',
      status: 'ACTIVE',
      createdDate: '2024-01-10'
    },
    {
      id: 5,
      name: 'Management',
      description: 'Strategic planning and leadership',
      headOfDepartment: 'Admin User',
      employeeCount: 1,
      budget: '$300,000',
      location: 'Mumbai, India',
      status: 'ACTIVE',
      createdDate: '2023-09-01'
    }
  ];

  const [departments, setDepartments] = useState<Department[]>(initialDepartments);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateDepartment = () => {
    if (!newDepartment.name.trim()) return;

    const departmentToAdd: Department = {
      id: departments.length + 1,
      name: newDepartment.name,
      description: newDepartment.description,
      headOfDepartment: newDepartment.headOfDepartment,
      employeeCount: 0,
      budget: newDepartment.budget,
      location: newDepartment.location,
      status: newDepartment.status,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setDepartments([...departments, departmentToAdd]);
    setShowAddDepartmentModal(false);
    setNewDepartment({
      name: '',
      description: '',
      headOfDepartment: '',
      budget: '',
      location: '',
      status: 'ACTIVE'
    });
    showToast(`Department "${departmentToAdd.name}" created successfully!`);
  };

  const handleUpdateDepartment = () => {
    if (!editingDepartment) return;

    setDepartments(departments.map(d => d.id === editingDepartment.id ? editingDepartment : d));
    setShowEditDepartmentModal(false);
    const deptName = editingDepartment.name;
    setEditingDepartment(null);
    showToast(`Department "${deptName}" updated successfully!`);
  };

  const handleDeleteDepartment = (dept: Department) => {
    setDepartmentToDelete(dept);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteDepartment = () => {
    if (!departmentToDelete) return;

    const deptName = departmentToDelete.name;
    setDepartments(departments.filter(d => d.id !== departmentToDelete.id));
    setShowDeleteConfirm(false);
    setDepartmentToDelete(null);
    showToast(`Department "${deptName}" deleted successfully!`);
  };

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.headOfDepartment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || dept.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalDepartments: departments.length,
    activeDepartments: departments.filter(d => d.status === 'ACTIVE').length,
    totalEmployees: departments.reduce((sum, d) => sum + d.employeeCount, 0),
    totalBudget: departments.reduce((sum, d) => {
      const budget = d.budget ? parseInt(d.budget.replace(/[$,]/g, '')) : 0;
      return sum + budget;
    }, 0)
  };

  return (
    <div className="flex-1 bg-[#f5f7ff] p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-foreground mb-1">Department Management</h2>
            <p className="text-sm text-muted-foreground">Organize teams and manage departments</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search departments"
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border z-10">
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground px-2 py-1">Filter by Status</p>
                    {['all', 'ACTIVE', 'INACTIVE'].map((status) => (
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
              onClick={() => setShowAddDepartmentModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg hover:bg-[#4b49ac]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Department</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Departments</p>
            <Building2 className="w-5 h-5 text-[#4b49ac]" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.totalDepartments}</p>
          <p className="text-xs text-muted-foreground">Organization-wide</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active Departments</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.activeDepartments}</p>
          <p className="text-xs text-green-600">Operating</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Employees</p>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.totalEmployees}</p>
          <p className="text-xs text-muted-foreground">Across all depts</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">${(stats.totalBudget / 1000).toFixed(0)}K</p>
          <p className="text-xs text-muted-foreground">Annual</p>
        </div>
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-border">
          <h3 className="text-foreground">Departments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sidebar-accent">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Head</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Employees</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Budget</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} className="hover:bg-sidebar-accent transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4b49ac] to-[#7978e9] flex items-center justify-center text-white font-semibold">
                        {dept.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{dept.name}</p>
                        <p className="text-xs text-muted-foreground">{dept.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground">{dept.headOfDepartment}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-foreground">{dept.employeeCount}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground font-medium">{dept.budget || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground">{dept.location || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      dept.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {dept.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setViewingDepartment(dept)}
                        className="p-1.5 rounded hover:bg-green-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingDepartment({ ...dept });
                          setShowEditDepartmentModal(true);
                        }}
                        className="p-1.5 rounded hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(dept)}
                        className="p-1.5 rounded hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={dept.employeeCount > 0 ? "Cannot delete department with employees" : "Delete"}
                        disabled={dept.employeeCount > 0}
                      >
                        <X className={`w-4 h-4 ${dept.employeeCount > 0 ? 'text-gray-300' : 'text-red-600'}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Department Modal */}
      {showAddDepartmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-foreground">Add New Department</h3>
                <p className="text-sm text-muted-foreground">Create a new department in your organization</p>
              </div>
              <button
                onClick={() => {
                  setShowAddDepartmentModal(false);
                  setNewDepartment({
                    name: '',
                    description: '',
                    headOfDepartment: '',
                    budget: '',
                    location: '',
                    status: 'ACTIVE'
                  });
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
                      Department Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                      placeholder="e.g., Marketing"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Head of Department
                    </label>
                    <select
                      value={newDepartment.headOfDepartment}
                      onChange={(e) => setNewDepartment({ ...newDepartment, headOfDepartment: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    >
                      <option value="">Select Manager</option>
                      <option value="Admin User">Admin User</option>
                      <option value="Ravi Mehta">Ravi Mehta</option>
                      <option value="Kirana Dewi">Kirana Dewi</option>
                      <option value="Finance Team">Finance Team</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                    placeholder="Brief description of department responsibilities"
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Annual Budget
                    </label>
                    <input
                      type="text"
                      value={newDepartment.budget}
                      onChange={(e) => setNewDepartment({ ...newDepartment, budget: e.target.value })}
                      placeholder="e.g., $200,000"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newDepartment.location}
                      onChange={(e) => setNewDepartment({ ...newDepartment, location: e.target.value })}
                      placeholder="e.g., Mumbai, India"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={newDepartment.status}
                    onChange={(e) => setNewDepartment({ ...newDepartment, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-border p-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddDepartmentModal(false);
                  setNewDepartment({
                    name: '',
                    description: '',
                    headOfDepartment: '',
                    budget: '',
                    location: '',
                    status: 'ACTIVE'
                  });
                }}
                className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDepartment}
                disabled={!newDepartment.name.trim()}
                className="px-6 py-2.5 rounded-lg bg-[#4b49ac] text-white hover:bg-[#4b49ac]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditDepartmentModal && editingDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-foreground">Edit Department</h3>
                <p className="text-sm text-muted-foreground">Update department information</p>
              </div>
              <button
                onClick={() => {
                  setShowEditDepartmentModal(false);
                  setEditingDepartment(null);
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
                      Department Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingDepartment.name}
                      onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                      placeholder="e.g., Marketing"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Head of Department
                    </label>
                    <select
                      value={editingDepartment.headOfDepartment}
                      onChange={(e) => setEditingDepartment({ ...editingDepartment, headOfDepartment: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    >
                      <option value="">Select Manager</option>
                      <option value="Admin User">Admin User</option>
                      <option value="Ravi Mehta">Ravi Mehta</option>
                      <option value="Kirana Dewi">Kirana Dewi</option>
                      <option value="Finance Team">Finance Team</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingDepartment.description}
                    onChange={(e) => setEditingDepartment({ ...editingDepartment, description: e.target.value })}
                    placeholder="Brief description of department responsibilities"
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Annual Budget
                    </label>
                    <input
                      type="text"
                      value={editingDepartment.budget}
                      onChange={(e) => setEditingDepartment({ ...editingDepartment, budget: e.target.value })}
                      placeholder="e.g., $200,000"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editingDepartment.location}
                      onChange={(e) => setEditingDepartment({ ...editingDepartment, location: e.target.value })}
                      placeholder="e.g., Mumbai, India"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={editingDepartment.status}
                    onChange={(e) => setEditingDepartment({ ...editingDepartment, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-border p-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowEditDepartmentModal(false);
                  setEditingDepartment(null);
                }}
                className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDepartment}
                disabled={!editingDepartment.name.trim()}
                className="px-6 py-2.5 rounded-lg bg-[#4b49ac] text-white hover:bg-[#4b49ac]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Update Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Department Modal */}
      {viewingDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#4b49ac] to-[#7978e9] text-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-semibold">
                    {viewingDepartment.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{viewingDepartment.name}</h3>
                    <p className="text-white/80 text-sm">{viewingDepartment.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingDepartment(null)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  viewingDepartment.status === 'ACTIVE'
                    ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                    : 'bg-gray-500/20 text-gray-100 border border-gray-400/30'
                }`}>
                  {viewingDepartment.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {viewingDepartment.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#f5f7ff] rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#4b49ac]" />
                    Department Head
                  </h4>
                  <p className="text-sm text-foreground font-medium">{viewingDepartment.headOfDepartment}</p>
                </div>

                <div className="bg-white rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#4b49ac]" />
                    Employees
                  </h4>
                  <p className="text-2xl font-semibold text-foreground">{viewingDepartment.employeeCount}</p>
                </div>

                <div className="bg-white rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#4b49ac]" />
                    Annual Budget
                  </h4>
                  <p className="text-lg font-semibold text-foreground">{viewingDepartment.budget || 'Not set'}</p>
                </div>

                <div className="bg-[#f5f7ff] rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#4b49ac]" />
                    Location
                  </h4>
                  <p className="text-sm text-foreground">{viewingDepartment.location || 'Not specified'}</p>
                </div>

                <div className="col-span-2 bg-white rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Department Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created Date:</span>
                      <span className="text-foreground font-medium">
                        {new Date(viewingDepartment.createdDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Department ID:</span>
                      <span className="text-foreground font-medium">DEPT-{String(viewingDepartment.id).padStart(3, '0')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-border p-4 flex gap-3 justify-end">
              <button
                onClick={() => setViewingDepartment(null)}
                className="px-4 py-2 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setEditingDepartment(viewingDepartment);
                  setViewingDepartment(null);
                  setShowEditDepartmentModal(true);
                }}
                className="px-4 py-2 rounded-lg bg-[#4b49ac] text-white hover:bg-[#4b49ac]/90 transition-colors flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && departmentToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-red-100">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-2">Delete Department</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Are you sure you want to delete the department <span className="font-semibold">"{departmentToDelete.name}"</span>? This action cannot be undone.
                  </p>
                  {departmentToDelete.employeeCount > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-yellow-800">
                        This department has {departmentToDelete.employeeCount} employee{departmentToDelete.employeeCount !== 1 ? 's' : ''} assigned and cannot be deleted.
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
                  setDepartmentToDelete(null);
                }}
                className="px-4 py-2 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteDepartment}
                disabled={departmentToDelete.employeeCount > 0}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Delete Department
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
