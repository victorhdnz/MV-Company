import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

// Layout específico para páginas de agregador de links
// Não renderiza Header e Footer para manter o design limpo
export default function LinksLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#000',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

