import dayjs from 'dayjs';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const uniqueName = uniqueNamesGenerator({
  dictionaries: [colors, adjectives, animals],
  separator: '_',
  style: 'capital',
});

const useUserStore = create(
  persist(
    (set) => ({
      userId: uniqueName.toLocaleLowerCase(),
      userName: uniqueName,
      lastActive: dayjs().toISOString(),
      setName: (name) => set({ name: name }),
      setUserId: (id) => set({ userId: id }),
      priorityGroup: 'audience',
      setPriorityGroup: (groupId) => set({ priorityGroup: groupId }),
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
    },
  ),
);

export default useUserStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('UserStore', useUserStore);
}
