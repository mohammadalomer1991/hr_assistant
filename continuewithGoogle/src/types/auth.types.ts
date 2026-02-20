// src/types/auth.types.ts

export interface User {
    userId: string;
    username: string;
    email?: string;
    emailVerified?: boolean;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
}