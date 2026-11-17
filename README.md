# 🧥 BALE Menswear — E-Commerce App

Proyecto desarrollado para la asignatura **Desarrollo Frontend II** (UADE — 2° Cuatrimestre 2026).  
**BALE Menswear** es una aplicación web de comercio electrónico orientada a la indumentaria masculina y el *streetwear* en Buenos Aires, construida con **React + Vite**, integrada con **Firebase** y desplegada en **Vercel**.

- 🌐 **Aplicación en vivo (Vercel):** [https://bale-menswear.vercel.app](https://bale-menswear.vercel.app)
- 💻 **Repositorio (GitHub):** [https://github.com/DuranteAG-367/bale-menswear](https://github.com/DuranteAG-367/bale-menswear)

---

## 🚀 Funcionalidades Principales

- **Catálogo Dinámico y Filtros Avanzados:** Búsqueda por nombre, filtrado por categoría (*Remeras, Camisas, Pantalones, Abrigos, Calzado, Accesorios*), filtro de favoritos (*Wishlist*), slider de precio máximo, selector de talle disponible y ordenamiento dinámico (precio y calificación).
- **Detalle de Prenda y Guía de Talles:** Selección de talles con control de stock en tiempo real, sistema de reseñas con estrellas y calculador automático de talle según altura (cm) y peso (kg).
- **Carrito y Checkout:** Bolsa lateral desplegable (*drawer*) con cálculo de subtotales, validación de stock, cupones de descuento (`BALE10`, `UADE2026`, `AGUS25`), descuento automático de inventario al confirmar compra y descarga de comprobantes en formato `.txt`.
- **Panel de Administración:** Control de inventario (`-`/`+` y baja de productos), activación de campañas promocionales (descuento porcentual o 2x1), gestión de cuentas registradas e historial de pagos.
- **Bitácora Interactiva:** Selector de versiones (`V1 MVP`, `V2 Filtros`, `V3 Final`) y modal de documentación técnica integrada.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React, Vite, Tailwind CSS
- **Iconografía:** Lucide React
- **Backend as a Service (BaaS):** Firebase Authentication & Cloud Firestore
- **Despliegue:** Vercel

---

## ⚙️ Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/DuranteAG-367/bale-menswear.git
   cd bale-menswear
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crear un archivo `.env` en la raíz del proyecto (junto a `package.json`) tomando como referencia `.env.example`:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key_aqui
   VITE_FIREBASE_AUTH_DOMAIN=bale-menswear.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=bale-menswear
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 🔒 Reglas de Seguridad (Cloud Firestore)

Las reglas incluidas en `firestore.rules` habilitan la lectura pública del catálogo y restringen las operaciones de escritura y consulta de pedidos a usuarios autenticados:

```javascript
rules_version = '2';
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
}
```

---

## 👨‍💻 Autor

**Agustín Durante**  
Desarrollo Frontend II — Facultad de Arquitectura y Diseño (UADE)