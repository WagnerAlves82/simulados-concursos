// src/lib/adminService.ts
import { createClient } from '@/lib/supabase';

export interface AdminStats {
  totalQuestoes: number;
  totalCargos: number;
  totalUsuarios: number;
  totalSimulados: number;
  questoesPorBanca: Record<string, number>;
  questoesPorArea: Record<string, number>;
  acessosRecentes: number;
}

export interface CargoDetalhado {
  id: number;
  nome: string;
  descricao: string;
  orgao: string;
  banca: string;
  nivel_escolaridade: string;
  ativo: boolean;
  created_at: string;
  questoes_count?: number;
}

export interface BancaDetalhada {
  id?: number;
  nome: string;
  questoes: number;
  ativa: boolean;
  cargos?: number;
}

export class AdminService {
  private supabase = createClient();

  async criarArea(novaArea: any) {
    return await this.supabase
      .from('areas_conhecimento')
      .insert([novaArea])
      .select();
  }

  async listarAreas() {
    return await this.supabase
      .from('areas_conhecimento')
      .select('*');
  }

  async deletarArea(id: number) {
    return await this.supabase
      .from('areas_conhecimento')
      .delete()
      .eq('id', id);
  }


 
  async buscarEstatisticas(): Promise<AdminStats> {
    try {
      // 1. Total de questões
      const { count: totalQuestoes } = await this.supabase
        .from('questoes')
        .select('*', { count: 'exact', head: true });

      // 2. Total de cargos
      const { count: totalCargos } = await this.supabase
        .from('cargos')
        .select('*', { count: 'exact', head: true });

      // 3. Total de usuários
      const { count: totalUsuarios } = await this.supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // 4. Total de simulados
      const { count: totalSimulados } = await this.supabase
        .from('simulados')
        .select('*', { count: 'exact', head: true });

      // 5. Questões por banca - usando queries separadas
      const { data: questoes } = await this.supabase
        .from('questoes')
        .select('cargo_id')
        .eq('ativo', true);

      const cargoIds = [...new Set(questoes?.map(q => q.cargo_id))];
      
      const { data: cargos } = await this.supabase
        .from('cargos')
        .select('id, banca')
        .in('id', cargoIds);

      const questoesPorBanca: Record<string, number> = {};
      questoes?.forEach(q => {
        const cargo = cargos?.find(c => c.id === q.cargo_id);
        const banca = cargo?.banca || 'Desconhecida';
        questoesPorBanca[banca] = (questoesPorBanca[banca] || 0) + 1;
      });

  const { data: questoesComArea } = await this.supabase
  .from('questoes')
  .select('area_id')
  .eq('ativo', true)
  .not('area_id', 'is', null);

const areaIds = [...new Set(questoesComArea?.map(q => q.area_id).filter(Boolean))] as number[];

const { data: areas } = await this.supabase
  .from('areas_conhecimento')
  .select('id, nome')
  .in('id', areaIds);

const questoesPorArea: Record<string, number> = {};
questoesComArea?.forEach(q => {
  if (q.area_id) {
    const area = areas?.find(a => a.id === q.area_id);
    const areaName = area?.nome || 'Área Desconhecida';
    questoesPorArea[areaName] = (questoesPorArea[areaName] || 0) + 1;
  }
});

      
      // 7. Acessos recentes (últimos 7 dias)
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
      
      const { count: acessosRecentes } = await this.supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('ultimo_acesso', seteDiasAtras.toISOString());

      return {
        totalQuestoes: totalQuestoes || 0,
        totalCargos: totalCargos || 0,
        totalUsuarios: totalUsuarios || 0,
        totalSimulados: totalSimulados || 0,
        questoesPorBanca,
        questoesPorArea,
        acessosRecentes: acessosRecentes || 0
      };

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw new Error('Erro ao carregar estatísticas do dashboard');
    }
  }

  /**
   * Buscar todos os cargos com detalhes
   */
  async buscarCargos(): Promise<CargoDetalhado[]> {
    try {
      const { data: cargos, error } = await this.supabase
        .from('cargos')
        .select('*')
        .order('nome');

      if (error) throw error;

      // Buscar contagem de questões para cada cargo separadamente
      const cargosComQuestoes = await Promise.all(
        (cargos || []).map(async (cargo) => {
          const { count } = await this.supabase
            .from('questoes')
            .select('*', { count: 'exact', head: true })
            .eq('cargo_id', cargo.id)
            .eq('ativo', true);

          return {
            ...cargo,
            questoes_count: count || 0
          };
        })
      );

      return cargosComQuestoes;

    } catch (error) {
      console.error('Erro ao buscar cargos:', error);
      throw new Error('Erro ao carregar cargos');
    }
  }

  /**
   * Buscar todas as áreas de conhecimento
   */
  async buscarAreas() {
    try {
      const { data, error } = await this.supabase
        .from('areas_conhecimento')
        .select('*')
        .order('nome');

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Erro ao buscar áreas:', error);
      throw new Error('Erro ao carregar áreas de conhecimento');
    }
  }

  /**
   * Buscar bancas com estatísticas
   */
  async buscarBancas(): Promise<BancaDetalhada[]> {
    try {
      // Buscar bancas únicas dos cargos
      const { data: cargosData } = await this.supabase
        .from('cargos')
        .select('banca')
        .order('banca');

      const bancasUnicas = [...new Set(cargosData?.map(c => c.banca))];
      
      const bancasDetalhadas: BancaDetalhada[] = [];

      for (const banca of bancasUnicas) {
        // Buscar IDs dos cargos desta banca
        const { data: cargosDaBanca } = await this.supabase
          .from('cargos')
          .select('id')
          .eq('banca', banca);

        const cargoIds = cargosDaBanca?.map(c => c.id) || [];

        // Contar questões da banca
        const { count: questoes } = await this.supabase
          .from('questoes')
          .select('*', { count: 'exact', head: true })
          .in('cargo_id', cargoIds)
          .eq('ativo', true);

        // Contar cargos da banca
        const { count: cargos } = await this.supabase
          .from('cargos')
          .select('*', { count: 'exact', head: true })
          .eq('banca', banca);

        bancasDetalhadas.push({
          nome: banca,
          questoes: questoes || 0,
          cargos: cargos || 0,
          ativa: true
        });
      }

      return bancasDetalhadas;

    } catch (error) {
      console.error('Erro ao buscar bancas:', error);
      throw new Error('Erro ao carregar bancas');
    }
  }

  /**
   * Criar nova questão
   */
  async criarQuestao(questaoData: {
    cargo_id: number;
    area_id: number;
    enunciado: string;
    alternativa_a: string;
    alternativa_b: string;
    alternativa_c: string;
    alternativa_d: string;
    alternativa_e?: string;
    resposta_correta: string;
    feedback: string;
    dificuldade?: number;
    fonte?: string;
  }) {
    try {
      const { data, error } = await this.supabase
        .from('questoes')
        .insert({
          ...questaoData,
          ativo: true,
          dificuldade: questaoData.dificuldade || 2
        })
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Erro ao criar questão:', error);
      throw new Error('Erro ao criar questão');
    }
  }

  /**
 * Buscar questões com filtros - versão simplificada
 */
async buscarQuestoes(filtros: {
  cargo_id?: number;
  area_id?: number;
  busca?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = this.supabase
      .from('questoes')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (filtros.cargo_id) {
      query = query.eq('cargo_id', filtros.cargo_id);
    }

    if (filtros.area_id) {
      query = query.eq('area_id', filtros.area_id);
    }

    if (filtros.busca) {
      query = query.ilike('enunciado', `%${filtros.busca}%`);
    }

    if (filtros.limit) {
      query = query.limit(filtros.limit);
    }

    if (filtros.offset) {
      query = query.range(filtros.offset, filtros.offset + (filtros.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Buscar nomes de cargos e áreas separadamente se necessário
    const questoesComDetalhes = await Promise.all(
      (data || []).map(async (questao) => {
        let cargoNome = null;
        let areaNome = null;

        if (questao.cargo_id) {
          const { data: cargo } = await this.supabase
            .from('cargos')
            .select('nome')
            .eq('id', questao.cargo_id)
            .single();
          cargoNome = cargo?.nome;
        }

        if (questao.area_id) {
          const { data: area } = await this.supabase
            .from('areas_conhecimento')
            .select('nome')
            .eq('id', questao.area_id)
            .single();
          areaNome = area?.nome;
        }

        return {
          ...questao,
          cargo_nome: cargoNome,
          area_nome: areaNome
        };
      })
    );

    return questoesComDetalhes;

  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    throw new Error('Erro ao buscar questões');
  }
}

  /**
   * Deletar questão
   */
  async deletarQuestao(id: number) {
    try {
      const { error } = await this.supabase
        .from('questoes')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;
      return true;

    } catch (error) {
      console.error('Erro ao deletar questão:', error);
      throw new Error('Erro ao deletar questão');
    }
  }

  /**
   * Criar novo cargo
   */
  async criarCargo(cargoData: {
    nome: string;
    descricao: string;
    orgao: string;
    banca: string;
    nivel_escolaridade: string;
  }) {
    try {
      const { data, error } = await this.supabase
        .from('cargos')
        .insert({
          ...cargoData,
          ativo: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Erro ao criar cargo:', error);
      throw new Error('Erro ao criar cargo');
    }
  }

 /**
 * Exportar questões em CSV
 */
async exportarQuestoes(cargo_id?: number) {
  try {
    // Buscar questões primeiro
    let query = this.supabase
      .from('questoes')
      .select('*')
      .eq('ativo', true);

    if (cargo_id) {
      query = query.eq('cargo_id', cargo_id);
    }

    const { data: questoes, error } = await query;

    if (error) throw error;

    // Buscar cargos e áreas separadamente
    const cargoIds = [...new Set(questoes?.map(q => q.cargo_id).filter(Boolean))];
    const areaIds = [...new Set(questoes?.map(q => q.area_id).filter(Boolean))];

    const [cargosData, areasData] = await Promise.all([
      this.supabase
        .from('cargos')
        .select('id, nome')
        .in('id', cargoIds),
      this.supabase
        .from('areas_conhecimento')
        .select('id, nome')
        .in('id', areaIds)
    ]);

    // Converter para CSV
    const csvData = questoes?.map(q => {
      const cargo = cargosData.data?.find(c => c.id === q.cargo_id);
      const area = areasData.data?.find(a => a.id === q.area_id);

      return {
        id: q.id,
        cargo: cargo?.nome || 'N/A',
        area: area?.nome || 'N/A',
        enunciado: q.enunciado,
        alternativa_a: q.alternativa_a,
        alternativa_b: q.alternativa_b,
        alternativa_c: q.alternativa_c,
        alternativa_d: q.alternativa_d,
        alternativa_e: q.alternativa_e || '',
        resposta_correta: q.resposta_correta,
        feedback: q.feedback,
        dificuldade: q.dificuldade,
        fonte: q.fonte || ''
      };
    });

    return csvData || [];

  } catch (error) {
    console.error('Erro ao exportar questões:', error);
    throw new Error('Erro ao exportar questões');
  }
}}
