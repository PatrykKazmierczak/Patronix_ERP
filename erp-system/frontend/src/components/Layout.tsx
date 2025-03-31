import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

// Import ikon z react-icons
import { 
  HiOutlineDatabase,
  HiOutlineShoppingCart,
  HiOutlineClipboardList,
  HiOutlineCog,
  HiOutlineCube,
  HiOutlineTruck,
  HiOutlineCash,
  HiOutlineDocument,
  HiOutlineTemplate,
  HiOutlineGlobe,
  HiOutlinePuzzle,
  HiOutlineTerminal,
  HiOutlineMailOpen,
  HiOutlineCog as HiOutlineSettings
} from 'react-icons/hi';

interface NavItem {
  name: string;
  path: string;
  icon: ReactNode;
}

const navigation: NavItem[] = [
  { name: 'Master Data', path: '/master-data', icon: <HiOutlineDatabase className="w-6 h-6" /> },
  { name: 'Sales', path: '/sales', icon: <HiOutlineShoppingCart className="w-6 h-6" /> },
  { name: 'Planning', path: '/planning', icon: <HiOutlineClipboardList className="w-6 h-6" /> },
  { name: 'Manufacturing', path: '/manufacturing', icon: <HiOutlineCog className="w-6 h-6" /> },
  { name: 'Procurement', path: '/procurement', icon: <HiOutlineCube className="w-6 h-6" /> },
  { name: 'Warehousing', path: '/warehousing', icon: <HiOutlineTruck className="w-6 h-6" /> },
  { name: 'Financials', path: '/financials', icon: <HiOutlineCash className="w-6 h-6" /> },
  { name: 'Invoicing', path: '/invoicing', icon: <HiOutlineDocument className="w-6 h-6" /> },
  { name: 'Common', path: '/common', icon: <HiOutlineTemplate className="w-6 h-6" /> },
  { name: 'Localization', path: '/localization', icon: <HiOutlineGlobe className="w-6 h-6" /> },
  { name: 'Enterprise Modeler', path: '/enterprise-modeler', icon: <HiOutlinePuzzle className="w-6 h-6" /> },
  { name: 'Tools', path: '/tools', icon: <HiOutlineTerminal className="w-6 h-6" /> },
  { name: 'E-Devlet', path: '/e-devlet', icon: <HiOutlineMailOpen className="w-6 h-6" /> },
  { name: 'Options', path: '/options', icon: <HiOutlineSettings className="w-6 h-6" /> },
];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white">
        <div className="h-16 flex items-center px-6">
          <h1 className="text-xl font-semibold">ERP System</h1>
        </div>
        <nav className="mt-5">
          <div className="px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${isActive 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:bg-blue-700'}
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="h-16 flex items-center justify-end px-6">
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 