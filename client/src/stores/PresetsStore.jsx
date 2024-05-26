import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

import { persist } from 'zustand/middleware';
import preset1 from '../presets/cloud9.json';
import preset2 from '../presets/default.json';

const PRESETS = [preset1, preset2];

const usePresetsStore = create(
  persist(
    (set, get) => ({
      presets: PRESETS,
      selected: PRESETS[0],
      setSelected: (preset) => set({ selected: preset }),
      updatePreset: (updatedPreset) => {
        const { presets } = get();
        const updatedPresets = presets.map((preset) =>
          preset.id === updatedPreset.id
            ? { ...preset, ...updatedPreset }
            : preset,
        );
        set({ presets: updatedPresets });
      },
    }),
    {
      name: 'preset-store',
    },
  ),
);

export default usePresetsStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('PresetsStore', usePresetsStore);
}
