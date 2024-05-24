import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

const useSocketStore = create((set) => ({
  socketConnected: false,
  status: 'connecting', // 'connecting', 'ready', 'disconnected', 'error'
  setSocketConnected: (connected) => set({ socketConnected: connected }),
  setStatus: (status) => set({ status }),
  clientId: null,
  setClientId: (clientId) => set({ clientId }),
}));

export default useSocketStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('SocketStore', useSocketStore);
}
