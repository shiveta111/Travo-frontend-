import { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { logoutUser } from '../../api/auth.api';
import { useAuth } from '../../auth/AuthContext';

export function TopBar() {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSubmenu = () => {
    setIsSubmenuOpen((prev) => !prev); // Toggle submenu visibility
  };

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


      window.location.href = '/login';
      // window.location.href = '/travo';

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
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
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

        <div className="flex items-center gap-3 pl-4 border-l border-border relative">
          <div className="text-right">
            <p className="text-sm text-foreground">Admin</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <div
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer"
            onClick={toggleSubmenu} // Toggle submenu on click
          >
            <User className="w-5 h-5 text-white" />
          </div>

          {/* Submenu */}
          {isSubmenuOpen && (
            <div className="absolute right-0 top-12 bg-white shadow-md rounded-lg border border-border w-48 py-2">
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors"
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