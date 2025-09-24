// src/app/estudar-por-area/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoginModal } from '@/components/ui/LoginModal';
import { useAuth } from '@/contexts/AuthProvider';
import { useQuestoes } from '@/hooks/useQuestoes';
import { QuestaoCompleta } from '@/lib/questoesServices';

import { 
  BookOpen, 
  Clock, 
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  BarChart3,
  Home,
  User,
  LogOut
} from 'lucide-react';

const EstudarPorAreaPage = () => {
  const { user, profile, signOut } = useAuth();
  const { 
    areas, 
    loading,
    buscarQuestoesPorArea,
    registrarQuestaoRespondida,
    showLoginModal,
    fecharModal
  } = useQuestoes(1);

  const [areaSelecionada, setAreaSelecionada] = useState<number | null>(null);
  const [questoesDaArea, setQuestoesDaArea] = useState<QuestaoCompleta[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [showFeedback, setShowFeedback] = useState<{[key: number]: boolean}>({});
  const [loadingQuestoes, setLoadingQuestoes] = useState(false);
  const [modoEstudo, setModoEstudo] = useState<'livre' | 'sequencial'>('livre');

  // Selecionar área e carregar questões
  const selecionarArea = async (areaId: number) => {
    try {
      setLoadingQuestoes(true);
      setAreaSelecionada(areaId);
      
      const questoes = await buscarQuestoesPorArea(areaId);
      setQuestoesDaArea(questoes);
      setCurrentQuestion(0);
      setAnswers({});
      setShowFeedback({});
    } catch (error) {
      console.error('Erro ao carregar questões da área:', error);
    } finally {
      setLoadingQuestoes(false);
    }
  };

  // Lidar com respostas
  const handleAnswer = async (questionId: number, answer: string) => {
    const jaRespondida = answers[questionId];
    
    setAnswers({
      ...answers,
      [questionId]: answer
    });

    // Mostrar feedback automaticamente
    setShowFeedback({
      ...showFeedback,
      [questionId]: true
    });

    // Verificar limite gratuito
    if (!jaRespondida && !user) {
      await registrarQuestaoRespondida();
    }
  };

  // Calcular estatísticas da área atual
  const calcularEstatisticasArea = () => {
    if (questoesDaArea.length === 0) return null;

    const totalRespondidas = Object.keys(answers).length;
    const acertos = questoesDaArea.filter(q => answers[q.id] === q.resposta_correta).length;
    const percentual = totalRespondidas > 0 ? (acertos / totalRespondidas) * 100 : 0;

    return {
      total: questoesDaArea.length,
      respondidas: totalRespondidas,
      acertos,
      percentual
    };
  };

  const stats = calcularEstatisticasArea();
  const currentQ = questoesDaArea[currentQuestion];
  const areaNome = areas.find(a => a.id === areaSelecionada)?.nome || '';

  // Tela de seleção de área
  if (!areaSelecionada) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                  <Button variant="outline" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button variant="outline">Fazer Login</Button>
                </Link>
              )}
              
              <Link href="/">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Início
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Estudar por Área de Conhecimento
              </h2>
              <p className="text-lg text-gray-600">
                Escolha uma área específica para focar seus estudos
              </p>
            </div>

            {/* Modos de Estudo */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Modo de Estudo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setModoEstudo('livre')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      modoEstudo === 'livre'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold">Estudo Livre</h3>
                    <p className="text-sm text-gray-600">
                      Navegue livremente entre as questões, veja feedbacks imediatos
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setModoEstudo('sequencial')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      modoEstudo === 'sequencial'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold">Estudo Sequencial</h3>
                    <p className="text-sm text-gray-600">
                      Responda em ordem, feedback apenas após responder
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Áreas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-2 text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando áreas...</p>
                </div>
              ) : (
                areas.map(area => (
                  <Card 
                    key={area.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => selecionarArea(area.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{area.nome}</span>
                        <Badge variant="outline">{area.total_questoes} questões</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Peso: {area.peso}</span>
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Estudar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de estudo da área
  return (
    <div className="min-h-screen bg-gray-50">
      <LoginModal 
        isOpen={showLoginModal}
        onClose={fecharModal}
        onSuccess={() => {}}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-gray-900">SimuladosPro</span>
              </Link>
              <Badge variant="outline">{areaNome}</Badge>
              <Badge variant="secondary">
                Questão {currentQuestion + 1} de {questoesDaArea.length}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {stats && (
                <div className="text-sm text-gray-600">
                  Acertos: {stats.acertos}/{stats.respondidas} ({stats.percentual.toFixed(1)}%)
                </div>
              )}
              
              <Button variant="outline" onClick={() => setAreaSelecionada(null)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar às Áreas
              </Button>
            </div>
          </div>

          {/* Barra de Progresso */}
          {stats && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progresso</span>
                <span>{stats.respondidas}/{stats.total} questões</span>
              </div>
              <Progress value={(stats.respondidas / stats.total) * 100} />
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loadingQuestoes ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando questões...</p>
            </div>
          ) : currentQ ? (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    Questão {currentQuestion + 1} - {areaNome}
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

                {/* Feedback */}
                {answers[currentQ.id] && showFeedback[currentQ.id] && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      {answers[currentQ.id] === currentQ.resposta_correta ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      <span className="font-semibold">
                        Resposta correta: {currentQ.resposta_correta}
                      </span>
                    </div>
                    <p className="text-gray-700">{currentQ.feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhuma questão encontrada para esta área.</p>
              <Button 
                onClick={() => setAreaSelecionada(null)}
                className="mt-4"
              >
                Voltar às Áreas
              </Button>
            </div>
          )}

          {/* Navegação */}
          {questoesDaArea.length > 0 && (
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {currentQuestion + 1} de {questoesDaArea.length}
                </span>
                
                {stats && (
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {stats.percentual.toFixed(1)}% de acerto
                  </Button>
                )}
              </div>

              <Button
                onClick={() => setCurrentQuestion(Math.min(questoesDaArea.length - 1, currentQuestion + 1))}
                disabled={
                  currentQuestion === questoesDaArea.length - 1 ||
                  (!user && currentQuestion >= 2)
                }
              >
                Próxima
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Mapa de questões */}
          {questoesDaArea.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Progresso da Área</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-10 gap-2">
                  {questoesDaArea.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded text-sm font-semibold ${
                        index === currentQuestion
                          ? 'bg-blue-600 text-white'
                          : answers[questoesDaArea[index].id]
                            ? answers[questoesDaArea[index].id] === questoesDaArea[index].resposta_correta
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
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
                    Acerto
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
                    Erro
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                    Não respondida
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstudarPorAreaPage;