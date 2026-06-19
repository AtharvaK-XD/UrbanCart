import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  addItem: (product, quantity = 1, size = null) => set((state) => {
    const existingItem = state.items.find(item => item.product.id === product.id && item.size === size);
    if (existingItem) {
      return {
        items: state.items.map(item =>
          (item.product.id === product.id && item.size === size)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      };
    }
    return { items: [...state.items, { product, quantity, size }] };
  }),
  removeItem: (productId, size = null) => set((state) => ({
    items: state.items.filter(item => !(item.product.id === productId && item.size === size))
  })),
  updateQuantity: (productId, quantity, size = null) => set((state) => ({
    items: state.items.map(item =>
      (item.product.id === productId && item.size === size) ? { ...item, quantity } : item
    )
  })),
  clearCart: () => set({ items: [] }),
  getCartTotal: () => {
    return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },
  getCartCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  }
}))
