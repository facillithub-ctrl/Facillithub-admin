// src/components/admin/Sidebar.tsx
"use client";

import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, HelpCircle, Rss, LogOut, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function Sidebar() {
  const router = useRouter();

  // Documentação:
  // Função que usa o Supabase Auth para fazer logout
  // e redireciona o usuário de volta para a página de login.
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="flex h-full w-64 flex-col bg-white p-6 shadow-lg">
      <div className="mb-8 flex justify-center">
        {/* Usando a logo que já temos */}
        <Image
          src="/images/SVG/logotipo/logo preta.svg"
          alt="Facillit Hub Admin Logo"
          width={140}
          height={28}
          priority
        />
      </div>

      {/* flex-1 faz esta lista crescer para ocupar o espaço disponível */}
      <ul className="flex-1 space-y-2">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg p-3 font-medium text-gray-700 hover:bg-gray-100"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/blog"
            className="flex items-center gap-3 rounded-lg p-3 font-medium text-gray-700 hover:bg-gray-100"
          >
            <Rss className="h-5 w-5" />
            Blog
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/faqs"
            className="flex items-center gap-3 rounded-lg p-3 font-medium text-gray-700 hover:bg-gray-100"
          >
            <HelpCircle className="h-5 w-5" />
            FAQs
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/legal"
            className="flex items-center gap-3 rounded-lg p-3 font-medium text-gray-700 hover:bg-gray-100"
          >
            <FileText className="h-5 w-5" />
            Páginas Legais
          </Link>
        </li>
      </ul>

      {/* Este div é empurrado para o final por causa do flex-1 no <ul> */}
      <div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg p-3 font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </nav>
  );
}