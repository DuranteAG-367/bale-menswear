import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, User, Search, SlidersHorizontal, Shield, 
  Trash2, Plus, Edit, RefreshCw, CheckCircle, Package, 
  ChevronRight, X, Lock, FileCode, Check, AlertCircle, ArrowLeft, ArrowRight, Play,
  Users, Tag, Percent, Eye, CreditCard, Heart, MapPin, Star, Ruler, Ticket, Download
} from 'lucide-react';

// IMPORTAMOS LA AUTENTICACIÓN Y LOS COMPONENTES (FASE 1)
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';

// === CONTEXTO Y CONFIGURACIÓN FIREBASE SIMULADA / SDK ===
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

// Catálogo inicial con la temática de ropa masculina BALE (Negro, Blanco, Celeste) + FASE 3 + RESEÑAS
const INITIAL_PRODUCTS = [
  { 
    id: '1', name: 'BALE Oversized Cyan Hoodie', category: 'Abrigos', price: 89000, originalPrice: 111250, isPromo: true, promoType: 'percentage', discount: 20, stock: 12, sizes: ['M', 'L', 'XL'], color: 'Negro/Celeste', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800', description: 'Buzo con capucha heavy-weight 480Gsm. Estampado serigráfico en la espalda y bordado en el pecho.',
    reviews: [
      { id: 1, user: 'Gonzalo M.', rating: 5, comment: 'La calidad del frisa es tremenda, bien pesado como me gusta.', date: '20/10/2026' },
      { id: 2, user: 'Tomás R.', rating: 4, comment: 'Calce oversized perfecto. Pedí L y mido 1.80m.', date: '15/10/2026' }
    ]
  },
  { 
    id: '2', name: 'BALE Technical Cargo Pant', category: 'Pantalones', price: 95000, stock: 8, sizes: ['S', 'M', 'L', 'XL'], color: 'Negro', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800', description: 'Pantalón cargo táctico con tiras ajustables y múltiples bolsillos funcionales.',
    reviews: [
      { id: 1, user: 'Esteban P.', rating: 5, comment: 'Los bolsillos son súper amplios y la tela es muy resistente.', date: '22/10/2026' }
    ]
  },
  { 
    id: '3', name: 'BALE Cyan Monogram Tee', category: 'Remeras', price: 42000, originalPrice: 42000, isPromo: true, promoType: '2x1', discount: 0, stock: 25, sizes: ['S', 'M', 'L', 'XL', 'XXL'], color: 'Blanco/Celeste', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800', description: 'Remera 100% algodón peinado 24/1. Corte boxy fit exclusivo con estampa BL frontal.',
    reviews: [
      { id: 1, user: 'Joaquín G.', rating: 5, comment: 'El estampado celeste cyan resalta un montón en persona.', date: '01/11/2026' }
    ]
  },
  { id: '4', name: 'BALE Urban Puffer Jacket', category: 'Abrigos', price: 116000, originalPrice: 145000, isPromo: true, promoType: 'percentage', discount: 20, stock: 5, sizes: ['M', 'L', 'XL'], color: 'Negro Mate', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800', description: 'Campera inflable térmica resistente al agua con forrería interior celeste.', reviews: [] },
  { id: '5', name: 'BALE Classic Oxford Shirt', category: 'Camisas', price: 68000, stock: 14, sizes: ['S', 'M', 'L', 'XL'], color: 'Blanco', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800', description: 'Camisa manga larga Oxford con botones de resina y logo BL bordado en tono pastel.', reviews: [] },
  { id: '6', name: 'BALE Cyan Line Sneakers', category: 'Calzado', price: 120000, stock: 9, sizes: ['39', '40', '41', '42', '43', '44'], color: 'Negro/Blanco/Celeste', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800', description: 'Zapatillas urbanas de cuero sintético premium y suela reforzada de goma.', reviews: [] },
  { id: '7', name: 'BALE Signature Cap', category: 'Accesorios', price: 28000, stock: 30, sizes: ['Único'], color: 'Negro', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800', description: 'Gorra de gabardina premium con logo bordado en 3D color celeste cyan y ajuste metálico.', reviews: [] },
  { id: '8', name: 'Black Void Oversized Tee', category: 'Remeras', price: 34000, originalPrice: 42500, isPromo: true, promoType: 'percentage', discount: 20, stock: 18, sizes: ['M', 'L', 'XL', 'XXL'], color: 'Negro Washed', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800', description: 'Remera con proceso de lavado desgastado. Corte extra amplio y caída pesada.', reviews: [] },
  { id: '9', name: 'Tech Parachute Pants', category: 'Pantalones', price: 85000, stock: 10, sizes: ['S', 'M', 'L'], color: 'Gris Oscuro', image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&q=80&w=800', description: 'Pantalón estilo paracaídas ultra liviano con elásticos ajustables en la botamanga.', reviews: [] }
];

// Puntos de Retiro / Locales Físicos
const STORES = [
  { id: 1, name: 'BALE Flagship Morón', address: '25 de Mayo 280, Morón', hours: 'Lun a Sáb: 10:00 - 20:00 hs', status: 'Abierto hoy' },
  { id: 2, name: 'BALE Studio Haedo', address: 'Av. Rivadavia 16100 (cerca de Banco Provincia), Haedo', hours: 'Lun a Sáb: 09:30 - 19:30 hs', status: 'Abierto hoy' },
  { id: 3, name: 'BALE Palermo Concept', address: 'Honduras 4800, Palermo, CABA', hours: 'Lun a Dom: 11:00 - 20:30 hs', status: 'Abierto hoy' }
];

// Usuarios Registrados Iniciales para Administración de Cuentas
const INITIAL_USERS = [
  { id: 'usr-1', name: 'Agustín Durante', email: 'agus.durante@uade.edu.ar', role: 'Admin', registeredAt: '12/10/2026', totalSpent: 247000, ordersCount: 3 },
  { id: 'usr-2', name: 'Lucas Benítez', email: 'lucas.b@gmail.com', role: 'Cliente', registeredAt: '18/10/2026', totalSpent: 89000, ordersCount: 1 },
  { id: 'usr-3', name: 'Mateo Rossi', email: 'mrossi@hotmail.com', role: 'Cliente', registeredAt: '25/10/2026', totalSpent: 162000, ordersCount: 2 }
];

// Orders iniciales para historial del admin
const INITIAL_ORDERS = [
  {
    id: 'BAL-849201',
    date: '28/10/2026',
    customer: 'Agustín Durante',
    email: 'agus.durante@uade.edu.ar',
    address: 'Av. Rivadavia 14200, Morón',
    paymentMethod: 'MercadoPago',
    status: 'Entregado',
    total: 131000,
    items: [
      { key: '1-L', name: 'BALE Oversized Cyan Hoodie', selectedSize: 'L', quantity: 1, price: 89000 },
      { key: '3-M', name: 'BALE Cyan Monogram Tee', selectedSize: 'M', quantity: 1, price: 42000 }
    ]
  },
  {
    id: 'BAL-310492',
    date: '01/11/2026',
    customer: 'Lucas Benítez',
    email: 'lucas.b@gmail.com',
    address: 'Belgrano 340, Haedo',
    paymentMethod: 'Tarjeta de Crédito',
    status: 'En preparación',
    total: 89000,
    items: [
      { key: '1-M', name: 'BALE Oversized Cyan Hoodie', selectedSize: 'M', quantity: 1, price: 89000 }
    ]
  }
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
  const [currentTab, setCurrentTab] = useState('shop'); // 'shop', 'admin', 'my-orders', 'stores'
  const [adminSubTab, setAdminSubTab] = useState('inventory'); // 'inventory', 'promos', 'users', 'orders'
  
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [registeredUsers, setRegisteredUsers] = useState(INITIAL_USERS);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  // ESTADOS NUEVOS (FAVORITOS, GUÍA DE TALLES, CUPONES, RESEÑAS)
  const [wishlist, setWishlist] = useState([]);
  const [onlyWishlistFilter, setOnlyWishlistFilter] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [userHeight, setUserHeight] = useState('');
  const [userWeight, setUserWeight] = useState('');
  const [recommendedSize, setRecommendedSize] = useState(null);

  // ESTADOS EXTRA 1 & 3: FILTROS AVANZADOS Y ORDENAMIENTO
  const [maxPriceFilter, setMaxPriceFilter] = useState(150000);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-asc', 'price-desc', 'rating-desc'

  // CUPONES EN CHECKOUT
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponNotice, setCouponNotice] = useState('');

  // FORMULARIO RESEÑAS
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Checkout & Admin States
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({ name: '', address: '', city: '', phone: '', paymentMethod: 'MercadoPago' });
  const [notification, setNotification] = useState(null);

  // Auto-notification helper
  const showNotice = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // ESTADO EXTRA 2: EXPORTAR COMPROBANTE / FACTURA TXT
  const handleDownloadInvoice = (order) => {
    const itemsText = order.items
      .map(item => `  - ${item.name} (${item.selectedSize}) x${item.quantity}: $${(item.price * item.quantity).toLocaleString('es-AR')}`)
      .join('\n');

    const invoiceContent = `================================================
           BALE MENSWEAR - COMPROBANTE DE COMPRA
================================================
N° Orden: #${order.id}
Fecha: ${order.date}
Cliente: ${order.customer}
Email: ${order.email}
Dirección de Entrega: ${order.address}
Medio de Pago: ${order.paymentMethod || 'MercadoPago'}
Estado: ${order.status}
------------------------------------------------
DETALLE DE PRENDAS:
${itemsText}
------------------------------------------------
TOTAL ABONADO: $${order.total.toLocaleString('es-AR')}
------------------------------------------------
¡Gracias por confiar en BALE Menswear!
http://bale-menswear.edu.ar | Buenos Aires, Argentina
================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Comprobante_${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotice(`Comprobante #${order.id} descargado`);
  };

  // Toggle Wishlist
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      showNotice('Prenda removida de favoritos');
    } else {
      setWishlist([...wishlist, productId]);
      showNotice('¡Agregado a tus favoritos!');
    }
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

  const subtotalCart = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartTotal = subtotalCart * (1 - appliedDiscount / 100);

  // Aplicar Cupón
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'BALE10') {
      setAppliedDiscount(10);
      setCouponNotice('¡Cupón BALE10 (10% OFF) aplicado!');
    } else if (code === 'UADE2026') {
      setAppliedDiscount(20);
      setCouponNotice('¡Cupón UADE2026 (20% OFF) aplicado!');
    } else if (code === 'AGUS25') {
      setAppliedDiscount(25);
      setCouponNotice('¡Cupón VIP AGUS25 (25% OFF) aplicado!');
    } else {
      setAppliedDiscount(0);
      setCouponNotice('Cupón no válido');
    }
  };

  // Calcular Talle Recomendado
  const handleCalculateSize = (e) => {
    e.preventDefault();
    const h = Number(userHeight);
    const w = Number(userWeight);
    if (!h || !w) return;

    if (h < 170 && w < 68) setRecommendedSize('S');
    else if (h <= 178 && w <= 78) setRecommendedSize('M');
    else if (h <= 186 && w <= 88) setRecommendedSize('L');
    else setRecommendedSize('XL');
  };

  // Publicar Reseña
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedProduct) return;

    const reviewObj = {
      id: Date.now(),
      user: user ? user.email.split('@')[0] : 'Cliente BALE',
      rating: Number(newRating),
      comment: newComment,
      date: new Date().toLocaleDateString('es-AR')
    };

    const updated = products.map(p => {
      if (p.id === selectedProduct.id) {
        return { ...p, reviews: [reviewObj, ...(p.reviews || [])] };
      }
      return p;
    });

    setProducts(updated);
    setSelectedProduct({ ...selectedProduct, reviews: [reviewObj, ...(selectedProduct.reviews || [])] });
    setNewComment('');
    showNotice('¡Gracias por tu opinión!');
  };

  // Proceso de Compra (Checkout)
  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const customerEmail = user ? user.email : 'cliente.guest@bale.com';
    const customerName = shippingInfo.name || (user ? user.email.split('@')[0] : 'Cliente BALE');

    const newOrder = {
      id: `BAL-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('es-AR'),
      items: [...cart],
      total: cartTotal,
      status: 'En preparación',
      customer: customerName,
      email: customerEmail,
      paymentMethod: shippingInfo.paymentMethod,
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

    // Actualizar historial del usuario en el panel admin si existe
    const updatedUsers = registeredUsers.map(u => {
      if (u.email.toLowerCase() === customerEmail.toLowerCase()) {
        return {
          ...u,
          totalSpent: u.totalSpent + cartTotal,
          ordersCount: u.ordersCount + 1
        };
      }
      return u;
    });

    setProducts(updatedProducts);
    setOrders([newOrder, ...orders]);
    setRegisteredUsers(updatedUsers);
    setCart([]);
    setAppliedDiscount(0);
    setCouponCode('');
    setIsCartOpen(false);
    setCheckoutStep(1);
    showNotice(`¡Pedido #${newOrder.id} realizado con éxito!`);
  };

  // Handler Admin para Promociones
  const handleTogglePromo = (productId) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const nextPromo = !p.isPromo;
        return {
          ...p,
          isPromo: nextPromo,
          promoType: p.promoType || 'percentage',
          discount: p.discount || 20,
          originalPrice: p.originalPrice || p.price,
          price: nextPromo ? (p.originalPrice || p.price) * (1 - (p.discount || 20) / 100) : (p.originalPrice || p.price)
        };
      }
      return p;
    }));
    showNotice('Estado promocional actualizado');
  };

  const handleUpdatePromoDetails = (productId, promoType, discountVal) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const basePrice = p.originalPrice || p.price;
        const discountNum = Number(discountVal) || 0;
        const newPrice = promoType === 'percentage' ? basePrice * (1 - discountNum / 100) : basePrice;

        return {
          ...p,
          promoType: promoType,
          discount: discountNum,
          price: newPrice,
          originalPrice: basePrice
        };
      }
      return p;
    }));
    showNotice('Promoción modificada correctamente');
  };

  // Categorías ampliadas con Accesorios
  const categories = ['Todas', 'Remeras', 'Camisas', 'Pantalones', 'Abrigos', 'Calzado', 'Accesorios'];
  const availableSizes = ['Todos', 'S', 'M', 'L', 'XL', 'XXL', '39', '40', '41', '42', '43', '44', 'Único'];

  // Helper para calcular rating promedio de producto
  const getAverageRating = (p) => {
    if (!p.reviews || p.reviews.length === 0) return 0;
    const sum = p.reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / p.reviews.length;
  };

  // FILTRADO Y ORDENAMIENTO (CON PRECIO MÁXIMO, TALLE Y CRITERIOS)
  const filteredProducts = products
    .filter(p => {
      const matchesCat = selectedCategory === 'Todas' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesWishlist = !onlyWishlistFilter || wishlist.includes(p.id);
      const matchesMaxPrice = p.price <= maxPriceFilter;
      const matchesSize = selectedSizeFilter === 'Todos' || p.sizes.includes(selectedSizeFilter);
      return matchesCat && matchesSearch && matchesWishlist && matchesMaxPrice && matchesSize;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return getAverageRating(b) - getAverageRating(a);
      return 0;
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
          <button onClick={() => { setCurrentTab('shop'); setOnlyWishlistFilter(false); }} className="text-left hover:opacity-90 transition">
            <BaleMonogramLogo size="md" />
          </button>

          {/* BUSCADOR (SOLO V2 y V3) */}
          {activeVersion !== 'v1' && (
            <div className="hidden md:flex items-center bg-neutral-950 border border-neutral-800 rounded-full px-4 py-2 w-72 focus-within:border-[#00C3FF] transition-all">
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* SUCURSALES / STORE LOCATOR */}
            <button
              onClick={() => setCurrentTab(currentTab === 'stores' ? 'shop' : 'stores')}
              className={`p-2 sm:px-3 sm:py-2 rounded-lg border text-xs flex items-center gap-1.5 transition ${
                currentTab === 'stores' ? 'bg-[#00C3FF] text-black font-bold border-[#00C3FF]' : 'border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Locales y Puntos de Retiro"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden lg:inline">Locales</span>
            </button>

            {/* BOTÓN WISHLIST / FAVORITOS */}
            <button
              onClick={() => {
                setCurrentTab('shop');
                setOnlyWishlistFilter(!onlyWishlistFilter);
              }}
              className={`relative p-2 sm:px-3 sm:py-2 rounded-lg border text-xs flex items-center gap-1.5 transition ${
                onlyWishlistFilter ? 'bg-red-600 text-white border-red-500 font-bold' : 'border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Favoritos"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="hidden sm:inline">Favoritos</span>
              {wishlist.length > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>

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
        {/* TAB 1: CATÁLOGO Y TIENDA */}
        {currentTab === 'shop' && (
          <div>
            
            {/* 🖼️ HERO BANNER ESTÁTICO HORIZONTAL DE CAMPAÑA MASCULINA */}
            {!onlyWishlistFilter && (
              <div className="relative rounded-2xl overflow-hidden border border-neutral-800 mb-12 min-h-[420px] flex items-center justify-center group shadow-2xl">
                {/* IMAGEN EDITORIAL DE ALTA CALIDAD - GRUPO DE HOMBRES CON PRENDAS BALE */}
                <img
                  src="https://g-o3tmdk99rtg.v.ai.lostpixel.com/f/image_2.png"
                  alt="BALE Campaña Colectiva"
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-50 group-hover:scale-[1.03] transition-all duration-1000 ease-out"
                />
                
                {/* OVERLAY DEGRADADO OSCURO PARA LECTURA */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent"></div>

                {/* CONTENIDO DEL BANNER HERO */}
                <div className="relative z-10 p-8 lg:p-12 w-full flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-5 max-w-xl text-center md:text-left">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full bg-[#00C3FF]/20 text-[#00C3FF] border border-[#00C3FF]/30 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-[#00C3FF] animate-pulse"></span> NUEVA COLECCIÓN 2026
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase drop-shadow-2xl">
                      URBAN ESSENTIALS <span className="text-[#00C3FF]">BALE</span>
                    </h1>
                    <p className="text-neutral-300 text-sm md:text-base leading-relaxed max-w-md drop-shadow-md">
                      Descubrí la nueva línea de indumentaria masculina. Corte minimalista, diseño urbano y materiales premium fabricados en Buenos Aires.
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                      <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="flex items-center gap-2 bg-white text-black font-black px-6 py-3 rounded-xl uppercase text-xs hover:bg-[#00C3FF] transition shadow-xl">
                        Ver Catálogo <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => setIsSizeGuideOpen(true)} className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-700 hover:border-[#00C3FF] text-white font-bold px-5 py-3 rounded-xl text-xs transition backdrop-blur-md">
                        <Ruler className="w-4 h-4 text-[#00C3FF]" /> Guía de Talles
                      </button>
                    </div>
                  </div>
                  
                  <div className="hidden md:block border border-[#00C3FF]/30 p-8 rounded-2xl bg-black/50 backdrop-blur-md text-center shadow-2xl shadow-[#00C3FF]/10 hover:scale-105 transition-transform duration-500">
                    <BaleMonogramLogo size="lg" />
                    <p className="text-xs text-[#00C3FF] mt-5 font-mono font-bold tracking-widest uppercase">The Streetwear Vision</p>
                  </div>
                </div>
              </div>
            )}

            {/* 📸 FASE 2: LOOKBOOK / MODELOS MASCULINOS (SOLO VISIBLE EN V2 Y V3) */}
            {activeVersion !== 'v1' && !onlyWishlistFilter && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">Campaña <span className="text-[#00C3FF]">Editorial</span></h2>
                    <p className="text-xs text-neutral-500 mt-1">Cómo se ven nuestras prendas en las calles.</p>
                  </div>
                  <button className="text-xs text-[#00C3FF] hover:text-white transition uppercase font-bold flex items-center gap-1">
                    <Play className="w-4 h-4"/> Ver Fashion Film
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Modelo 1 */}
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group border border-neutral-800 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600" alt="Modelo 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                      <p className="text-[#00C3FF] text-[10px] font-black tracking-widest uppercase mb-1">Streetwear</p>
                      <p className="text-white font-bold text-lg">Oversized Hoodie</p>
                    </div>
                  </div>
                  
                  {/* Modelo 2 */}
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group border border-neutral-800 cursor-pointer hidden md:block">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600" alt="Modelo 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                      <p className="text-[#00C3FF] text-[10px] font-black tracking-widest uppercase mb-1">Urbano Minimal</p>
                      <p className="text-white font-bold text-lg">Dark Aesthetics</p>
                    </div>
                  </div>

                  {/* Modelo 3 */}
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group border border-neutral-800 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=600" alt="Modelo 3 Masculino" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                      <p className="text-[#00C3FF] text-[10px] font-black tracking-widest uppercase mb-1">Techwear</p>
                      <p className="text-white font-bold text-lg">Cargo & Utility</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FILTROS Y CATEGORÍAS (V2 Y V3) */}
            {activeVersion !== 'v1' && (
              <div className="space-y-4 mb-8 pb-4 border-b border-neutral-800">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setOnlyWishlistFilter(false); }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedCategory === cat && !onlyWishlistFilter
                            ? 'bg-[#00C3FF] text-black shadow-lg shadow-[#00C3FF]/20'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {onlyWishlistFilter ? (
                    <div className="flex items-center gap-2 text-xs text-red-400 font-bold bg-red-950/40 border border-red-500/30 px-3 py-1.5 rounded-lg">
                      <Heart className="w-4 h-4 fill-red-400" /> Mostrando tus Favoritos
                      <button onClick={() => setOnlyWishlistFilter(false)} className="ml-2 text-neutral-400 hover:text-white underline">Ver Todo</button>
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-500">
                      Mostrando <span className="text-white font-bold">{filteredProducts.length}</span> prendas
                    </div>
                  )}
                </div>

                {/* 🎛️ EXTRA 1 & 3: BARRA DE FILTROS AVANZADOS Y ORDENAMIENTO */}
                <div className="p-4 bg-neutral-950 border border-neutral-800/80 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
                    {/* Slider Precio Máximo */}
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-400 font-bold">Precio Máx:</span>
                      <input
                        type="range"
                        min="25000"
                        max="150000"
                        step="5000"
                        value={maxPriceFilter}
                        onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                        className="accent-[#00C3FF] cursor-pointer"
                      />
                      <span className="font-mono text-[#00C3FF] font-bold">${maxPriceFilter.toLocaleString('es-AR')}</span>
                    </div>

                    {/* Selector de Talle */}
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 font-bold">Talle:</span>
                      <select
                        value={selectedSizeFilter}
                        onChange={(e) => setSelectedSizeFilter(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 text-white rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[#00C3FF]"
                      >
                        {availableSizes.map(sz => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Ordenamiento Dinámico */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <SlidersHorizontal className="w-4 h-4 text-[#00C3FF]" />
                    <span className="text-neutral-400 font-bold">Ordenar por:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 text-white rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#00C3FF]"
                    >
                      <option value="default">Recomendados</option>
                      <option value="price-asc">Precio: Menor a Mayor</option>
                      <option value="price-desc">Precio: Mayor a Menor</option>
                      <option value="rating-desc">Mejor Valorados ⭐</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* GRILLA DE PRODUCTOS CON PROMOCIONES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isFav = wishlist.includes(product.id);
                const avgRating = getAverageRating(product);
                return (
                  <div
                    key={product.id}
                    className="group bg-neutral-900/60 border border-neutral-800/80 hover:border-[#00C3FF]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-[#00C3FF]/5 relative"
                  >
                    {/* BOTÓN WISHLIST SOBRE LA IMAGEN */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 z-20 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:scale-110 transition border border-neutral-700"
                      title="Guardar en Favoritos"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-neutral-400'}`} />
                    </button>

                    <div className="relative aspect-square overflow-hidden bg-neutral-950">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[10px] uppercase font-bold text-[#00C3FF] px-2.5 py-1 rounded-md border border-[#00C3FF]/30 z-10">
                        {product.category}
                      </span>

                      {/* BADGE DE OFERTA ANIMADO */}
                      {product.isPromo && (
                        <span className="absolute bottom-3 left-3 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase animate-pulse shadow-lg shadow-red-600/40 z-10">
                          {product.promoType === '2x1' ? 'PROMO 2X1' : `${product.discount}% OFF`}
                        </span>
                      )}

                      {product.stock < 5 && (
                        <span className="absolute top-3 right-12 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-1 rounded-md z-10">
                          Últimas {product.stock} un.
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-white text-base group-hover:text-[#00C3FF] transition">
                            {product.name}
                          </h3>
                          {avgRating > 0 && (
                            <span className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {avgRating.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-neutral-500 block">Precio</span>
                          {product.isPromo && product.promoType === 'percentage' ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-neutral-500 line-through">
                                ${product.originalPrice?.toLocaleString('es-AR')}
                              </span>
                              <span className="text-lg font-black text-[#00C3FF]">
                                ${product.price.toLocaleString('es-AR')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-black text-white">
                              ${product.price.toLocaleString('es-AR')}
                            </span>
                          )}
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
                );
              })}
            </div>
          </div>
        )}

        {/* TAB SUCURSALES / STORE LOCATOR */}
        {currentTab === 'stores' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white uppercase flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#00C3FF]" /> Sucursales & Puntos de Retiro BALE
              </h2>
              <p className="text-xs text-neutral-400 mt-1">Retirá tus compras gratis en nuestros locales oficiales en Gran Buenos Aires y CABA.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STORES.map((st) => (
                <div key={st.id} className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4 hover:border-[#00C3FF]/50 transition">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-base">{st.name}</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                      {st.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-neutral-300">
                    <p className="flex items-center gap-2 text-neutral-400">
                      <MapPin className="w-4 h-4 text-[#00C3FF]" /> {st.address}
                    </p>
                    <p className="text-neutral-500">{st.hours}</p>
                  </div>
                  <button onClick={() => showNotice(`Punto de retiro seleccionado: ${st.name}`)} className="w-full bg-neutral-800 hover:bg-[#00C3FF] hover:text-black text-white font-bold py-2.5 rounded-xl text-xs uppercase transition">
                    Elegir punto de retiro
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PANEL DE ADMINISTRACIÓN COMPLETO */}
        {currentTab === 'admin' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-4 gap-4">
              <div>
                <h2 className="text-2xl font-black text-white uppercase flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#00C3FF]" /> Panel de Gestión BALE
                </h2>
                <p className="text-xs text-neutral-400 mt-1">Control integral de inventario, promociones, cuentas registradas y pagos</p>
              </div>

              {/* SUB-TABS ADMIN */}
              <div className="flex items-center gap-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
                <button
                  onClick={() => setAdminSubTab('inventory')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    adminSubTab === 'inventory' ? 'bg-[#00C3FF] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" /> Inventario
                </button>

                <button
                  onClick={() => setAdminSubTab('promos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    adminSubTab === 'promos' ? 'bg-[#00C3FF] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" /> Promociones
                </button>

                <button
                  onClick={() => setAdminSubTab('users')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    adminSubTab === 'users' ? 'bg-[#00C3FF] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> Cuentas
                </button>

                <button
                  onClick={() => setAdminSubTab('orders')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    adminSubTab === 'orders' ? 'bg-[#00C3FF] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Historial Pagos
                </button>
              </div>
            </div>

            {/* SUBTAB 1: INVENTARIO DE PRODUCTOS */}
            {adminSubTab === 'inventory' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-400">Total productos en catálogo: <strong className="text-white">{products.length}</strong></span>
                  <button
                    onClick={() => setProducts(INITIAL_PRODUCTS)}
                    className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 hover:border-[#00C3FF] text-xs px-3 py-2 rounded-lg transition"
                  >
                    <RefreshCw className="w-4 h-4 text-[#00C3FF]" />
                    Restaurar Stock Inicial
                  </button>
                </div>

                <div className="bg-[#121214] border border-neutral-800 rounded-2xl overflow-hidden">
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
                        <tr key={p.id} className="hover:bg-neutral-850 transition">
                          <td className="p-4 flex items-center gap-3">
                            <img src={p.image} className="w-10 h-10 object-cover rounded-lg bg-black" />
                            <span className="font-bold text-white">{p.name} {p.isPromo && <span className="ml-2 text-[9px] bg-red-600 px-1.5 py-0.5 rounded text-white font-bold">OFERTA</span>}</span>
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

            {/* SUBTAB 2: GESTIÓN DE PROMOCIONES, DESCUENTOS Y 2X1 */}
            {adminSubTab === 'promos' && (
              <div className="space-y-4">
                <div className="p-4 bg-black/40 border border-[#00C3FF]/30 rounded-xl text-xs text-neutral-300">
                  <p className="font-bold text-[#00C3FF] mb-1">Módulo de Descuentos & Ofertas Especiales</p>
                  <p>Activa campañas promocionales por producto, configura descuentos directos en porcentaje o modalidades 2x1.</p>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                      <tr>
                        <th className="p-4">Prenda</th>
                        <th className="p-4">Precio Lista</th>
                        <th className="p-4">Estado Promo</th>
                        <th className="p-4">Tipo Promo</th>
                        <th className="p-4">% Descuento</th>
                        <th className="p-4">Precio Final</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-850 transition">
                          <td className="p-4 font-bold text-white flex items-center gap-2">
                            <img src={p.image} className="w-8 h-8 rounded-lg object-cover" />
                            {p.name}
                          </td>
                          <td className="p-4 text-neutral-400 font-mono">
                            ${(p.originalPrice || p.price).toLocaleString('es-AR')}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleTogglePromo(p.id)}
                              className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase transition ${
                                p.isPromo ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-neutral-800 text-neutral-500'
                              }`}
                            >
                              {p.isPromo ? 'ACTIVA' : 'INACTIVA'}
                            </button>
                          </td>
                          <td className="p-4">
                            <select
                              disabled={!p.isPromo}
                              value={p.promoType || 'percentage'}
                              onChange={(e) => handleUpdatePromoDetails(p.id, e.target.value, p.discount || 20)}
                              className="bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-xs text-white disabled:opacity-40"
                            >
                              <option value="percentage">Descuento %</option>
                              <option value="2x1">Promoción 2x1</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <input
                              type="number"
                              disabled={!p.isPromo || p.promoType === '2x1'}
                              value={p.discount || 0}
                              onChange={(e) => handleUpdatePromoDetails(p.id, p.promoType || 'percentage', e.target.value)}
                              className="w-16 bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-xs text-white font-mono disabled:opacity-40"
                            />
                          </td>
                          <td className="p-4 font-bold text-[#00C3FF] font-mono">
                            ${p.price.toLocaleString('es-AR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBTAB 3: GESTIÓN DE CUENTAS REGISTRADAS */}
            {adminSubTab === 'users' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Usuarios en base de datos: <strong className="text-white">{registeredUsers.length + (user ? 1 : 0)}</strong></span>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                      <tr>
                        <th className="p-4">Usuario</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Rol</th>
                        <th className="p-4">Registro</th>
                        <th className="p-4">Compras</th>
                        <th className="p-4">Total Abonado</th>
                        <th className="p-4 text-right">Detalle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {/* Usuario logueado actual si existe */}
                      {user && (
                        <tr className="bg-[#00C3FF]/5 hover:bg-[#00C3FF]/10 transition">
                          <td className="p-4 font-bold text-[#00C3FF] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#00C3FF] animate-pulse"></span>
                            {user.email.split('@')[0]} (Sesión Actual)
                          </td>
                          <td className="p-4 text-white">{user.email}</td>
                          <td className="p-4"><span className="bg-[#00C3FF] text-black px-2 py-0.5 rounded font-black text-[10px]">SESIÓN ACTIVADA</span></td>
                          <td className="p-4 text-neutral-400">Hoy</td>
                          <td className="p-4 font-bold text-white">{orders.filter(o => o.email === user.email).length}</td>
                          <td className="p-4 font-mono text-[#00C3FF] font-bold">
                            ${orders.filter(o => o.email === user.email).reduce((sum, o) => sum + o.total, 0).toLocaleString('es-AR')}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedUserDetail({ name: user.email.split('@')[0], email: user.email, totalSpent: orders.filter(o => o.email === user.email).reduce((sum, o) => sum + o.total, 0), ordersCount: orders.filter(o => o.email === user.email).length })}
                              className="p-1.5 bg-neutral-800 hover:bg-[#00C3FF] hover:text-black rounded-lg transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )}

                      {registeredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-neutral-85 transition">
                          <td className="p-4 font-bold text-white">{u.name}</td>
                          <td className="p-4 text-neutral-400">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'Admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-neutral-800 text-neutral-400'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-neutral-500">{u.registeredAt}</td>
                          <td className="p-4 font-bold text-white">{u.ordersCount}</td>
                          <td className="p-4 font-mono font-bold text-white">${u.totalSpent.toLocaleString('es-AR')}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedUserDetail(u)}
                              className="p-1.5 bg-neutral-800 hover:bg-[#00C3FF] hover:text-black rounded-lg transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBTAB 4: HISTORIAL GLOBAL DE PEDIDOS Y PAGOS + DESCARGAR FACTURA */}
            {adminSubTab === 'orders' && (
              <div className="space-y-4">
                <div className="bg-[#121214] border border-neutral-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                      <tr>
                        <th className="p-4">N° Orden</th>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Medio Pago</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4">Fecha</th>
                        <th className="p-4">Monto Total</th>
                        <th className="p-4 text-right">Comprobante</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-neutral-85 transition">
                          <td className="p-4 font-bold text-[#00C3FF] font-mono">#{ord.id}</td>
                          <td className="p-4">
                            <div className="font-bold text-white">{ord.customer}</div>
                            <div className="text-[10px] text-neutral-500">{ord.email}</div>
                          </td>
                          <td className="p-4 text-neutral-300">{ord.paymentMethod || 'MercadoPago'}</td>
                          <td className="p-4">
                            <span className="bg-[#00C3FF]/20 text-[#00C3FF] border border-[#00C3FF]/30 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-4 text-neutral-500">{ord.date}</td>
                          <td className="p-4 font-mono font-black text-white text-sm">
                            ${ord.total.toLocaleString('es-AR')}
                          </td>
                          <td className="p-4 text-right">
                            {/* EXTRA 2: DESCARGAR FACTURA */}
                            <button
                              onClick={() => handleDownloadInvoice(ord)}
                              className="p-2 bg-neutral-800 hover:bg-[#00C3FF] hover:text-black text-white rounded-lg transition"
                              title="Descargar Comprobante TXT"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MIS COMPRAS (VISTA CLIENTE) CON EXPORTAR COMPROBANTE */}
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
                  <div key={ord.id} className="p-6 border border-neutral-800 bg-[#121214] rounded-2xl flex flex-col md:flex-row justify-between gap-4">
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
                    <div className="text-right flex md:flex-col justify-between items-end gap-3">
                      <div>
                        <span className="text-xs text-neutral-500 block">Total abonado</span>
                        <span className="text-xl font-black text-white">${ord.total.toLocaleString('es-AR')}</span>
                      </div>
                      
                      {/* EXTRA 2: BOTÓN DE DESCARGA DE FACTURA / COMPROBANTE */}
                      <button
                        onClick={() => handleDownloadInvoice(ord)}
                        className="flex items-center gap-1.5 bg-neutral-800 hover:bg-[#00C3FF] hover:text-black text-white text-xs font-bold px-3 py-2 rounded-xl transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Comprobante</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL GUÍA DE TALLES INTERACTIVA */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-6 relative">
            <button onClick={() => setIsSizeGuideOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-neutral-800 pb-4">
              <Ruler className="w-6 h-6 text-[#00C3FF]" />
              <h3 className="text-lg font-black text-white uppercase">Guía de Talles BALE</h3>
            </div>

            <form onSubmit={handleCalculateSize} className="p-4 bg-black/50 border border-neutral-800 rounded-xl space-y-3">
              <span className="text-xs font-bold text-[#00C3FF] uppercase block">Calculador Automático de Talle</span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Altura (cm) Ej: 175"
                  value={userHeight}
                  onChange={(e) => setUserHeight(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-[#00C3FF]"
                />
                <input
                  type="number"
                  placeholder="Peso (kg) Ej: 72"
                  value={userWeight}
                  onChange={(e) => setUserWeight(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-[#00C3FF]"
                />
              </div>
              <button type="submit" className="w-full bg-[#00C3FF] text-black font-bold py-2 rounded-xl text-xs uppercase">
                Calcular mi Talle Ideal
              </button>
              {recommendedSize && (
                <div className="text-center pt-2 text-xs text-emerald-400 font-bold">
                  Talle recomendado para vos: <span className="text-base text-white underline">{recommendedSize}</span>
                </div>
              )}
            </form>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-neutral-400 block">Medidas de Referencia (Remeras / Hoodies):</span>
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 grid grid-cols-4 gap-2 text-center text-[11px]">
                <div><strong className="text-white block">Talle</strong>S<br/>M<br/>L<br/>XL</div>
                <div><strong className="text-white block">Pecho</strong>52 cm<br/>55 cm<br/>58 cm<br/>62 cm</div>
                <div><strong className="text-white block">Largo</strong>70 cm<br/>73 cm<br/>76 cm<br/>79 cm</div>
                <div><strong className="text-white block">Manga</strong>60 cm<br/>62 cm<br/>64 cm<br/>66 cm</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE USUARIO ADMIN */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 relative">
            <button
              onClick={() => setSelectedUserDetail(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
              <div className="p-3 bg-[#00C3FF]/10 text-[#00C3FF] rounded-xl">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{selectedUserDetail.name}</h3>
                <p className="text-xs text-neutral-400">{selectedUserDetail.email}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-800/50">
                <span className="text-neutral-500">Total Compras Realizadas:</span>
                <span className="font-bold text-white">{selectedUserDetail.ordersCount} pedidos</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/50">
                <span className="text-neutral-500">Monto Acumulado Gastado:</span>
                <span className="font-bold text-[#00C3FF]">${selectedUserDetail.totalSpent?.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedUserDetail(null)}
              className="w-full bg-[#00C3FF] text-black font-bold py-2.5 rounded-xl text-xs uppercase"
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE PRODUCTO Y RESEÑAS */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-neutral-85 transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-1/2">
                  <img src={selectedProduct.image} className="w-full h-64 object-cover rounded-xl" />
                  {selectedProduct.isPromo && (
                    <span className="absolute bottom-3 right-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                      {selectedProduct.promoType === '2x1' ? 'PROMO 2X1' : `${selectedProduct.discount}% OFF`}
                    </span>
                  )}
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#00C3FF] bg-[#00C3FF]/10 px-2.5 py-1 rounded border border-[#00C3FF]/30">
                      {selectedProduct.category}
                    </span>
                    <h2 className="text-2xl font-black text-white mt-2">{selectedProduct.name}</h2>
                    <p className="text-xs text-neutral-400 mt-2">{selectedProduct.description}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase mb-2">Selecciona tu Talle:</label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedProduct({ ...selectedProduct, activeSize: sz })}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
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

                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      {selectedProduct.isPromo && selectedProduct.promoType === 'percentage' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-neutral-500 line-through">
                            ${selectedProduct.originalPrice?.toLocaleString('es-AR')}
                          </span>
                          <span className="text-xl font-black text-[#00C3FF]">
                            ${selectedProduct.price.toLocaleString('es-AR')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-black text-white">${selectedProduct.price.toLocaleString('es-AR')}</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        addToCart(selectedProduct, selectedProduct.activeSize);
                        setSelectedProduct(null);
                      }}
                      className="bg-[#00C3FF] text-black font-bold px-5 py-2.5 rounded-xl text-xs uppercase hover:bg-[#00C3FF]/90 transition"
                    >
                      Agregar a la Bolsa
                    </button>
                  </div>
                </div>
              </div>

              {/* MÓDULO RESEÑAS Y OPINIONES */}
              <div className="border-t border-neutral-800 pt-6 space-y-4">
                <h3 className="font-bold text-white text-sm uppercase flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Opiniones de Clientes ({selectedProduct.reviews?.length || 0})
                </h3>

                {/* PUBLICAR RESEÑA */}
                <form onSubmit={handleAddReview} className="p-4 bg-black/40 border border-neutral-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-neutral-300 block">Dejá tu valoración:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-amber-400 font-bold"
                    >
                      <option value="5">★★★★★ (5/5)</option>
                      <option value="4">★★★★☆ (4/5)</option>
                      <option value="3">★★★☆☆ (3/5)</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Escribí tu comentario sobre la prenda..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 min-w-[200px] bg-neutral-950 border border-neutral-800 p-2 rounded-xl text-xs text-white outline-none focus:border-[#00C3FF]"
                    />
                    <button type="submit" className="bg-neutral-800 hover:bg-[#00C3FF] hover:text-black text-white font-bold px-4 py-2 rounded-xl text-xs transition">
                      Publicar
                    </button>
                  </div>
                </form>

                {/* LISTA DE OPINIONES */}
                <div className="space-y-3">
                  {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                    selectedProduct.reviews.map((rev) => (
                      <div key={rev.id} className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-xl space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{rev.user}</span>
                          <span className="text-amber-400 font-mono">{'★'.repeat(rev.rating)}</span>
                        </div>
                        <p className="text-neutral-400">{rev.comment}</p>
                        <span className="text-[10px] text-neutral-600 block">{rev.date}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-500">Sé el primero en opinar sobre esta prenda.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER DEL CARRITO / CHECKOUT + CUPONES */}
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
                        <img src={item.image} className="w-14 h-14 object-cover rounded-xl bg-[#121214]" />
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                          <span className="text-[10px] text-[#00C3FF] block">Talle: {item.selectedSize}</span>
                          <span className="text-xs text-white font-mono font-bold mt-1 flex items-center gap-2">
                            ${(item.price * item.quantity).toLocaleString('es-AR')}
                            {item.isPromo && <span className="bg-red-600 text-white text-[9px] px-1 rounded font-bold">OFERTA</span>}
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
                {/* INGRESO DE CUPÓN DE DESCUENTO */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Cupón (ej: BALE10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white uppercase outline-none focus:border-[#00C3FF]"
                    />
                  </div>
                  <button type="submit" className="bg-neutral-800 hover:bg-[#00C3FF] hover:text-black text-white font-bold px-4 rounded-xl text-xs transition">
                    Aplicar
                  </button>
                </form>
                {couponNotice && (
                  <p className={`text-[11px] font-bold ${appliedDiscount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{couponNotice}</p>
                )}

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-neutral-400">
                    <span>Subtotal</span>
                    <span>${subtotalCart.toLocaleString('es-AR')}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between items-center text-emerald-400 font-bold">
                      <span>Descuento ({appliedDiscount}%)</span>
                      <span>-${(subtotalCart * (appliedDiscount / 100)).toLocaleString('es-AR')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-neutral-800">
                    <span>Total Final</span>
                    <span className="text-[#00C3FF] font-black text-base">${cartTotal.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between items-center text-neutral-500 text-[11px]">
                    <span>Envío en Argentina</span>
                    <span className="text-[#00C3FF] font-bold">GRATIS</span>
                  </div>
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
