import { create, StateCreator } from 'zustand'

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearUser: () => void;
  initialize: () => void;
}

const createUserStore: StateCreator<UserState> = (set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user: User | null) => {
    console.log("🔄 Setting user in store:", user)
    set({ user, isLoading: false, error: null })
    console.log("✅ User state updated:", get().user)
  },
  setError: (error: string | null) => {
    console.log("❌ Setting error in store:", error)
    set({ error, isLoading: false })
  },
  setLoading: (isLoading: boolean) => {
    console.log("⌛ Setting loading state:", isLoading)
    set({ isLoading })
  },
  clearUser: () => {
    console.log("🧹 Clearing user state")
    set({ user: null, error: null, isLoading: false })
  },
  initialize: () => {
    console.log("🚀 Initializing user store")
    set({ isLoading: true, error: null })
  }
})

export const useUserStore = create<UserState>(createUserStore) 