import { redirect } from 'next/navigation'

// Redirecionar página antiga de produtos para a homepage
export default function ProdutosPage() {
  redirect('/')
}
