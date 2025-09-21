import { createClient } from '@/lib/supabase';
import { Database } from '@/lib/types';

type Questao = Database['public']['Tables']['questoes']['Row'];
type Area = Database['public']['Tables']['areas_conhecimento']['Row']; 
type CargoArea = Database['public']['Tables']['cargo_areas']['Row'];

export interface QuestaoCompleta extends Questao {
  area_nome: string;
  peso_area: number;
}

export interface AreaEstatistica {
  id: number;
  nome: string;
  total_questoes: number;
  peso: number;
  questoes_respondidas: number;
  acertos: number;
  percentual: number;
}

export class QuestoesService {
  private supabase = createClient();

  async buscarQuestoesPorCargo(cargoId: number): Promise<{
    questoes: QuestaoCompleta[];
    areas: AreaEstatistica[];
    total: number;
  }> {
    if (!cargoId) throw new Error('cargoId é obrigatório');
    
    try {
      console.log('Iniciando busca por cargoId:', cargoId);
      
      // 1. Buscar questões básicas
      const { data: questoes, error: questoesError } = await this.supabase
        .from('questoes')
        .select('*')
        .eq('cargo_id', cargoId)
        .eq('ativo', true)
        .order('area_id')
        .order('id');

      if (questoesError) {
        console.error('Erro na query de questões:', questoesError);
        throw new Error(questoesError.message);
      }

      if (!questoes || questoes.length === 0) {
        console.log('Nenhuma questão encontrada para o cargo:', cargoId);
        return { questoes: [], areas: [], total: 0 };
      }

      console.log(`Questões encontradas: ${questoes.length}`);

      // 2. Buscar TODAS as áreas disponíveis primeiro
      const { data: todasAreas, error: todasAreasError } = await this.supabase
        .from('areas_conhecimento')
        .select('*')
        .order('id');

      if (todasAreasError) {
        console.error('Erro ao buscar todas as áreas:', todasAreasError);
      }

      console.log(`Total de áreas no banco: ${todasAreas?.length || 0}`);

      // 3. Buscar apenas áreas usadas pelas questões
      const areaIds = [...new Set(questoes.map(q => q.area_id).filter(id => id !== null))];
      console.log('Area IDs usados pelas questões:', areaIds);

      const { data: areas, error: areasError } = await this.supabase
        .from('areas_conhecimento')
        .select('*')
        .in('id', areaIds);

      if (areasError) {
        console.error('Erro na query de areas_conhecimento:', areasError);
        // Não quebrar aqui, continuar sem áreas
      }

      console.log(`Áreas encontradas para as questões: ${areas?.length || 0}`);

      // 4. Buscar configurações de cargo_areas
      const { data: cargoAreas, error: cargoAreasError } = await this.supabase
        .from('cargo_areas')
        .select('*')
        .eq('cargo_id', cargoId);

      if (cargoAreasError) {
        console.error('Erro na query de cargo_areas:', cargoAreasError);
        // Não quebrar aqui, continuar sem configuração
      }

      console.log(`Configurações cargo_areas encontradas: ${cargoAreas?.length || 0}`);

      // 5. Criar mapas para relacionamento (com fallbacks seguros)
      const areaMap = areas?.reduce((acc, area) => {
        acc[area.id] = area.nome;
        return acc;
      }, {} as { [key: number]: string }) || {};

      const cargoAreaMap = cargoAreas?.reduce((acc, ca) => {
        acc[ca.area_id] = {
          numero_questoes: ca.numero_questoes,
          peso: ca.peso || 1.0
        };
        return acc;
      }, {} as { [key: number]: { numero_questoes: number; peso: number } }) || {};

      // 6. Montar questões completas
      const questoesCompletas: QuestaoCompleta[] = questoes.map(q => ({
        ...q,
        area_nome: areaMap[q.area_id] || `Área ${q.area_id}` || 'Área Desconhecida',
        peso_area: cargoAreaMap[q.area_id]?.peso || 1.0
      }));

      // 7. Montar estatísticas das áreas (usando areas reais OU criando básicas)
      let areasEstatisticas: AreaEstatistica[];

      if (cargoAreas && cargoAreas.length > 0) {
        // Usar configuração completa
        areasEstatisticas = cargoAreas.map(ca => ({
          id: ca.area_id,
          nome: areaMap[ca.area_id] || `Área ${ca.area_id}`,
          total_questoes: ca.numero_questoes,
          peso: ca.peso || 1.0,
          questoes_respondidas: 0,
          acertos: 0,
          percentual: 0
        }));
      } else {
        // Criar áreas básicas baseadas nas questões existentes
        areasEstatisticas = areaIds.map(areaId => {
          const questoesDaArea = questoes.filter(q => q.area_id === areaId);
          return {
            id: areaId,
            nome: areaMap[areaId] || `Área ${areaId}`,
            total_questoes: questoesDaArea.length,
            peso: 1.0,
            questoes_respondidas: 0,
            acertos: 0,
            percentual: 0
          };
        });
      }

      console.log(`Busca concluída: ${questoesCompletas.length} questões, ${areasEstatisticas.length} áreas`);
      
      return {
        questoes: questoesCompletas,
        areas: areasEstatisticas,
        total: questoesCompletas.length
      };

    } catch (error) {
      console.error('Erro geral ao buscar questões:', error);
      throw error;
    }
  }

  /**
   * Busca questões de uma área específica
   */
  async buscarQuestoesPorArea(cargoId: number, areaId: number, limite?: number): Promise<QuestaoCompleta[]> {
    try {
      // 1. Buscar questões
      let questoesQuery = this.supabase
        .from('questoes')
        .select('*')
        .eq('cargo_id', cargoId)
        .eq('area_id', areaId)
        .eq('ativo', true)
        .order('id');

      if (limite) {
        questoesQuery = questoesQuery.limit(limite);
      }

      const { data: questoes, error: questoesError } = await questoesQuery;
      if (questoesError) throw new Error(questoesError.message);

      if (!questoes || questoes.length === 0) {
        return [];
      }

      // 2. Buscar nome da área
      const { data: area, error: areaError } = await this.supabase
        .from('areas_conhecimento')
        .select('nome')
        .eq('id', areaId)
        .single();

      if (areaError) {
        console.warn('Erro ao buscar nome da área:', areaError);
      }

      // 3. Buscar peso da área
      const { data: cargoArea, error: cargoAreaError } = await this.supabase
        .from('cargo_areas')
        .select('peso')
        .eq('cargo_id', cargoId)
        .eq('area_id', areaId)
        .single();

      if (cargoAreaError) {
        console.warn('Erro ao buscar configuração da área:', cargoAreaError);
      }

      // 4. Montar questões completas
      const questoesCompletas: QuestaoCompleta[] = questoes.map(q => ({
        ...q,
        area_nome: area?.nome || 'Área Desconhecida',
        peso_area: cargoArea?.peso || 1.0
      }));

      return questoesCompletas;

    } catch (error) {
      console.error('Erro ao buscar questões por área:', error);
      throw error;
    }
  }

  /**
   * Gera um simulado personalizado baseado na distribuição por área
   */
 /**
   * Gera um simulado personalizado baseado na distribuição por área
   */
  async gerarSimuladoPersonalizado(cargoId: number): Promise<QuestaoCompleta[]> {
    try {
      console.log('🎯 Iniciando geração do simulado para cargo:', cargoId);
      
      // 1. Buscar TODAS as questões do cargo primeiro
      const { data: todasQuestoes, error: questoesError } = await this.supabase
        .from('questoes')
        .select('*')
        .eq('cargo_id', cargoId)
        .eq('ativo', true);

      if (questoesError) {
        console.error('Erro ao buscar questões:', questoesError);
        throw new Error(questoesError.message);
      }

      if (!todasQuestoes || todasQuestoes.length === 0) {
        console.warn('Nenhuma questão encontrada para o cargo');
        return [];
      }

      console.log(`📚 Total de questões disponíveis: ${todasQuestoes.length}`);

      // 2. Buscar configuração de cargo_areas
      const { data: cargoAreas, error: configError } = await this.supabase
        .from('cargo_areas')
        .select('area_id, numero_questoes')
        .eq('cargo_id', cargoId);

      if (configError) {
        console.error('Erro ao buscar configuração:', configError);
      }

      console.log(`⚙️ Configurações encontradas: ${cargoAreas?.length || 0}`);

      // 3. Se não há configuração, usar distribuição simples
      if (!cargoAreas || cargoAreas.length === 0) {
        console.log('📋 Sem configuração específica, usando todas as questões embaralhadas');
        
        // Buscar nomes das áreas
        const areaIds = [...new Set(todasQuestoes.map(q => q.area_id))];
        const { data: areas } = await this.supabase
          .from('areas_conhecimento')
          .select('*')
          .in('id', areaIds);

        const areaMap = areas?.reduce((acc, area) => {
          acc[area.id] = area.nome;
          return acc;
        }, {} as { [key: number]: string }) || {};

        const questoesCompletas: QuestaoCompleta[] = todasQuestoes.map(q => ({
          ...q,
          area_nome: areaMap[q.area_id] || `Área ${q.area_id}`,
          peso_area: 1.0
        }));

        // Embaralhar e retornar até 120 questões
        const embaralhadas = this.embaralharArray(questoesCompletas);
        const simuladoFinal = embaralhadas.slice(0, 120);
        
        console.log(`✅ Simulado gerado sem configuração: ${simuladoFinal.length} questões`);
        return simuladoFinal;
      }

      // 4. Usar configuração específica por área
      const { data: areas } = await this.supabase
        .from('areas_conhecimento')
        .select('*');

      const { data: configAreas } = await this.supabase
        .from('cargo_areas')
        .select('*')
        .eq('cargo_id', cargoId);

      // Criar mapas
      const areaMap = areas?.reduce((acc, area) => {
        acc[area.id] = area.nome;
        return acc;
      }, {} as { [key: number]: string }) || {};

      const pesoMap = configAreas?.reduce((acc, config) => {
        acc[config.area_id] = config.peso || 1.0;
        return acc;
      }, {} as { [key: number]: number }) || {};

      // Montar questões completas
      const questoesCompletas: QuestaoCompleta[] = todasQuestoes.map(q => ({
        ...q,
        area_nome: areaMap[q.area_id] || `Área ${q.area_id}`,
        peso_area: pesoMap[q.area_id] || 1.0
      }));

      // Selecionar questões por área conforme configuração
      const questoesSimulado: QuestaoCompleta[] = [];
      
      for (const config of cargoAreas) {
        const questoesDaArea = questoesCompletas.filter(q => q.area_id === config.area_id);
        console.log(`📊 Área ${config.area_id}: ${questoesDaArea.length} questões disponíveis, ${config.numero_questoes} solicitadas`);
        
        if (questoesDaArea.length > 0) {
          const questoesEmbaralhadas = this.embaralharArray(questoesDaArea);
          const questoesSelecionadas = questoesEmbaralhadas.slice(0, config.numero_questoes);
          questoesSimulado.push(...questoesSelecionadas);
          
          console.log(`✅ Selecionadas ${questoesSelecionadas.length} questões da área ${config.area_id}`);
        } else {
          console.warn(`⚠️ Nenhuma questão encontrada para área ${config.area_id}`);
        }
      }

      const simuladoFinal = this.embaralharArray(questoesSimulado);
      
      console.log(`🎉 Simulado final gerado: ${simuladoFinal.length} questões`);
      console.log('📋 Distribuição por área:', 
        simuladoFinal.reduce((acc, q) => {
          acc[q.area_nome] = (acc[q.area_nome] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      );

      return simuladoFinal;

    } catch (error) {
      console.error('❌ Erro ao gerar simulado:', error);
      throw error;
    }
  }

  /**
   * Testa a conexão com o Supabase
   */
  async testarConexao() {
    try {
      console.log('Testando conexão com Supabase...');
      const { data, error } = await this.supabase
        .from('questoes')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Erro de conexão:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('Conexão bem-sucedida, dados retornados:', data);
      return true;
    } catch (error) {
      console.error('Erro geral na conexão:', error);
      throw error;
    }
  }

  /**
   * Busca estatísticas de desempenho por área para um usuário
   */
  async buscarEstatisticasUsuario(userId: string, cargoId: number): Promise<AreaEstatistica[]> {
    try {
      // 1. Buscar estatísticas
      const { data: stats, error: statsError } = await this.supabase
        .from('estatisticas_areas')
        .select('*')
        .eq('user_id', userId)
        .eq('cargo_id', cargoId);

      if (statsError) throw new Error(statsError.message);
      if (!stats || stats.length === 0) return [];

      // 2. Buscar nomes das áreas
      const areaIds = stats.map(s => s.area_id);
      const { data: areas, error: areasError } = await this.supabase
        .from('areas_conhecimento')
        .select('*')
        .in('id', areaIds);

      if (areasError) {
        console.warn('Erro ao buscar áreas:', areasError);
      }

      // 3. Buscar pesos das áreas
      const { data: cargoAreas, error: cargoAreasError } = await this.supabase
        .from('cargo_areas')
        .select('*')
        .eq('cargo_id', cargoId)
        .in('area_id', areaIds);

      if (cargoAreasError) {
        console.warn('Erro ao buscar configuração das áreas:', cargoAreasError);
      }

      // 4. Criar mapas
      const areaMap = areas?.reduce((acc, area) => {
        acc[area.id] = area.nome;
        return acc;
      }, {} as { [key: number]: string }) || {};

      const pesoMap = cargoAreas?.reduce((acc, config) => {
        acc[config.area_id] = config.peso || 1.0;
        return acc;
      }, {} as { [key: number]: number }) || {};

      // 5. Montar estatísticas
      return stats.map(s => ({
        id: s.area_id,
        nome: areaMap[s.area_id] || 'Área Desconhecida',
        total_questoes: s.total_questoes || 0,
        peso: pesoMap[s.area_id] || 1.0,
        questoes_respondidas: s.total_questoes || 0,
        acertos: s.acertos || 0,
        percentual: s.percentual || 0
      }));

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }

  /**
   * Salva resultado de simulado
   */
  async salvarResultadoSimulado(
    userId: string,
    cargoId: number,
    questoes: QuestaoCompleta[],
    respostas: { [key: number]: string },
    tempoGasto: number
  ) {
    try {
      let pontuacaoTotal = 0;
      let pesoTotal = 0;
      let acertos = 0;

      questoes.forEach(q => {
        pesoTotal += q.peso_area;
        if (respostas[q.id] === q.resposta_correta) {
          acertos++;
          pontuacaoTotal += q.peso_area;
        }
      });

      const percentualAcertos = (acertos / questoes.length) * 100;

      const { data: simulado, error: simuladoError } = await this.supabase
        .from('simulados')
        .insert({
          user_id: userId,
          cargo_id: cargoId,
          tipo: 'personalizado',
          status: 'concluido',
          data_conclusao: new Date().toISOString(),
          tempo_gasto: tempoGasto,
          pontuacao_total: pontuacaoTotal,
          percentual_acertos: percentualAcertos
        })
        .select('id')
        .single();

      if (simuladoError) throw new Error(simuladoError.message);

      const questoesSimulado = questoes.map((q, index) => ({
        simulado_id: simulado.id,
        questao_id: q.id,
        ordem: index + 1,
        resposta_usuario: respostas[q.id] || null,
        correta: respostas[q.id] === q.resposta_correta,
        tempo_resposta: Math.floor(tempoGasto / questoes.length) // Estimativa
      }));

      const { error: questoesError } = await this.supabase
        .from('simulado_questoes')
        .insert(questoesSimulado);

      if (questoesError) throw new Error(questoesError.message);

      await this.atualizarEstatisticasAreas(userId, cargoId, questoes, respostas);

      return simulado.id;
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      throw error;
    }
  }

  /**
   * Atualiza estatísticas por área
   */
  private async atualizarEstatisticasAreas(
    userId: string,
    cargoId: number,
    questoes: QuestaoCompleta[],
    respostas: { [key: number]: string }
  ) {
    const questoesPorArea = questoes.reduce((acc, q) => {
      if (!acc[q.area_id]) {
        acc[q.area_id] = [];
      }
      acc[q.area_id].push(q);
      return acc;
    }, {} as { [key: number]: QuestaoCompleta[] });

    for (const [areaId, questoesDaArea] of Object.entries(questoesPorArea)) {
      const areaIdNum = parseInt(areaId);
      const acertos = questoesDaArea.filter(q => respostas[q.id] === q.resposta_correta).length;
      const total = questoesDaArea.length;

      const { data: estatisticaExistente } = await this.supabase
        .from('estatisticas_areas')
        .select('*')
        .eq('user_id', userId)
        .eq('cargo_id', cargoId)
        .eq('area_id', areaIdNum)
        .single();

      if (estatisticaExistente) {
        const novoTotal = estatisticaExistente.total_questoes + total;
        const novosAcertos = estatisticaExistente.acertos + acertos;
        const novoPercentual = (novosAcertos / novoTotal) * 100;

        await this.supabase
          .from('estatisticas_areas')
          .update({
            total_questoes: novoTotal,
            acertos: novosAcertos,
            percentual: novoPercentual,
            ultima_atualizacao: new Date().toISOString()
          })
          .eq('id', estatisticaExistente.id);
      } else {
        const percentual = (acertos / total) * 100;

        await this.supabase
          .from('estatisticas_areas')
          .insert({
            user_id: userId,
            cargo_id: cargoId,
            area_id: areaIdNum,
            total_questoes: total,
            acertos,
            percentual
          });
      }
    }
  }

  /**
   * Função auxiliar para embaralhar array
   */
  private embaralharArray<T>(array: T[]): T[] {
    const embaralhado = [...array];
    for (let i = embaralhado.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [embaralhado[i], embaralhado[j]] = [embaralhado[j], embaralhado[i]];
    }
    return embaralhado;
  }
}