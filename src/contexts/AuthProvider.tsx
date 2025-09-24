//src/context/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

interface Profile {
  id: string
  email: string
  nome: string
  plano: string
  ultimo_acesso?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, nome: string) => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Verificar sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erro ao obter sessão:', error)
          setUser(null)
          setProfile(null)
        } else if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error('Erro na verificação inicial:', error)
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile não existe, criar um
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              email: user?.email || '',
              nome: user?.user_metadata?.nome || user?.email?.split('@')[0] || '',
              plano: 'gratuito'
            }
          ])
          .select()
          .single()

        if (createError) {
          console.error('Erro ao criar profile:', createError)
        } else {
          setProfile(newProfile)
        }
      } else if (error) {
        console.error('Erro ao carregar profile:', error)
      } else {
        setProfile(data)
        
        // Atualizar último acesso
        await supabase
          .from('profiles')
          .update({ ultimo_acesso: new Date().toISOString() })
          .eq('id', userId)
      }
    } catch (error) {
      console.error('Erro ao carregar profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome
          }
        }
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      // Redirecionar para home
      window.location.href = '/'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      signOut,
      signIn,
      signUp,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}