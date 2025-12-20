'use client'

import { FadeInSection } from './FadeInSection'
import { ReactNode } from 'react'

interface FadeInSectionWrapperProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function FadeInSectionWrapper({ children, delay, className }: FadeInSectionWrapperProps) {
  return (
    <FadeInSection delay={delay} className={className}>
      {children}
    </FadeInSection>
  )
}

