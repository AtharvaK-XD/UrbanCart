import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null, // null means not logged in
  isAuthenticated: false,
  isLoading: true, // starts true to check session on mount
  role: 'BUYER', // 'BUYER' or 'SELLER'
  setRole: (role) => set({ role }),
  
  checkSession: () => {
    set({ isLoading: true })

    // Setup listener for auth state changes (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Supabase Auth Event:', event)
      if (session) {
        const user = session.user
        // If they just logged in, check if we have a pending role to assign
        let currentRole = localStorage.getItem('pending_auth_role')
        
        if (currentRole) {
          // If we had a pending role from the login screen, save it to metadata and clear local storage
          supabase.auth.updateUser({
            data: { role: currentRole }
          })
          localStorage.removeItem('pending_auth_role')
        } else {
          // Otherwise, read it from their existing metadata
          currentRole = user.user_metadata?.role || 'BUYER'
        }

        // Sync/Upsert user profile to public.profiles table to ensure it always exists in database
        supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email.split('@')[0],
            role: currentRole
          })
          .then(({ error }) => {
            if (error) console.warn('Failed to sync profile to database:', error.message)
          })

        set({ 
          user: { 
            id: user.id, 
            name: user.user_metadata?.full_name || user.email, 
            email: user.email 
          },
          isAuthenticated: true,
          role: currentRole,
          isLoading: false
        })
      } else {
        // No session (logged out)
        set({ user: null, isAuthenticated: false, role: 'BUYER', isLoading: false })
      }
    })

    // Return the unsubscribe function in case we ever need to clean it up
    return () => {
      subscription.unsubscribe()
    }
  },

  loginWithGoogle: async (role = 'BUYER') => {
    try {
      // Store selected role in localStorage so we can apply/persist it after redirect
      localStorage.setItem('pending_auth_role', role)
      
      // Redirect to Google OAuth using Supabase
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })
      
      if (error) throw error
    } catch (error) {
      console.error('Google OAuth session initiation failed:', error)
      throw error
    }
  },

  // Fallback demo login (non-Supabase)
  login: (email, password, role) => set({ 
    user: { id: 'u1', name: 'Demo User', email },
    isAuthenticated: true,
    role,
    isLoading: false
  }),

  logout: async () => {
    try {
      set({ isLoading: true })
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Supabase logout failed:', error)
      set({ isLoading: false }) // Reset loading state even if it fails
    } finally {
      localStorage.removeItem('pending_auth_role')
    }
  }
}))
