'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft, 
  ShieldAlert,
  LogOut,
  Package,
  XCircle
} from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image?: string;
}

export default function DedicatedAdminDashboard() {
  const [items, setItems] = useState<InventoryItem[]>([
    { id: 1, name: 'Organic Fresh Bananas', category: 'Produce', stock: 120, price: 1.69, status: 'In Stock', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'Fresh Gala Apples', category: 'Produce', stock: 15, price: 3.19, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: '2% Whole Milk (4L)', category: 'Dairy & Eggs', stock: 45, price: 5.25, status: 'In Stock', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'Large Grade A Farm Eggs', category: 'Dairy & Eggs', stock: 0, price: 3.69, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80' },
    { id: 5, name: 'Sliced Whole Wheat Bread', category: 'Bakery', stock: 8, price: 2.49, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [editPrice, setEditPrice] = useState<number>(0);

  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Produce');
  const [newItemStock, setNewItemStock] = useState(50);
  const [newItemPrice, setNewItemPrice] = useState(2.99);
  const [showAddModal, setShowAddModal] = useState(false);

  const getAutomaticImage = (productName: string): string => {
    const name = productName.toLowerCase();
    if (name.includes('carrot')) return 'https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&w=600&q=80';
    if (name.includes('banana')) return 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80';
    if (name.includes('apple')) return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80';
    if (name.includes('milk')) return 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80';
    if (name.includes('egg')) return 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80';
    if (name.includes('bread') || name.includes('loaf')) return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80';
    if (name.includes('chicken') || name.includes('meat')) return 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80';
    if (name.includes('strawberry')) return 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80';
    if (name.includes('avocado')) return 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80';
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
  };

  useEffect(() => {
    const saved = localStorage.getItem('admin_inventory_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveInventory = (updatedItems: InventoryItem[]) => {
    setItems(updatedItems);
    localStorage.setItem('admin_inventory_items', JSON.stringify(updatedItems));

    const customerProducts = updatedItems.map((item, idx) => ({
      id: item.id || idx + 1,
      name: item.name,
      category: item.category,
      unit: 'Standard Pack',
      stock: item.stock,
      status: item.status,
      image: item.image || getAutomaticImage(item.name),
      storePrices: {
        'Walmart': Number((item.price * 1.1).toFixed(2)),
        'Superstore': Number((item.price * 1.05).toFixed(2)),
        'Costco': Number(item.price.toFixed(2)),
        'FreshCo': Number((item.price * 1.08).toFixed(2)),
        'No Frills': Number((item.price * 1.02).toFixed(2)),
        'Save-On-Foods': Number((item.price * 1.2).toFixed(2))
      }
    }));

    localStorage.setItem('kavyo_store_products', JSON.stringify(customerProducts));
  };

  const handleUpdateStock = (id: number, delta: number) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock + delta);
        let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
        if (newStock === 0) status = 'Out of Stock';
        else if (newStock <= 20) status = 'Low Stock';
        return { ...item, stock: newStock, status };
      }
      return item;
    });
    saveInventory(updated);
  };

  const handleDeleteItem = (id: number) => {
    const updated = items.filter(item => item.id !== id);
    saveInventory(updated);
  };

  const handleStartEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditStock(item.stock);
    setEditPrice(item.price);
  };

  const handleSaveEdit = (id: number) => {
    const updated = items.map(item => {
      if (item.id === id) {
        let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
        if (editStock === 0) status = 'Out of Stock';
        else if (editStock <= 20) status = 'Low Stock';
        return { ...item, stock: editStock, price: editPrice, status };
      }
      return item;
    });
    saveInventory(updated);
    setEditingId(null);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (newItemStock === 0) status = 'Out of Stock';
    else if (newItemStock <= 20) status = 'Low Stock';

    const newItem: InventoryItem = {
      id: Date.now(),
      name: newItemName,
      category: newItemCategory,
      stock: newItemStock,
      price: newItemPrice,
      status,
      image: getAutomaticImage(newItemName)
    };

    saveInventory([...items, newItem]);
    setNewItemName('');
    setShowAddModal(false);
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Live stock calculations for the 3 blocks
  const inStockCount = items.filter(i => i.status === 'In Stock').length;
  const lowStockCount = items.filter(i => i.status === 'Low Stock').length;
  const outOfStockCount = items.filter(i => i.status === 'Out of Stock').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-1 text-slate-400 hover:text-white text-xs font-semibold bg-slate-700/50 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-all">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store Front</span>
            </Link>
            <div className="h-5 w-px bg-slate-700" />
            <h1 className="font-extrabold text-lg text-white flex items-center space-x-2">
              <span className="text-emerald-400 font-black">KAVYO</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
                <ShieldAlert className="w-3 h-3" />
                <span>ADMIN CONSOLE</span>
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => setShowAddModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all">
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
            <Link href="/" className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-700/50">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* 3 Summary Blocks on Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-emerald-500/30 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">In Stock</span>
              <span className="text-3xl font-black text-emerald-400">{inStockCount} <span className="text-sm font-semibold text-slate-300">items</span></span>
            </div>
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <CheckCircle className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-5 border border-amber-500/30 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Low Stock Alerts</span>
              <span className="text-3xl font-black text-amber-400">{lowStockCount} <span className="text-sm font-semibold text-slate-300">items</span></span>
            </div>
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-5 border border-red-500/30 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Out of Stock</span>
              <span className="text-3xl font-black text-red-400">{outOfStockCount} <span className="text-sm font-semibold text-slate-300">items</span></span>
            </div>
            <div className="p-3 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
              <XCircle className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Central Inventory Control Table */}
        <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white">Central Inventory Control & Stock Status</h2>

          <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock & Progress Bar</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 bg-slate-800/40">
                {filteredItems.map((item) => {
                  const progressPercent = Math.min(100, (item.stock / 150) * 100);

                  return (
                    <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-3.5 font-bold text-white flex items-center space-x-3">
                        <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <span>{item.name}</span>
                      </td>
                      <td className="p-3.5"><span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-[11px] font-semibold">{item.category}</span></td>
                      <td className="p-3.5 font-semibold text-slate-200">
                        {editingId === item.id ? (
                          <input type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)} className="w-20 p-1 bg-slate-900 border border-slate-600 rounded text-xs text-emerald-400" />
                        ) : (
                          `$${item.price.toFixed(2)}`
                        )}
                      </td>
                      <td className="p-3.5 w-48">
                        {editingId === item.id ? (
                          <input type="number" value={editStock} onChange={(e) => setEditStock(parseInt(e.target.value) || 0)} className="w-20 p-1 bg-slate-900 border border-slate-600 rounded text-xs text-white" />
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-white">{item.stock} units</span>
                              <div className="space-x-1">
                                <button onClick={() => handleUpdateStock(item.id, -10)} className="px-1.5 py-0.5 bg-slate-700 rounded text-red-400 font-bold hover:bg-slate-600">-10</button>
                                <button onClick={() => handleUpdateStock(item.id, 10)} className="px-1.5 py-0.5 bg-slate-700 rounded text-emerald-400 font-bold hover:bg-slate-600">+10</button>
                              </div>
                            </div>
                            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${
                                  item.status === 'In Stock' ? 'bg-emerald-500' :
                                  item.status === 'Low Stock' ? 'bg-amber-500' : 'bg-red-500'
                                }`} 
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-3.5">
                        {item.status === 'In Stock' && (
                          <span className="inline-flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                            <CheckCircle className="w-3 h-3" />
                            <span>In Stock</span>
                          </span>
                        )}
                        {item.status === 'Low Stock' && (
                          <span className="inline-flex items-center space-x-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low Stock</span>
                          </span>
                        )}
                        {item.status === 'Out of Stock' && (
                          <span className="inline-flex items-center space-x-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                            <Trash2 className="w-3 h-3" />
                            <span>Out of Stock</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {editingId === item.id ? (
                          <button onClick={() => handleSaveEdit(item.id)} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold">Save</button>
                        ) : (
                          <button onClick={() => handleStartEdit(item)} className="px-2 py-1 bg-slate-700 text-slate-200 rounded text-xs"><Edit3 className="w-3.5 h-3.5" /></button>
                        )}
                        <button onClick={() => handleDeleteItem(item.id)} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-700 text-xs space-y-3">
            <h3 className="text-base font-bold text-white mb-2">Add New Product</h3>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Product Name</label>
                <input type="text" required value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="e.g. Fresh Oranges" className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)} className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white">
                  <option value="Produce">Produce</option>
                  <option value="Dairy & Eggs">Dairy & Eggs</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Meat & Seafood">Meat & Seafood</option>
                  <option value="Pantry">Pantry</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Stock</label>
                  <input type="number" value={newItemStock} onChange={(e) => setNewItemStock(parseInt(e.target.value) || 0)} className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Base Price ($)</label>
                  <input type="number" step="0.01" value={newItemPrice} onChange={(e) => setNewItemPrice(parseFloat(e.target.value) || 0)} className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl">Save & Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}