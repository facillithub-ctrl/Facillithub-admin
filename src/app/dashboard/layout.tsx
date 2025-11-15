// src/app/dashboard/layout.tsx
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Documentação:
    // Verificamos a sessão do usuário no Supabase.
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (!session) {
        // Se NÃO houver sessão, manda para a página de login
        router.push('/');
      } else {
        // Se houver sessão, permite o acesso
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkSession();
  }, [router]);

  // Documentação:
  // Mostra um "loading" enquanto verificamos a sessão.
  // Isso evita que a página do dashboard apareça rapidamente antes do
  // redirecionamento (o "flash" de conteúdo).
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
      </div>
    );
  }

  // Documentação:
  // Se estiver autenticado, mostra o layout do admin (Sidebar + Conteúdo)
  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    );
  }

  // (Fallback caso o loading termine e não esteja autenticado - será redirecionado)
  return null;
}