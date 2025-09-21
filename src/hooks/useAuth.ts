import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (mounted) setUser(user);

        if (user && mounted) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (mounted) setProfile(error ? null : profileData);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        if (mounted) setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUser = session?.user ?? null;
        if (mounted) setUser(newUser);

        if (newUser && mounted) {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', newUser.id)
            .single()
            .then(({ data, error }) => {
              if (mounted) setProfile(error ? null : data);
            });
        } else if (mounted) {
          setProfile(null);
        }
        if (mounted) setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Removido supabase.auth das dependências

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error } as const; // Tipagem explícita
  };

  const signUp = async (email: string, password: string, nome: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } },
    });
    return { data, error } as const;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error } as const;
  };

  return { user, profile, loading, signIn, signUp, signOut };
}