import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, User, Search, SlidersHorizontal, Shield, 
  Trash2, Plus, Edit, RefreshCw, CheckCircle, Package, 
  ChevronRight, X, Lock, FileCode, Check, AlertCircle, ArrowLeft, ArrowRight
} from 'lucide-react';

// IMPORTAMOS LA AUTENTICACIÓN Y LOS COMPONENTES (FASE 1)
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';

// === CONTEXTO Y CONFIGURACIÓN FIREBASE SIMULADA / SDK ===
// En un entorno local React+Vite, estas variables se importan desde tu config/firebase.js
/*
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
*/

// Catálogo inicial con la temática de ropa masculina BALE (Negro, Blanco, Celeste)
const INITIAL_PRODUCTS = [
  { id: '1', name: 'BALE Oversized Cyan Hoodie', category: 'Abrigos', price: 89000, stock: 12, sizes: ['M', 'L', 'XL'], color: 'Negro/Celeste', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800', description: 'Buzo con capucha heavy-weight 480Gsm. Estampado serigráfico en la espalda y bordado en el pecho.' },
  { id: '2', name: 'BALE Technical Cargo Pant', category: 'Pantalones', price: 95000, stock: 8, sizes: ['S', 'M', 'L', 'XL'], color: 'Negro', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800', description: 'Pantalón cargo táctico con tiras ajustables y múltiples bolsillos funcionales.' },
  { id: '3', name: 'BALE Cyan Monogram Tee', category: 'Remeras', price: 42000, stock: 25, sizes: ['S', 'M', 'L', 'XL', 'XXL'], color: 'Blanco/Celeste', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800', description: 'Remera 100% algodón peinado 24/1. Corte boxy fit exclusivo con estampa BL frontal.' },
  { id: '4', name: 'BALE Urban Puffer Jacket', category: 'Abrigos', price: 145000, stock: 5, sizes: ['M', 'L', 'XL'], color: 'Negro Mate', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800', description: 'Campera campera inflable térmica resistente al agua con forrería interior celeste.' },
  { id: '5', name: 'BALE Classic Oxford Shirt', category: 'Camisas', price: 68000, stock: 14, sizes: ['S', 'M', 'L', 'XL'], color: 'Blanco', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800', description: 'Camisa manga larga Oxford con botones de resina y logo BL bordado en tono pastel.' },
  { id: '6', name: 'BALE Cyan Line Sneakers', category: 'Calzado', price: 120000, stock: 9, sizes: ['39', '40', '41', '42', '43', '44'], color: 'Negro/Blanco/Celeste', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800', description: 'Zapatillas urbanas de cuero sintético premium y suela reforzada de goma.' }
];

// LOGO BALE CON B EN BLANCO Y L EN CELESTE
const BaleMonogramLogo = ({ size = "md" }) => {
  const isLarge = size === "lg";
  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative flex items-center justify-center font-black rounded-lg border border-[#00C3FF]/30 bg-black ${isLarge ? 'w-14 h-14 text-2xl' : 'w-10 h-10 text-xl'}`}>
        <span className="text-white tracking-tighter">B</span>
        <span className="text-[#00C3FF] -ml-1 font-extrabold">L</span>
      </div>
      <div>
        <span className={`font-black tracking-widest text-white block leading-none ${isLarge ? 'text-2xl' : 'text-xl'}`}>
          BALE
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#00C3FF] block mt-0.5">
          MENSWEAR & EST. 2026
        </span>
      </div>
    </div>
  );
};

export default function App() {
  // HOOK DE FIREBASE AUTH (FASE 1)
  const { user, logout } = useAuth();
  
  // ESTADOS DE MODALES DE LOGIN (FASE 1)
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [activeVersion, setActiveVersion] = useState('v3'); // v1, v2, v3
  const [currentTab, setCurrentTab] = useState('shop'); // 'shop', 'admin', 'my-orders'
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Checkout & Admin States
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({ name: '', address: '', city: '', phone: '', paymentMethod: 'MercadoPago' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState(null);

  // Auto-notification helper
  const showNotice = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Carrito handlers
  const addToCart = (product, size) => {
    if (!size) {
      showNotice('Por favor selecciona un talle', 'error');
      return;
    }
    const itemKey = `${product.id}-${size}`;
    const existing = cart.find(item => item.key === itemKey);
    
    if (existing) {
      if (existing.quantity >= product.stock) {
        showNotice('Stock máximo alcanzado para este talle', 'error');
        return;
      }
      setCart(cart.map(item => item.key === itemKey ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, key: itemKey, selectedSize: size, quantity: 1 }]);
    }
    showNotice(`Agregado a la bolsa: ${product.name} (${size})`);
  };

  const removeFromCart = (key) => {
    setCart(cart.filter(item => item.key !== key));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Proceso de Compra (Checkout)
  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder = {
      id: `BAL-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('es-AR'),
      items: [...cart],
      total: cartTotal,
      status: 'En preparación',
      customer: shippingInfo.name || (user ? user.email.split('@')[0] : null) || 'Cliente BALE',
      address: `${shippingInfo.address}, ${shippingInfo.city}`
    };

    // Descontar stock
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    });

    setProducts(updatedProducts);
    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCartOpen(false);
    setCheckoutStep(1);
    showNotice(`¡Pedido #${newOrder.id} realizado con éxito!`);
  };

  // Categorías
  const categories = ['Todas', 'Remeras', 'Camisas', 'Pantalones', 'Abrigos', 'Calzado'];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'Todas' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white font-sans selection:bg-[#00C3FF] selection:text-black">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border backdrop-blur-md transition-all animate-bounce ${
          notification.type === 'error' ? 'bg-red-950/90 border-red-500 text-red-200' : 'bg-[#00C3FF]/20 border-[#00C3FF] text-white'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400" /> : <CheckCircle className="w-5 h-5 text-[#00C3FF]" />}
          <span className="font-medium text-sm">{notification.msg}</span>
        </div>
      )}

      {/* BANNER DE SELECCIÓN DE VERSIÓN (DEMO PARA UADE TP2) */}
      <div className="bg-neutral-900 border-b border-neutral-800 py-2 px-4 text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00C3FF] animate-pulse"></span>
          <span className="font-semibold text-white">UADE - TP2 Frontend II:</span>
          <span className="hidden sm:inline text-neutral-400">Aplicación React + Vite + Firebase</span>
        </div>

        <div className="flex items-center gap-2 bg-black/60 p-1 rounded-lg border border-neutral-800">
          <span className="text-[10px] text-neutral-500 uppercase px-1">Versión Bitácora:</span>
          {['v1', 'v2', 'v3'].map((v) => (
            <button
              key={v}
              onClick={() => setActiveVersion(v)}
              className={`px-2.5 py-0.5 rounded font-bold transition-all ${
                activeVersion === v ? 'bg-[#00C3FF] text-black shadow-lg shadow-[#00C3FF]/20' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {v.toUpperCase()} {v === 'v1' ? '(MVP)' : v === 'v2' ? '(Filtros)' : '(Final)'}
            </button>
          ))}
        </div>
      </div>

      {/* HEADER / NAVBAR PRINCIPAL */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-neutral-800 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* LOGO BALE */}
          <button onClick={() => setCurrentTab('shop')} className="text-left hover:opacity-90 transition">
            <BaleMonogramLogo size="md" />
          </button>

          {/* BUSCADOR (SOLO V2 y V3) */}
          {activeVersion !== 'v1' && (
            <div className="hidden md:flex items-center bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 w-80 focus-within:border-[#00C3FF] transition-all">
              <Search className="w-4 h-4 text-neutral-400 mr-2" />
              <input
                type="text"
                placeholder="Buscar remeras, camperas, talle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-sm w-full focus:outline-none text-white placeholder-neutral-500"
              />
            </div>
          )}

          {/* MENÚ DE ACCIONES */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDocsOpen(true)}
              className="flex items-center gap-1.5 text-xs text-[#00C3FF] bg-[#00C3FF]/10 border border-[#00C3FF]/30 px-3 py-2 rounded-lg hover:bg-[#00C3FF]/20 transition"
              title="Ver Informe Técnico"
            >
              <FileCode className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Doc. Técnica TP2</span>
            </button>

            {/* BOTONES DE AUTH CON FIREBASE (FASE 1) */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab(currentTab === 'my-orders' ? 'shop' : 'my-orders')}
                  className="flex items-center gap-2 text-xs border border-neutral-700 bg-neutral-900 hover:border-[#00C3FF] px-3 py-2 rounded-lg transition text-[#00C3FF]"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.email.split('@')[0]}</span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-xs border border-red-900/50 hover:bg-red-900/30 text-red-400 px-3 py-2 rounded-lg transition"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 text-xs border border-neutral-800 hover:border-[#00C3FF] text-neutral-400 hover:text-white px-3 py-2 rounded-lg transition"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Ingresar</span>
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="flex items-center gap-2 text-xs bg-[#00C3FF] text-black font-bold border border-[#00C3FF] hover:bg-[#00C3FF]/90 px-3 py-2 rounded-lg transition shadow-lg shadow-[#00C3FF]/20"
                >
                  <span className="hidden sm:inline">Registrarse</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setCurrentTab(currentTab === 'admin' ? 'shop' : 'admin')}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition ${
                currentTab === 'admin' ? 'bg-white text-black border-white font-bold' : 'border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#00C3FF] text-black rounded-xl hover:bg-[#00C3FF]/90 transition shadow-lg shadow-[#00C3FF]/20"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* CUERPO PRINCIPAL DE LA APLICACIÓN */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* TABA 1: CATÁLOGO Y TIENDA */}
        {currentTab === 'shop' && (
          <div>
            {/* BANNER HERO DE BRANDING */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-black via-neutral-900 to-neutral-950 border border-neutral-800 p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-4 max-w-xl text-center md:text-left">
                <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#00C3FF]/10 text-[#00C3FF] border border-[#00C3FF]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C3FF]"></span> NUEVA COLECCIÓN 2026
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                  URBAN ESSENTIALS <span className="text-[#00C3FF]">BALE</span>
                </h1>
                <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                  Indumentaria masculina de corte minimalista y diseño urbano. Fabricada con materiales premium en Buenos Aires.
                </p>
              </div>
              <div className="border border-neutral-800 p-6 rounded-2xl bg-black/40 backdrop-blur-sm text-center">
                <BaleMonogramLogo size="lg" />
                <p className="text-xs text-neutral-400 mt-4 font-mono">BLACK / WHITE / CYAN</p>
              </div>
            </div>

            {/* FILTROS Y CATEGORÍAS (V2 Y V3) */}
            {activeVersion !== 'v1' && (
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-800">
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#00C3FF] text-black shadow-lg shadow-[#00C3FF]/20'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-neutral-500">
                  Mostrando <span className="text-white font-bold">{filteredProducts.length}</span> prendas
                </div>
              </div>
            )}

            {/* GRILLA DE PRODUCTOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-neutral-900/60 border border-neutral-800/80 hover:border-[#00C3FF]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-[#00C3FF]/5"
                >
                  <div className="relative aspect-square overflow-hidden bg-neutral-950">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[10px] uppercase font-bold text-[#00C3FF] px-2.5 py-1 rounded-md border border-[#00C3FF]/30">
                      {product.category}
                    </span>
                    {product.stock < 5 && (
                      <span className="absolute top-3 right-3 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-1 rounded-md">
                        Últimas {product.stock} un.
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-[#00C3FF] transition">
                        {product.name}
                      </h3>
                      <p className="text-neutral-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-neutral-500 block">Precio</span>
                        <span className="text-lg font-black text-white">
                          ${product.price.toLocaleString('es-AR')}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex items-center gap-1.5 bg-neutral-800 hover:bg-[#00C3FF] hover:text-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                      >
                        <span>Ver Talles</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PANEL DE ADMINISTRACIÓN / CRUD DE INVENTARIO */}
        {currentTab === 'admin' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-2xl font-black text-white uppercase flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#00C3FF]" /> Panel de Gestión BALE
                </h2>
                <p className="text-xs text-neutral-400 mt-1">Control de inventario y pedidos en tiempo real con Cloud Firestore</p>
              </div>
              <button
                onClick={() => setProducts(INITIAL_PRODUCTS)}
                className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 hover:border-[#00C3FF] text-xs px-3 py-2 rounded-lg transition"
              >
                <RefreshCw className="w-4 h-4 text-[#00C3FF]" />
                Restaurar Stock Inicial
              </button>
            </div>

            {/* TABLA DE PRODUCTOS EN FIRESTORE */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Prenda</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-800/40 transition">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 object-cover rounded-lg bg-black" />
                        <span className="font-bold text-white">{p.name}</span>
                      </td>
                      <td className="p-4"><span className="text-[#00C3FF] bg-[#00C3FF]/10 px-2 py-0.5 rounded border border-[#00C3FF]/20">{p.category}</span></td>
                      <td className="p-4 font-bold text-white">${p.price.toLocaleString('es-AR')}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const updated = products.map(item => item.id === p.id ? { ...item, stock: Math.max(0, item.stock - 1) } : item);
                              setProducts(updated);
                            }}
                            className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center font-bold text-white"
                          >-</button>
                          <span className={`font-mono font-bold ${p.stock < 5 ? 'text-amber-400' : 'text-white'}`}>{p.stock}</span>
                          <button
                            onClick={() => {
                              const updated = products.map(item => item.id === p.id ? { ...item, stock: item.stock + 1 } : item);
                              setProducts(updated);
                            }}
                            className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center font-bold text-white"
                          >+</button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setProducts(products.filter(item => item.id !== p.id));
                            showNotice(`Producto eliminado`, 'error');
                          }}
                          className="p-2 hover:bg-red-950/50 hover:text-red-400 text-neutral-500 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MIS COMPRAS */}
        {currentTab === 'my-orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-2">
              <Package className="w-6 h-6 text-[#00C3FF]" /> Mis Compras en BALE
            </h2>

            {orders.length === 0 ? (
              <div className="p-12 text-center border border-neutral-800 rounded-2xl bg-neutral-900/40 space-y-3">
                <p className="text-neutral-400 text-sm">Aún no has realizado compras con esta cuenta.</p>
                <button
                  onClick={() => setCurrentTab('shop')}
                  className="inline-block bg-[#00C3FF] text-black font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-[#00C3FF]/90 transition"
                >
                  Ir al Catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-6 border border-neutral-800 bg-neutral-900/60 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white text-base">Orden #{ord.id}</span>
                        <span className="text-xs bg-[#00C3FF]/20 text-[#00C3FF] border border-[#00C3FF]/30 px-2.5 py-0.5 rounded-full font-semibold">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">Fecha: {ord.date} | Entrega en: {ord.address}</p>
                      <div className="mt-3 space-y-1">
                        {ord.items.map(item => (
                          <div key={item.key} className="text-xs text-neutral-300 flex items-center gap-2">
                            <span>• {item.name} ({item.selectedSize})</span>
                            <span className="text-neutral-500">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex md:flex-col justify-between items-end">
                      <span className="text-xs text-neutral-500">Total abonado</span>
                      <span className="text-xl font-black text-white">${ord.total.toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL DETALLE DE PRODUCTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <img src={selectedProduct.image} className="w-full h-64 object-cover" />

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#00C3FF] bg-[#00C3FF]/10 px-2.5 py-1 rounded border border-[#00C3FF]/30">
                  {selectedProduct.category}
                </span>
                <h2 className="text-2xl font-black text-white mt-2">{selectedProduct.name}</h2>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{selectedProduct.description}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-2">Selecciona tu Talle:</label>
                <div className="flex gap-2">
                  {selectedProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedProduct({ ...selectedProduct, activeSize: sz })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        selectedProduct.activeSize === sz
                          ? 'border-[#00C3FF] bg-[#00C3FF] text-black'
                          : 'border-neutral-800 bg-neutral-950 text-white hover:border-neutral-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-500 block">Precio Final</span>
                  <span className="text-2xl font-black text-white">${selectedProduct.price.toLocaleString('es-AR')}</span>
                </div>

                <button
                  onClick={() => {
                    addToCart(selectedProduct, selectedProduct.activeSize);
                    setSelectedProduct(null);
                  }}
                  className="bg-[#00C3FF] text-black hover:bg-[#00C3FF]/90 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-[#00C3FF]/20"
                >
                  Agregar a la Bolsa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER DEL CARRITO / CHECKOUT */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-neutral-950 border-l border-neutral-800 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#00C3FF]" />
                  <h3 className="font-bold text-white text-lg">Tu Bolsa BALE</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <p className="text-neutral-500 text-sm">Tu bolsa está vacía.</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4 divide-y divide-neutral-900">
                  {cart.map((item) => (
                    <div key={item.key} className="pt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} className="w-14 h-14 object-cover rounded-xl bg-neutral-900" />
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                          <span className="text-[10px] text-[#00C3FF] block">Talle: {item.selectedSize}</span>
                          <span className="text-xs text-white font-mono font-bold mt-1 block">
                            ${(item.price * item.quantity).toLocaleString('es-AR')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-neutral-400">x{item.quantity}</span>
                        <button onClick={() => removeFromCart(item.key)} className="text-neutral-600 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-6 border-t border-neutral-800 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="font-bold text-white">${cartTotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-400">Envío en Argentina</span>
                  <span className="text-[#00C3FF] font-bold">GRATIS</span>
                </div>

                {checkoutStep === 1 ? (
                  <button
                    onClick={() => setCheckoutStep(2)}
                    className="w-full bg-[#00C3FF] text-black font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-[#00C3FF]/90 transition"
                  >
                    Continuar Checkout
                  </button>
                ) : (
                  <form onSubmit={handleCheckout} className="space-y-3 pt-2">
                    <input
                      type="text"
                      placeholder="Nombre y Apellido"
                      required
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:border-[#00C3FF] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Dirección de Envío"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:border-[#00C3FF] outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#00C3FF] text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-[#00C3FF]/90 transition shadow-lg shadow-[#00C3FF]/20"
                    >
                      Confirmar y Pagar ${cartTotal.toLocaleString('es-AR')}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DOCUMENTACIÓN TÉCNICA Y JUSTIFICACIÓN CROMÁTICA TP2 UADE */}
      {isDocsOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 text-xs leading-relaxed max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#00C3FF]" />
                <h3 className="text-base font-black text-white uppercase">Documentación Técnica & Justificación Visual</h3>
              </div>
              <button onClick={() => setIsDocsOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-black/50 border border-neutral-800 rounded-xl">
                <h4 className="font-bold text-[#00C3FF] uppercase text-xs mb-2">1. Justificación de la Paleta de Colores</h4>
                <p className="text-neutral-300">
                  La identidad visual de <strong>BALE</strong> se compone de tres colores fundamentales:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-neutral-400">
                  <li><strong className="text-white">Negro (#0A0A0C):</strong> Color dominante de fondo. Otorga sobriedad, elegancia streetwear y reduce la fatiga visual.</li>
                  <li><strong className="text-white">Blanco (#FFFFFF):</strong> Utilizado para contraste en textos primarios y elementos de la marca (Monograma B).</li>
                  <li><strong className="text-[#00C3FF]">Celeste Cyan (#00C3FF):</strong> Color de acento para la letra <strong>L</strong> del isotipo, botones principales de compra, badges activos y estados clave de la tienda.</li>
                </ul>
              </div>

              <div className="p-4 bg-black/50 border border-neutral-800 rounded-xl">
                <h4 className="font-bold text-white uppercase text-xs mb-2">2. Reglas de Seguridad Cloud Firestore</h4>
                <pre className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 font-mono text-[11px] text-neutral-300 overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bale_products/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /bale_orders/{document} {
      allow create: if true;
      allow read, update: if request.auth != null;
    }
  }
}`}
                </pre>
              </div>

              <div className="p-4 bg-black/50 border border-neutral-800 rounded-xl">
                <h4 className="font-bold text-white uppercase text-xs mb-2">3. Configuración .env.example</h4>
                <pre className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 font-mono text-[11px] text-neutral-300 overflow-x-auto">
{`VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=bale-menswear.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bale-menswear
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef`}
                </pre>
              </div>
            </div>

            <button
              onClick={() => setIsDocsOpen(false)}
              className="w-full bg-[#00C3FF] text-black font-bold py-3 rounded-xl uppercase text-xs"
            >
              Cerrar Ventana
            </button>
          </div>
        </div>
      )}

      {/* MODALES DE AUTENTICACIÓN (FASE 1) */}
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          switchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}

      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)} 
          switchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}
    </div>
  );
}
