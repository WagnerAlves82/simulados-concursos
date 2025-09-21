import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Target, Users, CheckCircle2, Star, Play, Trophy, BarChart3 } from 'lucide-react'
import DebugQuestoes from '@/components/simulado/DebugQuestoes'


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SimuladosPro</h1>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="#funcionalidades" className="text-gray-600 hover:text-blue-600 transition-colors">
              Funcionalidades
            </Link>
            <Link href="#como-funciona" className="text-gray-600 hover:text-blue-600 transition-colors">
              Como Funciona
            </Link>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Cadastrar Grátis</Button>
            </Link>
          </div>
        </nav>
      </header>
      

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-green-100 text-green-800 border-green-200">
            100% Gratuito - Sempre
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Prepare-se para <span className="text-blue-600">Agente de Educação Infantil</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            120 questões comentadas da banca HC Assessoria para São Lourenço do Oeste/SC. 
            Feedback detalhado, estatísticas de desempenho e acompanhamento personalizado.
          </p>
          
          {/* CTA Principal */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/simulado">
              <Button size="lg" className="px-8 py-3 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Começar Simulado Agora
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
                Fazer Login/Cadastro
              </Button>
            </Link>
          </div>

          {/* Prova Social */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mb-16">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>800+ candidatos ativos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>HC Assessoria</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>4.9/5 avaliação</span>
            </div>
          </div>
          
          {/* Cards de Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">120 Questões Comentadas</h3>
                <p className="text-gray-600">
                  Feedback detalhado em cada questão com explicações completas das regras
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tempo Real de Prova</h3>
                <p className="text-gray-600">
                  Pratique com 4 horas de duração como será na prova oficial
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Progresso Salvo</h3>
                <p className="text-gray-600">
                  Faça login para salvar respostas e acompanhar sua evolução
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Como Funciona
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Acesse o Simulado</h3>
                <p className="text-gray-600">
                  Clique em "Começar Simulado" e comece a estudar imediatamente, sem cadastro obrigatório
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Faça as 120 Questões</h3>
                <p className="text-gray-600">
                  Pratique com questões reais da banca HC Assessoria com tempo cronometrado
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Receba Feedback</h3>
                <p className="text-gray-600">
                  Veja explicações detalhadas e cadastre-se para salvar seu progresso
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Funcionalidades Completas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle2,
                title: '120 Questões da HC Assessoria',
                description: 'Questões organizadas por área conforme o edital oficial do concurso'
              },
              {
                icon: Target,
                title: 'Simulado Completo',
                description: 'Portugês, Raciocínio Lógico, Informática e Conhecimentos Específicos'
              },
              {
                icon: Clock,
                title: 'Timer de 4 Horas',
                description: 'Controle de tempo real como na prova oficial de São Lourenço do Oeste'
              },
              {
                icon: BookOpen,
                title: 'Feedback Detalhado',
                description: 'Explicações completas com referências à legislação educacional'
              },
              {
                icon: Star,
                title: 'Acesso Imediato',
                description: 'Comece a estudar agora mesmo, cadastro opcional para salvar progresso'
              },
              {
                icon: BarChart3,
                title: 'Estatísticas por Área',
                description: 'Acompanhe seu desempenho em cada matéria (requer cadastro)'
              }
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6">
                  <item.icon className="h-10 w-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            O que nossos alunos dizem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                nome: "Maria Silva",
                cargo: "Candidata para Agente de Educação Infantil",
                depoimento: "O simulado gratuito foi fundamental para minha preparação. As questões são muito parecidas com as da prova real!"
              },
              {
                nome: "João Santos",
                cargo: "Estudante",
                depoimento: "Poder treinar sem pagar nada me ajudou muito. O feedback das questões é excelente para entender onde estava errando."
              },
              {
                nome: "Ana Costa",
                cargo: "Candidata",
                depoimento: "Fiz várias vezes o simulado e consegui melhorar meu desempenho. O sistema de salvar progresso é muito útil."
              }
            ].map((depoimento, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{depoimento.depoimento}"</p>
                  <div>
                    <p className="font-semibold">{depoimento.nome}</p>
                    <p className="text-sm text-gray-500">{depoimento.cargo}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para conquistar sua vaga?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            42 vagas para Agente de Educação Infantil em São Lourenço do Oeste/SC. 
            Comece a treinar agora mesmo com nosso simulado 100% gratuito!
          </p>
          <Link href="/simulado">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              <Play className="mr-2 h-5 w-5" />
              Começar Simulado Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <h3 className="text-xl font-bold">SimuladosPro</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Simulados 100% gratuitos para concursos públicos.
                Especialista na banca HC Assessoria.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Navegação</h4>
              <div className="space-y-2">
                <Link href="/simulado" className="block text-gray-400 hover:text-white transition-colors">
                  Fazer Simulado
                </Link>
                <Link href="/login" className="block text-gray-400 hover:text-white transition-colors">
                  Login/Cadastro
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Concurso</h4>
              <div className="space-y-2">
                <div className="text-gray-400">Agente de Educação Infantil</div>
                <div className="text-gray-400">São Lourenço do Oeste/SC</div>
                <div className="text-gray-400">42 vagas - R$ 2.027,00</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Suporte</h4>
              <div className="space-y-2">
                <a 
                  href="mailto:suporte@simuladospro.com.br" 
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  suporte@simuladospro.com.br
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 SimuladosPro. Sistema gratuito de simulados para concursos públicos.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}