import { useState, useEffect, Fragment } from 'react';
import {
  LayoutDashboard, Search, Edit2, X, Plus, FolderTree,
  ChevronRight, ChevronDown, CheckCircle, AlertCircle, Trash2,
  ExternalLink, Layers
} from 'lucide-react';
import { getMenus, createMenu, updateMenu, deleteMenu } from '../../api/menus.api';

interface Menu {
  id: number;
  title: string;
  icon: string;
  path: string;
  parent_id: number | null;
  sort_order: number;
  is_active: number;
  subMenus?: Menu[];
}

export function MenuManagement() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [flatMenus, setFlatMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedMenuId, setDraggedMenuId] = useState<number | null>(null);
  const [dragOverMenuId, setDragOverMenuId] = useState<number | null>(null);
  const [currentMenu, setCurrentMenu] = useState<Partial<Menu>>({
    title: '',
    icon: 'LayoutDashboard',
    path: '',
    parent_id: null,
    sort_order: 0,
    is_active: 1
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await getMenus(true); // tree format
      const flatRes = await getMenus(false); // flat format
      if (res.success) {
        setMenus(res.data);
      }
      if (flatRes.success) {
        setFlatMenus(flatRes.data);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      showToast('Failed to load menus', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getNextSortOrder = (parentId: number | null) => {
    const siblings = flatMenus.filter((m) => m.parent_id === parentId);
    return siblings.length + 1;
  };

  const handleSave = async () => {
    try {
      if (!currentMenu.title) {
        showToast('Title is required', 'error');
        return;
      }

      const menuToSave = {
        ...currentMenu,
        path: currentMenu.path || currentMenu.title.toLowerCase().replace(/\s+/g, '-'),
        sort_order: currentMenu.sort_order || getNextSortOrder(currentMenu.parent_id ?? null)
      };

      if (isEditing && currentMenu.id) {
        const res = await updateMenu(currentMenu.id, menuToSave);
        if (res.success) {
          showToast('Menu updated successfully');
        }
      } else {
        const res = await createMenu(menuToSave);
        if (res.success) {
          showToast('Menu created successfully');
        }
      }
      setShowModal(false);
      fetchMenus();
    } catch (error) {
      console.error('Error saving menu:', error);
      showToast('Failed to save menu', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this menu? Submenus will also be deleted.')) {
      try {
        const res = await deleteMenu(id);
        if (res.success) {
          showToast('Menu deleted successfully');
          fetchMenus();
        }
      } catch (error) {
        console.error('Error deleting menu:', error);
        showToast('Failed to delete menu', 'error');
      }
    }
  };

  const flattenMenuTree = (menuList: Menu[]): Menu[] => {
    return menuList.reduce<Menu[]>((acc, item) => {
      acc.push(item);
      if (item.subMenus && item.subMenus.length > 0) {
        acc.push(...flattenMenuTree(item.subMenus));
      }
      return acc;
    }, []);
  };

  const updateSiblingOrder = async (updatedList: Menu[]) => {
    const orderUpdates = updatedList
      .map((menu, index) => ({ id: menu.id, sort_order: index + 1, parent_id: menu.parent_id }))
      .filter((menu) => {
        const previous = flatMenus.find((item) => item.id === menu.id);
        return previous?.sort_order !== menu.sort_order;
      });

    if (orderUpdates.length === 0) {
      return;
    }

    await Promise.all(orderUpdates.map((menu) => updateMenu(menu.id, { sort_order: menu.sort_order })));
  };

  const reorderMenuTree = (menuList: Menu[], draggedId: number, targetId: number): { updatedList: Menu[]; changed: boolean } => {
    const draggedIndex = menuList.findIndex((menu) => menu.id === draggedId);
    const targetIndex = menuList.findIndex((menu) => menu.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const updatedList = [...menuList];
      const [draggedItem] = updatedList.splice(draggedIndex, 1);
      updatedList.splice(targetIndex, 0, draggedItem);
      return { updatedList, changed: true };
    }

    const updatedList = menuList.map((menu) => {
      if (menu.subMenus) {
        const result = reorderMenuTree(menu.subMenus, draggedId, targetId);
        if (result.changed) {
          return { ...menu, subMenus: result.updatedList };
        }
      }
      return menu;
    });

    const changed = updatedList.some((menu, index) => menu !== menuList[index]);
    return { updatedList, changed };
  };

  const assignSortOrders = (menuList: Menu[]): Menu[] => {
    return menuList.map((menu, index) => ({
      ...menu,
      sort_order: index + 1,
      subMenus: menu.subMenus ? assignSortOrders(menu.subMenus) : undefined
    }));
  };

  const handleDrop = async (event: React.DragEvent<HTMLTableRowElement>, targetId: number) => {
    event.preventDefault();
    setDragOverMenuId(null);
    if (draggedMenuId === null || draggedMenuId === targetId) {
      return;
    }

    const { updatedList, changed } = reorderMenuTree(menus, draggedMenuId, targetId);
    if (!changed) {
      return;
    }

    const reordered = assignSortOrders(updatedList);
    setMenus(reordered);
    setFlatMenus(flattenMenuTree(reordered));
    await updateSiblingOrder(flattenMenuTree(reordered));
    showToast('Menu order updated successfully');
  };

  const handleDragStart = (event: React.DragEvent<HTMLTableRowElement>, menuId: number) => {
    event.dataTransfer.effectAllowed = 'move';
    setDraggedMenuId(menuId);
  };

  const handleDragOver = (event: React.DragEvent<HTMLTableRowElement>, menuId: number) => {
    event.preventDefault();
    setDragOverMenuId(menuId);
  };

  const handleDragLeave = () => {
    setDragOverMenuId(null);
  };

  const openAddModal = (parentId: number | null = null) => {
    setIsEditing(false);
    setCurrentMenu({
      title: '',
      icon: 'LayoutDashboard',
      path: '',
      parent_id: parentId,
      sort_order: 0,
      is_active: 1
    });
    setShowModal(true);
  };

  const openEditModal = (menu: Menu) => {
    setIsEditing(true);
    setCurrentMenu(menu);
    setShowModal(true);
  };

  const RenderMenuRows = ({ menuList, level = 0 }: { menuList: Menu[], level?: number }) => {
    return (
      <>
        {menuList.map((menu) => (
          <Fragment key={menu.id}>
            <tr
              draggable
              onDragStart={(event) => handleDragStart(event, menu.id)}
              onDragOver={(event) => handleDragOver(event, menu.id)}
              onDragLeave={handleDragLeave}
              onDrop={(event) => handleDrop(event, menu.id)}
              className={`transition-colors ${dragOverMenuId === menu.id ? 'bg-blue-50' : 'hover:bg-sidebar-accent'} ${draggedMenuId === menu.id ? 'opacity-70' : ''}`}
            >
              <td className="px-4 py-3">
                <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
                  <div className="mr-2 text-muted-foreground cursor-grab">≡</div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary relative">
                      <Layers className="w-4 h-4" />
                      {[1, 2, 6].includes(menu.id) && (
                        <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full ring-2 ring-white">
                          <CheckCircle className="w-2 h-2" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-foreground">{menu.title}</p>
                        {[1, 2, 6].includes(menu.id) && <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded font-bold uppercase tracking-tighter">System</span>}
                      </div>
                      <p className="text-[10px] text-muted-foreground">ID: {menu.id}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {menu.path || '-'}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {menu.icon}
              </td>
              <td className="px-4 py-3 text-sm text-center">
                {menu.sort_order}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${menu.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                  {menu.is_active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => openAddModal(menu.id)}
                    className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Add Submenu"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(menu)}
                    className={`p-1.5 rounded transition-colors ${[1, 2, 6].includes(menu.id) ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:bg-green-50 text-green-600'}`}
                    title={[1, 2, 6].includes(menu.id) ? "Core system menus cannot be edited" : "Edit"}
                    disabled={[1, 2, 6].includes(menu.id)}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(menu.id)}
                    className={`p-1.5 rounded transition-colors ${[1, 2, 6].includes(menu.id) ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:bg-red-50 text-red-600'}`}
                    title={[1, 2, 6].includes(menu.id) ? "Core system menus cannot be deleted" : "Delete"}
                    disabled={[1, 2, 6].includes(menu.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
            {menu.subMenus && <RenderMenuRows menuList={menu.subMenus} level={level + 1} />}
          </Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="flex-1 bg-[#f5f7ff] p-6 overflow-auto min-h-full">
      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border animate-in fade-in slide-in-from-top-4 ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-1">Menu Management</h2>
            <p className="text-sm text-muted-foreground">Configure the sidebar navigation structure</p>
            <p className="text-sm text-muted-foreground mt-2">Drag rows to reorder menus. Order is saved automatically.</p>
          </div>
          <button
            onClick={() => openAddModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-lg hover:bg-[#4b49ac]/90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Top Level Menu</span>
          </button>
        </div>
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sidebar-accent/50 border-b border-border">
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menu Title</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Path</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Icon</th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order</th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm">Loading menu structure...</p>
                    </div>
                  </td>
                </tr>
              ) : menus.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <FolderTree className="w-8 h-8 opacity-20" />
                      <p className="text-sm">No menus found. Create your first menu to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <RenderMenuRows menuList={menus} />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-semibold text-foreground">
                {isEditing ? 'Edit Menu' : 'Add New Menu'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-gray-200 text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Menu Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentMenu.title}
                  onChange={(e) => setCurrentMenu({ ...currentMenu, title: e.target.value })}
                  placeholder="e.g. User Management"
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Select Icon
                  </label>
                  <select
                    value={currentMenu.icon}
                    onChange={(e) => setCurrentMenu({ ...currentMenu, icon: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                  >
                    <option value="LayoutDashboard">Dashboard</option>
                    <option value="Shield">Shield (Admin)</option>
                    <option value="Users">Users</option>
                    <option value="Briefcase">Briefcase</option>
                    <option value="Settings">Settings</option>
                    <option value="FolderTree">Folder Tree</option>
                    <option value="FileText">File Text</option>
                    <option value="PieChart">Pie Chart</option>
                    <option value="Calendar">Calendar</option>
                    <option value="Mail">Mail</option>
                    <option value="Bell">Bell</option>
                    <option value="CreditCard">Credit Card</option>
                    <option value="Database">Database</option>
                    <option value="Globe">Globe</option>
                    <option value="Lock">Lock</option>
                    <option value="Map">Map</option>
                    <option value="Package">Package</option>
                    <option value="ShoppingCart">Shopping Cart</option>
                    <option value="Tag">Tag</option>
                    <option value="Terminal">Terminal</option>
                    <option value="Truck">Truck</option>
                    <option value="Video">Video</option>
                    <option value="Zap">Zap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Parent Menu
                  </label>
                  <select
                    value={currentMenu.parent_id || ''}
                    onChange={(e) => setCurrentMenu({ ...currentMenu, parent_id: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                  >
                    <option value="">None (Top Level)</option>
                    {flatMenus.filter(m => m.id !== currentMenu.id).map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Status
                </label>
                <select
                  value={currentMenu.is_active}
                  onChange={(e) => setCurrentMenu({ ...currentMenu, is_active: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-border flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-lg border border-border bg-white text-foreground font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-lg bg-[#4b49ac] text-white font-medium hover:bg-[#4b49ac]/90 transition-colors shadow-sm"
              >
                {isEditing ? 'Save Changes' : 'Create Menu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

