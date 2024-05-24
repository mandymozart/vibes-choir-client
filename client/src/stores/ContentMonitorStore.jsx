import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

const useContentMonitorStore = create((set, get) => ({
  contents: {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    10: null,
    11: null,
    12: null,
    13: null,
    14: null,
    15: null,
    16: null,
  },
  addContent: (note, channel) =>
    set((state) => {
      //   console.log(state.contents);
      return {
        contents: {
          ...state.contents,
          [channel]: note,
        },
      };
    }),
  removeContent: (note, channel) =>
    set((state) => {
      //   console.log(state.contents);
      return {
        contents: {
          ...state.contents,
          [channel]: null,
        },
      };
    }),
}));

export default useContentMonitorStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('ContentMonitorStore', useContentMonitorStore);
}
