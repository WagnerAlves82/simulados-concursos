import { useState, useEffect, useCallback, useMemo } from 'react'
import { QuestoesService, QuestaoCompleta, AreaEstatistica } from '@/lib/questoesServices'
import { useAuth } from '@/contexts/AuthProvider'

export function useQuestoes(cargoId: number = 1) {
  const { user } = useAuth()
  const [questoes, setQuestoes] = useState<QuestaoCompleta[]>([])
  const [areas, setAreas] = useState<AreaEstatistica[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastCargoId, setLastCargoId] = useState<number | null>(null)
  
  // Memorizar a instância do service para evitar recriações
  const questoesService = useMemo(() => new QuestoesService(), [])

  // Função para carregar questões (com useCallback para evitar re-renders desnecessários)
  const carregarQuestoes = useCallback(async (forceReload = false) => {
    // Evitar chamadas desnecessárias se o cargoId não mudou
    if (!forceReload && lastCargoId === cargoId && questoes.length > 0) {
      console.log('Questões já carregadas para este cargo, pulando...')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      console.log(`🔄 Carregando questões para cargo ${cargoId}...`)
      
      // Primeiro testar a conexão
      await questoesService.testarConexao()
      console.log('✅ Conexão com Supabase OK')
      
      // Buscar questões
      const resultado = await questoesService.buscarQuestoesPorCargo(cargoId)
      
      console.log(`📊 Resultado da busca:`, {
        totalQuestoes: resultado.questoes.length,
        totalAreas: resultado.areas.length,
        areas: resultado.areas.map(a => ({ id: a.id, nome: a.nome, questoes: a.total_questoes }))
      })
      
      if (resultado.questoes.length === 0) {
        console.warn(`⚠️ Nenhuma questão encontrada para o cargo ${cargoId}`)
        setError(`Nenhuma questão encontrada para o cargo selecionado`)
      } else {
        setQuestoes(resultado.questoes)
        setAreas(resultado.areas)
        setLastCargoId(cargoId)
        console.log(`✅ ${resultado.questoes.length} questões carregadas com sucesso`)
      }
      
    } catch (err) {
      console.error('❌ Erro ao carregar questões:', err)
      
      // Tratamento de erro mais específico
      if (err instanceof Error) {
        if (err.message.includes('JWT')) {
          setError('Erro de autenticação. Faça login novamente.')
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          setError('Erro de conexão. Verifique sua internet.')
        } else {
          setError(`Erro ao carregar questões: ${err.message}`)
        }
      } else {
        setError('Erro desconhecido ao carregar questões')
      }
    } finally {
      setLoading(false)
    }
  }, [cargoId, lastCargoId, questoes.length, questoesService])

  // Carregar questões quando o cargoId mudar
  useEffect(() => {
    if (cargoId) {
      carregarQuestoes()
    }
  }, [cargoId, carregarQuestoes])

  // Gerar simulado personalizado
  const gerarSimulado = useCallback(async (): Promise<QuestaoCompleta[]> => {
    try {
      console.log(`🎯 Gerando simulado para cargo ${cargoId}...`)
      
      const questoesSimulado = await questoesService.gerarSimuladoPersonalizado(cargoId)
      
      console.log(`✅ Simulado gerado: ${questoesSimulado.length} questões`)
      console.log('📋 Distribuição por área:', 
        questoesSimulado.reduce((acc, q) => {
          acc[q.area_nome] = (acc[q.area_nome] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      )
      
      return questoesSimulado
    } catch (err) {
      console.error('❌ Erro ao gerar simulado:', err)
      throw new Error('Erro ao gerar simulado. Tente novamente.')
    }
  }, [cargoId, questoesService])

  // Salvar resultado (apenas para usuários logados)
  const salvarResultado = useCallback(async (
    questoesSimulado: QuestaoCompleta[],
    respostas: { [key: number]: string },
    tempoGasto: number
  ) => {
    if (!user) {
      throw new Error('Usuário não logado')
    }

    try {
      console.log(`💾 Salvando resultado do simulado...`, {
        userId: user.id,
        cargoId,
        totalQuestoes: questoesSimulado.length,
        totalRespostas: Object.keys(respostas).length,
        tempoGasto: `${Math.floor(tempoGasto / 60)}min ${tempoGasto % 60}s`
      })

      const simuladoId = await questoesService.salvarResultadoSimulado(
        user.id,
        cargoId,
        questoesSimulado,
        respostas,
        tempoGasto
      )
      
      console.log(`✅ Resultado salvo com ID: ${simuladoId}`)
      return simuladoId
    } catch (err) {
      console.error('❌ Erro ao salvar resultado:', err)
      throw new Error('Erro ao salvar resultado')
    }
  }, [user, cargoId, questoesService])

  // Buscar estatísticas do usuário
  const carregarEstatisticas = useCallback(async (): Promise<AreaEstatistica[]> => {
    if (!user) {
      console.log('👤 Usuário não logado, retornando estatísticas vazias')
      return []
    }
    
    try {
      console.log(`📈 Carregando estatísticas para usuário ${user.id}...`)
      
      const stats = await questoesService.buscarEstatisticasUsuario(user.id, cargoId)
      
      console.log(`✅ Estatísticas carregadas:`, stats.map(s => ({
        area: s.nome,
        acertos: s.acertos,
        total: s.total_questoes,
        percentual: s.percentual.toFixed(1) + '%'
      })))
      
      return stats
    } catch (err) {
      console.error('❌ Erro ao carregar estatísticas:', err)
      return []
    }
  }, [user, cargoId, questoesService])

  // Função para buscar questões por área específica
  const buscarQuestoesPorArea = useCallback(async (areaId: number, limite?: number): Promise<QuestaoCompleta[]> => {
    try {
      console.log(`🔍 Buscando questões da área ${areaId}...`)
      
      const questoesDaArea = await questoesService.buscarQuestoesPorArea(cargoId, areaId, limite)
      
      console.log(`✅ ${questoesDaArea.length} questões encontradas para a área`)
      return questoesDaArea
    } catch (err) {
      console.error('❌ Erro ao buscar questões por área:', err)
      throw new Error('Erro ao buscar questões da área')
    }
  }, [cargoId, questoesService])

  // Estatísticas computadas
  const estatisticas = useMemo(() => {
    if (questoes.length === 0) return null

    const totalPorArea = questoes.reduce((acc, q) => {
      acc[q.area_nome] = (acc[q.area_nome] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalQuestoes: questoes.length,
      totalAreas: areas.length,
      questoesPorArea: totalPorArea,
      areasDisponiveis: areas.map(a => ({
        id: a.id,
        nome: a.nome,
        questoes: a.total_questoes,
        peso: a.peso
      }))
    }
  }, [questoes, areas])

  // Estado de validação
  const isReady = !loading && questoes.length > 0 && areas.length > 0

  // 🔍 DEBUG INFO EXPANDIDO
  const debug = useMemo(() => ({
    cargoId,
    totalQuestoes: questoes.length,
    totalAreas: areas.length,
    lastCargoId,
    loading,
    error,
    isReady,
    // Informações detalhadas para debug
    questoesPorArea: questoes.reduce((acc, q) => {
      acc[q.area_nome] = (acc[q.area_nome] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    areasConfiguradas: areas.map(a => ({
      id: a.id,
      nome: a.nome,
      questoesConfiguradas: a.total_questoes,
      peso: a.peso
    })),
    // Amostra das primeiras questões
    amostraQuestoes: questoes.slice(0, 2).map(q => ({
      id: q.id,
      area: q.area_nome,
      enunciado: q.enunciado.substring(0, 50) + '...'
    }))
  }), [cargoId, questoes, areas, lastCargoId, loading, error, isReady])

  return {
    // Estados principais
    questoes,
    areas,
    loading,
    error,
    isReady,
    
    // Estatísticas
    estatisticas,
    
    // Ações
    gerarSimulado,
    salvarResultado,
    carregarEstatisticas,
    buscarQuestoesPorArea,
    recarregar: () => carregarQuestoes(true),
    
    // Debug expandido
    debug
  }
}