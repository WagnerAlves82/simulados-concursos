@echo off
echo Criando estrutura completa do Sistema de Simulados...

REM Criar estrutura de pastas
mkdir src\app\(auth)\login
mkdir src\app\(auth)\register  
mkdir src\app\dashboard
mkdir src\app\simulado\[id]
mkdir src\app\simulado\configurar
mkdir src\components\ui
mkdir src\components\auth
mkdir src\components\simulado
mkdir src\components\shared
mkdir src\lib
mkdir src\hooks
mkdir src\store

echo Criando arquivos principais...

REM ===== ARQUIVOS LIB =====

echo. > src\lib\supabase.ts
(
echo import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'^

echo import { cookies } from 'next/headers'^

echo import { Database } from './types'^

echo.
echo export const createClient = ^(^) =^> createClientComponentClient^<Database^>^(^)^

echo export const createServerClient = ^(^) =^> createServerComponentClient^<Database^>^({ cookies }^)^

echo.
echo export const supabase = createClient^(^)
) > src\lib\supabase.ts

echo. > src\lib\types.ts
(
echo export interface Database {
echo   public: {
echo     Tables: {
echo       profiles: {
echo         Row: {
echo           id: string
echo           email: string
echo           nome: string
echo           data_cadastro: string
echo           ultimo_acesso: string ^| null
echo           plano: 'gratuito' ^| 'premium'
echo           created_at: string
echo           updated_at: string
echo         }
echo         Insert: {
echo           id: string
echo           email: string
echo           nome: string
echo           data_cadastro?: string
echo           ultimo_acesso?: string ^| null
echo           plano?: 'gratuito' ^| 'premium'
echo           created_at?: string
echo           updated_at?: string
echo         }
echo         Update: {
echo           id?: string
echo           email?: string
echo           nome?: string
echo           data_cadastro?: string
echo           ultimo_acesso?: string ^| null
echo           plano?: 'gratuito' ^| 'premium'
echo           created_at?: string
echo           updated_at?: string
echo         }
echo       }
echo       cargos: {
echo         Row: {
echo           id: number
echo           nome: string
echo           descricao: string ^| null
echo           orgao: string
echo           banca: string
echo           nivel_escolaridade: string
echo           ativo: boolean
echo           created_at: string
echo           updated_at: string
echo         }
echo         Insert: {
echo           id?: number
echo           nome: string
echo           descricao?: string ^| null
echo           orgao: string
echo           banca?: string
echo           nivel_escolaridade: string
echo           ativo?: boolean
echo           created_at?: string
echo           updated_at?: string
echo         }
echo         Update: {
echo           id?: number
echo           nome?: string
echo           descricao?: string ^| null
echo           orgao?: string
echo           banca?: string
echo           nivel_escolaridade?: string
echo           ativo?: boolean
echo           created_at?: string
echo           updated_at?: string
echo         }
echo       }
echo       areas_conhecimento: {
echo         Row: {
echo           id: number
echo           nome: string
echo           descricao: string ^| null
echo           created_at: string
echo         }
echo         Insert: {
echo           id?: number
echo           nome: string
echo           descricao?: string ^| null
echo           created_at?: string
echo         }
echo         Update: {
echo           id?: number
echo           nome?: string
echo           descricao?: string ^| null
echo           created_at?: string
echo         }
echo       }
echo       questoes: {
echo         Row: {
echo           id: number
echo           cargo_id: number
echo           area_id: number
echo           enunciado: string
echo           alternativa_a: string
echo           alternativa_b: string
echo           alternativa_c: string
echo           alternativa_d: string
echo           alternativa_e: string ^| null
echo           resposta_correta: 'A' ^| 'B' ^| 'C' ^| 'D' ^| 'E'
echo           feedback: string
echo           dificuldade: number
echo           fonte: string ^| null
echo           ano_referencia: number ^| null
echo           ativo: boolean
echo           created_at: string
echo           updated_at: string
echo         }
echo         Insert: {
echo           id?: number
echo           cargo_id: number
echo           area_id: number
echo           enunciado: string
echo           alternativa_a: string
echo           alternativa_b: string
echo           alternativa_c: string
echo           alternativa_d: string
echo           alternativa_e?: string ^| null
echo           resposta_correta: 'A' ^| 'B' ^| 'C' ^| 'D' ^| 'E'
echo           feedback: string
echo           dificuldade?: number
echo           fonte?: string ^| null
echo           ano_referencia?: number ^| null
echo           ativo?: boolean
echo           created_at?: string
echo           updated_at?: string
echo         }
echo         Update: {
echo           id?: number
echo           cargo_id?: number
echo           area_id?: number
echo           enunciado?: string
echo           alternativa_a?: string
echo           alternativa_b?: string
echo           alternativa_c?: string
echo           alternativa_d?: string
echo           alternativa_e?: string ^| null
echo           resposta_correta?: 'A' ^| 'B' ^| 'C' ^| 'D' ^| 'E'
echo           feedback?: string
echo           dificuldade?: number
echo           fonte?: string ^| null
echo           ano_referencia?: number ^| null
echo           ativo?: boolean
echo           created_at?: string
echo           updated_at?: string
echo         }
echo       }
echo       simulados: {
echo         Row: {
echo           id: number
echo           user_id: string
echo           cargo_id: number
echo           tipo: string
echo           configuracoes: any
echo           status: 'em_andamento' ^| 'concluido' ^| 'abandonado'
echo           data_inicio: string
echo           data_conclusao: string ^| null
echo           tempo_gasto: number ^| null
echo           pontuacao_total: number ^| null
echo           percentual_acertos: number ^| null
echo           created_at: string
echo         }
echo         Insert: {
echo           id?: number
echo           user_id: string
echo           cargo_id: number
echo           tipo?: string
echo           configuracoes?: any
echo           status?: 'em_andamento' ^| 'concluido' ^| 'abandonado'
echo           data_inicio?: string
echo           data_conclusao?: string ^| null
echo           tempo_gasto?: number ^| null
echo           pontuacao_total?: number ^| null
echo           percentual_acertos?: number ^| null
echo           created_at?: string
echo         }
echo         Update: {
echo           id?: number
echo           user_id?: string
echo           cargo_id?: number
echo           tipo?: string
echo           configuracoes?: any
echo           status?: 'em_andamento' ^| 'concluido' ^| 'abandonado'
echo           data_inicio?: string
echo           data_conclusao?: string ^| null
echo           tempo_gasto?: number ^| null
echo           pontuacao_total?: number ^| null
echo           percentual_acertos?: number ^| null
echo           created_at?: string
echo         }
echo       }
echo       simulado_questoes: {
echo         Row: {
echo           id: number
echo           simulado_id: number
echo           questao_id: number
echo           ordem: number
echo           resposta_usuario: 'A' ^| 'B' ^| 'C' ^| 'D' ^| 'E' ^| null
echo           tempo_resposta: number ^| null
echo           correta: boolean ^| null
echo           created_at: string
echo         }
echo         Insert: {
echo           id?: number
echo           simulado_id: number
echo           questao_id: number
echo           ordem: number
echo           resposta_usuario?: 'A' ^| 'B' ^| 'C' ^| 'D' ^| 'E' ^| null
echo           tempo_resposta?: number ^| null
echo           correta?: boolean ^| null
echo           created_at?: string
echo         }
echo         Update: {
echo           id?: number
echo           simulado_id?: number
echo           questao_id?: number
echo           ordem?: number
echo           resposta_usuario?: 'A' ^| 'B' ^| 'C' ^| 'D' ^| 'E' ^| null
echo           tempo_resposta?: number ^| null
echo           correta?: boolean ^| null
echo           created_at?: string
echo         }
echo       }
echo       estatisticas_areas: {
echo         Row: {
echo           id: number
echo           user_id: string
echo           cargo_id: number
echo           area_id: number
echo           total_questoes: number
echo           acertos: number
echo           percentual: number
echo           ultima_atualizacao: string
echo         }
echo         Insert: {
echo           id?: number
echo           user_id: string
echo           cargo_id: number
echo           area_id: number
echo           total_questoes?: number
echo           acertos?: number
echo           percentual?: number
echo           ultima_atualizacao?: string
echo         }
echo         Update: {
echo           id?: number
echo           user_id?: string
echo           cargo_id?: number
echo           area_id?: number
echo           total_questoes?: number
echo           acertos?: number
echo           percentual?: number
echo           ultima_atualizacao?: string
echo         }
echo       }
echo     }
echo     Views: {
echo       [_ in never]: never
echo     }
echo     Functions: {
echo       [_ in never]: never
echo     }
echo     Enums: {
echo       [_ in never]: never
echo     }
echo   }
echo }
echo.
echo // Tipos customizados
echo export type Questao = Database['public']['Tables']['questoes']['Row']
echo export type QuestaoInsert = Database['public']['Tables']['questoes']['Insert']  
echo export type QuestaoUpdate = Database['public']['Tables']['questoes']['Update']
echo.
echo export type Simulado = Database['public']['Tables']['simulados']['Row']
echo export type SimuladoInsert = Database['public']['Tables']['simulados']['Insert']
echo export type SimuladoUpdate = Database['public']['Tables']['simulados']['Update']
echo.
echo export type SimuladoQuestao = Database['public']['Tables']['simulado_questoes']['Row']
echo export type SimuladoQuestaoInsert = Database['public']['Tables']['simulado_questoes']['Insert']
echo export type SimuladoQuestaoUpdate = Database['public']['Tables']['simulado_questoes']['Update']
echo.
echo export type Cargo = Database['public']['Tables']['cargos']['Row']
echo export type AreaConhecimento = Database['public']['Tables']['areas_conhecimento']['Row']
echo export type Profile = Database['public']['Tables']['profiles']['Row']
echo export type EstatisticaArea = Database['public']['Tables']['estatisticas_areas']['Row']
echo.
echo export interface SimuladoConfig {
echo   embaralhar: boolean
echo   tempo_limite: number
echo   mostrar_feedback: boolean
echo   modo: 'prova_completa' ^| 'area_especifica' ^| 'personalizado'
echo   areas_selecionadas?: number[]
echo   dificuldade_min?: number
echo   dificuldade_max?: number
echo }
echo.
echo export interface ResultadoSimulado {
echo   simulado_id: number
echo   acertos: number
echo   total_questoes: number
echo   percentual: number
echo   tempo_gasto: number
echo   data_conclusao: string
echo   questoes_detalhadas: {
echo     questao_id: number
echo     resposta_usuario: string ^| null
echo     resposta_correta: string
echo     acertou: boolean
echo     tempo_resposta: number ^| null
echo   }[]
echo   estatisticas_por_area: {
echo     area_id: number
echo     nome_area: string
echo     acertos: number
echo     total: number
echo     percentual: number
echo   }[]
echo }
) > src\lib\types.ts

echo. > src\lib\utils.ts
(
echo import { type ClassValue, clsx } from "clsx"
echo import { twMerge } from "tailwind-merge"
echo.
echo export function cn^(...classes: ClassValue[]^) {
echo   return twMerge^(clsx^(classes^)^)
echo }
echo.
echo export function formatarTempo^(segundos: number^): string {
echo   const horas = Math.floor^(segundos / 3600^)
echo   const mins = Math.floor^(^(segundos %% 3600^) / 60^)
echo   const secs = segundos %% 60
echo   return `${horas.toString^(^).padStart^(2, '0'^)}:${mins.toString^(^).padStart^(2, '0'^)}:${secs.toString^(^).padStart^(2, '0'^)}`
echo }
echo.
echo export function embaralharArray^<T^>^(array: T[]^): T[] {
echo   const resultado = [...array]
echo   for ^(let i = resultado.length - 1; i ^> 0; i--^) {
echo     const j = Math.floor^(Math.random^(^) * ^(i + 1^)^)
echo     ;[resultado[i], resultado[j]] = [resultado[j], resultado[i]]
echo   }
echo   return resultado
echo }
echo.
echo export function calcularPercentual^(acertos: number, total: number^): number {
echo   if ^(total === 0^) return 0
echo   return Math.round^(^(acertos / total^) * 100^)
echo }
echo.
echo export function obterCorPorPercentual^(percentual: number^): string {
echo   if ^(percentual ^>= 80^) return 'text-green-600'
echo   if ^(percentual ^>= 70^) return 'text-blue-600'  
echo   if ^(percentual ^>= 60^) return 'text-yellow-600'
echo   return 'text-red-600'
echo }
echo.
echo export function formatarData^(data: string^): string {
echo   return new Date^(data^).toLocaleDateString^('pt-BR', {
echo     day: '2-digit',
echo     month: '2-digit', 
echo     year: 'numeric'
echo   }^)
echo }
echo.
echo export function formatarDataHora^(data: string^): string {
echo   return new Date^(data^).toLocaleString^('pt-BR', {
echo     day: '2-digit',
echo     month: '2-digit',
echo     year: 'numeric',
echo     hour: '2-digit',
echo     minute: '2-digit'
echo   }^)
echo }
) > src\lib\utils.ts

REM ===== ARQUIVOS HOOKS =====

echo. > src\hooks\useAuth.ts
(
echo import { useEffect, useState } from 'react'
echo import { createClient } from '@/lib/supabase'
echo import type { User } from '@supabase/supabase-js'
echo import type { Profile } from '@/lib/types'
echo.
echo export function useAuth^(^) {
echo   const [user, setUser] = useState^<User ^| null^>^(null^)
echo   const [profile, setProfile] = useState^<Profile ^| null^>^(null^)
echo   const [loading, setLoading] = useState^(true^)
echo   const supabase = createClient^(^)
echo.
echo   useEffect^(^(^) =^> {
echo     const getUser = async ^(^) =^> {
echo       try {
echo         const { data: { user } } = await supabase.auth.getUser^(^)
echo         setUser^(user^)
echo         
echo         if ^(user^) {
echo           const { data: profileData } = await supabase
echo             .from^('profiles'^)
echo             .select^('*'^)
echo             .eq^('id', user.id^)
echo             .single^(^)
echo           setProfile^(profileData^)
echo         }
echo       } catch ^(error^) {
echo         console.error^('Erro ao buscar usuário:', error^)
echo       } finally {
echo         setLoading^(false^)
echo       }
echo     }
echo.
echo     getUser^(^)
echo.
echo     const { data: { subscription } } = supabase.auth.onAuthStateChange^(
echo       async ^(event, session^) =^> {
echo         setUser^(session?.user ?? null^)
echo         
echo         if ^(session?.user^) {
echo           const { data: profileData } = await supabase
echo             .from^('profiles'^)
echo             .select^('*'^)
echo             .eq^('id', session.user.id^)
echo             .single^(^)
echo           setProfile^(profileData^)
echo         } else {
echo           setProfile^(null^)
echo         }
echo         
echo         setLoading^(false^)
echo       }
echo     ^)
echo.
echo     return ^(^) =^> subscription.unsubscribe^(^)
echo   }, [supabase.auth]^)
echo.
echo   const signIn = async ^(email: string, password: string^) =^> {
echo     const { data, error } = await supabase.auth.signInWithPassword^({
echo       email,
echo       password
echo     }^)
echo     return { data, error }
echo   }
echo.
echo   const signUp = async ^(email: string, password: string, nome: string^) =^> {
echo     const { data, error } = await supabase.auth.signUp^({
echo       email,
echo       password,
echo       options: {
echo         data: { nome }
echo       }
echo     }^)
echo     return { data, error }
echo   }
echo.
echo   const signOut = async ^(^) =^> {
echo     const { error } = await supabase.auth.signOut^(^)
echo     return { error }
echo   }
echo.
echo   return {
echo     user,
echo     profile,
echo     loading,
echo     signIn,
echo     signUp,
echo     signOut
echo   }
echo }
) > src\hooks\useAuth.ts

echo. > src\hooks\useTimer.ts
(
echo import { useEffect, useState, useCallback } from 'react'
echo.
echo export function useTimer^(initialTime: number, onTimeUp?: ^(^) =^> void^) {
echo   const [timeLeft, setTimeLeft] = useState^(initialTime^)
echo   const [isRunning, setIsRunning] = useState^(false^)
echo.
echo   useEffect^(^(^) =^> {
echo     if ^(!isRunning ^|^| timeLeft ^<= 0^) return
echo.
echo     const interval = setInterval^(^(^) =^> {
echo       setTimeLeft^(time =^> {
echo         if ^(time ^<= 1^) {
echo           setIsRunning^(false^)
echo           onTimeUp?.^(^)
echo           return 0
echo         }
echo         return time - 1
echo       }^)
echo     }, 1000^)
echo.
echo     return ^(^) =^> clearInterval^(interval^)
echo   }, [isRunning, timeLeft, onTimeUp]^)
echo.
echo   const start = useCallback^(^(^) =^> setIsRunning^(true^), []^)
echo   const pause = useCallback^(^(^) =^> setIsRunning^(false^), []^)
echo   const reset = useCallback^(^(newTime?: number^) =^> {
echo     setTimeLeft^(newTime ^|^| initialTime^)
echo     setIsRunning^(false^)
echo   }, [initialTime]^)
echo.
echo   return {
echo     timeLeft,
echo     isRunning,
echo     start,
echo     pause,
echo     reset
echo   }
echo }
) > src\hooks\useTimer.ts

REM ===== ARQUIVOS STORE =====

echo. > src\store\simuladoStore.ts
(
echo import { create } from 'zustand'
echo import { persist } from 'zustand/middleware'
echo import type { Questao, Simulado, SimuladoConfig } from '@/lib/types'
echo.
echo interface SimuladoState {
echo   // Estado atual
echo   simuladoAtual: Simulado ^| null
echo   questoes: Questao[]
echo   questaoAtual: number
echo   respostas: Record^<number, string^>
echo   questoesMarcadas: Set^<number^>
echo   tempoInicio: Date ^| null
echo   configuracoes: SimuladoConfig ^| null
echo   
echo   // Actions
echo   iniciarSimulado: ^(simulado: Simulado, questoes: Questao[], config: SimuladoConfig^) =^> void
echo   responderQuestao: ^(questaoId: number, resposta: string^) =^> void
echo   navegarPara: ^(indice: number^) =^> void
echo   marcarQuestao: ^(questaoId: number^) =^> void
echo   finalizarSimulado: ^(^) =^> void
echo   limparSimulado: ^(^) =^> void
echo }
echo.
echo export const useSimuladoStore = create^<SimuladoState^>^(^)^(
echo   persist^(
echo     ^(set, get^) =^> ^({
echo       simuladoAtual: null,
echo       questoes: [],
echo       questaoAtual: 0,
echo       respostas: {},
echo       questoesMarcadas: new Set^(^),
echo       tempoInicio: null,
echo       configuracoes: null,
echo.
echo       iniciarSimulado: ^(simulado, questoes, config^) =^> {
echo         set^({
echo           simuladoAtual: simulado,
echo           questoes,
echo           questaoAtual: 0,
echo           respostas: {},
echo           questoesMarcadas: new Set^(^),
echo           tempoInicio: new Date^(^),
echo           configuracoes: config
echo         }^)
echo       },
echo.
echo       responderQuestao: ^(questaoId, resposta^) =^> {
echo         set^(state =^> ^({
echo           respostas: { ...state.respostas, [questaoId]: resposta }
echo         }^)^)
echo       },
echo.
echo       navegarPara: ^(indice^) =^> {
echo         set^({ questaoAtual: indice }^)
echo       },
echo.
echo       marcarQuestao: ^(questaoId^) =^> {
echo         set^(state =^> {
echo           const novasMarcadas = new Set^(state.questoesMarcadas^)
echo           if ^(novasMarcadas.has^(questaoId^)^) {
echo             novasMarcadas.delete^(questaoId^)
echo           } else {
echo             novasMarcadas.add^(questaoId^)
echo           }
echo           return { questoesMarcadas: novasMarcadas }
echo         }^)
echo       },
echo.
echo       finalizarSimulado: ^(^) =^> {
echo         const state = get^(^)
echo         // Aqui você implementaria a lógica para salvar no Supabase
echo         console.log^('Finalizando simulado...', {
echo           simulado: state.simuladoAtual,
echo           respostas: state.respostas,
echo           tempoGasto: state.tempoInicio ? Date.now^(^) - state.tempoInicio.getTime^(^) : 0
echo         }^)
echo       },
echo.
echo       limparSimulado: ^(^) =^> {
echo         set^({
echo           simuladoAtual: null,
echo           questoes: [],
echo           questaoAtual: 0,
echo           respostas: {},
echo           questoesMarcadas: new Set^(^),
echo           tempoInicio: null,
echo           configuracoes: null
echo         }^)
echo       }
echo     }^),
echo     {
echo       name: 'simulado-storage',
echo       partialize: ^(state^) =^> ^({
echo         simuladoAtual: state.simuladoAtual,
echo         questoes: state.questoes,
echo         questaoAtual: state.questaoAtual,
echo         respostas: state.respostas,
echo         questoesMarcadas: Array.from^(state.questoesMarcadas^),
echo         tempoInicio: state.tempoInicio,
echo         configuracoes: state.configuracoes
echo       }^),
echo       merge: ^(persistedState: any, currentState^) =^> ^({
echo         ...currentState,
echo         ...persistedState,
echo         questoesMarcadas: new Set^(persistedState.questoesMarcadas ^|^| []^)
echo       }^)
echo     }
echo   ^)
echo ^)
) > src\store\simuladoStore.ts

REM ===== LAYOUT PRINCIPAL =====

echo. > src\app\layout.tsx
(
echo import './globals.css'
echo import { Inter } from 'next/font/google'
echo import { Providers } from './providers'
echo.
echo const inter = Inter^({ subsets: ['latin'] }^)
echo.
echo export const metadata = {
echo   title: 'Sistema de Simulados - Concursos Públicos',
echo   description: 'Prepare-se para concursos públicos com simulados personalizados da banca HC Assessoria',
echo }
echo.
echo export default function RootLayout^({
echo   children,
echo }: {
echo   children: React.ReactNode
echo }^) {
echo   return ^(
echo     ^<html lang="pt-BR"^>
echo       ^<body className={inter.className}^>
echo         ^<Providers^>
echo           {children}
echo         ^</Providers^>
echo       ^</body^>
echo     ^</html^>
echo   ^)
echo }
) > src\app\layout.tsx

echo. > src\app\providers.tsx
(
echo 'use client'
echo.
echo import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
echo import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
echo import { Toaster } from '@/components/ui/toaster'
echo import { useState } from 'react'
echo.
echo export function Providers^({ children }: { children: React.ReactNode }^) {
echo   const [queryClient] = useState^(
echo     ^(^) =^>
echo       new QueryClient^({
echo         defaultOptions: {
echo           queries: {
echo             staleTime: 60 * 1000, // 1 minuto
echo             retry: 1,
echo           },
echo         },
echo       }^)
echo   ^)
echo.
echo   return ^(
echo     ^<QueryClientProvider client={queryClient}^>
echo       {children}
echo       ^<ReactQueryDevtools initialIsOpen={false} /^>
echo       ^<Toaster /^>
echo     ^</QueryClientProvider^>
echo   ^)
echo }
) > src\app\providers.tsx

echo. > src\app\globals.css
(
echo @tailwind base;
echo @tailwind components;
echo @tailwind utilities;
echo.
echo @layer base {
echo   :root {
echo     --background: 0 0%% 100%%;
echo     --foreground: 222.2 84%% 4.9%%;
echo     --card: 0 0%% 100%%;
echo     --card-foreground: 222.2 84%% 4.9%%;
echo     --popover: 0 0%% 100%%;
echo     --popover-foreground: 222.2 84%% 4.9%%;
echo     --primary: 221.2 83.2%% 53.3%%;
echo     --primary-foreground: 210 40%% 98%%;
echo     --secondary: 210 40%% 96%%;
echo     --secondary-foreground: 222.2 84%% 4.9%%;
echo     --muted: 210 40%% 96%%;
echo     --muted-foreground: 215.4 16.3%% 46.9%%;
echo     --accent: 210 40%% 96%%;
echo     --accent-foreground: 222.2 84%% 4.9%%;
echo     --destructive: 0 84.2%% 60.2%%;
echo     --destructive-foreground: 210 40%% 98%%;
echo     --border: 214.3 31.8%% 91.4%%;
echo     --input: 214.3 31.8%% 91.4%%;
echo     --ring: 221.2 83.2%% 53.3%%;
echo     --radius: 0.5rem;
echo   }
echo.
echo   .dark {
echo     --background: 222.2 84%% 4.9%%;
echo     --foreground: 210 40%% 98%%;
echo     --card: 222.2 84%% 4.9%%;
echo     --card-foreground: 210 40%% 98%%;
echo     --popover: 222.2 84%% 4.9%%;
echo     --popover-foreground: 210 40%% 98%%;
echo     --primary: 217.2 91.2%% 59.8%%;
echo     --primary-foreground: 222.2 84%% 4.9%%;
echo     --secondary: 217.2 32.6%% 17.5%%;
echo     --secondary-foreground: 210 40%% 98%%;
echo     --muted: 217.2 32.6%% 17.5%%;
echo     --muted-foreground: 215 20.2%% 65.1%%;
echo     --accent: 217.2 32.6%% 17.5%}