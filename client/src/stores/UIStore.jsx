import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

const useUIStore = create((set) => ({
  isPresenting: false,
  setIsPresenting: (value) => set({ isPresenting: value }),
}));

export default useUIStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('UIStore', useUIStore);
}
