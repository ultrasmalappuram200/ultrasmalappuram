'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-toastify'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signUp: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        const adminStatus = await checkAndSetAdmin(session.user.id, session.user.email!)
        setIsAdmin(adminStatus)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const adminStatus = await checkAndSetAdmin(session.user.id, session.user.email!)
        setIsAdmin(adminStatus)
      } else {
        setIsAdmin(false)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAndSetAdmin = async (userId: string, userEmail: string): Promise<boolean> => {
    if (!supabase) return false
    
    try {
      console.log('Checking admin status for:', userId, userEmail);
      
      // TEMPORARY FIX: Check if email is admin email
      if (userEmail === 'admin@malappuramfc.com' || userEmail === 'aneesaboo123@gmail.com') {
        console.log('Email is admin email, granting admin access');
        return true;
      }
      
      // Check if profile exists
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      console.log('Profile query result:', profile, error);

      // If there's an error, fallback to email check
      if (error) {
        console.log('Profile query error, falling back to email check');
        if (userEmail === 'admin@malappuramfc.com' || userEmail === 'aneesaboo123@gmail.com') {
          return true;
        }
        return false;
      }

      // If profile exists, check role
      if (profile) {
        console.log('Profile found, role:', profile.role);
        return profile.role === 'admin'
      }

      // If no profile and email is admin email, create admin profile
      if (!profile && (userEmail === 'admin@malappuramfc.com' || userEmail === 'aneesaboo123@gmail.com')) {
        console.log('No profile found, creating admin profile for:', userEmail);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userEmail,
            role: 'admin'
          })
        
        console.log('Profile creation result:', insertError);
        if (!insertError) {
          console.log('Admin profile created successfully');
          return true
        }
        // If creation fails, still grant access based on email
        console.log('Profile creation failed, but email is admin, granting access');
        return true;
      }

      console.log('User is not admin');
      return false
    } catch (error) {
      console.error('Error checking admin status:', error)
      // Fallback: if email is admin email, grant access
      if (userEmail === 'admin@malappuramfc.com' || userEmail === 'aneesaboo123@gmail.com') {
        console.log('Error occurred but email is admin, granting access');
        return true;
      }
      return false
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      toast.error('Supabase not configured. Please check your environment variables.')
      return { success: false, message: 'Supabase not configured' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return { success: false, message: error.message }
      }

      if (data.user) {
        // Check admin status and set it
        console.log('Setting admin status for user:', data.user.id, data.user.email);
        const adminStatus = await checkAndSetAdmin(data.user.id, data.user.email!)
        console.log('Admin status result:', adminStatus);
        setIsAdmin(adminStatus)
        
        toast.success('Login successful!')
        return { success: true, isAdmin: adminStatus }
      }

      return { success: false, message: 'Login failed' }
    } catch (error: any) {
      console.error('Sign in error:', error)
      toast.error('An error occurred during login')
      return { success: false, message: error?.message || 'An error occurred during login' }
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      toast.error('Supabase not configured. Please check your environment variables.')
      return { success: false, message: 'Supabase not configured' }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return { success: false, message: error.message }
      }

      if (data.user) {
        toast.success('Account created successfully! Please check your email to verify your account.')
        return { success: true }
      }

      return { success: false, message: 'Sign up failed' }
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error('An error occurred during sign up')
      return { success: false, message: 'An error occurred during sign up' }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      toast.error('Supabase not configured. Please check your environment variables.')
      return
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error(error.message)
        return
      }
      
      setIsAdmin(false)
      toast.success('Logged out successfully!')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('An error occurred during logout')
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
