'use client'

import { useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { ImageUploader } from './ImageUploader'
import Image from 'next/image'
import { GiftItem } from '@/types/service-detail'

interface GiftsManagerProps {
  value: GiftItem[]
  onChange: (items: GiftItem[]) => void
  label?: string
}

export function GiftsManager({ value = [], onChange, label = 'Presentes' }: GiftsManagerProps) {
  const generateId = () => `gift_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const handleAdd = () => {
    const newItem: GiftItem = {
      id: generateId(),
      title: '',
      description: '',
      image: '',
      badge_text: '',
    }
    onChange([...value, newItem])
  }

  const handleRemove = (index: number) => {
    const newItems = value.filter((_, i) => i !== index)
    onChange(newItems)
  }

  const handleUpdate = (index: number, field: keyof GiftItem, newValue: string) => {
    const newItems = [...value]
    newItems[index] = { ...newItems[index], [field]: newValue }
    onChange(newItems)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus size={16} className="mr-2" />
          Adicionar Presente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {value.map((item, index) => (
          <div key={item.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Presente {index + 1}</span>
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
                label="Título"
                value={item.title || ''}
                onChange={(e) => handleUpdate(index, 'title', e.target.value)}
                placeholder="Ex: Biblioteca de Execução"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={item.description || ''}
                  onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                  placeholder="Descrição do presente..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Imagem</label>
                <ImageUploader
                  value={item.image || ''}
                  onChange={(url) => handleUpdate(index, 'image', url)}
                  placeholder="Upload de imagem (PNG transparente recomendado)"
                  cropType="banner"
                  aspectRatio={16 / 9}
                />
                {item.image && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-gray-300">
                    <Image
                      src={item.image}
                      alt={item.title || 'Preview'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <Input
                label="Texto do Badge (Glassmorphism)"
                value={item.badge_text || ''}
                onChange={(e) => handleUpdate(index, 'badge_text', e.target.value)}
                placeholder="Ex: Orientação"
              />
            </div>
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="mb-4">Nenhum presente adicionado</p>
          <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
            <Plus size={16} className="mr-2" />
            Adicionar Primeiro Presente
          </Button>
        </div>
      )}
    </div>
  )
}

