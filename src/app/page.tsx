// src/app/page.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient'; // Importa nosso cliente
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Documentação:
  // Função que usa o Supabase Auth para tentar fazer o login.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Login bem-sucedido! Redirecionando...');
      // TODO: Redirecionar para o dashboard principal (ex: /admin/dashboard)
      // Por enquanto, apenas recarrega a página ou mostra a mensagem
      window.location.href = '/dashboard'; // (Vamos criar essa página em breve)
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          {/* Você pode querer uma logo específica para o admin aqui */}
          <Image
            src="/images/SVG/logotipo/logo preta.svg"
            alt="Facillit Hub Admin Logo"
            width={180}
            height={36}
            priority
          />
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Acesso ao Painel Admin
        </h2>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-3"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-3"
              placeholder="Sua senha"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-btn bg-gradient-to-r from-brand-primary to-brand-secondary py-3 px-4 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}
        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}