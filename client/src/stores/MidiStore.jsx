import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

const useMidiStore = create((set) => ({
  midiConnected: false,
  status: 'connecting', // 'connecting', 'ready', 'disconnected', 'error'
  setMidiConnected: (connected) => set({ midiConnected: connected }),
  setStatus: (status) => set({ status }),
}));

export default useMidiStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('MidiStore', useMidiStore);
}
