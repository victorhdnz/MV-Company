'use client'

import { useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from './Input'
import { NotificationIconSelector } from './NotificationIconSelector'
import { NotificationItem } from '@/components/homepage/NotificationsSection'

interface NotificationsManagerProps {
  value: NotificationItem[]
  onChange: (items: NotificationItem[]) => void
  label?: string
}

export function NotificationsManager({ value = [], onChange, label = 'Notificações' }: NotificationsManagerProps) {
  const generateId = () => `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const handleAdd = () => {
    const newItem: NotificationItem = {
      id: generateId(),
      name: '',
      description: '',
      icon: 'whatsapp',
      time: 'agora',
    }
    onChange([...value, newItem])
  }

  const handleRemove = (index: number) => {
    const newItems = value.filter((_, i) => i !== index)
    onChange(newItems)
  }

  const handleUpdate = (index: number, field: keyof NotificationItem, newValue: string) => {
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
          Adicionar Notificação
        </Button>
      </div>

      <div className="space-y-4">
        {value.map((item, index) => (
          <div key={item.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Notificação {index + 1}</span>
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
              <Input
                label="Título da Notificação"
                value={item.name || ''}
                onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                placeholder="Ex: Nova mensagem no WhatsApp"
              />
              <Input
                label="Descrição"
                value={item.description || ''}
                onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                placeholder="Ex: Cliente interessado em nossos serviços"
              />
              <NotificationIconSelector
                value={item.icon || 'whatsapp'}
                onChange={(icon) => handleUpdate(index, 'icon', icon)}
                label="Ícone"
              />
              <Input
                label="Tempo (ex: '2m atrás', 'agora', 'há 5min')"
                value={item.time || ''}
                onChange={(e) => handleUpdate(index, 'time', e.target.value)}
                placeholder="Ex: 2m atrás"
              />
            </div>
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="mb-4">Nenhuma notificação adicionada</p>
          <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
            <Plus size={16} className="mr-2" />
            Adicionar Primeira Notificação
          </Button>
        </div>
      )}
    </div>
  )
}

