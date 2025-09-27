// src/lib/questoesServices.ts - VERSÃO CORRIGIDA
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

// CONFIGURAÇÃO DO LIMITE GRATUITO
const LIMITE_QUESTOES_GRATUITAS = 3;

export class QuestoesService {
  private supabase = createClient();

  // Método auxiliar para verificar login
  private async isUsuarioLogado(): Promise<boolean> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      return !error && !!user;
    } catch (error) {
      return false;
    }
  }
async buscarCargos(): Promise<Array<{
  id: number;
  nome: string;
  descricao: string | null;
  nivel_escolaridade: string | null;
  banca: string | null;
}>> {
  try {
    const { data: cargos, error } = await this.supabase
      .from('cargos')
      .select('id, nome, descricao, nivel_escolaridade, banca')
      .eq('ativo', true)
      .order('nome');

    if (error) {
      console.error('Erro ao buscar cargos:', error);
      throw new Error(error.message);
    }

    return cargos || [];
  } catch (error) {
    console.error('Erro ao buscar cargos:', error);
    throw error;
  }
}
  async buscarQuestoesPorCargo(cargoId: number): Promise<{
    questoes: QuestaoCompleta[];
    areas: AreaEstatistica[];
    total: number;
  }> {
    if (!cargoId) throw new Error('cargoId é obrigatório');
    
    try {
      console.log('Iniciando busca por cargoId:', cargoId);
      
      // 1. Buscar TODAS as questões
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

      // 2. Buscar áreas - CORRIGIDO (evita problema com .in())
      const areaIds = [...new Set(questoes.map(q => q.area_id).filter(id => id !== null))];
      console.log('Area IDs a buscar:', areaIds);
      
      const { data: areas, error: areasError } = await this.supabase
        .from('areas_conhecimento')
        .select('*');

      // Filtrar apenas as áreas que têm questões
      const areasComQuestoes = areas?.filter(area => areaIds.includes(area.id)) || [];

      // ADICIONAR verificação de erro:
      if (areasError) {
        console.error('Erro ao buscar áreas:', areasError);
        throw new Error(`Erro ao buscar áreas: ${areasError.message}`);
      }

      console.log('Todas as áreas do banco:', areas);
      console.log('Áreas filtradas com questões:', areasComQuestoes);

      const { data: cargoAreas, error: cargoAreasError } = await this.supabase
        .from('cargo_areas')
        .select('*')
        .eq('cargo_id', cargoId);

      if (cargoAreasError) {
        console.warn('Erro ao buscar cargo_areas:', cargoAreasError);
      }

      // 3. Criar mapas para relacionamento - CORRIGIDO
      const areaMap = (areas && areas.length > 0) ? areas.reduce((acc, area) => {
        acc[area.id] = area.nome;
        return acc;
      }, {} as { [key: number]: string }) : {};

      console.log('Area map criado:', areaMap);

      const cargoAreaMap = cargoAreas?.reduce((acc, ca) => {
        acc[ca.area_id!] = {
          numero_questoes: ca.numero_questoes,
          peso: ca.peso || 1.0
        };
        return acc;
      }, {} as { [key: number]: { numero_questoes: number; peso: number } }) || {};

      // 4. Montar questões completas - CORRIGIDO
      const questoesCompletas: QuestaoCompleta[] = questoes.map(q => ({
        ...q,
        area_nome: areaMap[q.area_id!] || 'Área Desconhecida',
        peso_area: cargoAreaMap[q.area_id!]?.peso || 1.0
      }));

      // 5. Montar estatísticas das áreas - CORRIGIDO
      // 5. Montar estatísticas das áreas - CORRIGIDO
let areasEstatisticas: AreaEstatistica[];

if (cargoAreas && cargoAreas.length > 0) {
  areasEstatisticas = cargoAreas.map(ca => {
    // CONTAR QUESTÕES REAIS EM VEZ DE USAR VALOR FIXO
    const questoesDaArea = questoes.filter(q => q.area_id === ca.area_id);
    
    return {
      id: ca.area_id!,
      nome: areaMap[ca.area_id!] || 'Área Desconhecida',
      total_questoes: questoesDaArea.length, // ← CORREÇÃO: usar contagem real
      peso: ca.peso || 1.0,
      questoes_respondidas: 0,
      acertos: 0,
      percentual: 0
    };
  });
} else {
  areasEstatisticas = areaIds.map(areaId => {
    const questoesDaArea = questoes.filter(q => q.area_id === areaId);
    return {
      id: areaId!,
      nome: areaMap[areaId!] || 'Área Desconhecida',
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
        total: questoes.length
      };

    } catch (error) {
      console.error('Erro geral ao buscar questões:', error);
      throw error;
    }
  }

  /**
   * Gera um simulado personalizado baseado na distribuição por área e dificuldade
   */
  async gerarSimuladoPersonalizado(
    cargoId: number, 
    dificuldades: number[] = [1, 2, 3] // Níveis de dificuldade a incluir
  ): Promise<QuestaoCompleta[]> {
    try {
      console.log('Iniciando geração do simulado para cargo:', cargoId, 'dificuldades:', dificuldades);
      
      // 1. Buscar TODAS as questões do cargo com filtro de dificuldade
      const { data: todasQuestoes, error: questoesError } = await this.supabase
        .from('questoes')
        .select('*')
        .eq('cargo_id', cargoId)
        .eq('ativo', true)
        .in('dificuldade', dificuldades);

      if (questoesError) {
        console.error('Erro ao buscar questões:', questoesError);
        throw new Error(questoesError.message);
      }

      if (!todasQuestoes || todasQuestoes.length === 0) {
        console.warn('Nenhuma questão encontrada para o cargo e dificuldades especificadas');
        return [];
      }

      console.log(`Total de questões disponíveis: ${todasQuestoes.length}`);

      // 2. Buscar configuração de cargo_areas
      const { data: cargoAreas, error: configError } = await this.supabase
        .from('cargo_areas')
        .select('area_id, numero_questoes')
        .eq('cargo_id', cargoId);

      if (configError) {
        console.error('Erro ao buscar configuração:', configError);
      }

      console.log(`Configurações encontradas: ${cargoAreas?.length || 0}`);

      // 3. Buscar dados complementares para questões completas - CORRIGIDO
      const areaIds = [...new Set(todasQuestoes.map(q => q.area_id).filter(id => id !== null))];
      
      const { data: areas, error: areasError } = await this.supabase
        .from('areas_conhecimento')
        .select('*');

      // Filtrar apenas as áreas necessárias
      const areasComQuestoes = areas?.filter(area => areaIds.includes(area.id)) || [];

      if (areasError) {
        console.error('Erro ao buscar áreas para simulado:', areasError);
      }

      const { data: configAreas } = await this.supabase
        .from('cargo_areas')
        .select('*')
        .eq('cargo_id', cargoId);

      // Criar mapas - CORRIGIDO
      const areaMap = (areasComQuestoes && areasComQuestoes.length > 0) ? areasComQuestoes.reduce((acc, area) => {
        acc[area.id] = area.nome;
        return acc;
      }, {} as { [key: number]: string }) : {};

      const pesoMap = configAreas?.reduce((acc, config) => {
        acc[config.area_id!] = config.peso || 1.0;
        return acc;
      }, {} as { [key: number]: number }) || {};

      // Montar questões completas - CORRIGIDO
      const questoesCompletas: QuestaoCompleta[] = todasQuestoes.map(q => ({
        ...q,
        area_nome: areaMap[q.area_id!] || 'Área Desconhecida',
        peso_area: pesoMap[q.area_id!] || 1.0
      }));

      let questoesSimulado: QuestaoCompleta[] = [];

      // 4. Se não há configuração, usar distribuição simples com mistura de dificuldades
      if (!cargoAreas || cargoAreas.length === 0) {
        console.log('Sem configuração específica, misturando questões por dificuldade');
        
        // Separar questões por dificuldade
        const questoesPorDificuldade = dificuldades.reduce((acc, nivel) => {
          acc[nivel] = questoesCompletas.filter(q => q.dificuldade === nivel);
          return acc;
        }, {} as { [key: number]: QuestaoCompleta[] });

        // Calcular quantas questões de cada dificuldade incluir
        const totalDesejado = Math.min(120, questoesCompletas.length);
        const questoesPorNivel = Math.floor(totalDesejado / dificuldades.length);
        const resto = totalDesejado % dificuldades.length;

        dificuldades.forEach((nivel, index) => {
          const quantidade = questoesPorNivel + (index < resto ? 1 : 0);
          const disponíveis = questoesPorDificuldade[nivel] || [];
          const embaralhadas = this.embaralharArray(disponíveis);
          questoesSimulado.push(...embaralhadas.slice(0, quantidade));
        });

        questoesSimulado = this.embaralharArray(questoesSimulado);
      } else {
        // 5. Usar configuração específica por área, misturando dificuldades dentro de cada área
        for (const config of cargoAreas) {
          const questoesDaArea = questoesCompletas.filter(q => q.area_id === config.area_id);
          console.log(`Área ${config.area_id}: ${questoesDaArea.length} questões disponíveis, ${config.numero_questoes} solicitadas`);
          
          if (questoesDaArea.length > 0) {
            // Separar por dificuldade dentro da área
            const questoesPorDificuldade = dificuldades.reduce((acc, nivel) => {
              acc[nivel] = questoesDaArea.filter(q => q.dificuldade === nivel);
              return acc;
            }, {} as { [key: number]: QuestaoCompleta[] });

            // Distribuir questões da área proporcionalmente entre dificuldades
            const questoesDaAreaSelecionadas: QuestaoCompleta[] = [];
            const questoesPorNivel = Math.floor(config.numero_questoes / dificuldades.length);
            const resto = config.numero_questoes % dificuldades.length;

            dificuldades.forEach((nivel, index) => {
              const quantidade = questoesPorNivel + (index < resto ? 1 : 0);
              const disponíveis = questoesPorDificuldade[nivel] || [];
              const embaralhadas = this.embaralharArray(disponíveis);
              questoesDaAreaSelecionadas.push(...embaralhadas.slice(0, quantidade));
            });

            questoesSimulado.push(...questoesDaAreaSelecionadas);
            console.log(`Selecionadas ${questoesDaAreaSelecionadas.length} questões da área ${config.area_id}`);
          }
        }

        questoesSimulado = this.embaralharArray(questoesSimulado);
      }

      const simuladoFinal = questoesSimulado;
      
      console.log(`Simulado final gerado: ${simuladoFinal.length} questões`);
      console.log('Distribuição por área:', 
        simuladoFinal.reduce((acc, q) => {
          acc[q.area_nome] = (acc[q.area_nome] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      );

      return simuladoFinal;

    } catch (error) {
      console.error('Erro ao gerar simulado:', error);
      throw error;
    }
  }

  // Método para verificar se usuário deve ver modal
  async deveExibirModalLogin(questoesRespondidas: number): Promise<{
    exibirModal: boolean;
    beneficios: string[];
    questoesTotais: number;
    questoesLiberadas: number;
  }> {
    const isLogado = await this.isUsuarioLogado();
    
    if (isLogado || questoesRespondidas < LIMITE_QUESTOES_GRATUITAS) {
      return {
        exibirModal: false,
        beneficios: [],
        questoesTotais: 0,
        questoesLiberadas: 0
      };
    }

    return {
      exibirModal: true,
      beneficios: [
        "Acesso completo a todas as questões do simulado",
        "Relatórios detalhados de desempenho por área",
        "Cronômetro e controle de tempo personalizado",
        "Acompanhamento de evolução e estatísticas",
        "Histórico completo de simulados realizados",
        "Questões sempre atualizadas conforme o edital",
        "Sincronização entre dispositivos",
        "Comentários detalhados com explicações das regras"
      ],
      questoesTotais: 0,
      questoesLiberadas: LIMITE_QUESTOES_GRATUITAS
    };
  }

  async testarConexao() {
    try {
      console.log('Testando conexão com Supabase...');
      const { data, error } = await this.supabase
        .from('questoes')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Erro de conexão:', error);
        throw error;
      }
      
      console.log('Conexão bem-sucedida');
      return true;
    } catch (error) {
      console.error('Erro geral na conexão:', error);
      throw error;
    }
  }

  /**
   * Busca questões de uma área específica
   */
  async buscarQuestoesPorArea(cargoId: number, areaId: number, limite?: number): Promise<QuestaoCompleta[]> {
    try {
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

      // Buscar nome da área - CORRIGIDO
      const { data: area, error: areaError } = await this.supabase
        .from('areas_conhecimento')
        .select('nome')
        .eq('id', areaId)
        .single();

      if (areaError) {
        console.warn('Erro ao buscar nome da área:', areaError);
      }

      // Buscar peso da área
      const { data: cargoArea, error: cargoAreaError } = await this.supabase
        .from('cargo_areas')
        .select('peso')
        .eq('cargo_id', cargoId)
        .eq('area_id', areaId)
        .single();

      if (cargoAreaError) {
        console.warn('Erro ao buscar configuração da área:', cargoAreaError);
      }

      // Montar questões completas - CORRIGIDO
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
   * Busca estatísticas de desempenho por área para um usuário
   */
  async buscarEstatisticasUsuario(userId: string, cargoId: number): Promise<AreaEstatistica[]> {
    try {
      // Buscar estatísticas
      const { data: stats, error: statsError } = await this.supabase
        .from('estatisticas_areas')
        .select('*')
        .eq('user_id', userId)
        .eq('cargo_id', cargoId);

      if (statsError) throw new Error(statsError.message);
      if (!stats || stats.length === 0) return [];

      // Buscar nomes das áreas - CORRIGIDO
      const areaIds = stats.map(s => s.area_id).filter(id => id !== null);
      const { data: areas, error: areasError } = await this.supabase
        .from('areas_conhecimento')
        .select('*')
        .in('id', areaIds);

      if (areasError) {
        console.warn('Erro ao buscar áreas:', areasError);
      }

      // Buscar pesos das áreas
      const { data: cargoAreas, error: cargoAreasError } = await this.supabase
        .from('cargo_areas')
        .select('*')
        .eq('cargo_id', cargoId)
        .in('area_id', areaIds);

      if (cargoAreasError) {
        console.warn('Erro ao buscar configuração das áreas:', cargoAreasError);
      }

      // Criar mapas - CORRIGIDO
      const areaMap = (areas && areas.length > 0) ? areas.reduce((acc, area) => {
        acc[area.id] = area.nome;
        return acc;
      }, {} as { [key: number]: string }) : {};

      const pesoMap = cargoAreas?.reduce((acc, config) => {
        acc[config.area_id!] = config.peso || 1.0;
        return acc;
      }, {} as { [key: number]: number }) || {};

      // Montar estatísticas - CORRIGIDO
      return stats.map(s => ({
        id: s.area_id!,
        nome: areaMap[s.area_id!] || 'Área Desconhecida',
        total_questoes: s.total_questoes || 0,
        peso: pesoMap[s.area_id!] || 1.0,
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
        tempo_resposta: Math.floor(tempoGasto / questoes.length)
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
      if (!acc[q.area_id!]) {
        acc[q.area_id!] = [];
      }
      acc[q.area_id!].push(q);
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
        const novoTotal = (estatisticaExistente.total_questoes || 0) + total;
        const novosAcertos = (estatisticaExistente.acertos || 0) + acertos;
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

  private embaralharArray<T>(array: T[]): T[] {
    const embaralhado = [...array];
    for (let i = embaralhado.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [embaralhado[i], embaralhado[j]] = [embaralhado[j], embaralhado[i]];
    }
    return embaralhado;
  }
}