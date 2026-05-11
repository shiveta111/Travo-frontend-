import { useEffect, useState, useRef } from 'react';
import {
  Briefcase, Search, Edit2, X, Users, Building2, Filter,
  CheckCircle, AlertCircle, TrendingUp, Eye, Plus
} from 'lucide-react';
import { getCountries, getStatesByCountry, getCitiesByState, newCity, updateCity, deleteCity } from '../../api/location.api';

interface City {
  id: number;
  name: string;
  description: string;
  stateId: number;
  status: number;
}

export function Cities() {

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCityModal, setShowAddCity] = useState(false);
  const [showEditCityModal, setShowEditCityModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingCity, setEditingCity] = useState<City  | null>(null);
  const [cityToDelete, setCityToDelete] = useState<City  | null>(null);
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
  const [cityForm, setCityForm] = useState({
        name: '',
        description: '',
        stateId: '',
        status: 'ACTIVE'
  });
  const [countries, setCountries] = useState<any[]>([]);
  const [allStates, setAllStates] = useState<any[]>([]); 
  const [allCities, setAllCities] = useState<City[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);

  const [modalCountryId, setModalCountryId] = useState<number | null>(null);
  const [modalStates, setModalStates] = useState<any[]>([]);
  const [editCountryId, setEditCountryId] = useState<number | null>(null);
  const [editStates, setEditStates] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCountries();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteCity = (city: City) => {
    setCityToDelete(city);
    setShowDeleteConfirm(true);
  };

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
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

  const stats = {
      totalDepartments: allCities.length,

      activeDepartments: allCities.filter(
          (d: City) => d.status === 0
      ).length,

      totalEmployees: allCities.length,

      totalBudget: allCities.length
  };

  const fetchCountries = async () => {
    try {
        const res = await getCountries();
        const data = res.data || [];

        setCountries(data);

        // ✅ find India
        const india = data.find((c: any) => c.name.toLowerCase() === "india");

        const defaultCountry = india || data[0];

        if (defaultCountry) {
        setSelectedCountryId(defaultCountry.id);
        fetchStates(defaultCountry.id);
        }

    } catch (error) {
        console.error(error);
    }
  };

  const handleCreateCity = async () => {
    if (!cityForm.name.trim() || !cityForm.stateId) return;

    try {
        await newCity(
        cityForm.name,
        cityForm.description,
        Number(cityForm.stateId),
        cityForm.status === 'ACTIVE' ? 0 : 1
        );

        await fetchCities(Number(cityForm.stateId));

        setCityForm({
        name: '',
        description: '',
        stateId: selectedStateId?.toString() || '',
        status: 'ACTIVE'
        });

        setShowAddCity(false);
        showToast("City created successfully");
    } catch (error) {
        showToast("Failed to create city", "error");
    }
  };

  const handleUpdateCity = async () => {
    if (!editingCity) return;

    try {
        await updateCity(
        editingCity.id,
        editingCity.name,
        editingCity.description,
        editingCity.stateId,
        editingCity.status
        );

        await fetchCities(editingCity.stateId);

        setShowEditCityModal(false);
        setEditingCity(null);

        showToast("City updated successfully");
    } catch (error) {
        showToast("Failed to update city", "error");
    }
  };

  const confirmDeleteCity = async () => {
    if (!cityToDelete) return;

    try {
        await deleteCity(cityToDelete.id);

        await fetchCities(cityToDelete.stateId);

        setShowDeleteConfirm(false);
        setCityToDelete(null);

        showToast("City deleted successfully");
    } catch (error) {
        showToast("Failed to delete city", "error");
    }
  };

  const search = searchQuery.toLowerCase();

  const filteredCities = allCities.filter((city) => {
    const matchesSearch =
        (city.name || '').toLowerCase().includes(search) ||
        (city.description || '').toLowerCase().includes(search);

    const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'ACTIVE' && city.status === 0) ||
        (filterStatus === 'INACTIVE' && city.status === 1);

    return matchesSearch && matchesStatus;
  });

  const paginatedCities = filteredCities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCities.length / itemsPerPage);

  const fetchStates = async (countryId: number) => {
    try {
        const res = await getStatesByCountry(countryId);
        const data = res.data || [];

        setAllStates(data);

        if (data.length > 0) {
        setSelectedStateId(data[0].id);

        setCityForm((prev) => ({
            ...prev,
            stateId: data[0].id.toString()
        }));

        fetchCities(data[0].id);
        } else {
        setSelectedStateId(null);
        setAllStates([]);
        setAllCities([]);
        }
    } catch (error) {
        console.error(error);
        
    }
  };

  const fetchCities = async (stateId: number) => {
    try {
        const res = await getCitiesByState(stateId);
        setAllCities(res.data || []);
    } catch (error) {
        console.error(error);
    }
  };

  const fetchStatesForModal = async (countryId: number) => {
    try {
        const res = await getStatesByCountry(countryId);
        setModalStates(res.data || []);

        // auto select first state
        if (res.data?.length > 0) {
        setCityForm((prev) => ({
            ...prev,
            stateId: res.data[0].id.toString()
        }));
        } else {
        setCityForm((prev) => ({
            ...prev,
            stateId: ''
        }));
        }
    } catch (err) {
        console.error(err);
        setModalStates([]);
    }
  };

  const fetchStatesForEdit = async (countryId: number) => {
    try {
        const res = await getStatesByCountry(countryId);
        setEditStates(res.data || []);
    } catch (err) {
        console.error(err);
        setEditStates([]);
    }
  };

  return (
    <div className="flex-1 bg-[#f5f7ff] p-6 overflow-auto">
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-foreground mb-1">Cities</h2>
            <p className="text-sm text-muted-foreground">Manage and organize country-related information and settings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              
              <input
                type="text"
                placeholder="Search Cities..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // 🔥 IMPORTANT FIX
                }}
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
              disabled={!selectedStateId}
              onClick={() => setShowAddCity(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg hover:bg-[#4b49ac]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add City</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Cities</p>
            <Building2 className="w-5 h-5 text-[#4b49ac]" />
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">{stats.totalDepartments}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active Cities</p>
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
            className="min-w-[180px] px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac] transition"
            >
            {countries.map((c) => (
                <option key={c.id} value={c.id}>
                {c.name}
                </option>
            ))}
            </select>
        </div>

        {/* State */}
        <div className="flex flex-col">
            <label className="text-xs text-muted-foreground mb-1">
            State
            </label>

            <select
            value={selectedStateId || ''}
            onChange={(e) => {
                const id = Number(e.target.value);

                setSelectedStateId(id);

                setCityForm((prev) => ({
                ...prev,
                stateId: id.toString()
                }));

                fetchCities(id);
                setCurrentPage(1);
            }}
            className="min-w-[180px] px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4b49ac] transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={!allStates.length}
            >
            {allStates.length === 0 ? (
                <option>No States Available</option>
            ) : (
                allStates.map((s) => (
                <option key={s.id} value={s.id}>
                    {s.name}
                </option>
                ))
            )}
            </select>
        </div>

      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden mb-6 mt-5">
        <div className="p-4 border-b border-border">
          <h3 className="text-foreground">Cities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sidebar-accent">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">City Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedCities.map((dept: City, index) => (
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
                            setEditingCity({ ...dept });

                            // 🔥 set country + states for edit modal
                            setEditCountryId(selectedCountryId);
                            setEditStates(allStates);

                            setShowEditCityModal(true);
                        }}
                        className="p-1.5 rounded hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteCity(dept)}
                        className="p-1.5 rounded hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete"
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
      {showAddCityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-foreground">Add New City</h3>
                <p className="text-sm text-muted-foreground">Add a new country to your system and manage its details</p>   
              </div>
              <button
                onClick={() => {
                  setShowAddCity(false);
                  setCityForm({
                    name: '',
                    description: '',
                    stateId: '',
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
                    {/* Country Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                        Country <span className="text-red-600">*</span>
                        </label>
                        <select
                        value={modalCountryId || ''}
                        onChange={(e) => {
                            const id = Number(e.target.value);
                            setModalCountryId(id);
                            fetchStatesForModal(id);
                        }}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                            <option key={c.id} value={c.id}>
                            {c.name}
                            </option>
                        ))}
                        </select>
                    </div>

                    {/* State Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                        State <span className="text-red-600">*</span>
                        </label>
                        <select
                        value={cityForm.stateId}
                        onChange={(e) =>
                            setCityForm({
                            ...cityForm,
                            stateId: e.target.value
                            })
                        }
                        disabled={!modalStates.length}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac] disabled:bg-gray-100"
                        >
                        <option value="">Select State</option>
                        {modalStates.map((s) => (
                            <option key={s.id} value={s.id}>
                            {s.name}
                            </option>
                        ))}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={cityForm.name}
                      onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                      placeholder="Enter city name"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                    />
                  </div>
                </div>  
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={cityForm.description}
                    onChange={(e) => setCityForm({ ...cityForm, description: e.target.value,})}
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
                    value={cityForm.status}
                    onChange={(e) => setCityForm({ ...cityForm, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
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
                  setShowAddCity(false);
                  setCityForm({
                    name: '',
                    description: '',
                    stateId: '',
                    status: 'ACTIVE'
                  });
                }}
                className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCity}
                disabled={!cityForm.name.trim()}
                className="px-6 py-2.5 rounded-lg bg-[#4b49ac] text-white hover:bg-[#4b49ac]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create City
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditCityModal && editingCity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-foreground">Edit City</h3>
                <p className="text-sm text-muted-foreground">Modify and update the details of the selected country</p>
              </div>
              <button
                onClick={() => {
                  setShowEditCityModal(false);
                  setEditingCity(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">

                    {/* Country */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                        Country <span className="text-red-600">*</span>
                        </label>

                        <select
                        value={editCountryId || ''}
                        onChange={(e) => {
                            const id = Number(e.target.value);
                            setEditCountryId(id);
                            fetchStatesForEdit(id);
                        }}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac]"
                        >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                            <option key={c.id} value={c.id}>
                            {c.name}
                            </option>
                        ))}
                        </select>
                    </div>

                    {/* State */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                        State <span className="text-red-600">*</span>
                        </label>

                        <select
                        value={editingCity.stateId}
                        onChange={(e) =>
                            setEditingCity({
                            ...editingCity,
                            stateId: Number(e.target.value)
                            })
                        }
                        disabled={!editStates.length}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b49ac] disabled:bg-gray-100"
                        >
                        <option value="">Select State</option>
                        {editStates.map((s) => (
                            <option key={s.id} value={s.id}>
                            {s.name}
                            </option>
                        ))}
                        </select>
                    </div>

                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingCity.name}
                      onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
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
                    value={editingCity.description}
                    onChange={(e) => setEditingCity({ ...editingCity, description: e.target.value })}
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
                    value={editingCity.status === 0 ? 'ACTIVE' : 'INACTIVE'}
                    onChange={(e) =>
                        setEditingCity({
                        ...editingCity,
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
                  setShowEditCityModal(false);
                  setEditingCity(null);
                }}
                className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCity}
                disabled={!editingCity.name.trim()}
                className="px-6 py-2.5 rounded-lg bg-[#4b49ac] text-white hover:bg-[#4b49ac]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Update City
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && cityToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-red-100">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-2">Delete City</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Are you sure you want to delete this city <span className="font-semibold">"{cityToDelete.name}"</span>? This action cannot be undone and will permanently remove the record.
                  </p>
                  {cityToDelete.id && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-yellow-800">
                        This city is currently in use and cannot be deleted.{cityToDelete.id ? 's' : ''} assigned and cannot be deleted.
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
                  setCityToDelete(null);
                }}
                className="px-4 py-2 rounded-lg border border-border bg-white text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCity}
                disabled={false}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Delete City
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
