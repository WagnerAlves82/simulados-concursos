'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AdminService } from '@/lib/adminService'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { 
  LogOut, 
  Plus,
  Search,
  Edit,
  Trash2,
  Upload,
  Download,
  Settings,
  BarChart3,
  Users,
  Database,
  FileText,
  Building,
  GraduationCap,
  Target,
  Check,
  X,
  Save,
  Eye,
  AlertCircle
} from 'lucide-react'

export function AdminDashboardContent() {
  const { user, profile, signOut } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCargo, setSelectedCargo] = useState("todos")
  const [selectedArea, setSelectedArea] = useState("todas")

  // Estados para dados
  const [questoes, setQuestoes] = useState([])
  const [cargos, setCargos] = useState([])
  const [areas, setAreas] = useState([])
  const [bancas, setBancas] = useState([])
  const [loading, setLoading] = useState(true)

  // Estados para estatísticas
  const [stats, setStats] = useState({
    totalQuestoes: 0,
    totalCargos: 0,
    totalUsuarios: 0,
    totalSimulados: 0,
    questoesPorBanca: {},
    questoesPorArea: {},
    acessosRecentes: 0
  })

  // Estados para formulário de nova questão
  const [novaQuestao, setNovaQuestao] = useState({
    cargo_id: '',
    area_id: '',
    enunciado: '',
    alternativa_a: '',
    alternativa_b: '',
    alternativa_c: '',
    alternativa_d: '',
    alternativa_e: '',
    resposta_correta: '',
    feedback: '',
    dificuldade: 2,
    fonte: ''
  })
  const [criandoQuestao, setCriandoQuestao] = useState(false)

  // Estados para novo cargo
  const [novoCargo, setNovoCargo] = useState({
    nome: '',
    descricao: '',
    orgao: '',
    banca: 'HC ASSESSORIA',
    nivel_escolaridade: 'Ensino Médio'
  })
  const [criandoCargo, setCriandoCargo] = useState(false)
  const [mostrarFormCargo, setMostrarFormCargo] = useState(false)

  // Estados para nova área
  const [novaArea, setNovaArea] = useState({
    nome: '',
    descricao: ''
  })
  const [criandoArea, setCriandoArea] = useState(false)
  const [mostrarFormArea, setMostrarFormArea] = useState(false)

  // Instanciar o AdminService
  const adminService = useMemo(() => new AdminService(), [])

  useEffect(() => {
    loadDashboardData()
  }, [adminService])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      console.log('📊 Carregando dados do dashboard admin...')
      
      // Carregar todas as informações em paralelo
      const [statsData, cargosData, areasData, bancasData] = await Promise.all([
        adminService.buscarEstatisticas(),
        adminService.buscarCargos(),
        adminService.buscarAreas(),
        adminService.buscarBancas()
      ])
      
      console.log('✅ Dados carregados:', {
        stats: statsData,
        cargos: cargosData.length,
        areas: areasData.length,
        bancas: bancasData.length
      })
      
      setStats(statsData)
      setCargos(cargosData)
      setAreas(areasData)
      setBancas(bancasData)
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados do admin:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do dashboard",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // Criar nova questão
  const handleCriarQuestao = async () => {
    if (!novaQuestao.cargo_id || !novaQuestao.area_id || !novaQuestao.enunciado || 
        !novaQuestao.alternativa_a || !novaQuestao.alternativa_b || !novaQuestao.alternativa_c || 
        !novaQuestao.alternativa_d || !novaQuestao.resposta_correta || !novaQuestao.feedback) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    setCriandoQuestao(true)
    try {
      await adminService.criarQuestao({
        cargo_id: parseInt(novaQuestao.cargo_id),
        area_id: parseInt(novaQuestao.area_id),
        enunciado: novaQuestao.enunciado,
        alternativa_a: novaQuestao.alternativa_a,
        alternativa_b: novaQuestao.alternativa_b,
        alternativa_c: novaQuestao.alternativa_c,
        alternativa_d: novaQuestao.alternativa_d,
        alternativa_e: novaQuestao.alternativa_e || undefined,
        resposta_correta: novaQuestao.resposta_correta,
        feedback: novaQuestao.feedback,
        dificuldade: novaQuestao.dificuldade,
        fonte: novaQuestao.fonte || undefined
      })

      toast({
        title: "Sucesso!",
        description: "Questão criada com sucesso!"
      })

      // Limpar formulário
      setNovaQuestao({
        cargo_id: '',
        area_id: '',
        enunciado: '',
        alternativa_a: '',
        alternativa_b: '',
        alternativa_c: '',
        alternativa_d: '',
        alternativa_e: '',
        resposta_correta: '',
        feedback: '',
        dificuldade: 2,
        fonte: ''
      })

      // Recarregar dados
      await loadDashboardData()

    } catch (error) {
      console.error('Erro ao criar questão:', error)
      toast({
        title: "Erro",
        description: "Erro ao criar questão",
        variant: "destructive"
      })
    } finally {
      setCriandoQuestao(false)
    }
  }

  // Criar novo cargo
  const handleCriarCargo = async () => {
    if (!novoCargo.nome || !novoCargo.orgao) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos o nome e órgão",
        variant: "destructive"
      })
      return
    }

    setCriandoCargo(true)
    try {
      await adminService.criarCargo(novoCargo)

      toast({
        title: "Sucesso!",
        description: "Cargo criado com sucesso!"
      })

      // Limpar formulário
      setNovoCargo({
        nome: '',
        descricao: '',
        orgao: '',
        banca: 'HC ASSESSORIA',
        nivel_escolaridade: 'Ensino Médio'
      })
      setMostrarFormCargo(false)

      // Recarregar dados
      await loadDashboardData()

    } catch (error) {
      console.error('Erro ao criar cargo:', error)
      toast({
        title: "Erro",
        description: "Erro ao criar cargo",
        variant: "destructive"
      })
    } finally {
      setCriandoCargo(false)
    }
  }

  // Criar nova área
  const handleCriarArea = async () => {
  if (!novaArea.nome) {
    toast({
      title: "Erro",
      description: "Preencha o nome da área",
      variant: "destructive"
    })
    return
  }

  setCriandoArea(true)
  try {
      await adminService.criarArea(novaArea)

    toast({
      title: "Sucesso!",
      description: "Área criada com sucesso!"
    })

    // Limpar formulário
    setNovaArea({
      nome: '',
      descricao: ''
    })
    setMostrarFormArea(false)

    // Recarregar dados
    await loadDashboardData()

  } catch (error) {
    console.error('Erro ao criar área:', error)
    toast({
      title: "Erro",
      description: "Erro ao criar área",
      variant: "destructive"
    })
  } finally {
    setCriandoArea(false)
  }
}

  // Componente para criar nova questão
  const NovaQuestaoForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Nova Questão</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Cargo *</label>
            <Select value={novaQuestao.cargo_id} onValueChange={(value) => setNovaQuestao({...novaQuestao, cargo_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                {cargos.map(cargo => (
                  <SelectItem key={cargo.id} value={cargo.id.toString()}>
                    {cargo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Área *</label>
            <Select value={novaQuestao.area_id} onValueChange={(value) => setNovaQuestao({...novaQuestao, area_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map(area => (
                  <SelectItem key={area.id} value={area.id.toString()}>
                    {area.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Enunciado *</label>
          <Textarea 
            placeholder="Digite o enunciado da questão..."
            className="min-h-32"
            value={novaQuestao.enunciado}
            onChange={(e) => setNovaQuestao({...novaQuestao, enunciado: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium mb-2 block">Alternativas *</label>
          <Input 
            placeholder="A) " 
            value={novaQuestao.alternativa_a}
            onChange={(e) => setNovaQuestao({...novaQuestao, alternativa_a: e.target.value})}
          />
          <Input 
            placeholder="B) " 
            value={novaQuestao.alternativa_b}
            onChange={(e) => setNovaQuestao({...novaQuestao, alternativa_b: e.target.value})}
          />
          <Input 
            placeholder="C) " 
            value={novaQuestao.alternativa_c}
            onChange={(e) => setNovaQuestao({...novaQuestao, alternativa_c: e.target.value})}
          />
          <Input 
            placeholder="D) " 
            value={novaQuestao.alternativa_d}
            onChange={(e) => setNovaQuestao({...novaQuestao, alternativa_d: e.target.value})}
          />
          <Input 
            placeholder="E) (opcional)" 
            value={novaQuestao.alternativa_e}
            onChange={(e) => setNovaQuestao({...novaQuestao, alternativa_e: e.target.value})}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Resposta Correta *</label>
          <Select value={novaQuestao.resposta_correta} onValueChange={(value) => setNovaQuestao({...novaQuestao, resposta_correta: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Resposta correta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
              {novaQuestao.alternativa_e && <SelectItem value="E">E</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Feedback/Explicação *</label>
          <Textarea 
            placeholder="Explique por que esta é a resposta correta..."
            className="min-h-24"
            value={novaQuestao.feedback}
            onChange={(e) => setNovaQuestao({...novaQuestao, feedback: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Dificuldade</label>
            <Select value={novaQuestao.dificuldade.toString()} onValueChange={(value) => setNovaQuestao({...novaQuestao, dificuldade: parseInt(value)})}>
              <SelectTrigger>
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Muito Fácil</SelectItem>
                <SelectItem value="2">2 - Fácil</SelectItem>
                <SelectItem value="3">3 - Médio</SelectItem>
                <SelectItem value="4">4 - Difícil</SelectItem>
                <SelectItem value="5">5 - Muito Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Fonte</label>
            <Input 
              placeholder="Ex: Prova anterior 2023"
              value={novaQuestao.fonte}
              onChange={(e) => setNovaQuestao({...novaQuestao, fonte: e.target.value})}
            />
          </div>
        </div>
        
        <div className="flex space-x-2 pt-4">
          <Button 
            className="flex-1" 
            onClick={handleCriarQuestao}
            disabled={criandoQuestao}
          >
            {criandoQuestao ? (
              <>Criando...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Criar Questão
              </>
            )}
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload em Lote
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Componente para novo cargo
  const NovoCargoForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>Novo Cargo</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setMostrarFormCargo(!mostrarFormCargo)}>
            {mostrarFormCargo ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      {mostrarFormCargo && (
        <CardContent className="space-y-4">
          <Input 
            placeholder="Nome do cargo *"
            value={novoCargo.nome}
            onChange={(e) => setNovoCargo({...novoCargo, nome: e.target.value})}
          />
          <Textarea 
            placeholder="Descrição do cargo"
            value={novoCargo.descricao}
            onChange={(e) => setNovoCargo({...novoCargo, descricao: e.target.value})}
          />
          <Input 
            placeholder="Órgão *"
            value={novoCargo.orgao}
            onChange={(e) => setNovoCargo({...novoCargo, orgao: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="Banca"
              value={novoCargo.banca}
              onChange={(e) => setNovoCargo({...novoCargo, banca: e.target.value})}
            />
            <Select value={novoCargo.nivel_escolaridade} onValueChange={(value) => setNovoCargo({...novoCargo, nivel_escolaridade: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Escolaridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ensino Fundamental">Ensino Fundamental</SelectItem>
                <SelectItem value="Ensino Médio">Ensino Médio</SelectItem>
                <SelectItem value="Ensino Superior">Ensino Superior</SelectItem>
                <SelectItem value="Pós-graduação">Pós-graduação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCriarCargo} disabled={criandoCargo} className="w-full">
            {criandoCargo ? 'Criando...' : 'Criar Cargo'}
          </Button>
        </CardContent>
      )}
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Carregando Dashboard</h2>
            <p className="text-gray-600">Buscando dados do sistema...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin CMS</h1>
                <p className="text-sm text-gray-600">
                  Gerencie questões, cargos e bancas
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-red-100 text-red-800">
                Administrador
              </Badge>
              
              <div className="text-right text-sm">
                <p className="font-medium">{profile?.nome || user?.email}</p>
                <p className="text-gray-500">Último acesso: Hoje</p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="questoes" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Questões</span>
            </TabsTrigger>
            <TabsTrigger value="cargos" className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span>Cargos</span>
            </TabsTrigger>
            <TabsTrigger value="bancas" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Bancas</span>
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Backup</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Questões</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalQuestoes}</div>
                  <p className="text-xs text-muted-foreground">
                    Sistema de simulados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cargos Ativos</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCargos}</div>
                  <p className="text-xs text-muted-foreground">
                    Cargos configurados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
                  <p className="text-xs text-muted-foreground">
                    Usuários cadastrados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Simulados</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSimulados}</div>
                  <p className="text-xs text-muted-foreground">
                    Realizados no total
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos e estatísticas */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Questões por Área</CardTitle>
                </CardHeader>
                <CardContent>
                 <div className="space-y-4">
  {Object.entries(stats.questoesPorArea).length > 0 ? (
    Object.entries(stats.questoesPorArea).map(([area, count]) => {
      const countNumber = Number(count);
      const percentage = stats.totalQuestoes > 0 ? (countNumber / stats.totalQuestoes) * 100 : 0;
      
      return (
        <div key={area} className="flex items-center justify-between">
          <span className="text-sm font-medium">{area}</span>
          <div className="flex items-center space-x-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-600 rounded-full" 
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">{countNumber}</span>
          </div>
        </div>
      );
    })
  ) : (
    <div className="text-center py-8 text-gray-500">
      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
      <p>Nenhuma questão cadastrada ainda</p>
    </div>
  )}
</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('questoes')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Questão
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('cargos')}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Novo Cargo
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload em Lote
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Questões
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Questões Tab */}
          <TabsContent value="questoes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Gestão de Questões</h2>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar Questões
                </Button>
                <Button onClick={() => setActiveTab('questoes')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Questão
                </Button>
              </div>
            </div>

            {/* Filtros */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Buscar questões..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCargo} onValueChange={setSelectedCargo}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os cargos</SelectItem>
                      {cargos.map(cargo => (
                        <SelectItem key={cargo.id} value={cargo.id.toString()}>
                          {cargo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as áreas</SelectItem>
                      {areas.map(area => (
                        <SelectItem key={area.id} value={area.id.toString()}>
                          {area.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <NovaQuestaoForm />

            {/* Lista de questões */}
            {stats.totalQuestoes === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma questão cadastrada</h3>
                  <p className="text-gray-600 mb-4">
                    Comece criando sua primeira questão usando o formulário acima.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Cargos Tab */}
          <TabsContent value="cargos" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Gestão de Cargos</h2>
              <Button onClick={() => setMostrarFormCargo(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cargo
              </Button>
            </div>

            <NovoCargoForm />

            <div className="grid gap-4">
              {cargos.length > 0 ? (
                cargos.map(cargo => (
                  <Card key={cargo.id}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div>
                        <h3 className="text-lg font-semibold">{cargo.nome}</h3>
                        <p className="text-sm text-gray-600">
                          {cargo.nivel_escolaridade} • {cargo.banca} • {cargo.orgao}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {cargo.questoes_count || 0} questões cadastradas
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={cargo.ativo ? "default" : "secondary"}>
                          {cargo.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum cargo cadastrado</h3>
                    <p className="text-gray-600 mb-4">
                      Crie o primeiro cargo para começar a adicionar questões.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Bancas Tab */}
          <TabsContent value="bancas" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Gestão de Bancas</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Banca
              </Button>
            </div>

            <div className="grid gap-4">
              {bancas.length > 0 ? (
                bancas.map((banca, index) => (
                  <Card key={index}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div>
                        <h3 className="text-lg font-semibold">{banca.nome}</h3>
                        <p className="text-sm text-gray-600">
                          {banca.questoes} questões • {banca.cargos} cargos
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={banca.ativa ? "default" : "secondary"}>
                          {banca.ativa ? "Ativa" : "Inativa"}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma banca encontrada</h3>
                    <p className="text-gray-600 mb-4">
                      As bancas são criadas automaticamente quando você adiciona cargos.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Usuários Tab */}
          <TabsContent value="usuarios" className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h2>
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Funcionalidade em desenvolvimento</h3>
                <p className="text-gray-600">
                  Em breve você poderá gerenciar usuários, permissões e acessos.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup Tab */}
          <TabsContent value="backup" className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Backup e Exportação</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Exportar Dados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Todas as Questões (CSV)
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Estatísticas
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Backup do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Fazer Backup Completo
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Restaurar Backup
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}