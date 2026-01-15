'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ReactNode } from 'react'

interface FadeInElementProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export const FadeInElement = ({ 
  children, 
  delay = 0, 
  className = '',
  direction = 'up'
}: FadeInElementProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: 20 }
      case 'down': return { opacity: 0, y: -20 }
      case 'left': return { opacity: 0, x: 20 }
      case 'right': return { opacity: 0, x: -20 }
      case 'none': return { opacity: 0 }
      default: return { opacity: 0, y: 20 }
    }
  }

  const getFinalPosition = () => {
    switch (direction) {
      case 'up':
      case 'down': return { opacity: 1, y: 0 }
      case 'left':
      case 'right': return { opacity: 1, x: 0 }
      case 'none': return { opacity: 1 }
      default: return { opacity: 1, y: 0 }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={inView ? getFinalPosition() : {}}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

