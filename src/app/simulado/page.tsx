// src/app/simulado/page.tsx - VERSÃO ATUALIZADA
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoginModal } from '@/components/ui/LoginModal'; // NOVO: Import do modal
import { useAuth } from '@/contexts/AuthProvider';
import { useQuestoes } from '@/hooks/useQuestoes';
import { QuestaoCompleta } from '@/lib/questoesServices';
import { createClient } from '@/lib/supabase';



import { 
  BookOpen, 
  Clock, 
  ArrowLeft,
  ArrowRight,
  Save,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LogOut,
  User,
  Loader2,
  RefreshCw
} from 'lucide-react';


const SimuladoPage = () => {
  const { user, profile, signOut } = useAuth();
  const [questoesSimulado, setQuestoesSimulado] = useState<QuestaoCompleta[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [timeLeft, setTimeLeft] = useState(4 * 60 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState<{[key: number]: boolean}>({});
  const [isStarted, setIsStarted] = useState(false);
  const [salvandoResultado, setSalvandoResultado] = useState(false);
  const [dificuldadesSelecionadas, setDificuldadesSelecionadas] = useState<number[]>([1, 2, 3]);
  const [gerandoSimulado, setGerandoSimulado] = useState(false);
  // ADICIONAR após os estados existentes:
  const [acertosEmTempoReal, setAcertosEmTempoReal] = useState(0);
  const [errosEmTempoReal, setErrosEmTempoReal] = useState(0);
  
  // NOVOS: Estados para modo de estudo
  const [tipoSimulado, setTipoSimulado] = useState<'completo' | 'area'>('completo');
  const [areaSelecionada, setAreaSelecionada] = useState<number | null>(null);
  const [quantidadeQuestoes, setQuantidadeQuestoes] = useState(40);
  
 // Estados para controle do modal
const [beneficiosModal, setBeneficiosModal] = useState<string[]>([]);
// NOVOS: Estados para seleção de cargo
const [cargos, setCargos] = useState<any[]>([]);
const [cargoSelecionado, setCargoSelecionado] = useState<number>(4);
const [loadingCargos, setLoadingCargos] = useState(false);
const supabase = createClient();

 const { 
    questoes: questoesDisponiveis, 
    areas, 
    loading: loadingQuestoes, 
    error: errorQuestoes,
    gerarSimulado,
    gerarSimuladoPorArea,
    salvarResultado,
    recarregar,
    registrarQuestaoRespondida,
    showLoginModal,
    fecharModal,
    getInfoModal,
    debug
  } = useQuestoes(cargoSelecionado);




  // Carregar cargos disponíveis
const carregarCargos = useCallback(async () => {
  try {
    setLoadingCargos(true);
    const { data, error } = await supabase
      .from('cargos')
      .select('id, nome, descricao, nivel_escolaridade, banca')
      .eq('ativo', true)
      .order('nome');
      
    if (data) {
      setCargos(data);
      console.log('Cargos carregados:', data);
    }
    if (error) {
      console.error('Erro ao carregar cargos:', error);
    }
  } catch (err) {
    console.error('Erro ao buscar cargos:', err);
  } finally {
    setLoadingCargos(false);
  }
}, []);

// Carregar cargos no início
useEffect(() => {
  carregarCargos();
}, [carregarCargos]);

// Ajustar quantidade quando área muda
useEffect(() => {
  if (areaSelecionada && areas.length > 0) {
    const areaSel = areas.find(a => a.id === areaSelecionada);
    if (areaSel) {
      setQuantidadeQuestoes(Math.min(40, areaSel.total_questoes));
    }
  }
}, [areaSelecionada, areas]);

  // No SimuladoPage, no useEffect de debug:
useEffect(() => {
  console.log('🔍 Debug SimuladoPage:', {
    cargoSelecionado,
    questoesDisponiveis: questoesDisponiveis.length,
    areas: areas.length,
    loading: loadingQuestoes,
    error: errorQuestoes,
    debug
  });
}, [cargoSelecionado, questoesDisponiveis, areas, loadingQuestoes, errorQuestoes, debug]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, showResults]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    try {
      console.log('Iniciando geração do simulado:', { 
        tipo: tipoSimulado, 
        area: areaSelecionada, 
        dificuldades: dificuldadesSelecionadas 
      });
      setGerandoSimulado(true);
      
      let questoes: QuestaoCompleta[];
      
      if (tipoSimulado === 'area' && areaSelecionada) {
        // Gerar simulado por área específica
        questoes = await gerarSimuladoPorArea(areaSelecionada, dificuldadesSelecionadas, quantidadeQuestoes);
      } else {
        // Gerar simulado completo
        questoes = await gerarSimulado(dificuldadesSelecionadas);
      }
      
      console.log('Simulado gerado:', questoes.length, 'questões');
      
      setQuestoesSimulado(questoes);
      setIsStarted(true);
      setIsRunning(true);
      
    } catch (error) {
      console.error('Erro ao gerar simulado:', error);
      alert(`Erro ao gerar simulado: ${error.message}`);
    } finally {
      setGerandoSimulado(false);
      setAcertosEmTempoReal(0);
      setErrosEmTempoReal(0);
    }
  };

  // NOVO: Função para lidar com respostas e verificar modal
  const handleAnswer = async (questionId: number, answer: string) => {
  const jaRespondida = answers[questionId];
  const questaoAtual = questoesSimulado.find(q => q.id === questionId);
  
  setAnswers({
    ...answers,
    [questionId]: answer
  });

  // NOVO: Atualizar contadores em tempo real (SEM mostrar se está certo)
  if (!jaRespondida && questaoAtual) {
    if (answer === questaoAtual.resposta_correta) {
      setAcertosEmTempoReal(prev => prev + 1);
    } else {
      setErrosEmTempoReal(prev => prev + 1);
    }
  }

  // Se é uma nova resposta E usuário não está logado, registrar no hook
  if (!jaRespondida && !user) {
    const deveExibirModal = await registrarQuestaoRespondida();
    
    if (deveExibirModal) {
      setIsRunning(false); // Pausar o timer
      const modalInfo = await getInfoModal();
      setBeneficiosModal(modalInfo.beneficios);
    }
  }
};

  // NOVO: Callback para quando usuário fizer login via modal
  const handleLoginSuccess = () => {
    setIsRunning(true); // Retomar o timer
    fecharModal();
  };

  const handleFinish = async () => {
    setIsRunning(false);
    setShowResults(true);

    if (user) {
      try {
        setSalvandoResultado(true);
        const tempoGasto = (4 * 60 * 60) - timeLeft;
        await salvarResultado(questoesSimulado, answers, tempoGasto);
      } catch (error) {
        console.error('Erro ao salvar resultado:', error);
      } finally {
        setSalvandoResultado(false);
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const calculateResults = () => {
    let correct = 0;
    let totalWeight = 0;
    let earnedWeight = 0;

    questoesSimulado.forEach(q => {
      totalWeight += q.peso_area;
      if (answers[q.id] === q.resposta_correta) {
        correct++;
        earnedWeight += q.peso_area;
      }
    });

    const estatisticasPorArea = areas.map(area => {
      const questoesDaArea = questoesSimulado.filter(q => q.area_id === area.id);
      const acertosDaArea = questoesDaArea.filter(q => answers[q.id] === q.resposta_correta).length;
      
      return {
        ...area,
        questoes_respondidas: questoesDaArea.length,
        acertos: acertosDaArea,
        percentual: questoesDaArea.length > 0 ? (acertosDaArea / questoesDaArea.length) * 100 : 0
      };
    });

    return {
      correct,
      total: questoesSimulado.length,
      percentage: questoesSimulado.length > 0 ? (correct / questoesSimulado.length) * 100 : 0,
      weightedScore: totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0,
      porArea: estatisticasPorArea
    };
  };

  const toggleFeedback = (questionId: number) => {
    setShowFeedback({
      ...showFeedback,
      [questionId]: !showFeedback[questionId]
    });
  };

  const currentQ = questoesSimulado[currentQuestion];
  const results = showResults ? calculateResults() : null;

  // Loading de questões
  if (loadingQuestoes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Carregando questões...</h2>
          <p className="text-gray-500">Buscando questões do banco de dados</p>
        </div>
      </div>
    );
  }

  // Erro ao carregar questões
  if (errorQuestoes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar questões</h2>
            <p className="text-gray-600 mb-4">{errorQuestoes}</p>
            <Button onClick={recarregar} className="mr-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
            <Link href="/">
              <Button variant="outline">Voltar ao início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Componente de header com auth
const AuthHeader = () => (
  <header className="container mx-auto px-4 py-6">
    <nav className="space-y-4">
      {/* Primeira linha: Logo e ações de usuário */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">SimuladosPro</h1>
        </Link>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{profile?.nome || user.email}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline">
                Fazer Login
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Segunda linha: Navegação */}
      <div className="flex justify-left">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </nav>
  </header>
);

  // Tela inicial
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AuthHeader />

        {/* NOVO: Modal de Login */}
        <LoginModal 
          isOpen={showLoginModal}
          onClose={fecharModal}
          onSuccess={handleLoginSuccess}
        />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* NOVO: Seletor de Cargo */}
<Card className="mb-8">
  <CardHeader>
    <CardTitle>Escolha o Cargo</CardTitle>
    <p className="text-sm text-gray-600">Selecione o cargo para o qual deseja fazer o simulado</p>
  </CardHeader>
  <CardContent>
    {loadingCargos ? (
      <div className="text-center py-4">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        <span className="text-sm text-gray-600">Carregando cargos...</span>
      </div>
    ) : (
      <div className="space-y-3">
        {cargos.map((cargo) => (
          <button
            key={cargo.id}
            onClick={() => setCargoSelecionado(cargo.id)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              cargoSelecionado === cargo.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-lg">{cargo.nome}</div>
                <div className="text-sm text-gray-600 mt-1">{cargo.descricao}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {cargo.nivel_escolaridade} • {cargo.banca}
                </div>
              </div>
              {cargoSelecionado === cargo.id && (
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              )}
            </div>
          </button>
        ))}
      </div>
    )}
  </CardContent>
</Card>
            <Badge className="mb-6 bg-green-100 text-green-800 border-green-200">
              Simulado Gratuito
            </Badge>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Simulado - {cargos.find(c => c.id === cargoSelecionado)?.nome || 'Carregando...'}
        </h2>

        <p className="text-xl text-gray-600 mb-8">
          São Lourenço do Oeste/SC - HC Assessoria
        </p>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{questoesDisponiveis.length}</div>
                    <div className="text-sm text-gray-600">Questões</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">4h</div>
                    <div className="text-sm text-gray-600">Tempo</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">42</div>
                    <div className="text-sm text-gray-600">Vagas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">HC</div>
                    <div className="text-sm text-gray-600">Assessoria</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NOVO: Tipo de Simulado */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Tipo de Simulado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => {
                      setTipoSimulado('completo');
                      setAreaSelecionada(null);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      tipoSimulado === 'completo'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xl font-bold">Simulado Completo</div>
                      <div className="text-sm text-gray-600">Todas as áreas, cronometrado</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setTipoSimulado('area')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      tipoSimulado === 'area'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xl font-bold">Estudar por Área</div>
                      <div className="text-sm text-gray-600">Foque em uma área específica</div>
                    </div>
                  </button>
                </div>

                {/* Seleção de Área (aparece apenas se tipo 'area' estiver selecionado) */}
                {tipoSimulado === 'area' && (
                  <div>
                    <h4 className="font-semibold mb-3">Escolha a Área:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {areas.map(area => (
                        <button
                          key={area.id}
                          onClick={() => setAreaSelecionada(area.id)}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            areaSelecionada === area.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{area.nome}</span>
                            <Badge variant="outline">{area.total_questoes}</Badge>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Quantidade de questões */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantidade de questões: {quantidadeQuestoes}
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={quantidadeQuestoes}
                        onChange={(e) => setQuantidadeQuestoes(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5</span>
                        <span>25</span>
                        <span>50</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Distribuição por áreas */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {tipoSimulado === 'completo' 
                    ? 'Distribuição de Questões por Área' 
                    : areaSelecionada 
                      ? `Questões da Área: ${areas.find(a => a.id === areaSelecionada)?.nome}`
                      : 'Selecione uma área acima'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tipoSimulado === 'completo' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {areas.map(area => (
                      <div key={area.id} className="flex justify-between items-left p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{area.nome}</span>
                        <Badge variant="outline">{area.total_questoes} questões</Badge>
                      </div>
                    ))}
                  </div>
                ) : areaSelecionada ? (
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {quantidadeQuestoes} questões
                    </div>
                    <div className="text-sm text-green-600">
                      da área {areas.find(a => a.id === areaSelecionada)?.nome}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    Selecione uma área para ver as informações
                  </div>
                )}
              </CardContent>
            </Card>

            {/* NOVO: Seleção de Níveis de Dificuldade */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Níveis de Dificuldade</CardTitle>
                <p className="text-sm text-gray-600">Selecione os níveis que deseja incluir no simulado</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((nivel) => (
                    <button
                      key={nivel}
                      onClick={() => {
                        if (dificuldadesSelecionadas.includes(nivel)) {
                          setDificuldadesSelecionadas(dificuldadesSelecionadas.filter(n => n !== nivel));
                        } else {
                          setDificuldadesSelecionadas([...dificuldadesSelecionadas, nivel]);
                        }
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        dificuldadesSelecionadas.includes(nivel)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xl font-bold">Nível {nivel}</div>
                        <div className="text-sm text-gray-600">
                          {nivel === 1 && 'Básico'}
                          {nivel === 2 && 'Fácil'}
                          {nivel === 3 && 'Médio'}
                          {nivel === 4 && 'Difícil'}
                          {nivel === 5 && 'Expert'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Selecionados: {dificuldadesSelecionadas.length > 0 
                    ? dificuldadesSelecionadas.map(n => `Nível ${n}`).join(', ')
                    : 'Nenhum nível selecionado'
                  }
                </p>
              </CardContent>
            </Card>

            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <p className="text-yellow-800">
                  <AlertCircle className="inline h-5 w-5 mr-2" />
                  Faça <Link href="/login" className="text-blue-600 underline">login</Link> para acessar todas as questões e salvar seu progresso
                </p>
              </div>
            )}

            {user && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <p className="text-green-800">
                  <CheckCircle2 className="inline h-5 w-5 mr-2" />
                  Logado como {profile?.nome || user.email}. Seus resultados serão salvos automaticamente!
                </p>
              </div>
            )}

            <Button 
            onClick={handleStart} 
            size="lg" 
            className="px-8 py-4 text-xl"
            disabled={
              gerandoSimulado || 
              questoesDisponiveis.length === 0 || 
              dificuldadesSelecionadas.length === 0 ||
              (tipoSimulado === 'area' && !areaSelecionada) ||
              !cargoSelecionado || // NOVO: Verificar se cargo foi selecionado
              loadingCargos
            }
          >
              {gerandoSimulado ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Gerando Simulado...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-6 w-6" />
                  {tipoSimulado === 'completo' ? 'Iniciar Simulado Completo' : 'Estudar Área Selecionada'}
                </>
              )}
            </Button>

            {/* Mensagens de validação */}
            <div className="mt-4 space-y-2">
              {dificuldadesSelecionadas.length === 0 && (
                <p className="text-red-500 text-sm">
                  Selecione pelo menos um nível de dificuldade
                </p>
              )}
              
              {tipoSimulado === 'area' && !areaSelecionada && (
                <p className="text-red-500 text-sm">
                  Selecione uma área para estudar
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de resultados
  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AuthHeader />
        
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Resultado do Simulado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{results.correct}</div>
                    <div className="text-sm text-gray-600">Acertos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-600">{results.total - results.correct}</div>
                    <div className="text-sm text-gray-600">Erros</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">{results.percentage.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Percentual</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">{formatTime((4 * 60 * 60) - timeLeft)}</div>
                    <div className="text-sm text-gray-600">Tempo Gasto</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resultado por área */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Desempenho por Área</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.porArea.map(area => (
                    <div key={area.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">{area.nome}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm">{area.acertos}/{area.questoes_respondidas}</span>
                        <span className="font-semibold">{area.percentual.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button onClick={() => window.location.reload()} className="mr-4">
                <RotateCcw className="h-4 w-4 mr-2" />
                Novo Simulado
              </Button>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela do simulado em andamento
  return (
    <div className="min-h-screen bg-gray-50">
      {/* NOVO: Modal de Login também na tela do simulado */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={fecharModal}
        onSuccess={handleLoginSuccess}
      />

      {/* Header fixo */}
<header className="bg-white shadow-sm border-b sticky top-0 z-10">
  <div className="container mx-auto px-4 py-3">
    {/* Primeira linha: Logo e botões principais */}
    <div className="flex items-center justify-between mb-2">
      <Link href="/" className="flex items-center space-x-2">
        <BookOpen className="h-6 w-6 text-blue-600" />
        <span className="font-bold text-gray-900">SimuladosPro</span>
      </Link>
      
      <div className="flex items-center space-x-2">
        {user && (
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        )}
        
        <Button onClick={handleFinish} variant="destructive" size="sm">
          <span className="hidden sm:inline">Finalizar</span>
          <span className="sm:hidden">Fim</span>
        </Button>
      </div>
    </div>

    {/* Segunda linha: Informações do simulado */}
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center space-x-2 md:space-x-3">
        <Badge variant="outline" className="text-xs">
          Questão {currentQuestion + 1} de {questoesSimulado.length}
        </Badge>
        
        {tipoSimulado === 'area' && (
          <Badge variant="secondary" className="text-xs">
            Acertos: {Object.keys(answers).filter(id => 
              answers[parseInt(id)] === questoesSimulado.find(q => q.id === parseInt(id))?.resposta_correta
            ).length}/{Object.keys(answers).length}
          </Badge>
        )}
        
        {user && (
          <div className="hidden md:flex items-center space-x-1 text-gray-600">
            <User className="h-4 w-4" />
            <span>{profile?.nome || user.email}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-gray-600" />
        <span className="font-mono text-sm md:text-base font-semibold">
          {formatTime(timeLeft)}
        </span>
        <Button
          onClick={() => setIsRunning(!isRunning)}
          variant="outline"
          size="sm"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
    </div>
    
    {/* Barra de progresso */}
    <div className="mt-3">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questoesSimulado.length) * 100}%` }}
        ></div>
      </div>
    </div>
  </div>
</header>

      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          {currentQ && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    Questão {currentQuestion + 1} - {currentQ.area_nome}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Peso {currentQ.peso_area}</Badge>
                    <Badge variant="secondary">Nível {currentQ.dificuldade}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6 leading-relaxed whitespace-pre-line">
                  {currentQ.enunciado}
                </p>
                
                <div className="space-y-3">
                  {[
                    { key: 'A', value: currentQ.alternativa_a },
                    { key: 'B', value: currentQ.alternativa_b },
                    { key: 'C', value: currentQ.alternativa_c },
                    { key: 'D', value: currentQ.alternativa_d },
                    ...(currentQ.alternativa_e ? [{ key: 'E', value: currentQ.alternativa_e }] : [])
                  ].map(({ key, value }) => (
                    <button
                      key={key}
                      onClick={() => handleAnswer(currentQ.id, key)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:bg-gray-50 ${
                        answers[currentQ.id] === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <span className="font-semibold text-blue-600">{key})</span> {value}
                    </button>
                  ))}
                </div>
             
              </CardContent>
              {/* ADICIONAR após o CardContent da questão: */}

{/* Gráfico em Tempo Real */}
<Card className="mb-6">
  <CardHeader>
    <CardTitle className="text-lg">Progresso em Tempo Real</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex items-center justify-center">
      <div className="relative w-32 h-32">
        {/* Gráfico circular simples */}
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Círculo base */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          {/* Círculo de acertos */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#10b981"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${(acertosEmTempoReal / Object.keys(answers).length) * 251.2} 251.2`}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">
              {Object.keys(answers).length}
            </div>
            <div className="text-xs text-gray-500">respondidas</div>
          </div>
        </div>
      </div>
      
      {/* Legenda */}
      <div className="ml-8 space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm">Corretas: {acertosEmTempoReal}</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span className="text-sm">Incorretas: {errosEmTempoReal}</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
          <span className="text-sm">Não respondidas: {questoesSimulado.length - Object.keys(answers).length}</span>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
            </Card>
          )}

          {/* Navegação */}
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="text-sm text-gray-600">
              Questão {currentQuestion + 1} de {questoesSimulado.length}
            </div>

            <Button
              onClick={() => setCurrentQuestion(Math.min(questoesSimulado.length - 1, currentQuestion + 1))}
              disabled={
                currentQuestion === questoesSimulado.length - 1 || 
                (!user && currentQuestion >= 2) // Só bloqueia se não logado E já na 3ª questão (índice 2)
              }
            >
              Próxima
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Mapa de questões */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Mapa de Questões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-2">
                {questoesSimulado.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded text-sm font-semibold ${
                      index === currentQuestion
                        ? 'bg-blue-600 text-white'
                        : answers[questoesSimulado[index].id]
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                  Atual
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                  Respondida
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                  Não respondida
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimuladoPage;