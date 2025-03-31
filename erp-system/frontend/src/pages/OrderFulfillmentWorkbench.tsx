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
  HiOutlineX
} from 'react-icons/hi';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  productCode: string;
  productName: string;
  price: number;
  quantity: number;
  orderedQuantity: number;
  deliveredQuantity: number;
  plannedDeliveryDate: string;
  releaseDate: string;
  actualDeliveryDate: string;
  deliveryStatus: 'Pending' | 'Released' | 'Completed';
  reviseDate: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'S1000004',
    customerName: 'TIP HP KATLAMA EKSTRA',
    productCode: 'SSF-25642',
    productName: 'HP KATLAMA EKSTRA',
    price: 4054.85,
    quantity: 15000,
    orderedQuantity: 15000,
    deliveredQuantity: 15000,
    plannedDeliveryDate: '2025-03-31',
    releaseDate: '2025-03-31',
    actualDeliveryDate: '2025-03-31',
    deliveryStatus: 'Completed',
    reviseDate: '2025-03-31'
  },
  // Add more mock data here...
];

type SortField = keyof Order;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export default function OrderFulfillmentWorkbench() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'orderNumber', direction: 'asc' });
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all'
  });

  // Sorting logic
  const sortedOrders = useMemo(() => {
    const sorted = [...orders].sort((a, b) => {
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
      
      return 0;
    });

    return sorted;
  }, [orders, sortConfig]);

  // Filtering logic
  const filteredOrders = useMemo(() => {
    return sortedOrders.filter(order => {
      const matchesSearch = Object.values(order).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesStatus = filters.status === 'all' || order.deliveryStatus === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [sortedOrders, searchTerm, filters]);

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

  const handleEdit = (orderId: string) => {
    setEditingOrder(orderId);
  };

  const handleSave = (orderId: string) => {
    // Implement save logic here
    setEditingOrder(null);
  };

  const handleCancel = () => {
    setEditingOrder(null);
  };

  const handleExport = () => {
    // Implement export logic here
    const selectedData = orders.filter(order => selectedOrders.includes(order.id));
    console.log('Exporting:', selectedData);
  };

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg">
        {/* Top Toolbar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
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
              <select
                className="border border-gray-300 rounded-md px-3 py-2"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Released">Released</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleExport}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                disabled={selectedOrders.length === 0}
              >
                <HiOutlineDocumentDownload className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <HiOutlinePrinter className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <HiOutlineAdjustments className="w-5 h-5" />
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
                      {editingOrder === order.id ? (
                        <input
                          type="text"
                          value={value.toString()}
                          onChange={(e) => {
                            // Implement edit logic
                          }}
                          className="border border-gray-300 rounded-md px-2 py-1 w-full"
                        />
                      ) : key === 'deliveryStatus' ? (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${value === 'Completed' ? 'bg-green-100 text-green-800' : 
                            value === 'Released' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {value}
                        </span>
                      ) : (
                        value.toString()
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingOrder === order.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave(order.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <HiOutlineCheck className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-600 hover:text-red-900"
                        >
                          <HiOutlineX className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(order.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    )}
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