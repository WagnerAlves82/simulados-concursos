'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthProvider';
import { useQuestoes } from '@/hooks/useQuestoes';
import { QuestaoCompleta } from '@/lib/questoesServices';
import DebugQuestoes from '@/components/simulado/DebugQuestoes'; // 🔍 ADICIONADO
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
  const { 
    questoes: questoesDisponiveis, 
    areas, 
    loading: loadingQuestoes, 
    error: errorQuestoes,
    gerarSimulado,
    salvarResultado,
    recarregar,
    debug // 🔍 ADICIONADO para ver debug info
  } = useQuestoes(1); // Cargo ID 1 = Agente de Educação Infantil

  const [questoesSimulado, setQuestoesSimulado] = useState<QuestaoCompleta[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [timeLeft, setTimeLeft] = useState(4 * 60 * 60); // 4 horas em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState<{[key: number]: boolean}>({});
  const [isStarted, setIsStarted] = useState(false);
  const [salvandoResultado, setSalvandoResultado] = useState(false);
  const [gerandoSimulado, setGerandoSimulado] = useState(false);

  // 🔍 ADICIONAR LOG PARA DEBUG
  useEffect(() => {
    console.log('🔍 Debug SimuladoPage:', {
      questoesDisponiveis: questoesDisponiveis.length,
      areas: areas.length,
      loading: loadingQuestoes,
      error: errorQuestoes,
      debug
    });
  }, [questoesDisponiveis, areas, loadingQuestoes, errorQuestoes, debug]);

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
    console.log('🎯 Botão clicado - Iniciando geração do simulado...');
    console.log('Estado atual:', { 
      gerandoSimulado, 
      questoesDisponiveis: questoesDisponiveis.length,
      isStarted 
    });
    
    setGerandoSimulado(true);
    console.log('✅ setGerandoSimulado(true) executado');
    
    const questoes = await gerarSimulado();
    console.log('✅ gerarSimulado() retornou:', questoes.length, 'questões');
    
    setQuestoesSimulado(questoes);
    console.log('✅ setQuestoesSimulado() executado com', questoes.length, 'questões');
    
    setIsStarted(true);
    console.log('✅ setIsStarted(true) executado');
    
    setIsRunning(true);
    console.log('✅ setIsRunning(true) executado');
    
    console.log('🎉 Todos os estados atualizados, interface deve mudar agora');
  } catch (error) {
    console.error('❌ Erro ao gerar simulado:', error);
    alert(`Erro ao gerar simulado: ${error.message}`);
  } finally {
    setGerandoSimulado(false);
    console.log('🏁 setGerandoSimulado(false) executado');
  }
};

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleFinish = async () => {
    setIsRunning(false);
    setShowResults(true);

    // Salvar resultado se usuário estiver logado
    if (user) {
      try {
        setSalvandoResultado(true);
        const tempoGasto = (4 * 60 * 60) - timeLeft; // Tempo total - tempo restante
        await salvarResultado(questoesSimulado, answers, tempoGasto);
      } catch (error) {
        console.error('Erro ao salvar resultado:', error);
        // Continuar mesmo se não conseguir salvar
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

    // Calcular estatísticas por área
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
        {/* 🔍 DEBUG DURANTE LOADING */}
        <DebugQuestoes />
        
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
        {/* 🔍 DEBUG DURANTE ERRO */}
        <DebugQuestoes />
        
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
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">SimuladosPro</h1>
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{profile?.nome || user.email}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline">
                Fazer Login
              </Button>
            </Link>
          )}
          
          <Link href="/">
            <Button variant="outline">
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
        {/* 🔍 COMPONENTE DE DEBUG ADICIONADO AQUI */}
        <DebugQuestoes />
        
        <AuthHeader />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Badge className="mb-6 bg-green-100 text-green-800 border-green-200">
              Simulado Gratuito
            </Badge>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Simulado - Agente de Educação Infantil
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

            {/* Distribuição por áreas */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Distribuição de Questões por Área</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {areas.map(area => (
                    <div key={area.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{area.nome}</span>
                      <Badge variant="outline">{area.total_questoes} questões</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <p className="text-yellow-800">
                  <AlertCircle className="inline h-5 w-5 mr-2" />
                  Faça <Link href="/login" className="text-blue-600 underline">login</Link> para salvar seu progresso e acompanhar estatísticas
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
              disabled={gerandoSimulado || questoesDisponiveis.length === 0}
            >
              {gerandoSimulado ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Gerando Simulado...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-6 w-6" />
                  Iniciar Simulado
                </>
              )}
            </Button>

            {/* 🔍 DEBUG INFO ADICIONAL NA TELA */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left text-sm">
                <h3 className="font-bold mb-2">Debug Info Adicional:</h3>
                <div>Questões disponíveis: {questoesDisponiveis.length}</div>
                <div>Áreas carregadas: {areas.length}</div>
                <div>Loading: {loadingQuestoes ? 'Sim' : 'Não'}</div>
                <div>Error: {errorQuestoes || 'Nenhum'}</div>
                <div>Debug object: {JSON.stringify(debug, null, 2)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Resto do código permanece igual...
  // [Código das outras telas continua igual]

 // Tela de resultados
  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* ... código da tela de resultados ... */}
      </div>
    );
  }

  // Tela do simulado em andamento
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-gray-900">SimuladosPro</span>
              </Link>
              <Badge variant="outline">
                Questão {currentQuestion + 1} de {questoesSimulado.length}
              </Badge>
              {user && (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{profile?.nome || user.email}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-600" />
                <span className="font-mono text-lg font-semibold">
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
              
              {user && (
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </Button>
              )}
              
              <Button onClick={handleFinish} variant="destructive">
                Finalizar
              </Button>
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questoesSimulado.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {currentQ && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    Questão {currentQuestion + 1} - {currentQ.area_nome}
                  </CardTitle>
                  <Badge variant="outline">Peso {currentQ.peso_area}</Badge>
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
              disabled={currentQuestion === questoesSimulado.length - 1}
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