import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarTempo(segundos: number): string {
  const horas = Math.floor(segundos / 3600)
  const mins = Math.floor((segundos % 3600) / 60)
  const secs = segundos % 60
  return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function embaralharArray<T>(array: T[]): T[] {
  const resultado = [...array]
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[resultado[i], resultado[j]] = [resultado[j], resultado[i]]
  }
  return resultado
}

export function calcularPercentual(acertos: number, total: number): number {
  if (total === 0) return 0
  return Math.round((acertos / total) * 100)
}

export function obterCorPorPercentual(percentual: number): string {
  if (percentual >= 80) return 'text-green-600'
  if (percentual >= 70) return 'text-blue-600'  
  if (percentual >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

export function formatarData(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  })
}

export function formatarDataHora(data: string): string {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
