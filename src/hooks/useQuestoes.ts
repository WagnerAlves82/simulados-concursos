// src/hooks/useQuestoes.ts - VERSÃO CORRIGIDA COMPLETA
import { useState, useEffect, useCallback, useMemo } from 'react'
import { QuestoesService, QuestaoCompleta, AreaEstatistica } from '@/lib/questoesServices'
import { useAuth } from '@/contexts/AuthProvider'

export function useQuestoes(cargoId: number = 4)
 {
  const { user } = useAuth()
  const [questoes, setQuestoes] = useState<QuestaoCompleta[]>([])
  const [areas, setAreas] = useState<AreaEstatistica[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastCargoId, setLastCargoId] = useState<number | null>(null)
  
  // Estados para controle do modal
  const [questoesRespondidas, setQuestoesRespondidas] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)
  
  const questoesService = useMemo(() => new QuestoesService(), [])

  const carregarQuestoes = useCallback(async (forceReload = false) => {
    // Não carregar se cargoId for inválido
    if (!cargoId || cargoId <= 0) {
      console.log('CargoId inválido, aguardando seleção...')
      setLoading(false)
      return
    }

    if (!forceReload && lastCargoId === cargoId && questoes.length > 0) {
      console.log('Questões já carregadas para este cargo, pulando...')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      console.log(`Carregando questões para cargo ${cargoId}...`)
      
      await questoesService.testarConexao()
      console.log('Conexão com Supabase OK')
      
      const resultado = await questoesService.buscarQuestoesPorCargo(cargoId)
      
      console.log('Debug - Raw resultado do service:', {
        questoes: resultado.questoes.slice(0, 3).map(q => ({
          id: q.id,
          area_id: q.area_id,
          area_nome: q.area_nome,
          enunciado: q.enunciado?.substring(0, 50) + '...'
        })),
        areas: resultado.areas.map(a => ({
          id: a.id,
          nome: a.nome,
          total_questoes: a.total_questoes
        }))
      })

      console.log(`Resultado da busca:`, {
        totalQuestoes: resultado.questoes.length,
        totalAreas: resultado.areas.length,
        areas: resultado.areas.map(a => ({ id: a.id, nome: a.nome, questoes: a.total_questoes }))
      })
      
      if (resultado.questoes.length === 0) {
        console.warn(`Nenhuma questão encontrada para o cargo ${cargoId}`)
        setError(`Nenhuma questão encontrada para o cargo selecionado`)
      } else {
        setQuestoes(resultado.questoes) // Retorna TODAS as questões
        setAreas(resultado.areas)
        setLastCargoId(cargoId)
        console.log(`${resultado.questoes.length} questões carregadas com sucesso`)
      }
      
    } catch (err) {
      console.error('Erro ao carregar questões:', err)
      
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

  useEffect(() => {
  if (cargoId) {
    // Limpar estado anterior quando cargo muda
    if (lastCargoId !== cargoId) {
      setQuestoes([])
      setAreas([])
      setError(null)
    }
    carregarQuestoes()
  }
}, [cargoId, carregarQuestoes])

  // Gerar simulado completo com níveis de dificuldade
  const gerarSimulado = useCallback(async (
    dificuldades: number[] = [1, 2, 3]
  ): Promise<QuestaoCompleta[]> => {
    try {
      console.log(`Gerando simulado para cargo ${cargoId} com dificuldades:`, dificuldades)
      
      const questoesSimulado = await questoesService.gerarSimuladoPersonalizado(cargoId, dificuldades)
      
      console.log(`Simulado gerado: ${questoesSimulado.length} questões`)
      
      return questoesSimulado
    } catch (err) {
      console.error('Erro ao gerar simulado:', err)
      throw new Error('Erro ao gerar simulado. Tente novamente.')
    }
  }, [cargoId, questoesService])

  // NOVO: Gerar simulado por área específica
  const gerarSimuladoPorArea = useCallback(async (
    areaId: number,
    dificuldades: number[] = [1, 2, 3],
    limite: number = 80
  ): Promise<QuestaoCompleta[]> => {
    try {
      console.log(`Gerando simulado da área ${areaId} com ${limite} questões`)
      
      // Buscar questões da área específica
      const questoesDaArea = await questoesService.buscarQuestoesPorArea(cargoId, areaId)
      
      // Filtrar por dificuldade
      const questoesFiltradas = questoesDaArea.filter(q => 
        dificuldades.includes(q.dificuldade || 2)
      )
      
      console.log(`Questões filtradas por dificuldade: ${questoesFiltradas.length}`)
      
      // Embaralhar as questões
      const questoesEmbaralhadas = questoesFiltradas
        .sort(() => Math.random() - 0.5)
      
      // Limitar quantidade
      const questoesLimitadas = questoesEmbaralhadas.slice(0, limite)
      
      console.log(`Simulado por área gerado: ${questoesLimitadas.length} questões`)
      
      return questoesLimitadas
    } catch (err) {
      console.error('Erro ao gerar simulado por área:', err)
      throw new Error('Erro ao gerar simulado da área. Tente novamente.')
    }
  }, [cargoId, questoesService])

  // Controle de questões respondidas e modal
  const registrarQuestaoRespondida = useCallback(async (): Promise<boolean> => {
    // Se usuário está logado, nunca mostrar modal
    if (user) {
      return false;
    }

    const novoContador = questoesRespondidas + 1;
    setQuestoesRespondidas(novoContador);

    // Verificar se deve mostrar modal (após 3 questões)
    if (novoContador >= 3) {
      const modalInfo = await questoesService.deveExibirModalLogin(novoContador);
      if (modalInfo.exibirModal) {
        setShowLoginModal(true);
        return true;
      }
    }

    return false;
  }, [user, questoesRespondidas, questoesService])

  // Fechar modal
  const fecharModal = useCallback(() => {
    setShowLoginModal(false)
  }, [])

  // Resetar contador após login
  const resetarContador = useCallback(() => {
    setQuestoesRespondidas(0)
    setShowLoginModal(false)
  }, [])

  // Executar reset quando usuário fizer login
  useEffect(() => {
    if (user) {
      resetarContador()
    }
  }, [user, resetarContador])

  // Obter informações do modal
  const getInfoModal = useCallback(async () => {
    return await questoesService.deveExibirModalLogin(questoesRespondidas)
  }, [questoesService, questoesRespondidas])

  const salvarResultado = useCallback(async (
    questoesSimulado: QuestaoCompleta[],
    respostas: { [key: number]: string },
    tempoGasto: number
  ) => {
    if (!user) {
      throw new Error('Usuário não logado')
    }

    try {
      console.log(`Salvando resultado do simulado...`, {
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
      
      console.log(`Resultado salvo com ID: ${simuladoId}`)
      return simuladoId
    } catch (err) {
      console.error('Erro ao salvar resultado:', err)
      throw new Error('Erro ao salvar resultado')
    }
  }, [user, cargoId, questoesService])

  const carregarEstatisticas = useCallback(async (): Promise<AreaEstatistica[]> => {
    if (!user) {
      console.log('Usuário não logado, retornando estatísticas vazias')
      return []
    }
    
    try {
      console.log(`Carregando estatísticas para usuário ${user.id}...`)
      
      const stats = await questoesService.buscarEstatisticasUsuario(user.id, cargoId)
      
      console.log(`Estatísticas carregadas`)
      return stats
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
      return []
    }
  }, [user, cargoId, questoesService])

  const buscarQuestoesPorArea = useCallback(async (areaId: number, limite?: number): Promise<QuestaoCompleta[]> => {
    try {
      console.log(`Buscando questões da área ${areaId}...`)
      
      const questoesDaArea = await questoesService.buscarQuestoesPorArea(cargoId, areaId, limite)
      
      console.log(`${questoesDaArea.length} questões encontradas para a área`)
      return questoesDaArea
    } catch (err) {
      console.error('Erro ao buscar questões por área:', err)
      throw new Error('Erro ao buscar questões da área')
    }
  }, [cargoId, questoesService])

  const estatisticas = useMemo(() => {
    if (questoes.length === 0) return null

    const totalPorArea = questoes.reduce((acc, q) => {
      acc[q.area_nome] = (acc[q.area_nome] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Estatísticas por dificuldade
    const totalPorDificuldade = questoes.reduce((acc, q) => {
      const nivel = `Nível ${q.dificuldade}`
      acc[nivel] = (acc[nivel] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalQuestoes: questoes.length,
      totalAreas: areas.length,
      questoesPorArea: totalPorArea,
      questoesPorDificuldade: totalPorDificuldade,
      areasDisponiveis: areas.map(a => ({
        id: a.id,
        nome: a.nome,
        questoes: a.total_questoes,
        peso: a.peso
      }))
    }
  }, [questoes, areas])

  const isReady = !loading && questoes.length > 0 && areas.length > 0

  return {
    // Estados principais
    questoes,
    areas,
    loading,
    error,
    isReady,
    
    // Estados do modal
    questoesRespondidas,
    showLoginModal,
    
    // Estatísticas
    estatisticas,
    
    // Ações
    gerarSimulado,
    gerarSimuladoPorArea, // NOVO MÉTODO
    salvarResultado,
    carregarEstatisticas,
    buscarQuestoesPorArea,
    recarregar: () => carregarQuestoes(true),
    
    // Ações do modal
    registrarQuestaoRespondida,
    fecharModal,
    resetarContador,
    getInfoModal,
    
    // Debug
    debug: {
      cargoId,
      totalQuestoes: questoes.length,
      totalAreas: areas.length,
      lastCargoId,
      loading,
      error,
      isReady,
      questoesRespondidas,
      showLoginModal,
    }
  }
}