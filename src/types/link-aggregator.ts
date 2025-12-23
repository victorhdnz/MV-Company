/**
 * Tipos para o agregador de links (link-in-bio)
 */

export interface LinkAggregator {
  id: string
  user_id: string
  name: string // Nome do agregador (ex: "Victor Diniz", "Maria Silva")
  slug: string // URL única (ex: "victor-diniz", "maria-silva")
  main_title?: string // Título principal com efeito Portfolio (ex: "Portfolio")
  main_title_letter?: string // Letra a ser substituída pela animação (padrão: "o")
  profile_image?: string // URL da imagem de perfil
  profile_name?: string // Nome exibido no perfil
  homepage_button_enabled?: boolean
  homepage_button_title?: string // Título do botão para homepage
  homepage_button_url?: string // URL do botão para homepage
  links?: LinkItem[]
  social_links?: SocialLink[]
  created_at: string
  updated_at: string
}

export interface LinkItem {
  id: string
  title: string // Ex: "TikTok", "Instagram", "Contato"
  description?: string // Ex: "Rede social", "Clique para copiar email"
  url: string // URL de redirecionamento
  icon?: string // Nome do ícone (lucide-react) ou URL de imagem
  icon_type?: 'lucide' | 'image' | 'custom' // Tipo de ícone
  order: number // Ordem de exibição
  enabled?: boolean
}

export interface SocialLink {
  id: string
  platform: string // Ex: "github", "instagram", "tiktok", "email"
  url: string
  icon?: string // Nome do ícone ou URL
  order: number
  enabled?: boolean
}

