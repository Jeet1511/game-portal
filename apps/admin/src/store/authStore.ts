import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Admin {
    id: string;
    username: string;
    email: string;
    role: 'super_admin' | 'admin' | 'moderator';
    profilePicture?: string;
    permissions: string[];
}

interface AuthState {
    admin: Admin | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (admin: Admin, token: string) => void;
    logout: () => void;
    updateAdmin: (admin: Partial<Admin>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            admin: null,
            token: null,
            isAuthenticated: false,
            login: (admin, token) => set({ admin, token, isAuthenticated: true }),
            logout: () => set({ admin: null, token: null, isAuthenticated: false }),
            updateAdmin: (updates) =>
                set((state) => ({
                    admin: state.admin ? { ...state.admin, ...updates } : null,
                })),
        }),
        {
            name: 'admin-auth',
        }
    )
);
