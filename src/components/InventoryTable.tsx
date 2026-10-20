import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function InventoryTable() {
  const { role } = useAuth();

  const [items, setItems] = useState([
    { id: 1, name: 'Wireless Mouse', stock: 45 },
    { id: 2, name: 'Mechanical Keyboard', stock: 12 },
  ]);

  const handleStockUpdate = (id: number, newStock: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, stock: newStock } : item
      )
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Inventory Dashboard ({role} Perspective)
      </h2>

      {/* Admin-only action */}
      {role === 'ADMIN' && (
        <div className="mb-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            + Add New Inventory Item (Admin Only)
          </button>
        </div>
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Item Name</th>
            <th className="border p-2">Stock Level</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.stock}</td>
              <td className="border p-2">
                {role === 'GUEST' && (
                  <span className="text-gray-500 italic">View Only</span>
                )}

                {role === 'USER' && (
                  <button
                    onClick={() => handleStockUpdate(item.id, item.stock + 1)}
                    className="bg-blue-500 text-white px-2 py-1 text-sm rounded"
                  >
                    Update Stock (User)
                  </button>
                )}

                {role === 'ADMIN' && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleStockUpdate(item.id, item.stock + 1)}
                      className="bg-blue-500 text-white px-2 py-1 text-sm rounded"
                    >
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 text-sm rounded">
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}