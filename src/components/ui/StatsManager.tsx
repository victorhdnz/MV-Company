'use client'

import { useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from './Input'
import { StatsItem } from '@/types/service-detail'

interface StatsManagerProps {
  value: StatsItem[]
  onChange: (items: StatsItem[]) => void
  label?: string
}

export function StatsManager({ value = [], onChange, label = 'Cards de Estatísticas' }: StatsManagerProps) {
  const generateId = () => `stats_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const handleAdd = () => {
    const newItem: StatsItem = {
      id: generateId(),
      target: 1000,
      label: 'Views',
      duration: 2000,
    }
    onChange([...value, newItem])
  }

  const handleRemove = (index: number) => {
    const newItems = value.filter((_, i) => i !== index)
    onChange(newItems)
  }

  const handleUpdate = (index: number, field: keyof StatsItem, newValue: string | number) => {
    const newItems = [...value]
    newItems[index] = { ...newItems[index], [field]: newValue }
    onChange(newItems)
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= value.length) return

    const newItems = [...value]
    const [removed] = newItems.splice(index, 1)
    newItems.splice(newIndex, 0, removed)
    onChange(newItems)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus size={16} className="mr-2" />
          Adicionar Card
        </Button>
      </div>

      <div className="space-y-4">
        {value.map((item, index) => (
          <div key={item.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Card {index + 1}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                    title="Mover para cima"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === value.length - 1}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                    title="Mover para baixo"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Número Alvo</label>
                <input
                  type="number"
                  value={item.target || 0}
                  onChange={(e) => handleUpdate(index, 'target', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 777000"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Número que será animado no card (ex: 777000 será exibido como "777k")
                </p>
              </div>
              <Input
                label="Label (Texto abaixo do número)"
                value={item.label || ''}
                onChange={(e) => handleUpdate(index, 'label', e.target.value)}
                placeholder="Ex: Views, Clientes, Projetos"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Duração da Animação (ms)</label>
                <input
                  type="number"
                  value={item.duration || 2000}
                  onChange={(e) => handleUpdate(index, 'duration', parseInt(e.target.value) || 2000)}
                  placeholder="2000"
                  min="500"
                  max="10000"
                  step="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tempo em milissegundos para a animação contar até o número alvo (padrão: 2000ms)
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="mb-4">Nenhum card adicionado</p>
          <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
            <Plus size={16} className="mr-2" />
            Adicionar Primeiro Card
          </Button>
        </div>
      )}
    </div>
  )
}

