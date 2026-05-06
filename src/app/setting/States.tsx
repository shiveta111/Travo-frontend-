import { useEffect, useState } from 'react';
import {
  Briefcase, Search, Edit2, X, Users, Building2, Filter,
  CheckCircle, AlertCircle, TrendingUp, Eye, Plus
} from 'lucide-react';
import { getCountries, getStatesByCountry, newState, updateState, deleteState } from '../../api/location.api';

interface Country {
  id: number;
  name: string;
  description: string;
  status: number; // 0 = active, 1 = inactive
}

interface State {
  id: number;
  name: string;
  description: string;
  countryId: number;
  status: number;
}

export function States() {

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<State | null>(null);
  const [stateToDelete, setStateToDelete] = useState<State | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [stateForm, setStateForm] = useState({
    name: '',
    description: '',
    countryId: '',
    status: 'ACTIVE'
  });


  const [countries, setCountries] = useState<Country[]>([]);
  const [allStates, setAllStates] = useState<State[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCountries();
  }, []);


  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteState = (dept: State) => {
    setStateToDelete(dept);
    setShowDeleteConfirm(true);
  };

  const stats = {
      totalDepartments: allStates.length,

      activeDepartments: allStates.filter(
          (d: Country) => d.status === 0
      ).length,

      totalEmployees: allStates.length,

      totalBudget: allStates.length
  };

  const getVisiblePages = () => {
    const pages = [];

    if (totalPages <= 5) {
      // show all if small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const fetchCountries = async () => {
    try {
        const res = await getCountries();
        const data = res.data || [];

        setCountries(data);

        // ✅ find India
        const india = data.find(
        (c: Country) => c.name.toLowerCase() === "india"
        );

        const defaultCountry = india || data[0];

        if (defaultCountry) {
        setSelectedCountryId(defaultCountry.id);
        fetchStates(defaultCountry.id);
        }

    } catch (error) {
        console.error(error);
    }
  };

  const fetchStates = async (countryId: number) => {
    try {
        const res = await getStatesByCountry(countryId);
        setAllStates(res.data || []);
    } catch (error) {
        console.error(error);
    }
  };

  const handleCreateState = async () => {
    if (!stateForm.name.trim() || !stateForm.countryId) return;

    try {
        await newState(
        stateForm.name,
        stateForm.description,
        Number(stateForm.countryId),
        stateForm.status === 'ACTIVE' ? 0 : 1
        );

        await fetchStates(Number(stateForm.countryId));

        setStateForm({
        name: '',
        description: '',
        countryId: '',
        status: 'ACTIVE'
        });

        setShowAddDepartmentModal(false);

        showToast("State created successfully");

    } catch (error) {
        console.error(error);
        showToast("Failed to create state", "error");
    }
  };

  const handleUpdateState = async () => {
    if (!editingDepartment) return;

    try {
        await updateState(
        editingDepartment.id,
        editingDepartment.name,
        editingDepartment.description,
        editingDepartment.countryId,
        editingDepartment.status
        );

        await fetchStates(editingDepartment.countryId);

        setShowEditDepartmentModal(false);
        setEditingDepartment(null);

        showToast("State updated successfully");

    } catch (error) {
        console.error(error);
        showToast("Failed to update state", "error");
    }
  };

  const confirmDeleteState = async () => {
    if (!stateToDelete) return;

    try {
        await deleteState(stateToDelete.id);

        await fetchStates(stateToDelete.countryId);

        setShowDeleteConfirm(false);
        setStateToDelete(null);

        showToast("State deleted successfully");

    } catch (error) {
        console.error(error);
        showToast("Failed to delete state", "error");
    }
  };

  const search = searchQuery.toLowerCase();

  const filteredStates = allStates.filter((state) => {
    const name = (state.name || '').toLowerCase();
    const desc = (state.description || '').toLowerCase();

    const matchesSearch = name.includes(search) || desc.includes(search);

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'ACTIVE' && state.status === 0) ||
      (filterStatus === 'INACTIVE' && state.status === 1);

    return matchesSearch && matchesStatus;
  });

  const paginatedStates = filteredStates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredStates.length / itemsPerPage);

  return (
    <div className="flex-1 bg-[#f5f7ff] p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-foreground mb-1">States</h2>
            <p className="text-sm text-muted-foreground">Manage and organize country-related information and settings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              
              <input
                type="text"
                placeholder="Search States..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // 🔥 IMPORTANT FIX
                }}
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
              <span className="text-sm">Add States</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total States</p>
            <Building2 className="w-5 h-5 text-[#4b49ac]" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.totalDepartments}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active States</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.activeDepartments}</p>
        </div>
      </div>

<div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border border-border shadow-sm">

  {/* Country */}
  <div className="flex flex-col">
    <label className="text-xs text-muted-foreground mb-1">
      Country
    </label>

    <select
      value={selectedCountryId || ''}
      onChange={(e) => {
        const id = Number(e.target.value);
        setSelectedCountryId(id);
        fetchStates(id);
        setCurrentPage(1);
      }}
      className="min-w-[200px] px-3 py-2 border border-border rounded-lg bg-white text-sm 
      focus:outline-none focus:ring-2 focus:ring-[#4b49ac] transition"
    >
      {countries.length === 0 ? (
        <option>No Countries Available</option>
      ) : (
        countries.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))
      )}
    </select>
  </div>

</div>

      {/* Departments Table */}
      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden mb-6 mt-5">
        <div className="p-4 border-b border-border">
          <h3 className="text-foreground">States</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sidebar-accent">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">State Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedStates.map((dept: State, index) => (
                <tr key={dept.id} className="hover:bg-sidebar-accent transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4b49ac] to-[#7978e9] flex items-center justify-center text-white font-semibold">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{dept.name}</p>
                        <p className="text-xs text-muted-foreground">{dept.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        dept.status === 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        {dept.status === 0 ? (
                        <CheckCircle className="w-3 h-3" />
                        ) : (
                        <X className="w-3 h-3" />
                        )}

                        {dept.status === 0 ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
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
                        onClick={() => handleDeleteState(dept)}
                        className="p-1.5 rounded hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={dept.id ? "Cannot delete department with employees" : "Delete"}
                        // disabled={dept.employeeCount > 0}
                      >
                        <X className={`w-4 h-4 ${dept.id ? 'text-gray-300' : 'text-red-600'}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-4 py-3 border-t border-border mt-4">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getVisiblePages().map((page, index) =>
              page === '...' ? (
                <span key={index} className="px-2">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => {
                    if (typeof page === 'number') {
                      setCurrentPage(page);
                    }
                  }}
                  disabled={page === '...'}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page
                      ? "bg-[#4b49ac] text-white"
                      : "bg-white text-black"
                  } ${page === '...' ? 'cursor-default opacity-50' : ''}`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

        </div>
      </div>

      {/* Add Department Modal */}
      {showAddDepartmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-foreground">Add New Country</h3>
                <p className="text-sm text-muted-foreground">Add a new country to your system and manage its details</p>   
              </div>
              <button
                onClick={() => {
                  setShowAddDepartmentModal(false);
                  setStateForm({
                    name: '',
                    description: '',
                    countryId: '',
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
                      Country
                    </label>
                    <select
                      value={stateForm.countryId}
                      onChange={(e) =>
                        setStateForm({
                          ...stateForm,
                          countryId: e.target.value
                        })
                      }
                      className="px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      State Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={stateForm.name}
                      onChange={(e) => setStateForm({ ...stateForm, name: e.target.value })}
                      placeholder="Enter state name"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                   
                </div>  

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={stateForm.description}
                    onChange={(e) => setStateForm({ ...stateForm, description: e.target.value,})}
                    placeholder="Brief description of country details"
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={stateForm.status}
                    onChange={(e) => setStateForm({ ...stateForm, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
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
                  setStateForm({
                    name: '',
                    description: '',
                    countryId: '',
                    status: 'ACTIVE'
                  });
                }}
                className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateState}
                disabled={!stateForm.name.trim()}
                className="px-6 py-2.5 rounded-lg bg-[#4b49ac] text-white hover:bg-[#4b49ac]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create State
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
                <h3 className="text-foreground">Edit Country</h3>
                <p className="text-sm text-muted-foreground">Modify and update the details of the selected country</p>
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
                      Country
                    </label>
                    <select
                      value={editingDepartment.countryId}
                      onChange={(e) =>
                        setEditingDepartment({
                          ...editingDepartment,
                          countryId: Number(e.target.value)
                        })
                      }
                      className="px-3 py-2 border rounded-lg"
                    >
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      State Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingDepartment.name}
                      onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                      placeholder="e.g., Marketing"
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

        
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  
                  <select
                    value={editingDepartment.status === 0 ? 'ACTIVE' : 'INACTIVE'}
                    onChange={(e) =>
                        setEditingDepartment({
                        ...editingDepartment,
                        status: e.target.value === 'ACTIVE' ? 0 : 1,
                        })
                    }
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
                onClick={handleUpdateState}
                disabled={!editingDepartment.name.trim()}
                className="px-6 py-2.5 rounded-lg bg-[#4b49ac] text-white hover:bg-[#4b49ac]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Update Country
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && stateToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-red-100">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-2">Delete State</h3>

                  <p className="text-sm text-muted-foreground mb-4">
                    Are you sure you want to delete this state{" "}
                    <span className="font-semibold">"{stateToDelete.name}"</span>? 
                    This action cannot be undone.
                  </p>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      Please ensure this state is not linked to any cities before deleting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-border p-4 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setStateToDelete(null);
                }}
                className="px-4 py-2 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteState}
                disabled={false}
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
