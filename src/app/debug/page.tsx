'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface DiagnosticResult {
  test: string
  status: 'success' | 'error' | 'warning' | 'info'
  message: string
  details?: any
}

export default function ProjectDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(false)
  const [projectStructure, setProjectStructure] = useState<string>('')

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result])
  }

  const runDiagnostics = async () => {
    setResults([])
    setLoading(true)

    try {
      // 1. Teste de Variáveis de Ambiente
      addResult({
        test: '🔧 Variáveis de Ambiente',
        status: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'success' : 'error',
        message: process.env.NEXT_PUBLIC_SUPABASE_URL 
          ? 'NEXT_PUBLIC_SUPABASE_URL encontrada' 
          : 'NEXT_PUBLIC_SUPABASE_URL não encontrada',
        details: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ Ausente',
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ Ausente'
        }
      })

      // 2. Teste de Import do Supabase
      try {
        const supabase = createClient()
        addResult({
          test: '📦 Cliente Supabase',
          status: 'success',
          message: 'Cliente Supabase criado com sucesso',
          details: { client: 'Inicializado' }
        })

        // 3. Teste de Conexão
        try {
          const { data, error } = await supabase
            .from('questoes')
            .select('id')
            .limit(1)

          if (error) {
            addResult({
              test: '🌐 Conexão Database',
              status: 'error',
              message: 'Erro na conexão com o banco',
              details: {
                error: error.message,
                code: error.code,
                hint: error.hint
              }
            })
          } else {
            addResult({
              test: '🌐 Conexão Database',
              status: 'success',
              message: `Conexão bem-sucedida - ${data?.length || 0} registros encontrados`,
              details: { data }
            })
          }
        } catch (dbError) {
          addResult({
            test: '🌐 Conexão Database',
            status: 'error',
            message: 'Erro de rede ou configuração',
            details: { error: dbError }
          })
        }

        // 4. Teste das Tabelas
        const tables = ['questoes', 'areas_conhecimento', 'cargo_areas', 'cargos']
        for (const table of tables) {
          try {
            const { data, error } = await supabase
              .from(table)
              .select('*')
              .limit(1)

            addResult({
              test: `🗄️ Tabela: ${table}`,
              status: error ? 'error' : 'success',
              message: error 
                ? `Erro ao acessar tabela ${table}` 
                : `Tabela ${table} acessível - ${data?.length || 0} registros`,
              details: error || { count: data?.length || 0 }
            })
          } catch (tableError) {
            addResult({
              test: `🗄️ Tabela: ${table}`,
              status: 'error',
              message: `Erro ao acessar ${table}`,
              details: { error: tableError }
            })
          }
        }

        // 5. Teste de Estrutura de Dados
        try {
          const { data: questaoSample } = await supabase
            .from('questoes')
            .select('*')
            .limit(1)
            .single()

          if (questaoSample) {
            addResult({
              test: '📋 Estrutura de Dados',
              status: 'info',
              message: 'Exemplo de questão encontrada',
              details: {
                campos: Object.keys(questaoSample),
                amostra: questaoSample
              }
            })
          }
        } catch (structError) {
          addResult({
            test: '📋 Estrutura de Dados',
            status: 'warning',
            message: 'Não foi possível obter estrutura',
            details: { error: structError }
          })
        }

      } catch (clientError) {
        addResult({
          test: '📦 Cliente Supabase',
          status: 'error',
          message: 'Erro ao criar cliente Supabase',
          details: { error: clientError }
        })
      }

      // 6. Teste de Hooks
      try {
        // Simular import do hook
        addResult({
          test: '🎣 Custom Hooks',
          status: 'info',
          message: 'Hook useQuestoes disponível para teste',
          details: { location: '/hooks/useQuestoes.ts' }
        })
      } catch (hookError) {
        addResult({
          test: '🎣 Custom Hooks',
          status: 'error',
          message: 'Erro nos custom hooks',
          details: { error: hookError }
        })
      }

      // 7. Informações do Sistema
      addResult({
        test: '💻 Informações do Sistema',
        status: 'info',
        message: 'Informações do ambiente',
        details: {
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
          node_env: process.env.NODE_ENV,
          timestamp: new Date().toISOString()
        }
      })

    } catch (globalError) {
      addResult({
        test: '💥 Erro Geral',
        status: 'error',
        message: 'Erro não capturado no diagnóstico',
        details: { error: globalError }
      })
    }

    setLoading(false)
  }

  // Gerar estrutura do projeto sugerida
  const generateProjectStructure = () => {
    const structure = `
📁 seu-projeto/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 (auth)/
│   │   │   └── 📁 login/
│   │   │       └── page.tsx
│   │   ├── 📁 dashboard/
│   │   │   └── page.tsx
│   │   ├── 📁 simulado/
│   │   │   └── page.tsx
│   │   ├── 📁 api/
│   │   │   └── 📁 questoes/
│   │   │       ├── route.ts
│   │   │       └── 📁 [cargoId]/
│   │   │           └── route.ts
│   │   ├── 📁 components/
│   │   │   ├── 📁 auth/
│   │   │   ├── 📁 shared/
│   │   │   ├── 📁 simulado/
│   │   │   └── 📁 ui/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── 📁 hooks/
│   │   ├── useAuthUser.ts
│   │   ├── useQuestoes.ts
│   │   └── useTimer.ts
│   │
│   ├── 📁 lib/
│   │   ├── supabase.ts
│   │   ├── questoesServices.ts
│   │   ├── utils.ts
│   │   └── types.ts
│   │
│   └── 📁 contexts/
│       └── AuthProvider.tsx
│
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json

📋 ARQUIVOS ESSENCIAIS:

1. .env.local:
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica

2. src/lib/supabase.ts:
'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

3. src/hooks/useQuestoes.ts:
'use client'
import { useState, useEffect } from 'react'

4. Componentes com 'use client' no topo
`
    setProjectStructure(structure)
  }

  useEffect(() => {
    generateProjectStructure()
  }, [])

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '❓'
    }
  }

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'error': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'info': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔍 Diagnóstico do Projeto
        </h1>
        <p className="text-gray-600">
          Análise completa da estrutura e configuração do projeto
        </p>
      </div>

      {/* Botão de Diagnóstico */}
      <div className="text-center">
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? '🔄 Executando Diagnóstico...' : '🚀 Executar Diagnóstico'}
        </button>
      </div>

      {/* Resultados */}
      {results.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">📊 Resultados do Diagnóstico</h2>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getStatusIcon(result.status)}</span>
                    <div className="flex-1">
                      <h3 className="font-medium">{result.test}</h3>
                      <p className="text-sm mt-1">{result.message}</p>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs font-medium">
                            Ver detalhes
                          </summary>
                          <pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estrutura Sugerida */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">📁 Estrutura Recomendada</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-xs font-mono whitespace-pre-wrap text-gray-700">
                {projectStructure}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">
          📝 Como usar este diagnóstico:
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Execute o diagnóstico clicando no botão acima</li>
          <li>Analise os resultados - erros em vermelho precisam ser corrigidos</li>
          <li>Verifique se as variáveis de ambiente estão configuradas</li>
          <li>Confirme se as tabelas existem no Supabase</li>
          <li>Compare sua estrutura com a recomendada</li>
          <li>Compartilhe os resultados para obter ajuda específica</li>
        </ol>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        💡 Este componente pode ser usado em: <code>/app/debug/page.tsx</code>
      </div>
    </div>
  )
}