'use client';

import React, { useState, FormEvent } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Minus, 
  LogOut, 
  X, 
  Lock, 
  TrendingDown, 
  CreditCard, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';

// Type Definitions
type StoreName = 'Walmart' | 'Superstore' | 'Costco' | 'FreshCo' | 'No Frills' | 'Save-On-Foods';

type StorePrices = Record<StoreName, number>;

interface Product {
  id: number;
  name: string;
  category: string;
  unit: string;
  image: string;
  storePrices: StorePrices;
}

interface CartItem extends Product {
  store: StoreName;
  price: number;
  qty: number;
}

interface Address {
  name: string;
  street: string;
  city: string;
  postal: string;
}

type CheckoutStep = 'checkout' | 'success' | null;

export default function KavyoGroceryApp() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // App & Cart State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>(null);
  const [address, setAddress] = useState<Address>({
    name: 'Parneet Kaur',
    street: '123 University Ave',
    city: 'Calgary',
    postal: 'T2M 1N7'
  });

  // Stores & Categories Lists
  const stores: StoreName[] = ['Walmart', 'Superstore', 'Costco', 'FreshCo', 'No Frills', 'Save-On-Foods'];
  const categories: string[] = ['All', 'Produce', 'Dairy & Eggs', 'Bakery', 'Meat & Seafood', 'Pantry'];

  // Grocery Products Database
  const products: Product[] = [
    {
      id: 1,
      name: 'Organic Fresh Bananas',
      category: 'Produce',
      unit: '1 bunch (~1.5 kg)',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
      storePrices: {
        'Walmart': 1.99,
        'Superstore': 1.88,
        'Costco': 1.69,
        'FreshCo': 1.79,
        'No Frills': 1.75,
        'Save-On-Foods': 2.19
      }
    },
    {
      id: 2,
      name: 'Fresh Gala Apples',
      category: 'Produce',
      unit: '3 lb bag',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
      storePrices: {
        'Walmart': 3.97,
        'Superstore': 3.49,
        'Costco': 4.29,
        'FreshCo': 3.29,
        'No Frills': 3.19,
        'Save-On-Foods': 4.49
      }
    },
    {
      id: 3,
      name: '2% Whole Milk',
      category: 'Dairy & Eggs',
      unit: '4 L Jug',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
      storePrices: {
        'Walmart': 5.69,
        'Superstore': 5.49,
        'Costco': 5.29,
        'FreshCo': 5.39,
        'No Frills': 5.25,
        'Save-On-Foods': 5.89
      }
    },
    {
      id: 4,
      name: 'Large Grade A Farm Eggs',
      category: 'Dairy & Eggs',
      unit: '12 Large Eggs',
      image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
      storePrices: {
        'Walmart': 4.18,
        'Superstore': 3.99,
        'Costco': 3.69,
        'FreshCo': 3.89,
        'No Frills': 3.79,
        'Save-On-Foods': 4.39
      }
    },
    {
      id: 5,
      name: 'Sliced Whole Wheat Bread',
      category: 'Bakery',
      unit: '675g Loaf',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      storePrices: {
        'Walmart': 2.97,
        'Superstore': 2.79,
        'Costco': 2.49,
        'FreshCo': 2.69,
        'No Frills': 2.59,
        'Save-On-Foods': 3.29
      }
    },
    {
      id: 6,
      name: 'Boneless Chicken Breasts',
      category: 'Meat & Seafood',
      unit: '1 kg pack',
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
      storePrices: {
        'Walmart': 13.99,
        'Superstore': 12.88,
        'Costco': 11.99,
        'FreshCo': 12.50,
        'No Frills': 12.25,
        'Save-On-Foods': 14.99
      }
    }
  ];

  // Helper to find cheapest store for a product
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

  // Login Form Submission
  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  // Add Item to Cart (Prompts Login if guest)
  const handleAddToCart = (product: Product, store: StoreName) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
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

  // Modify Quantity in Cart
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

  // Financial Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = cartSubtotal > 30 || cartSubtotal === 0 ? 0.00 : 3.99;
  const tax = cartSubtotal * 0.05;
  const cartTotal = cartSubtotal + deliveryFee + tax;

  // Filter products based on search & active tab
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#d8efbe] text-slate-900 pb-16">
      
      {/* Navigation Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <span className="font-black text-2xl tracking-widest text-[#1e293b]">KAVYO</span>
            <span className="hidden sm:inline-block text-xs bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full font-bold">
              6-Store Price Tracker
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 relative hidden md:block">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search bananas, milk, eggs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full text-xs text-slate-800 focus:outline-none focus:bg-white border border-transparent focus:border-slate-300 transition-all"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                if (!isLoggedIn) {
                  setShowLoginModal(true);
                } else {
                  setCartOpen(true);
                }
              }}
              className="relative px-3.5 py-2 bg-[#1e293b] hover:bg-slate-800 text-white rounded-xl shadow-md flex items-center space-x-2 text-xs font-bold transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart (${cartSubtotal.toFixed(2)})</span>
              {cart.length > 0 && (
                <span className="bg-emerald-400 text-slate-900 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px]">
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Guest Notice Banner */}
      {!isLoggedIn && (
        <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center space-x-2">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>You are browsing as a guest. Compare store prices freely! <strong>Sign in to add to cart & checkout.</strong></span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-[#1e293b] text-white shadow-md' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Store Comparison Grid */}
        <div className="space-y-6">
          {filteredProducts.map((product) => {
            const cheapest = getCheapestStore(product.storePrices);

            return (
              <div 
                key={product.id} 
                className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                {/* Product Card Details */}
                <div className="flex items-center space-x-4 min-w-[260px]">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-20 h-20 rounded-2xl object-cover bg-slate-100 shadow-inner"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{product.category}</span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">{product.name}</h3>
                    <span className="text-xs text-slate-500 font-medium block mb-2">{product.unit}</span>
                    <div className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cheapest: ${cheapest.price.toFixed(2)} at {cheapest.store}</span>
                    </div>
                  </div>
                </div>

                {/* 6 Store Price Comparison Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 w-full lg:w-auto flex-1">
                  {stores.map((store) => {
                    const price = product.storePrices[store];
                    const isCheapest = store === cheapest.store;

                    return (
                      <div 
                        key={store} 
                        className={`p-3 rounded-2xl text-center border transition-all flex flex-col justify-between ${
                          isCheapest 
                            ? 'bg-emerald-50/80 border-emerald-400 shadow-sm' 
                            : 'bg-slate-50/80 border-slate-200/60'
                        }`}
                      >
                        <div>
                          <span className="block text-[11px] font-bold text-slate-500 truncate">{store}</span>
                          <span className={`block font-extrabold text-sm my-1 ${isCheapest ? 'text-emerald-700' : 'text-slate-800'}`}>
                            ${price.toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product, store)}
                          className={`w-full py-1.5 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center space-x-1 ${
                            isCheapest 
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm' 
                              : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300'
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
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

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#d8efbe] rounded-3xl p-8 max-w-sm w-full shadow-2xl relative border border-slate-300 text-center">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-600 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h1 className="text-4xl font-black text-[#1e293b] tracking-wider mb-2">
              KAVYO
            </h1>
            <p className="text-[#334155] text-xs font-medium mb-6">
              Sign in to your account
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none shadow-sm text-sm"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none shadow-sm text-sm"
              />

              <button
                type="submit"
                className="w-full py-3 bg-[#1e293b] hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-colors shadow-md mt-2"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#1e293b]" />
                  <h3 className="font-extrabold text-slate-900 text-lg">Your Grocery Basket</h3>
                </div>
                <button onClick={() => setCartOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 divide-y divide-slate-100 overflow-y-auto max-h-[60vh] space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-slate-600">Your basket is empty</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="pt-4 first:pt-0 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h4>
                          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                            {item.store} • ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50">
                          <button onClick={() => updateQuantity(idx, -1)} className="text-slate-500 hover:text-slate-900">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs w-5 text-center text-slate-800">{item.qty}</span>
                          <button onClick={() => updateQuantity(idx, 1)} className="text-slate-500 hover:text-slate-900">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-slate-900 text-sm w-12 text-right">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Estimated Delivery</span>
                  <span className={deliveryFee === 0 ? "text-emerald-600 font-bold" : ""}>
                    {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <button 
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutStep('checkout');
                  }}
                  className="w-full py-3.5 bg-[#1e293b] hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutStep === 'checkout' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setCheckoutStep(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-2xl text-slate-900 mb-1">Final Checkout</h3>
            <p className="text-xs text-slate-500 mb-6">Review your delivery address and order details.</p>

            <div className="bg-slate-50 p-4 rounded-2xl mb-6 space-y-3 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Delivery Address</span>
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input 
                  type="text" 
                  value={address.name} 
                  onChange={(e) => setAddress({ ...address, name: e.target.value })} 
                  className="p-2 bg-white rounded-xl border border-slate-200 focus:outline-none"
                  placeholder="Full Name"
                />
                <input 
                  type="text" 
                  value={address.street} 
                  onChange={(e) => setAddress({ ...address, street: e.target.value })} 
                  className="p-2 bg-white rounded-xl border border-slate-200 focus:outline-none"
                  placeholder="Street Address"
                />
                <input 
                  type="text" 
                  value={address.city} 
                  onChange={(e) => setAddress({ ...address, city: e.target.value })} 
                  className="p-2 bg-white rounded-xl border border-slate-200 focus:outline-none"
                  placeholder="City"
                />
                <input 
                  type="text" 
                  value={address.postal} 
                  onChange={(e) => setAddress({ ...address, postal: e.target.value })} 
                  className="p-2 bg-white rounded-xl border border-slate-200 focus:outline-none"
                  placeholder="Postal Code"
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <span className="text-xs font-bold text-slate-700 block">Order Summary</span>
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-800 font-medium">{item.qty}x {item.name} ({item.store})</span>
                  <span className="font-bold text-slate-900">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-100 p-4 rounded-2xl space-y-2 text-xs mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setCheckoutStep('success');
                setCart([]);
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all text-sm flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm & Pay (${cartTotal.toFixed(2)})</span>
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {checkoutStep === 'success' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            <h3 className="font-extrabold text-xl text-slate-900">Order Confirmed!</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thank you, <strong>{address.name}</strong>! Your order will be delivered to <strong>{address.street}, {address.city}</strong> in ~30 mins.
            </p>
            <button 
              onClick={() => setCheckoutStep(null)}
              className="w-full py-3 bg-[#1e293b] text-white rounded-2xl font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Back to Store
            </button>
          </div>
        </div>
      )}

    </div>
  );
}