import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

import preset1 from '../presets/cloud9.json';
import preset2 from '../presets/default.json';

const PRESETS = [preset1, preset2];

const usePresetsStore = create((set, get) => {
  let presets = [PRESETS];

  const selectPreset = (id) => {
    const preset = id
      ? get().presets.find((p) => p.id === id)
      : get().presets[0];
    if (preset) {
      set({ selectedPreset: preset });
    } else {
      console.error('preset with id' + id + 'not found');
    }
  };

  const addContent = (content) => {
    const { selectedPreset } = get();
    const existingContentIndex = selectedPreset.contents.findIndex(
      (c) => c.note === content.note,
    );

    const newContents =
      existingContentIndex !== -1
        ? [
            ...selectedPreset.contents.slice(0, existingContentIndex),
            content,
            ...selectedPreset.contents.slice(existingContentIndex + 1),
          ]
        : [...selectedPreset.contents, content];

    set({
      selectedPreset: { ...selectedPreset, contents: newContents },
    });
  };

  return {
    presets,
    selectedPreset: presets[0],
    getAll: () => get().presets,
    selectPreset,
    addContent,
    getSelected: () => get().selectedPreset,
    setName: (name) =>
      set((state) => ({ selectedPreset: { ...state.selectedPreset, name } })),
    setId: (id) =>
      set((state) => ({ selectedPreset: { ...state.selectedPreset, id } })),
    getSelectedJSON: () => JSON.stringify(get().selectedPreset, null, 2),
    getContents: () => get().selectedPreset.contents,
    getContent: (note) =>
      get().selectedPreset.contents.find((c) => c.note === note),
  };
});

export default usePresetsStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('PresetsStore', usePresetsStore);
}
