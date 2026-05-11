import { useState, useEffect, useRef } from 'react';
import {
  Briefcase, Search, Edit2, X, Users, Building2, Filter,
  CheckCircle, AlertCircle, TrendingUp, Eye, Plus
} from 'lucide-react';
import { getActiveCountries, getActiveStatesByCountry, getActiveCitiesByState } from '../../api/location.api';
import { getDepartments, newDepartment as createDepartmentApi, updateDepartment as updateDepartmentApi, deleteDepartment as deleteDepartmentApi } from '../../api/department.api';

interface Department {
  id: number;
  name: string;
  description: string;
  head_of_department: string;
  employee_count: number;
  budget?: string;

  // API fields
  country?: string;
  state?: string;
  city?: string;

  // Numeric fields
  country_id: number;
  state_id: number;
  city_id: number;

  country_name?: string;
  state_name?: string;
  city_name?: string;

  status: number;
  created_at: string;
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

  // My Custome Code Start
  const [allCountries, setAllCountries] = useState<any[]>([]);
  const [allStates, setAllStates] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);

  const [editCountryId, setEditCountryId] = useState<number | null>(null);
  const [editStates, setEditStates] = useState<any[]>([]);
  const [editCities, setEditCities] = useState<any[]>([]);

  const fetchStatesForEdit = async (countryId: number) => {
    try {

      const res = await getActiveStatesByCountry(countryId);

      setEditStates(res.data || []);

    } catch (error) {

      console.error(error);
      setEditStates([]);
    }
  };

  const fetchCitiesForEdit = async (stateId: number) => {
    try {

      const res = await getActiveCitiesByState(stateId);

      setEditCities(res.data || []);

    } catch (error) {

      console.error(error);
      setEditCities([]);
    }
  };


  useEffect(() => {
    fetchCountries();
    fetchDepartments();
  }, []);
  
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

  // My Custome Code End

  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    head_of_department: '',
    employee_count: 0,
    budget: '',
    country_id: '',
    state_id: '',
    city_id: '',
    status: 0
  });

  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchDepartments = async () => {
    try {

      const res = await getDepartments();

      if (res?.success) {
        setDepartments(res.data || []);
      } else {
        setDepartments([]);
      }

    } catch (error) {
      console.error(error);
      setDepartments([]);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateDepartment = async () => {

    try {

      if (!newDepartment.name.trim()) return;

      const res = await createDepartmentApi(
        newDepartment.name,
        newDepartment.description,
        newDepartment.head_of_department,
        newDepartment.employee_count,
        Number(newDepartment.budget),
        Number(newDepartment.country_id),
        Number(newDepartment.state_id),
        Number(newDepartment.city_id),
        newDepartment.status
      );

      if (res?.success) {

        showToast('Department created successfully');

        fetchDepartments();

        setShowAddDepartmentModal(false);

        setNewDepartment({
          name: '',
          description: '',
          head_of_department: '',
          employee_count: 0,
          budget: '',
          country_id: '',
          state_id: '',
          city_id: '',
          status: 0
        });
      }

    } catch (error) {
      console.error(error);
      showToast('Failed to create department', 'error');
    }
  };

  const handleUpdateDepartment = async () => {

    try {

      if (!editingDepartment) return;

      const res = await updateDepartmentApi(
        editingDepartment.id,
        editingDepartment.name,
        editingDepartment.description,
        editingDepartment.head_of_department,
        editingDepartment.employee_count,
        Number(editingDepartment.budget),
        editingDepartment.country_id,
        editingDepartment.state_id,
        editingDepartment.city_id,
        editingDepartment.status
      );

      if (res?.success) {

        showToast('Department updated successfully');

        fetchDepartments();

        setShowEditDepartmentModal(false);

        setEditingDepartment(null);
      }

    } catch (error) {
      console.error(error);
      showToast('Failed to update department', 'error');
    }
  };

  const handleDeleteDepartment = (dept: Department) => {
    setDepartmentToDelete(dept);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteDepartment = async () => {

    try {

      if (!departmentToDelete) return;

      const res = await deleteDepartmentApi(departmentToDelete.id);

      if (res?.success) {

        showToast('Department deleted successfully');

        fetchDepartments();

        setShowDeleteConfirm(false);

        setDepartmentToDelete(null);
      }

    } catch (error) {
      console.error(error);
      showToast('Failed to delete department', 'error');
    }
  };

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.head_of_department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
    filterStatus === 'all' ||
    dept.status === Number(filterStatus);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalDepartments: departments.length,
    activeDepartments: departments.filter(d => d.status === 0).length,
    totalEmployees: departments.reduce((sum, d) => sum + d.employee_count, 0),
    totalBudget: departments.reduce((sum, d) => {
      const budget = Number(d.budget || 0);
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
            <div ref={filterRef} className="relative">
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
                    <p className="text-xs text-muted-foreground px-2 py-1">
                      Filter by Status
                    </p>
                    {[
                      { label: 'All Status', value: 'all' },
                      { label: 'Active', value: '0' },
                      { label: 'Inactive', value: '1' }
                    ].map((status) => (
                      <button
                        key={status.value}
                        onClick={() => {
                          setFilterStatus(status.value);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-sidebar-accent transition-colors ${
                          filterStatus === status.value
                            ? 'bg-[#4b49ac]/10 text-[#4b49ac]'
                            : 'text-foreground'
                        }`}
                      >
                        {status.label}
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
                    <p className="text-sm text-foreground">{dept.head_of_department}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-foreground">{dept.employee_count}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground font-medium">{dept.budget || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground">{dept.city_name}, {dept.state_name}, {dept.country_name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      dept.status === 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {dept.status === 0 ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {dept.status === 0 ? 'ACTIVE' : 'INACTIVE'}
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
                        onClick={async () => {
                          const countryId = Number(dept.country);
                          const stateId = Number(dept.state);
                          const cityId = Number(dept.city);

                          // Load states
                          await fetchStatesForEdit(countryId);

                          // Load cities
                          await fetchCitiesForEdit(stateId);

                          // Set selected country
                          setEditCountryId(countryId);

                          // Set department data
                          setEditingDepartment({
                            ...dept,

                            country: String(countryId),
                            state: String(stateId),
                            city: String(cityId),

                            country_id: countryId,
                            state_id: stateId,
                            city_id: cityId,
                          });

                          // Open modal
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
                        title={dept.employee_count > 0 ? "Cannot delete department with employees" : "Delete"}
                        disabled={dept.employee_count > 0}
                      >
                        <X className={`w-4 h-4 ${dept.employee_count > 0 ? 'text-gray-300' : 'text-red-600'}`} />
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
                    head_of_department: '',
                    employee_count: 0,
                    budget: '',
                    country_id: '',
                    state_id: '',
                    city_id: '',
                    status: 0
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
                      placeholder="Department Name"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Head of Department
                    </label>
                    <input
                      type="text"
                      value={newDepartment.head_of_department}
                      onChange={(e) =>
                        setNewDepartment({
                          ...newDepartment,
                          head_of_department: e.target.value
                        })
                      }
                      placeholder="Head of Department"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
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
                      Select Country
                    </label>
                    <select
                      value={newDepartment.country_id}
                      onChange={(e) => {
                        const countryId = e.target.value;

                        setNewDepartment({
                          ...newDepartment,
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
                      value={newDepartment.state_id}
                      onChange={(e) => {
                        const stateId = e.target.value;

                        setNewDepartment({
                          ...newDepartment,
                          state_id: stateId,
                          city_id: ''
                        });

                        if (stateId) {
                          fetchCities(Number(stateId));
                        } else {
                          setAllCities([]);
                        }
                      }}
                      disabled={!newDepartment.country_id}
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
                      value={newDepartment.city_id}
                      onChange={(e) =>
                        setNewDepartment({
                          ...newDepartment,
                          city_id: e.target.value
                        })
                      }
                      disabled={!newDepartment.state_id}
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

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>

                  <select
                    value={newDepartment.status}
                    onChange={(e) =>
                      setNewDepartment({
                        ...newDepartment,
                        status: Number(e.target.value)
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                  >
                    <option value={0}>Active</option>
                    <option value={1}>Inactive</option>
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
                    head_of_department: '',
                    employee_count: 0,
                    budget: '',
                    country_id: '',
                    state_id: '',
                    city_id: '',
                    status: 0
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
                      placeholder="Department Name"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Head of Department
                    </label>
                    <input
                      type="text"
                      value={editingDepartment.head_of_department}
                      onChange={(e) =>
                        setEditingDepartment({
                          ...editingDepartment,
                          head_of_department: e.target.value
                        })
                      }
                      placeholder="Head of Department"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
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
                      value={editingDepartment.budget || ''}
                      onChange={(e) =>
                        setEditingDepartment({
                          ...editingDepartment,
                          budget: e.target.value
                        })
                      }
                      placeholder="e.g., $200,000"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Country
                    </label>
                    <select
                        value={editingDepartment.country || ''}
                        onChange={async (e) => {

                          const countryId = Number(e.target.value);
                          console.log('Selected country ID:', countryId);
                          setEditCountryId(countryId);

                          await fetchStatesForEdit(countryId);

                          setEditCities([]);

                          setEditingDepartment({
                            ...editingDepartment,
                            country: String(countryId),
                            country_id: countryId,
                            state: '',
                            state_id: 0,
                            city: '',
                            city_id: 0
                          });
                        }}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                      >
                        <option value="">Select Country</option>

                        {allCountries.map((country: any) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select State
                    </label>
                   <select
                      value={editingDepartment.state || ''}
                      onChange={async (e) => {
                        const stateId = Number(e.target.value);

                        await fetchCitiesForEdit(stateId);

                        setEditingDepartment({
                          ...editingDepartment,
                          state: String(stateId),
                          state_id: stateId,
                          city: '',
                          city_id: 0
                        });
                      }}
                      disabled={!editStates.length}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    >
                      <option value="">Select State</option>

                      {editStates.map((state: any) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select City
                    </label>

                    <select
                      value={editingDepartment.city || ''}
                      onChange={(e) =>
                        setEditingDepartment({
                          ...editingDepartment,
                          city: e.target.value,
                          city_id: Number(e.target.value)
                        })
                      }
                      disabled={!editCities.length}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    >
                      <option value="">Select City</option>

                      {editCities.map((city: any) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>

                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={editingDepartment.status}
                    onChange={(e) => setEditingDepartment({ ...editingDepartment, status: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                  >
                    <option value={0}>Active</option>
                    <option value={1}>Inactive</option>
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
                  viewingDepartment.status === 0
                    ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                    : 'bg-gray-500/20 text-gray-100 border border-gray-400/30'
                }`}>
                  {viewingDepartment.status === 0 ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {viewingDepartment.status === 0 ? 'Active' : 'Inactive' }
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
                  <p className="text-sm text-foreground font-medium">{viewingDepartment.head_of_department}</p>
                </div>

                <div className="bg-white rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#4b49ac]" />
                    Employees
                  </h4>
                  <p className="text-2xl font-semibold text-foreground">{viewingDepartment.employee_count}</p>
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
                  <p className="text-sm text-foreground">
                    {viewingDepartment.city_name && viewingDepartment.state_name && viewingDepartment.country_name
                      ? `${viewingDepartment.city_name}, ${viewingDepartment.state_name}, ${viewingDepartment.country_name}`
                      : 'Not specified'}
                  </p>
                </div>

                <div className="col-span-2 bg-white rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Department Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created Date:</span>
                      <span className="text-foreground font-medium">
                        {new Date(viewingDepartment.created_at).toLocaleDateString('en-US', {
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
                  {departmentToDelete.employee_count > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-yellow-800">
                        This department has {departmentToDelete.employee_count} employee{departmentToDelete.employee_count !== 1 ? 's' : ''} assigned and cannot be deleted.
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
                disabled={departmentToDelete.employee_count > 0}
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
