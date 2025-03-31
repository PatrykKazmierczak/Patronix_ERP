import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { HiChevronDown, HiChevronRight } from 'react-icons/hi';

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
  HiOutlineCog as HiOutlineSettings,
  HiOutlineClipboard,
  HiOutlineBeaker,
  HiOutlineLightBulb
} from 'react-icons/hi';

interface SubNavItem {
  name: string;
  path: string;
}

interface NavItem {
  name: string;
  path?: string;
  icon: ReactNode;
  subItems?: SubNavItem[];
}

const navigation: NavItem[] = [
  { name: 'Master Data', path: '/master-data', icon: <HiOutlineDatabase className="w-6 h-6" /> },
  { 
    name: 'Engineering', 
    icon: <HiOutlineBeaker className="w-6 h-6" />,
    subItems: [
      { name: 'Product Design', path: '/engineering/product-design' },
      { name: 'Bill of Materials', path: '/engineering/bom' },
      { name: 'Change Management', path: '/engineering/change-management' },
      { name: 'Technical Documentation', path: '/engineering/documentation' },
      { name: 'Research & Development', path: '/engineering/research' }
    ]
  },
  { 
    name: 'Sales', 
    icon: <HiOutlineShoppingCart className="w-6 h-6" />,
    subItems: [
      { name: 'Customer 360', path: '/sales/customer-360' },
      { name: 'Sales Orders', path: '/sales/orders' },
      { name: 'Order Intake Workbench', path: '/sales/order-intake' },
      { name: 'Order Fulfillment Workbench', path: '/sales/order-fulfillment' },
      { name: 'Inventory / Commitments', path: '/sales/inventory' },
      { name: 'Parameters', path: '/sales/parameters' }
    ]
  },
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
  const [expandedItems, setExpandedItems] = useState<string[]>(['Sales']); // Pre-expand Sales menu

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white overflow-y-auto">
        <div className="h-16 flex items-center px-6">
          <h1 className="text-xl font-semibold">ERP System</h1>
        </div>
        <nav className="mt-5">
          <div className="px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = item.path 
                ? location.pathname === item.path
                : item.subItems?.some(subItem => location.pathname === subItem.path);
              const isExpanded = expandedItems.includes(item.name);

              return (
                <div key={item.name}>
                  {item.subItems ? (
                    // Menu item with submenu
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md
                        ${isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'}
                      `}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </div>
                      {isExpanded ? (
                        <HiChevronDown className="w-5 h-5" />
                      ) : (
                        <HiChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  ) : (
                    // Regular menu item
                    <Link
                      to={item.path!}
                      className={`
                        flex items-center px-3 py-2 text-sm font-medium rounded-md
                        ${isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'}
                      `}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  )}

                  {/* Submenu items */}
                  {item.subItems && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`
                            block px-3 py-2 text-sm font-medium rounded-md
                            ${location.pathname === subItem.path
                              ? 'bg-blue-700 text-white'
                              : 'text-blue-100 hover:bg-blue-700'}
                          `}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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