'use client'

import { motion } from 'framer-motion'
import { 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Palette 
} from 'lucide-react'

interface SectionWrapperProps {
  section: string
  icon: string
  title: string
  children: React.ReactNode
  expandedSection: string | null
  setExpandedSection: (section: string | null) => void
  index: number
  toggleSectionVisibility?: (section: string) => void
  isVisible?: boolean
  moveSection?: (sectionId: string, direction: 'up' | 'down') => void
  sectionOrder?: string[]
  showColorEditor?: string | null
  setShowColorEditor?: (section: string | null) => void
}

export function SectionWrapper({
  section,
  icon,
  title,
  children,
  expandedSection,
  setExpandedSection,
  index,
  toggleSectionVisibility,
  isVisible = true,
  moveSection,
  sectionOrder = [],
  showColorEditor,
  setShowColorEditor
}: SectionWrapperProps) {
  const isExpanded = expandedSection === section
  const canMoveUp = sectionOrder.length > 0 && sectionOrder.indexOf(section) > 0
  const canMoveDown = sectionOrder.length > 0 && sectionOrder.indexOf(section) < sectionOrder.length - 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden mb-4 ${!isVisible ? 'opacity-50' : ''}`}
    >
      {/* Header da Seção */}
      <div
        className="p-4 flex items-center justify-between bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setExpandedSection(isExpanded ? null : section)}
      >
        <div className="flex items-center gap-3">
          <GripVertical size={18} className="text-gray-400" />
          <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
            {index + 1}
          </span>
          <span className="text-xl">{icon}</span>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botão Cores */}
          {setShowColorEditor && (
            <button
              onClick={(e) => { 
                e.stopPropagation()
                setShowColorEditor(showColorEditor === section ? null : section) 
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-purple-600"
              title="Editar cores"
            >
              <Palette size={18} />
            </button>
          )}
          
          {/* Botão Visibilidade */}
          {toggleSectionVisibility && (
            <button
              onClick={(e) => { 
                e.stopPropagation()
                toggleSectionVisibility(section) 
              }}
              className={`p-2 rounded-lg transition-colors ${
                isVisible 
                  ? 'hover:bg-gray-200 text-gray-600' 
                  : 'bg-red-100 text-red-500'
              }`}
              title={isVisible ? 'Ocultar' : 'Mostrar'}
            >
              {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          )}
          
          {/* Setas de Ordenação */}
          {moveSection && (
            <>
              <button
                onClick={(e) => { 
                  e.stopPropagation()
                  moveSection(section, 'up') 
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={!canMoveUp}
                title="Mover para cima"
              >
                <ChevronUp size={18} />
              </button>
              <button
                onClick={(e) => { 
                  e.stopPropagation()
                  moveSection(section, 'down') 
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={!canMoveDown}
                title="Mover para baixo"
              >
                <ChevronDown size={18} />
              </button>
            </>
          )}
          
          {/* Ícone Expandir/Colapsar */}
          {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
      </div>

      {/* Conteúdo Colapsável */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="p-6 border-t"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  )
}

