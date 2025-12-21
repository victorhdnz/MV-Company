'use client'

import { useState } from 'react'
import { 
  Check, FileText, Calendar, Bell, Share2, Globe, 
  Search, Settings, Zap, Star, Heart, Shield,
  Award, Target, Rocket, Lightbulb, TrendingUp,
  Users, Briefcase, Code, Palette, Camera, Video,
  Music, Book, Mail, Phone, MapPin, Clock, Gift
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconSelectorProps {
  value?: string
  onChange: (iconName: string) => void
  label?: string
}

// Mapeamento de nomes de ícones para componentes
const iconMap: Record<string, React.ElementType> = {
  'check': Check,
  'file-text': FileText,
  'calendar': Calendar,
  'bell': Bell,
  'share': Share2,
  'globe': Globe,
  'search': Search,
  'settings': Settings,
  'zap': Zap,
  'star': Star,
  'heart': Heart,
  'shield': Shield,
  'award': Award,
  'target': Target,
  'rocket': Rocket,
  'lightbulb': Lightbulb,
  'trending-up': TrendingUp,
  'users': Users,
  'briefcase': Briefcase,
  'code': Code,
  'palette': Palette,
  'camera': Camera,
  'video': Video,
  'music': Music,
  'book': Book,
  'mail': Mail,
  'phone': Phone,
  'map-pin': MapPin,
  'clock': Clock,
  'gift': Gift,
}

const iconOptions = Object.keys(iconMap)

export function IconSelector({ value, onChange, label = 'Ícone' }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedIcon = value && iconMap[value] ? iconMap[value] : Check
  const SelectedIcon = selectedIcon

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between hover:border-gray-400 transition-colors"
        >
          <div className="flex items-center gap-3">
            <SelectedIcon size={20} className="text-gray-700" />
            <span className="text-sm text-gray-700">
              {value ? value.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Selecione um ícone'}
            </span>
          </div>
          <svg
            className={cn(
              "h-4 w-4 text-gray-500 transition-transform",
              isOpen && "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-auto">
              <div className="p-2 grid grid-cols-4 gap-2">
                {iconOptions.map((iconName) => {
                  const Icon = iconMap[iconName]
                  const isSelected = value === iconName
                  
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => {
                        onChange(iconName)
                        setIsOpen(false)
                      }}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all hover:bg-gray-50 flex items-center justify-center",
                        isSelected
                          ? "border-black bg-gray-100"
                          : "border-gray-200"
                      )}
                      title={iconName}
                    >
                      <Icon size={24} className={cn(
                        isSelected ? "text-black" : "text-gray-600"
                      )} />
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

