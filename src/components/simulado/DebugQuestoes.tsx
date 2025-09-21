'use client'

import React from 'react'
import { useQuestoes } from '@/hooks/useQuestoes'

export default function DebugQuestoes() {
  const { questoes, areas, loading, error, debug, estatisticas } = useQuestoes(1)
  
  return (
    <div className="fixed top-4 right-4 bg-white border-2 border-red-300 p-4 rounded-lg shadow-lg max-w-sm z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-red-700">🔍 Debug Hook</h3>
        <div className="text-xs bg-red-100 px-2 py-1 rounded">
          Cargo: {debug?.cargoId}
        </div>
      </div>
      
      <div className="text-xs space-y-2">
        {/* Status Principal */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-2 rounded ${loading ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <div className="font-medium">Loading</div>
            <div>{loading ? 'SIM' : 'NÃO'}</div>
          </div>
          <div className={`p-2 rounded ${error ? 'bg-red-100' : 'bg-green-100'}`}>
            <div className="font-medium">Error</div>
            <div>{error ? 'SIM' : 'NÃO'}</div>
          </div>
        </div>

        {/* Contadores */}
        <div className="bg-blue-50 p-2 rounded">
          <div className="font-medium mb-1">Contadores:</div>
          <div>Questões: <strong>{questoes.length}</strong></div>
          <div>Áreas: <strong>{areas.length}</strong></div>
          <div>isReady: <strong>{debug?.isReady ? 'SIM' : 'NÃO'}</strong></div>
        </div>

        {/* Erro Detalhado */}
        {error && (
          <div className="bg-red-50 p-2 rounded border border-red-200">
            <div className="font-medium text-red-700 mb-1">Erro:</div>
            <div className="text-red-600 text-xs">{error}</div>
          </div>
        )}

        {/* Debug Expandido */}
        {debug && (
          <div className="bg-gray-50 p-2 rounded">
            <div className="font-medium mb-1">Debug Info:</div>
            <div>LastCargoId: {debug.lastCargoId}</div>
            <div>Total Questões: {debug.totalQuestoes}</div>
            <div>Total Áreas: {debug.totalAreas}</div>
          </div>
        )}

        {/* Questões por Área */}
        {debug?.questoesPorArea && Object.keys(debug.questoesPorArea).length > 0 && (
          <div className="bg-green-50 p-2 rounded">
            <div className="font-medium mb-1">Por Área:</div>
            {Object.entries(debug.questoesPorArea).map(([area, qtd]) => (
              <div key={area} className="text-xs">
                {area}: {qtd}
              </div>
            ))}
          </div>
        )}

        {/* Áreas Configuradas */}
        {debug?.areasConfiguradas && debug.areasConfiguradas.length > 0 && (
          <div className="bg-purple-50 p-2 rounded">
            <div className="font-medium mb-1">Áreas Config:</div>
            {debug.areasConfiguradas.map(area => (
              <div key={area.id} className="text-xs">
                {area.nome}: {area.questoesConfiguradas}
              </div>
            ))}
          </div>
        )}

        {/* Amostra de Questões */}
        {debug?.amostraQuestoes && debug.amostraQuestoes.length > 0 && (
          <div className="bg-yellow-50 p-2 rounded">
            <div className="font-medium mb-1">Amostra:</div>
            {debug.amostraQuestoes.map(q => (
              <div key={q.id} className="text-xs mb-1">
                #{q.id} ({q.area}): {q.enunciado}
              </div>
            ))}
          </div>
        )}

        {/* Botão de Atualizar */}
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
        >
          🔄 Recarregar Página
        </button>
      </div>
    </div>
  )
}