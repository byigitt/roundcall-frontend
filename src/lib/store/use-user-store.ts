import { create, StateCreator } from 'zustand'

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  role: 'user' | 'admin' | 'trainer' | 'trainee';
  isActive: boolean;
  lastLogin: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearUser: () => void;
}

const createUserStore: StateCreator<UserState> = (set) => ({
  user: null,
  isLoading: true,
  error: null,
  setUser: (user: User | null) => set({ user, isLoading: false }),
  setError: (error: string | null) => set({ error, isLoading: false }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  clearUser: () => set({ user: null, error: null, isLoading: false }),
})

export const useUserStore = create<UserState>(createUserStore) 