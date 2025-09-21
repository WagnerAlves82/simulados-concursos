import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Questao, Simulado, SimuladoConfig } from '@/lib/types'

interface SimuladoState {
  // Estado atual
  simuladoAtual: Simulado | null
  questoes: Questao[]
  questaoAtual: number
  respostas: Record<number, string>
  questoesMarcadas: Set<number>
  tempoInicio: Date | null
  configuracoes: SimuladoConfig | null
ECHO est� desativado.
  // Actions
  iniciarSimulado: (simulado: Simulado, questoes: Questao[], config: SimuladoConfig) => void
  responderQuestao: (questaoId: number, resposta: string) => void
  navegarPara: (indice: number) => void
  marcarQuestao: (questaoId: number) => void
  finalizarSimulado: () => void
  limparSimulado: () => void
}

export const useSimuladoStore = create<SimuladoState>()(
  persist(
    (set, get) => ({
      simuladoAtual: null,
      questoes: [],
      questaoAtual: 0,
      respostas: {},
      questoesMarcadas: new Set(),
      tempoInicio: null,
      configuracoes: null,

      iniciarSimulado: (simulado, questoes, config) => {
        set({
          simuladoAtual: simulado,
          questoes,
          questaoAtual: 0,
          respostas: {},
          questoesMarcadas: new Set(),
          tempoInicio: new Date(),
          configuracoes: config
        })
      },

      responderQuestao: (questaoId, resposta) => {
        set(state => ({
          respostas: { ...state.respostas, [questaoId]: resposta }
        }))
      },

      navegarPara: (indice) => {
        set({ questaoAtual: indice })
      },

      marcarQuestao: (questaoId) => {
        set(state => {
          const novasMarcadas = new Set(state.questoesMarcadas)
          if (novasMarcadas.has(questaoId)) {
            novasMarcadas.delete(questaoId)
          } else {
            novasMarcadas.add(questaoId)
          }
          return { questoesMarcadas: novasMarcadas }
        })
      },

      finalizarSimulado: () => {
        const state = get()
        // Aqui você implementaria a lógica para salvar no Supabase
        console.log('Finalizando simulado...', {
          simulado: state.simuladoAtual,
          respostas: state.respostas,
          tempoGasto: state.tempoInicio ? Date.now() - state.tempoInicio.getTime() : 0
        })
      },

      limparSimulado: () => {
        set({
          simuladoAtual: null,
          questoes: [],
          questaoAtual: 0,
          respostas: {},
          questoesMarcadas: new Set(),
          tempoInicio: null,
          configuracoes: null
        })
      }
    }),
    {
      name: 'simulado-storage',
      partialize: (state) => ({
        simuladoAtual: state.simuladoAtual,
        questoes: state.questoes,
        questaoAtual: state.questaoAtual,
        respostas: state.respostas,
        questoesMarcadas: Array.from(state.questoesMarcadas),
        tempoInicio: state.tempoInicio,
        configuracoes: state.configuracoes
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        questoesMarcadas: new Set(persistedState.questoesMarcadas || [])
      })
    }
  )
)
