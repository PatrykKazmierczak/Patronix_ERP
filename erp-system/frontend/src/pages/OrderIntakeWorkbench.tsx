import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import {
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineDocumentDownload,
  HiOutlinePrinter,
  HiOutlineAdjustments,
  HiOutlineFilter,
  HiChevronUp,
  HiChevronDown,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlinePlus
} from 'react-icons/hi';

interface Order {
  id: string;
  orderNumber: string;
  salesOffice: string;
  internalSalesRep: string;
  salesBusinessPartner: string;
  orderLines: number;
  backorderLines: number;
  salesOrders: number;
  releaseToWarehouse: boolean;
  releaseToAcknowledgement: boolean;
  releaseManualActivities: boolean;
  miscellaneous: boolean;
  noBackorders: boolean;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'S1000004',
    salesOffice: 'Main Office',
    internalSalesRep: 'John Doe',
    salesBusinessPartner: 'ABC Corp',
    orderLines: 5,
    backorderLines: 0,
    salesOrders: 2,
    releaseToWarehouse: true,
    releaseToAcknowledgement: true,
    releaseManualActivities: false,
    miscellaneous: false,
    noBackorders: true
  },
  // Add more mock data here...
];

type SortField = keyof Order;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export default function OrderIntakeWorkbench() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'orderNumber', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);

  // Sorting logic
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortConfig.direction === 'asc'
          ? (aValue === bValue ? 0 : aValue ? 1 : -1)
          : (aValue === bValue ? 0 : aValue ? -1 : 1);
      }
      
      return 0;
    });
  }, [orders, sortConfig]);

  // Filtering logic
  const filteredOrders = useMemo(() => {
    return sortedOrders.filter(order => {
      const searchFields = [
        order.orderNumber,
        order.salesOffice,
        order.internalSalesRep,
        order.salesBusinessPartner
      ];
      
      return searchFields.some(field => 
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [sortedOrders, searchTerm]);

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(current =>
      current.includes(orderId)
        ? current.filter(id => id !== orderId)
        : [...current, orderId]
    );
  };

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg">
        {/* General Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-4">General</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sales Office</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Internal Sales Representative</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sales Business Partner</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Lines Ready For Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Lines Ready For</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">Release to Warehouse</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">Release to Acknowledgement</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">Release Manual Activities</label>
            </div>
          </div>
        </div>

        {/* Miscellaneous Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Miscellaneous</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">No Backorders</label>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <HiOutlineRefresh className="w-5 h-5" />
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <HiOutlineSearch className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <HiOutlineDocumentDownload className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <HiOutlinePrinter className="w-5 h-5" />
              </button>
              <button 
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                onClick={() => setShowFilters(!showFilters)}
              >
                <HiOutlineFilter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {Object.keys(mockOrders[0] || {}).map((key) => (
                  <th
                    key={key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(key as SortField)}
                  >
                    <div className="flex items-center">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                      {sortConfig.field === key && (
                        sortConfig.direction === 'asc' ? <HiChevronUp className="ml-1 w-4 h-4" /> : <HiChevronDown className="ml-1 w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  {Object.entries(order).map(([key, value]) => (
                    <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof value === 'boolean' ? (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {value ? 'Yes' : 'No'}
                        </span>
                      ) : (
                        value.toString()
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <HiOutlinePencil className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
} 