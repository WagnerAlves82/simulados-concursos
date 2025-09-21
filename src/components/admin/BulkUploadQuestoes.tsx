// src/components/admin/BulkUploadQuestoes.tsx
'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAdminPermissions } from '@/components/ProtectedAdminRoute'
import { AdminService } from '@/lib/adminService'
import { AuthSecurityService } from '@/lib/authSecurity'
import { useAuth } from '@/contexts/AuthProvider'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Eye,
  Trash2
} from 'lucide-react'

interface QuestaoUpload {
  cargo_nome: string
  area_nome: string
  enunciado: string
  alternativa_a: string
  alternativa_b: string
  alternativa_c: string
  alternativa_d: string
  alternativa_e?: string
  resposta_correta: string
  feedback: string
  dificuldade?: number
  fonte?: string
  // Campos resolvidos
  cargo_id?: number
  area_id?: number
  erro?: string
}

export default function BulkUploadQuestoes() {
  const { user } = useAuth()
  const { hasPermission } = useAdminPermissions()
  const [file, setFile] = useState<File | null>(null)
  const [questoes, setQuestoes] = useState<QuestaoUpload[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const adminService = new AdminService()
  const authService = new AuthSecurityService()

  // Verificar permissão
  if (!hasPermission('canUploadBulk')) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
          <p className="text-gray-600">Você não tem permissão para fazer upload em lote.</p>
        </CardContent>
      </Card>
    )
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setQuestoes([])
      setErrors([])
      setSuccess(null)
      setShowPreview(false)
    }
  }

  const processFile = async () => {
    if (!file) return

    setLoading(true)
    setErrors([])

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        throw new Error('Arquivo deve ter pelo menos um cabeçalho e uma linha de dados')
      }

      // Parse CSV
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      const questoesData: QuestaoUpload[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i])
        
        if (values.length < headers.length) continue

        const questao: QuestaoUpload = {
          cargo_nome: values[headers.indexOf('cargo_nome')] || '',
          area_nome: values[headers.indexOf('area_nome')] || '',
          enunciado: values[headers.indexOf('enunciado')] || '',
          alternativa_a: values[headers.indexOf('alternativa_a')] || '',
          alternativa_b: values[headers.indexOf('alternativa_b')] || '',
          alternativa_c: values[headers.indexOf('alternativa_c')] || '',
          alternativa_d: values[headers.indexOf('alternativa_d')] || '',
          alternativa_e: values[headers.indexOf('alternativa_e')] || undefined,
          resposta_correta: values[headers.indexOf('resposta_correta')] || '',
          feedback: values[headers.indexOf('feedback')] || '',
          dificuldade: parseInt(values[headers.indexOf('dificuldade')]) || 2,
          fonte: values[headers.indexOf('fonte')] || undefined
        }

        questoesData.push(questao)
      }

      // Validar e resolver IDs
      await validateAndResolveQuestoes(questoesData)
      setQuestoes(questoesData)
      setShowPreview(true)

    } catch (error) {
      setErrors([`Erro ao processar arquivo: ${error.message}`])
    } finally {
      setLoading(false)
    }
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result
  }

  const validateAndResolveQuestoes = async (questoesData: QuestaoUpload[]) => {
    const [cargos, areas] = await Promise.all([
      adminService.buscarCargos(),
      adminService.buscarAreas()
    ])

    questoesData.forEach((questao, index) => {
      const erros: string[] = []

      // Validar campos obrigatórios
      if (!questao.enunciado) erros.push('Enunciado é obrigatório')
      if (!questao.alternativa_a) erros.push('Alternativa A é obrigatória')
      if (!questao.alternativa_b) erros.push('Alternativa B é obrigatória')
      if (!questao.alternativa_c) erros.push('Alternativa C é obrigatória')
      if (!questao.alternativa_d) erros.push('Alternativa D é obrigatória')
      if (!questao.resposta_correta) erros.push('Resposta correta é obrigatória')
      if (!questao.feedback) erros.push('Feedback é obrigatório')

      // Validar resposta correta
      if (questao.resposta_correta && !['A', 'B', 'C', 'D', 'E'].includes(questao.resposta_correta)) {
        erros.push('Resposta correta deve ser A, B, C, D ou E')
      }

      // Resolver cargo
      const cargo = cargos.find(c => 
        c.nome.toLowerCase().includes(questao.cargo_nome.toLowerCase()) ||
        questao.cargo_nome.toLowerCase().includes(c.nome.toLowerCase())
      )
      
      if (cargo) {
        questao.cargo_id = cargo.id
      } else {
        erros.push(`Cargo "${questao.cargo_nome}" não encontrado`)
      }

      // Resolver área
      const area = areas.find(a => 
        a.nome.toLowerCase().includes(questao.area_nome.toLowerCase()) ||
        questao.area_nome.toLowerCase().includes(a.nome.toLowerCase())
      )
      
      if (area) {
        questao.area_id = area.id
      } else {
        erros.push(`Área "${questao.area_nome}" não encontrada`)
      }

      if (erros.length > 0) {
        questao.erro = `Linha ${index + 2}: ${erros.join(', ')}`
      }
    })
  }

  const uploadQuestoes = async () => {
    if (!user) return

    setUploading(true)
    setProgress(0)
    setErrors([])

    try {
      const questoesValidas = questoes.filter(q => !q.erro)
      
      if (questoesValidas.length === 0) {
        throw new Error('Nenhuma questão válida para upload')
      }

      // Upload em lotes de 10
      const batchSize = 10
      let sucessos = 0
      const errosUpload: string[] = []

      for (let i = 0; i < questoesValidas.length; i += batchSize) {
        const batch = questoesValidas.slice(i, i + batchSize)
        
        for (const questao of batch) {
          try {
            await adminService.criarQuestao({
              cargo_id: questao.cargo_id!,
              area_id: questao.area_id!,
              enunciado: questao.enunciado,
              alternativa_a: questao.alternativa_a,
              alternativa_b: questao.alternativa_b,
              alternativa_c: questao.alternativa_c,
              alternativa_d: questao.alternativa_d,
              alternativa_e: questao.alternativa_e,
              resposta_correta: questao.resposta_correta,
              feedback: questao.feedback,
              dificuldade: questao.dificuldade,
              fonte: questao.fonte
            })
            sucessos++
          } catch (error) {
            errosUpload.push(`Erro na questão "${questao.enunciado.substring(0, 50)}...": ${error.message}`)
          }
        }

        setProgress(Math.round(((i + batch.length) / questoesValidas.length) * 100))
      }

      // Log da ação
      await authService.logAction(user.id, 'bulk_upload_questoes', {
        total_questoes: questoesValidas.length,
        sucessos,
        erros: errosUpload.length,
        arquivo: file?.name
      })

      if (errosUpload.length > 0) {
        setErrors(errosUpload)
      }

      setSuccess(`Upload concluído! ${sucessos} questões inseridas com sucesso.`)
      
      // Limpar formulário
      setFile(null)
      setQuestoes([])
      setShowPreview(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      setErrors([`Erro no upload: ${error.message}`])
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const downloadTemplate = () => {
    const csvContent = [
      'cargo_nome,area_nome,enunciado,alternativa_a,alternativa_b,alternativa_c,alternativa_d,alternativa_e,resposta_correta,feedback,dificuldade,fonte',
      '"Agente de Educação Infantil","Língua Portuguesa","Exemplo de enunciado?","Alternativa A","Alternativa B","Alternativa C","Alternativa D","","A","Explicação da resposta correta","2","Banca HC Assessoria"'
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'template_questoes.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const questoesComErro = questoes.filter(q => q.erro)
  const questoesValidas = questoes.filter(q => !q.erro)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Upload em Lote de Questões</h2>
          <p className="text-gray-600">Importe múltiplas questões via arquivo CSV</p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={downloadTemplate}
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Baixar Template</span>
        </Button>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Selecionar Arquivo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              <FileText className="h-12 w-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium">Clique para selecionar arquivo CSV</p>
                <p className="text-sm text-gray-500">Ou arraste e solte aqui</p>
              </div>
            </label>
          </div>

          {file && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Arquivo selecionado: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
              </AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2">
            <Button 
              onClick={processFile} 
              disabled={!file || loading}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>{loading ? 'Processando...' : 'Processar e Visualizar'}</span>
            </Button>

            {file && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setFile(null)
                  setQuestoes([])
                  setShowPreview(false)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Erros encontrados:</strong>
            <ul className="mt-2 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">• {error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Success */}
      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Preview */}
      {showPreview && questoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Preview do Upload</span>
              <div className="text-sm space-x-4">
                <span className="text-green-600">Válidas: {questoesValidas.length}</span>
                <span className="text-red-600">Com erro: {questoesComErro.length}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Resumo */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Resumo do Upload:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>Total: {questoes.length}</div>
                <div className="text-green-600">Válidas: {questoesValidas.length}</div>
                <div className="text-red-600">Com erro: {questoesComErro.length}</div>
                <div>Taxa: {questoes.length > 0 ? Math.round((questoesValidas.length / questoes.length) * 100) : 0}%</div>
              </div>
            </div>

            {/* Questões com erro */}
            {questoesComErro.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-red-600 mb-3">Questões com Problemas:</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {questoesComErro.slice(0, 10).map((questao, index) => (
                    <div key={index} className="text-sm p-2 bg-red-50 rounded border border-red-200">
                      <strong>{questao.enunciado.substring(0, 50)}...</strong>
                      <div className="text-red-600 mt-1">{questao.erro}</div>
                    </div>
                  ))}
                  {questoesComErro.length > 10 && (
                    <div className="text-sm text-gray-500">
                      ... e mais {questoesComErro.length - 10} questões com erro
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Questões válidas (preview) */}
            {questoesValidas.length > 0 && (
              <div>
                <h3 className="font-medium text-green-600 mb-3">Preview das Questões Válidas:</h3>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {questoesValidas.slice(0, 3).map((questao, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-gray-600">
                          {questao.cargo_nome} • {questao.area_nome}
                        </div>
                        <div className="text-sm font-medium">
                          Resposta: {questao.resposta_correta}
                        </div>
                      </div>
                      <div className="font-medium mb-2">{questao.enunciado}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>A) {questao.alternativa_a}</div>
                        <div>B) {questao.alternativa_b}</div>
                        <div>C) {questao.alternativa_c}</div>
                        <div>D) {questao.alternativa_d}</div>
                      </div>
                    </div>
                  ))}
                  {questoesValidas.length > 3 && (
                    <div className="text-center text-gray-500">
                      ... e mais {questoesValidas.length - 3} questões
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fazendo upload...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                disabled={uploading}
              >
                Voltar
              </Button>
              
              <Button
                onClick={uploadQuestoes}
                disabled={questoesValidas.length === 0 || uploading}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>
                  {uploading 
                    ? 'Fazendo Upload...' 
                    : `Confirmar Upload (${questoesValidas.length} questões)`
                  }
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle>Instruções para Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div><strong>1.</strong> Baixe o template CSV clicando no botão "Baixar Template"</div>
          <div><strong>2.</strong> Preencha o arquivo com suas questões seguindo o formato exato</div>
          <div><strong>3.</strong> Certifique-se de que os nomes dos cargos e áreas existem no sistema</div>
          <div><strong>4.</strong> A resposta correta deve ser A, B, C, D ou E</div>
          <div><strong>5.</strong> Todos os campos são obrigatórios exceto alternativa_e e fonte</div>
          <div><strong>6.</strong> Use vírgula como separador e aspas duplas para textos com vírgula</div>
        </CardContent>
      </Card>
    </div>
  )
}