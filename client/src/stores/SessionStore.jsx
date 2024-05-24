import dayjs from 'dayjs';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { Roles } from '../roles';

import toast from 'react-hot-toast';
import preset1 from '../presets/cloud9.json';
import preset2 from '../presets/default.json';

const PRESETS = [preset1, preset2];

const GENERAL_GROUP = {
  id: 'idle',
  channel: 0,
  name: 'Idle',
  createdAt: dayjs().toISOString(),
  updatedAt: dayjs().toISOString(),
};

const useSessionStore = create((set, get) => ({
  role: Roles.OBSERVER,
  currentGroup: GENERAL_GROUP,
  presetId: 'cloud9',
  setRole: (role) => {
    if (
      role === Roles.GROUP ||
      role === Roles.HOST ||
      role === Roles.OBSERVER
    ) {
      set({ role });
    } else {
      console.error('Unknown role', role);
    }
  },
  loadPreset: (id) =>
    // TODO async loading from external file
    set((state) => {
      const preset = PRESETS.find((p) => p.id === id) || null;
      if (preset) {
        toast(`Welcome to ${preset.name}!`, { position: 'bottom-center' });
        return {
          preset: preset,
          groups: preset.groups || [GENERAL_GROUP],
          presetId: preset.id,
          status: 'loaded',
        };
      } else {
        console.error(`Preset '${id}' not found`);
        toast('Preset not found');
        return {}; // No state changes if preset not found
      }
    }),
  status: 'initial',
  setStatus: (status) => set({ status: status }),
  sessionId: null,
  groups: [GENERAL_GROUP],
  setSessionId: (id) => set({ sessionId: id }),
  addGroup: (newGroup) =>
    set((state) => ({ groups: [...state.groups, newGroup] })),
  switchGroup: (groupId) => {
    const targetGroup =
      get().groups.find((group) => group.id === groupId) || null;
    if (!targetGroup) {
      console.log(`Group ${groupId} not found.`);
      return;
    }
    set({ currentGroup: targetGroup });
  },
}));

export default useSessionStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('SessionStore', useSessionStore);
}
