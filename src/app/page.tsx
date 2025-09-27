import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Target, Users, CheckCircle2, Star, Play, Trophy, BarChart3, ShoppingCart, Download, Lock } from 'lucide-react'

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
      <Link href="#apostilas" className="text-gray-600 hover:text-blue-600 transition-colors">
        Apostilas
      </Link>
      <Link href="#simulado-gratuito" className="text-gray-600 hover:text-blue-600 transition-colors">
        Simulado Grátis
      </Link>
      <Link href="#como-funciona" className="text-gray-600 hover:text-blue-600 transition-colors">
        Como Funciona
      </Link>
    </div>
    <div className="flex items-center space-x-2 md:space-x-4">
      <Link href="/login">
        <Button variant="outline" size="sm" className="md:size-default">
          Entrar
        </Button>
      </Link>
      <Link href="/login">
        <Button size="sm" className="md:size-default">
          Cadastrar
        </Button>
      </Link>
    </div>
  </nav>
</header>
      

      {/* Hero Section - REFORMULADA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-5xl mx-auto">
          <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
            Apostila + Simulado Completo
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">Apostilas Completas</span> + Simulados Ilimitados
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Material teórico completo + questões comentadas da banca HC Assessoria. 
            Combo completo para sua aprovação com feedback detalhado e estatísticas.
          </p>
          
          {/* CTA Duplo - NOVO */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="#apostilas">
              <Button size="lg" className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ver Apostilas + Simulados
              </Button>
            </Link>
            <Link href="/simulado">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-blue-600 text-blue-600 hover:bg-blue-50">
                <Play className="mr-2 h-5 w-5" />
                Testar Simulado Grátis
              </Button>
            </Link>
          </div>

          {/* Prova Social - ATUALIZADA */}
         <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm text-gray-600 mb-16 px-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>800+ aprovados</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>HC Assessoria</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>4.9/5 avaliação</span>
          </div>
          <div className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Material completo</span>
          </div>
        </div>
        </div>
      </section>

      {/* Seção Apostilas em Destaque - NOVA */}
      <section id="apostilas" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Apostilas + Simulados por Cargo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Material teórico completo + acesso vitalício ao simulado específico do seu cargo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card EM BREVE */}
            {[
              {
                cargo: "Agente de Educação Infantil",
                preco: "R$ 49,90",
                vagas: "42 vagas",
                salario: "R$ 2.027,00",
                banca: "HC Assessoria",
                status: "em-breve"
              },
              {
                cargo: "Professor Anos Iniciais",
                preco: "R$ 59,90",
                vagas: "28 vagas",
                salario: "R$ 3.245,00",
                banca: "HC Assessoria",
                status: "em-breve"
              },
              {
                cargo: "Auxiliar Administrativo",
                preco: "R$ 39,90",
                vagas: "15 vagas",
                salario: "R$ 1.890,00",
                banca: "AOCP",
                status: "em-breve"
              }
            ].map((produto, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 relative overflow-hidden">
                {/* Badge EM BREVE */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    EM BREVE
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{produto.cargo}</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{produto.preco}</div>
                    <p className="text-sm text-gray-500">Apostila + Simulado Completo</p>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center justify-between">
                      <span>Vagas:</span>
                      <span className="font-semibold">{produto.vagas}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Salário:</span>
                      <span className="font-semibold">{produto.salario}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Banca:</span>
                      <span className="font-semibold">{produto.banca}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Apostila PDF completa</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Simulados ilimitados</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Questões comentadas</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Acesso vitalício</span>
                    </div>
                  </div>

                  <Button className="w-full" disabled>
                    <Lock className="mr-2 h-4 w-4" />
                    Em Breve
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Interessado em outros cargos?</p>
            <Button variant="outline" size="lg">
              Solicitar Novo Cargo
            </Button>
          </div>
        </div>
      </section>

      {/* Simulado Grátis - REPOSITIONADA */}
      <section id="simulado-gratuito" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-green-100 text-green-800 border-green-200">
              100% Gratuito
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Experimente Nosso Simulado Gratuitamente
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Teste nossa plataforma com 3 questões gratuitas. 
              Veja a qualidade do nosso material antes de adquirir a apostila completa.
            </p>
            
            {/* Cards de Benefícios do Simulado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Questões que aprovam</h3>
                  <p className="text-gray-600">
                    Questões reais da banca com feedback detalhado
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Tempo Real de Prova</h3>
                  <p className="text-gray-600">
                    Cronômetro oficial de 4 horas como na prova real
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Relatório Detalhado</h3>
                  <p className="text-gray-600">
                    Análise de desempenho por área de conhecimento
                  </p>
                </CardContent>
              </Card>
            </div>

            <Link href="/simulado">
              <Button size="lg" className="px-8 py-4 text-xl">
                <Play className="mr-2 h-6 w-6" />
                Começar Simulado Gratuito
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona - ATUALIZADA */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Como Funciona o Combo Completo
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Teste Grátis</h3>
                <p className="text-gray-600">
                  Experimente 3 questões gratuitas para conhecer a qualidade do nosso material
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Compre a Apostila</h3>
                <p className="text-gray-600">
                  Adquira o material completo + acesso vitalício ao simulado do seu cargo
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Estude e Pratique</h3>
                <p className="text-gray-600">
                  Material teórico + simulados ilimitados com questões comentadas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades - MANTIDA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            O que Você Recebe no Combo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Apostila PDF Completa',
                description: 'Material teórico abrangente conforme o edital oficial do concurso'
              },
              {
                icon: Target,
                title: 'Simulados Ilimitados',
                description: 'Acesso vitalício com questões organizadas por área de conhecimento'
              },
              {
                icon: CheckCircle2,
                title: 'Questões Comentadas',
                description: 'Feedback detalhado com explicações das regras e legislação'
              },
              {
                icon: Clock,
                title: 'Timer Oficial',
                description: 'Controle de tempo real como na prova oficial'
              },
              {
                icon: BarChart3,
                title: 'Relatórios de Desempenho',
                description: 'Acompanhe seu progresso e identifique pontos de melhoria'
              },
              {
                icon: Star,
                title: 'Atualizações Gratuitas',
                description: 'Material sempre atualizado conforme mudanças no edital'
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

      {/* Depoimentos - ATUALIZADA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Aprovados com Nosso Material
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                nome: "Maria Silva",
                cargo: "Aprovada - Agente de Educação Infantil",
                depoimento: "A apostila cobriu exatamente o que caiu na prova! Os simulados me deram confiança para o dia da prova."
              },
              {
                nome: "João Santos",
                cargo: "Aprovado - Professor Anos Iniciais",
                depoimento: "Material muito completo. A combinação teoria + prática com simulados foi fundamental para minha aprovação."
              },
              {
                nome: "Ana Costa",
                cargo: "Aprovada - Auxiliar Administrativo",
                depoimento: "Fiz vários simulados e consegui identificar minhas dificuldades. O material é excelente!"
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
                    <p className="text-sm text-blue-600">{depoimento.cargo}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final - ATUALIZADA */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Comece Sua Preparação Agora
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Material completo + simulados ilimitados. 
            Teste gratuitamente e veja por que somos referência em aprovação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#apostilas">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ver Apostilas Disponíveis
              </Button>
            </Link>
            <Link href="/simulado">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Testar Simulado Grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - MANTIDO */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <h3 className="text-xl font-bold">SimuladosPro</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Apostilas completas + simulados para concursos públicos.
                Especialista na banca HC Assessoria.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Produtos</h4>
              <div className="space-y-2">
                <Link href="#apostilas" className="block text-gray-400 hover:text-white transition-colors">
                  Apostilas + Simulados
                </Link>
                <Link href="/simulado" className="block text-gray-400 hover:text-white transition-colors">
                  Simulado Gratuito
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Concurso Atual</h4>
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
            <p>© 2025 SimuladosPro. Apostilas + Simulados para sua aprovação.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}