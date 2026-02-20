// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect,  } from 'react';
import type { ReactNode } from 'react';
import { 
  signInWithRedirect, 
  signOut as amplifySignOut,
  getCurrentUser,
  fetchAuthSession,
  AuthError
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import type { User, AuthContextType } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  // src/context/AuthContext.tsx

const checkAuthStatus = async (): Promise<void> => {
    console.log('🔍 Checking auth status...');
    try {
      setIsLoading(true);
      
      // Try to get current user
      const currentUser = await getCurrentUser();
      console.log('✅ User found:', currentUser);
      
      // Try to get session
      const session = await fetchAuthSession();
      console.log('✅ Session found:', session);
      
      if (currentUser && session.tokens) {
        const idToken = session.tokens.idToken;
        
        const userData = {
          userId: currentUser.userId,
          username: currentUser.username,
          email: idToken?.payload.email as string,
          emailVerified: idToken?.payload.email_verified as boolean,
        };
        
        console.log('✅ Setting authenticated user:', userData);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.log('⚠️ User found but no tokens');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      // This is normal when user is not logged in
      if (error.name === 'UserUnAuthenticatedException') {
        console.log('ℹ️ No authenticated user (expected when not logged in)');
      } else {
        console.error('❌ Unexpected error during auth check:', error);
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<void> => {
    try {
      await signInWithRedirect({
        provider: 'Google'
      });
      // Note: This will redirect the page, so code after this won't execute
    } catch (error) {
      console.error('❌ Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      await amplifySignOut();
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ User signed out');
    } catch (error) {
      console.error('❌ Error signing out:', error);
      throw error;
    }
  };


  useEffect(() => {
    console.log('🎬 AuthProvider mounted');
    checkAuthStatus();
  
    const hubListener = Hub.listen('auth', async ({ payload }) => {
      console.log('🔔 Hub event:', payload.event);
      
      switch (payload.event) {
        case 'signInWithRedirect':
          console.log('✅ OAuth redirect completed, waiting for tokens...');
          
          // Give Amplify a moment to store tokens
          await new Promise(resolve => setTimeout(resolve, 500));
          
          console.log('🔍 Now checking auth status...');
          await checkAuthStatus();
          break;
          
        case 'signInWithRedirect_failure':
          console.error('❌ OAuth redirect failed:', payload.data);
          setIsLoading(false);
          break;
          
        case 'signedIn':
          console.log('✅ User signed in');
          await checkAuthStatus();
          break;
          
        case 'signedOut':
          console.log('✅ User signed out');
          setUser(null);
          setIsAuthenticated(false);
          break;
          
        case 'tokenRefresh':
          console.log('🔄 Token refreshed');
          break;
          
        case 'tokenRefresh_failure':
          console.log('❌ Token refresh failed');
          setUser(null);
          setIsAuthenticated(false);
          break;
      }
    });
  
    return () => hubListener();
  }, []);
  

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    signInWithGoogle,
    signOut,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};