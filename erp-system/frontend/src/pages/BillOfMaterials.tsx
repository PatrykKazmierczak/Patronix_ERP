import React, { useState } from 'react';
import { HiPlus, HiSearch, HiChevronRight, HiChevronDown } from 'react-icons/hi';

interface BOMItem {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  components?: BOMItem[];
}

interface BOMTreeProps {
  item: BOMItem;
  level: number;
  onItemClick: (item: BOMItem) => void;
}

const BOMTree: React.FC<BOMTreeProps> = ({ item, level, onItemClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="ml-4">
      <div 
        className={`flex items-center p-2 hover:bg-gray-50 cursor-pointer ${level === 0 ? 'bg-blue-50' : ''}`}
        onClick={() => {
          if (item.components?.length) {
            setIsExpanded(!isExpanded);
          }
          onItemClick(item);
        }}
      >
        <div className="w-6">
          {item.components?.length ? (
            isExpanded ? (
              <HiChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <HiChevronRight className="w-5 h-5 text-gray-500" />
            )
          ) : null}
        </div>
        <div className="flex-1 ml-2">
          <div className="font-medium">{item.itemCode}</div>
          <div className="text-sm text-gray-600">{item.description}</div>
        </div>
        <div className="text-right">
          <div className="font-medium">{item.quantity}</div>
          <div className="text-sm text-gray-600">{item.unit}</div>
        </div>
      </div>
      {isExpanded && item.components && (
        <div className="ml-6">
          {item.components.map((component) => (
            <BOMTree
              key={component.id}
              item={component}
              level={level + 1}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BillOfMaterials: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<BOMItem | null>(null);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState<Partial<BOMItem>>({
    itemCode: '',
    description: '',
    quantity: 1,
    unit: 'pcs',
  });
  const [parentItem, setParentItem] = useState<BOMItem | null>(null);

  // Example data - w przyszłości będzie pobierane z API
  const [items, setItems] = useState<BOMItem[]>([
    {
      id: '1',
      itemCode: 'ASSY-001',
      description: 'Final Assembly',
      quantity: 1,
      unit: 'pcs',
      components: [
        {
          id: '2',
          itemCode: 'COMP-001',
          description: 'Component 1',
          quantity: 2,
          unit: 'pcs',
          components: [
            {
              id: '4',
              itemCode: 'RAW-001',
              description: 'Raw Material 1',
              quantity: 0.5,
              unit: 'kg'
            }
          ]
        },
        {
          id: '3',
          itemCode: 'COMP-002',
          description: 'Component 2',
          quantity: 1,
          unit: 'pcs'
        }
      ]
    }
  ]);

  const handleNewItem = (parentItem?: BOMItem) => {
    setParentItem(parentItem || null);
    setNewItem({
      itemCode: '',
      description: '',
      quantity: 1,
      unit: 'pcs',
    });
    setShowNewItemForm(true);
  };

  const handleItemClick = (item: BOMItem) => {
    setSelectedItem(item);
  };

  const handleSaveNewItem = () => {
    if (!newItem.itemCode || !newItem.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newBOMItem: BOMItem = {
      id: Math.random().toString(36).substr(2, 9),
      itemCode: newItem.itemCode!,
      description: newItem.description!,
      quantity: newItem.quantity || 1,
      unit: newItem.unit || 'pcs',
      components: []
    };

    if (parentItem) {
      // Add as a component to parent item
      const updateItemsRecursively = (items: BOMItem[]): BOMItem[] => {
        return items.map(item => {
          if (item.id === parentItem.id) {
            return {
              ...item,
              components: [...(item.components || []), newBOMItem]
            };
          }
          if (item.components) {
            return {
              ...item,
              components: updateItemsRecursively(item.components)
            };
          }
          return item;
        });
      };

      setItems(updateItemsRecursively(items));
    } else {
      // Add as a top-level item
      setItems([...items, newBOMItem]);
    }

    setShowNewItemForm(false);
    setNewItem({
      itemCode: '',
      description: '',
      quantity: 1,
      unit: 'pcs',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Bill of Materials</h1>
        <button
          onClick={() => handleNewItem()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
        >
          <HiPlus className="w-5 h-5 mr-2" />
          New Item
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left panel - BOM Tree */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <HiSearch className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="p-4">
            {items.map((item) => (
              <BOMTree
                key={item.id}
                item={item}
                level={0}
                onItemClick={handleItemClick}
              />
            ))}
          </div>
        </div>

        {/* Right panel - Item Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Item Details</h2>
          </div>
          <div className="p-4">
            {selectedItem ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item Code</label>
                  <div className="mt-1 text-lg">{selectedItem.itemCode}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <div className="mt-1">{selectedItem.description}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <div className="mt-1">{selectedItem.quantity}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                    <div className="mt-1">{selectedItem.unit}</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Components</label>
                  <div className="mt-1">
                    {selectedItem.components?.length ? (
                      <div className="space-y-2">
                        {selectedItem.components.map((comp) => (
                          <div key={comp.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <div className="font-medium">{comp.itemCode}</div>
                              <div className="text-sm text-gray-600">{comp.description}</div>
                            </div>
                            <div className="text-right">
                              <div>{comp.quantity} {comp.unit}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No components</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Select an item to view details</p>
            )}
          </div>
        </div>
      </div>

      {/* New Item Modal */}
      {showNewItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {parentItem ? `Add Component to ${parentItem.itemCode}` : 'Add New Item'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Item Code *
                </label>
                <input
                  type="text"
                  value={newItem.itemCode}
                  onChange={(e) => setNewItem({ ...newItem, itemCode: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                  placeholder="Enter item code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                  rows={3}
                  placeholder="Enter item description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unit
                  </label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                  >
                    <option value="pcs">pcs</option>
                    <option value="kg">kg</option>
                    <option value="m">m</option>
                    <option value="l">l</option>
                    <option value="m2">m²</option>
                    <option value="m3">m³</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowNewItemForm(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Component Button when item is selected */}
      {selectedItem && (
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => handleNewItem(selectedItem)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center shadow-lg hover:bg-blue-700"
          >
            <HiPlus className="w-5 h-5 mr-2" />
            Add Component
          </button>
        </div>
      )}
    </div>
  );
};

export default BillOfMaterials; 