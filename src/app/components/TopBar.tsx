import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { logoutUser } from '../../api/auth.api';
import { useAuth } from '../../auth/AuthContext';

export function TopBar() {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSubmenu = () => {
    setIsSubmenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSubmenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSubmenuOpen(false);
    };
    if (isSubmenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isSubmenuOpen]);

const {
  user,
  logout
} = useAuth();


const handleLogout =
  async () => {

    try {

      if (user?.id) {

        await logoutUser(
          user.id
        );

      }


      logout();


      // window.location.href = '/login';
      window.location.href = '/travo';

    } catch (error) {

      console.error(
        'Logout failed',
        error
      );

    }

};

//   console.log('Authenticated user:', user);

//   const handleLogout =
//   async () => {

//     try {

//       await logoutUser(
//         user.id
//       );

//       logout();

//     } catch (error) {

//       console.error(error);

//     }

// };

  // const handleLogout = () => {
  //   // Add your logout logic here, for example:
  //   localStorage.removeItem('auth');
  //   // Redirect to login or home
  //   window.location.href = '/login'; 
  // };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 relative z-30">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search modules, trips, clients..."
            className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
        </button>

        <div ref={dropdownRef} className="flex items-center gap-3 pl-4 border-l border-border relative">
          <div className="text-right">
            <p className="text-sm text-foreground">{user?.first_name || 'Admin'}</p>
            <p className="text-xs text-muted-foreground">{user?.department_name || user?.username || 'Administrator'}</p>
          </div>
          <div
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer"
            onClick={toggleSubmenu}
          >
            <User className="w-5 h-5 text-white" />
          </div>

          {isSubmenuOpen && (
            <div className="absolute right-0 top-11 bg-white shadow-lg rounded-lg border border-border w-36 py-1 z-50">
              <button
                onClick={handleLogout}
                className="w-full text-center text-red-600 hover:bg-red-50 py-2 px-3 text-sm font-medium transition-colors rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}