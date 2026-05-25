import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  addCartItem,
  clearCart,
  fetchCart,
  mergeCartItems,
  removeCartItem,
  updateCartItem,
} from '../api/cart';
import { getAuthToken } from '../api/client';
import AuthContext from './AuthContext';

const CartContext = createContext(null);

const baseStorageKey = 'cart_items';
const guestStorageKey = `${baseStorageKey}:guest`;

const loadCart = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext) || {};
  const hasAuth = Boolean(user?.id || user?._id);
  const [items, setItems] = useState(() => loadCart(guestStorageKey));

  useEffect(() => {
    const load = async () => {
      if (!hasAuth) {
        setItems(loadCart(guestStorageKey));
        return;
      }

      try {
        const data = await fetchCart();
        setItems(Array.isArray(data?.items) ? data.items : []);
      } catch (error) {
        setItems([]);
      }
    };

    load();
  }, [hasAuth]);

  const persistGuest = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem(guestStorageKey, JSON.stringify(nextItems));
  };

  const addItem = async (product, quantity = 1) => {
    const productId = product.id || product._id || product.productId;
    if (!productId) return;
    if (hasAuth) {
      const data = await addCartItem({ productId, quantity });
      setItems(Array.isArray(data?.items) ? data.items : []);
      return;
    }

    const existing = items.find((item) => item.productId === productId);
    if (existing) {
      const updated = items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
      persistGuest(updated);
      return;
    }
    const next = [
      ...items,
      {
        productId,
        name: product.name,
        price: Number(product.price ?? 0) || 0,
        imageUrl: product.imageUrl || product.image?.url || '',
        vendorId: product.vendorId || product.vendor?._id || null,
        quantity,
      },
    ];
    persistGuest(next);
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      await removeItem(productId);
      return;
    }
    if (hasAuth) {
      const data = await updateCartItem(productId, { quantity });
      setItems(Array.isArray(data?.items) ? data.items : []);
      return;
    }

    const updated = items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    );
    persistGuest(updated);
  };

  const removeItem = async (productId) => {
    if (hasAuth) {
      const data = await removeCartItem(productId);
      setItems(Array.isArray(data?.items) ? data.items : []);
      return;
    }

    const updated = items.filter((item) => item.productId !== productId);
    persistGuest(updated);
  };

  const clear = async () => {
    if (hasAuth) {
      const data = await clearCart();
      setItems(Array.isArray(data?.items) ? data.items : []);
      return;
    }

    persistGuest([]);
  };

  const mergeGuestCart = async () => {
    const token = getAuthToken();
    if (!token) return;
    const guestItems = loadCart(guestStorageKey);
    if (!guestItems.length) return;

    const payloadItems = guestItems
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
      .filter((item) => item.productId && item.quantity > 0);

    if (!payloadItems.length) return;

    const data = await mergeCartItems({ items: payloadItems });
    localStorage.removeItem(guestStorageKey);
    setItems(Array.isArray(data?.items) ? data.items : []);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      mergeGuestCart,
      subtotal,
      itemCount,
    }),
    [items, subtotal, itemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
