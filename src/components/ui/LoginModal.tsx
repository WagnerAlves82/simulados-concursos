// src/components/ui/LoginModal.tsx - VERSÃO ATUALIZADA
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthProvider'
import { X, Lock, User, Mail, CheckCircle } from 'lucide-react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password, nome)

      if (error) {
        setError(error.message)
      } else {
        onSuccess?.()
        onClose()
      }
    } catch (err) {
      setError('Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  const beneficios = [
    "Acesso completo a todas as questões disponíveis no simulado",
    "Relatórios detalhados de desempenho e estatísticas por área de conhecimento", 
    "Histórico completo de simulados realizados com acompanhamento de evolução"
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Login Necessário
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Você chegou ao limite gratuito de 3 questões. Faça login para continuar estudando!
          </p>
        </CardHeader>
        <CardContent>
          {/* Benefícios do Login */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-3">Benefícios do cadastro gratuito:</h4>
            <ul className="space-y-2">
              {beneficios.map((beneficio, index) => (
                <li key={index} className="flex items-start text-sm text-blue-800">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{beneficio}</span>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
                        
            {!isLogin && (
              <Input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            )}
                        
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta Gratuita')}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}