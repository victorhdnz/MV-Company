import { redirect } from 'next/navigation'

// Redirecionar página antiga de checkout para homepage
export default function CheckoutPage() {
  redirect('/')
}

