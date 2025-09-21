'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase';
import { 
  BookOpen, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  CheckCircle2,
  ArrowLeft,
  Play,
  AlertCircle
} from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (isLogin) {
        // Login logic
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.user) {
          // Atualizar último acesso
          await supabase
            .from('profiles')
            .update({ ultimo_acesso: new Date().toISOString() })
            .eq('id', data.user.id);

          router.push('/simulado');
        }
      } else {
        // Signup logic
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              nome: formData.name,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // Criar perfil do usuário (caso a trigger não funcione)
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: formData.email,
              nome: formData.name
            });

          // Ignorar erro se perfil já existe (trigger pode ter criado)
          if (profileError && !profileError.message.includes('duplicate key')) {
            throw profileError;
          }

          if (data.user.email_confirmed_at) {
            // Email já confirmado, redirecionar
            router.push('/simulado');
          } else {
            // Email precisa ser confirmado
            setSuccess('Verifique seu email para confirmar a conta antes de fazer login.');
            setIsLogin(true); // Trocar para tela de login
          }
        }
      }
      
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpar erros quando usuário digita
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SimuladosPro</h1>
          </Link>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Badge de Gratuito */}
          <div className="text-center mb-6">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              100% Gratuito
            </Badge>
          </div>

          {/* Card Principal */}
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Entrar na Conta' : 'Criar Conta Grátis'}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {isLogin 
                  ? 'Acesse sua conta para continuar seus estudos'
                  : 'Cadastre-se para salvar seu progresso e estatísticas'
                }
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Mensagens de erro e sucesso */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Nome (apenas no cadastro) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nome completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required={!isLogin}
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={isLogin ? "Sua senha" : "Mínimo 6 caracteres"}
                      minLength={!isLogin ? 6 : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-gray-500">
                      A senha deve ter pelo menos 6 caracteres
                    </p>
                  )}
                </div>

                {/* Botão de Submit */}
                <Button 
                  onClick={handleSubmit}
                  className="w-full py-3 text-lg"
                  disabled={loading || !formData.email || !formData.password || (!isLogin && !formData.name)}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {isLogin ? 'Entrando...' : 'Criando conta...'}
                    </div>
                  ) : (
                    <>
                      {isLogin ? 'Entrar' : 'Criar Conta Grátis'}
                    </>
                  )}
                </Button>
              </div>

              {/* Alternar entre Login e Cadastro */}
              <div className="text-center">
                <p className="text-gray-600">
                  {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                  <button
                    onClick={toggleMode}
                    className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {isLogin ? 'Cadastre-se grátis' : 'Faça login'}
                  </button>
                </p>
              </div>

              {/* Separador */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              {/* Botão para continuar sem cadastro */}
              <Link href="/simulado">
                <Button variant="outline" className="w-full py-3 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Continuar sem cadastro
                </Button>
              </Link>

              <p className="text-xs text-gray-500 text-center">
                Sem cadastro você pode fazer o simulado, mas não conseguirá salvar o progresso
              </p>
            </CardContent>
          </Card>

          {/* Benefícios do Cadastro */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-900 mb-3">
                Vantagens de ter uma conta:
              </h3>
              <div className="space-y-2">
                {[
                  'Salvar progresso dos simulados',
                  'Acompanhar evolução por área',
                  'Histórico completo de tentativas',
                  'Estatísticas detalhadas de desempenho'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center text-sm text-blue-800">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-blue-600" />
                    {benefit}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info do Concurso */}
          <div className="text-center mt-6 text-gray-600">
            <p className="text-sm">
              <strong>Concurso:</strong> Agente de Educação Infantil<br/>
              <strong>Local:</strong> São Lourenço do Oeste/SC<br/>
              <strong>Vagas:</strong> 42 | <strong>Salário:</strong> R$ 2.027,00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;