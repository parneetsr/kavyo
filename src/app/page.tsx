'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  LogOut, 
  X, 
  Lock, 
  TrendingDown, 
  ShieldAlert,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

type StoreName = 'Walmart' | 'Superstore' | 'Costco' | 'FreshCo' | 'No Frills' | 'Save-On-Foods';
type StorePrices = Record<StoreName, number>;
type UserRole = 'GUEST' | 'USER';

interface Product {
  id: number;
  name: string;
  category: string;
  unit: string;
  image: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  priceObservations: any[]; // accepts the raw array directly
}

interface CartItem extends Product {
  store: StoreName;
  price: number;
  qty: number;
}

export default function KavyoGroceryApp() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => 
    {fetch('http://localhost:3000/basket')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch from backend:", err);
        setLoading(false);
      });
  }, []);


  const [role, setRole] = useState<UserRole>('USER');
  const [showUserLoginModal, setShowUserLoginModal] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  const stores: StoreName[] = ['Walmart', 'Superstore', 'Costco', 'FreshCo', 'No Frills', 'Save-On-Foods'];
  const categories: string[] = ['All', 'Produce', 'Dairy & Eggs', 'Bakery', 'Meat & Seafood', 'Pantry'];

  const defaultProducts: Product[] = [
    {
      id: 1,
      name: 'Organic Fresh Bananas',
      category: 'Produce',
      unit: '1 bunch (~1.5 kg)',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
      stock: 120,
      status: 'In Stock',
      storePrices: { 'Walmart': 1.99, 'Superstore': 1.88, 'Costco': 1.69, 'FreshCo': 1.79, 'No Frills': 1.75, 'Save-On-Foods': 2.19 }
    },
    {
      id: 2,
      name: 'Fresh Gala Apples',
      category: 'Produce',
      unit: '3 lb bag',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
      stock: 15,
      status: 'Low Stock',
      storePrices: { 'Walmart': 3.97, 'Superstore': 3.49, 'Costco': 4.29, 'FreshCo': 3.29, 'No Frills': 3.19, 'Save-On-Foods': 4.49 }
    },
    {
      id: 3,
      name: '2% Whole Milk',
      category: 'Dairy & Eggs',
      unit: '4 L Jug',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
      stock: 45,
      status: 'In Stock',
      storePrices: { 'Walmart': 5.69, 'Superstore': 5.49, 'Costco': 5.29, 'FreshCo': 5.39, 'No Frills': 5.25, 'Save-On-Foods': 5.89 }
    },
    {
      id: 4,
      name: 'Large Grade A Farm Eggs',
      category: 'Dairy & Eggs',
      unit: '12 Large Eggs',
      image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
      stock: 0,
      status: 'Out of Stock',
      storePrices: { 'Walmart': 4.18, 'Superstore': 3.99, 'Costco': 3.69, 'FreshCo': 3.89, 'No Frills': 3.79, 'Save-On-Foods': 4.39 }
    },
    {
      id: 5,
      name: 'Sliced Whole Wheat Bread',
      category: 'Bakery',
      unit: '675g Loaf',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      stock: 8,
      status: 'Low Stock',
      storePrices: { 'Walmart': 2.97, 'Superstore': 2.79, 'Costco': 2.49, 'FreshCo': 2.69, 'No Frills': 2.59, 'Save-On-Foods': 3.29 }
    },
    {
      id: 6,
      name: 'Boneless Chicken Breasts',
      category: 'Meat & Seafood',
      unit: '1 kg pack',
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
      stock: 60,
      status: 'In Stock',
      storePrices: { 'Walmart': 13.99, 'Superstore': 12.88, 'Costco': 11.99, 'FreshCo': 12.50, 'No Frills': 12.25, 'Save-On-Foods': 14.99 }
    }
  ];

  // const [products, setProducts] = useState<Product[]>(defaultProducts);

  const loadSyncedProducts = () => {
    const savedProducts = localStorage.getItem('kavyo_store_products');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        if (parsed && parsed.length > 0) {
          setProducts(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadSyncedProducts();
    const handleStorageChange = () => loadSyncedProducts();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  const getCheapestStore = (storePrices: StorePrices): { store: StoreName; price: number } => {
    let cheapestStore = stores[0];
    let lowestPrice = storePrices[stores[0]];
    stores.forEach((store) => {
      if (storePrices[store] < lowestPrice) {
        lowestPrice = storePrices[store];
        cheapestStore = store;
      }
    });
    return { store: cheapestStore, price: lowestPrice };
  };

  const handleUserLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRole('USER');
    setShowUserLoginModal(false);
  };

  const handleAdminLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === 'admin123' || password.length >= 6) {
      setShowAdminLoginModal(false);
      setLoginError('');
      router.push('/admin');
    } else {
      setLoginError('Invalid Admin credentials. Try password: admin123');
    }
  };

  const handleAddToCart = (product: Product, store: StoreName) => {
    if (role === 'GUEST') {
      setShowUserLoginModal(true);
      return;
    }
    if (product.status === 'Out of Stock') {
      alert('Sorry, this item is currently out of stock.');
      return;
    }

    const price = product.storePrices[store];
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id && item.store === store);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += 1;
        return updated;
      }
      return [...prev, { ...product, store, price, qty: 1 }];
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[index].qty + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].qty = newQty;
      return updated;
    });
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const filteredProducts = (Array.isArray(products) ? products : []).filter((p) => {
  // const filteredProducts = products.filter((p) => {

    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#d8efbe] text-slate-900 pb-16 font-sans">
      <div className="bg-slate-900 text-white px-4 py-2.5 text-xs flex flex-wrap justify-between items-center gap-2 border-b border-slate-800">
        <div className="flex items-center space-x-2 font-medium">
          <span className="text-slate-400">Current Perspective:</span>
          <span className="font-bold px-2.5 py-0.5 rounded-md bg-emerald-600/30 text-emerald-300 border border-emerald-500/30">
            {role} VIEW
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 hidden sm:inline">Switch Role:</span>
          <button onClick={() => setRole('GUEST')} className={`px-3 py-1 rounded-lg font-bold transition-all ${role === 'GUEST' ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>Guest</button>
          <button onClick={() => { if (role === 'GUEST') setShowUserLoginModal(true); else setRole('USER'); }} className={`px-3 py-1 rounded-lg font-bold transition-all ${role === 'USER' ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>User</button>
          <button onClick={() => setShowAdminLoginModal(true)} className="px-3 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>

      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-black text-2xl tracking-widest text-[#1e293b]">KAVYO</span>
            <span className="hidden sm:inline-block text-xs bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full font-bold">6-Store Price Tracker</span>
          </div>

          <div className="flex-1 max-w-md mx-4 relative hidden md:block">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full text-xs text-slate-800 focus:outline-none focus:bg-white border border-transparent focus:border-slate-300 transition-all" />
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => { if (role === 'GUEST') setShowUserLoginModal(true); else setCartOpen(true); }} className="relative px-3.5 py-2 bg-[#1e293b] hover:bg-slate-800 text-white rounded-xl shadow-md flex items-center space-x-2 text-xs font-bold transition-all">
              <ShoppingBag className="w-4 h-4" />
              <span>Cart (${cartSubtotal.toFixed(2)})</span>
              {cart.length > 0 && (
                <span className="bg-emerald-400 text-slate-900 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px]">
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>

            {role !== 'GUEST' ? (
              <button onClick={() => setRole('GUEST')} className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button onClick={() => setShowUserLoginModal(true)} className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-sm">
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {role === 'GUEST' && (
        <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center space-x-2">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>You are browsing as a <strong>Guest</strong>. Compare store prices freely! Sign in to add items to cart & checkout.</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-[#1e293b] text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredProducts.map((product) => {
            const cheapest = getCheapestStore(product.storePrices);
            const progressPercent = Math.min(100, ((product.stock ?? 50) / 150) * 100);

            return (
              <div key={product.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 min-w-[280px]">
                  <img src={product.image} alt={product.name} className="w-20 h-20 rounded-2xl object-cover bg-slate-100 shadow-inner" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{product.category}</span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">{product.name}</h3>
                    
                    {/* Stock Status Badge & Progress Bar on Home Page */}
                    <div className="flex items-center space-x-2 pt-1">
                      {product.status === 'In Stock' && (
                        <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>In Stock</span>
                        </span>
                      )}
                      {product.status === 'Low Stock' && (
                        <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Low Stock</span>
                        </span>
                      )}
                      {product.status === 'Out of Stock' && (
                        <span className="inline-flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                          <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                          <span>Out of Stock</span>
                        </span>
                      )}
                    </div>

                    <div className="w-36 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full ${
                          product.status === 'In Stock' ? 'bg-emerald-500' :
                          product.status === 'Low Stock' ? 'bg-amber-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 mt-1">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cheapest: ${cheapest.price.toFixed(2)} at {cheapest.store}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 w-full lg:w-auto flex-1">
                  {stores.map((store) => {
                    const price = product.storePrices[store];
                    const isCheapest = store === cheapest.store;
                    const isOutOfStock = product.status === 'Out of Stock';

                    return (
                      <div key={store} className={`p-3 rounded-2xl text-center border transition-all flex flex-col justify-between ${isCheapest ? 'bg-emerald-50/80 border-emerald-400 shadow-sm' : 'bg-slate-50/80 border-slate-200/60'}`}>
                        <div>
                          <span className="block text-[11px] font-bold text-slate-500 truncate">{store}</span>
                          <span className={`block font-extrabold text-sm my-1 ${isCheapest ? 'text-emerald-700' : 'text-slate-800'}`}>
                            ${price.toFixed(2)}
                          </span>
                        </div>
                        <button 
                          disabled={isOutOfStock}
                          onClick={() => handleAddToCart(product, store)} 
                          className={`w-full py-1.5 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center space-x-1 ${
                            isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed' :
                            isCheapest ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm' : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300'
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                          <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showUserLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#d8efbe] rounded-3xl p-8 max-w-sm w-full shadow-2xl relative border border-slate-300 text-center">
            <button onClick={() => setShowUserLoginModal(false)} className="absolute top-4 right-4 text-slate-600 hover:text-slate-900"><X className="w-5 h-5" /></button>
            <h1 className="text-4xl font-black text-[#1e293b] tracking-wider mb-2">KAVYO</h1>
            <p className="text-[#334155] text-xs font-medium mb-6">Sign in to your Customer Account</p>
            <form onSubmit={handleUserLogin} className="space-y-3">
              <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white rounded-xl text-slate-800 text-sm" />
              <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white rounded-xl text-slate-800 text-sm" />
              <button type="submit" className="w-full py-3 bg-[#1e293b] text-white font-semibold rounded-xl text-sm shadow-md">Sign In as Customer</button>
            </form>
          </div>
        </div>
      )}

      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-slate-700 text-center text-white">
            <button onClick={() => setShowAdminLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h2 className="text-2xl font-black mb-1">Admin Access Authorization</h2>
            <p className="text-xs text-slate-400 mb-6">Use password: admin123</p>
            {loginError && <div className="bg-red-500/20 text-red-300 p-2 rounded-xl text-xs mb-3">{loginError}</div>}
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input type="password" placeholder="Admin Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" />
              <button type="submit" className="w-full py-3.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm">Open Admin Console</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}