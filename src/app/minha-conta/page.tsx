import { redirect } from 'next/navigation'

// Redirecionar página antiga de minha conta para homepage
export default function MinhaContaPage() {
  redirect('/')
}

