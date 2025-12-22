'use client'

import { useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from './Input'
import { ImageUploader } from './ImageUploader'
import { CardSwapItem } from '@/types/service-detail'

interface CardSwapManagerProps {
  value: CardSwapItem[]
  onChange: (items: CardSwapItem[]) => void
  label?: string
}

export function CardSwapManager({ value = [], onChange, label = 'Cards de Animação' }: CardSwapManagerProps) {
  const generateId = () => `card_swap_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const handleAdd = () => {
    const newItem: CardSwapItem = {
      id: generateId(),
      title: '',
      description: '',
      image: '',
    }
    onChange([...value, newItem])
  }

  const handleRemove = (index: number) => {
    const newItems = value.filter((_, i) => i !== index)
    onChange(newItems)
  }

  const handleUpdate = (index: number, field: keyof CardSwapItem, newValue: string) => {
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
                <Layers size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Card {index + 1}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Mover para cima"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === value.length - 1}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <Input
                label="Título do Card"
                value={item.title || ''}
                onChange={(e) => handleUpdate(index, 'title', e.target.value)}
                placeholder="Ex: Smooth"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={item.description || ''}
                  onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                  placeholder="Descrição do card..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem (Opcional)</label>
                <ImageUploader
                  value={item.image || ''}
                  onChange={(url) => handleUpdate(index, 'image', url)}
                  placeholder="Clique para fazer upload de uma imagem"
                  cropType="custom"
                  recommendedDimensions="Recomendado: 500x400px ou proporção similar"
                />
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

