import { redirect } from 'next/navigation'

// Redirecionar página antiga de catálogo para homepage
export default function CatalogoPage() {
  redirect('/')
}
