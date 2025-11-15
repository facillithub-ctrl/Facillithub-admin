// src/app/dashboard/legal/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Plus, Edit, Trash } from 'lucide-react';
// 1. CORREÇÃO DO TIPTAP: Importa o 'dynamic' do Next.js
import dynamic from 'next/dynamic';

// 2. CORREÇÃO DO TIPTAP: Carrega o TiptapEditor dinamicamente
// Isso garante que ele NUNCA seja renderizado no servidor, corrigindo o erro de SSR.
const TiptapEditor = dynamic(() => import('@/components/admin/TiptapEditor'), {
  ssr: false, // Fundamental: desliga o Server-Side Rendering para este componente
  loading: () => (
    <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-gray-300 bg-white">
      <Loader2 className="animate-spin" />
    </div>
  ),
});

// Definição do Tipo (Interface)
type LegalPage = {
  id: string;
  title: string;
  slug: string;
  content: string;
  icon: string | null;
  external_reference: string | null;
  created_at: string;
};

export default function LegalAdminPage() {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Loading separado
  const [error, setError] = useState<string | null>(null);

  // Estados do Formulário
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [pageData, setPageData] = useState({
    title: '',
    slug: '',
    icon: '',
    external_reference: '',
    content: '',
  });

  // 3. CORREÇÃO DO SUPABASE: Movido `.schema('cms')` para o final da query
  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .order('created_at', { ascending: false })
      .schema('cms'); // <-- LOCAL CORRETO É NO FINAL

    if (error) {
      setError(error.message);
    } else {
      setPages(data as LegalPage[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleShowNewForm = () => {
    setIsEditing(null);
    setPageData({
      title: '',
      slug: '',
      icon: '',
      external_reference: '',
      content: '',
    });
    setIsFormVisible(true);
  };

  const handleSelectToEdit = (page: LegalPage) => {
    setIsEditing(page.id);
    setPageData({
      title: page.title,
      slug: page.slug,
      icon: page.icon || '',
      external_reference: page.external_reference || '',
      content: page.content || '',
    });
    setIsFormVisible(true);
    window.scrollTo(0, 0);
  };

  // 3. CORREÇÃO DO SUPABASE: Movido `.schema('cms')` para o final da query
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      const { error } = await supabase
        .from('legal_pages')
        .delete()
        .match({ id })
        .schema('cms'); // <-- LOCAL CORRETO É NO FINAL
      if (error) {
        setError(error.message);
      } else {
        fetchPages(); // Recarrega a lista
      }
    }
  };

  // 3. CORREÇÃO DO SUPABASE: Movido `.schema('cms')` para o final da query
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);

    const dataToSubmit = {
      title: pageData.title,
      slug: pageData.slug,
      content: pageData.content,
      icon: pageData.icon || null,
      external_reference: pageData.external_reference || null,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (isEditing) {
      // MODO UPDATE
      const { error: updateError } = await supabase
        .from('legal_pages')
        .update(dataToSubmit)
        .match({ id: isEditing })
        .schema('cms'); // <-- LOCAL CORRETO É NO FINAL
      error = updateError;
    } else {
      // MODO INSERT
      const { error: insertError } = await supabase
        .from('legal_pages')
        .insert(dataToSubmit)
        .schema('cms'); // <-- LOCAL CORRETO É NO FINAL
      error = insertError;
    }

    if (error) {
      setError(error.message);
      if (error.message.includes('unique constraint')) {
        setError('Erro: O "Slug (URL)" já existe. Ele deve ser único.');
      }
    } else {
      setIsFormVisible(false);
      fetchPages();
    }
    setLoadingSubmit(false);
  };

  const handleContentChange = (newContent: string) => {
    setPageData((prev) => ({ ...prev, content: newContent }));
  };

  return (
    <div>
      {/* --- TÍTULO DA PÁGINA E BOTÃO DE ADICIONAR --- */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-title text-3xl font-bold text-gray-900">
          Gerenciar Páginas Legais
        </h1>
        {!isFormVisible && (
          <button
            onClick={handleShowNewForm}
            className="flex items-center gap-2 rounded-btn bg-brand-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary/90"
          >
            <Plus className="h-5 w-5" />
            Novo Documento
          </button>
        )}
      </div>

      {/* --- MENSAGEM DE ERRO --- */}
      {error && (
        <div className="my-4 rounded-md bg-red-100 p-4 text-red-700">
          <p className="font-bold">Erro:</p>
          <p>{error}</p>
        </div>
      )}

      {/* --- SEÇÃO DO FORMULÁRIO (OCULTÁVEL) --- */}
      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg bg-white p-6 shadow mb-8 space-y-6"
        >
          <h2 className="font-title text-2xl font-semibold">
            {isEditing ? 'Editando Documento' : 'Novo Documento'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título (ex: "Termos de Uso")
              </label>
              <input
                type="text"
                required
                value={pageData.title}
                onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm"
              />
            </div>

            {/* Slug (URL) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug (URL) (ex: "termos-de-uso")
              </label>
              <input
                type="text"
                required
                value={pageData.slug}
                onChange={(e) => setPageData({ ...pageData, slug: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ícone (Lucide) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ícone (Nome do Lucide, ex: "FileText")
              </label>
              <input
                type="text"
                value={pageData.icon || ''}
                onChange={(e) => setPageData({ ...pageData, icon: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm"
              />
            </div>

            {/* Referência Externa */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Referência Externa (ex: "Fonte: Lei...")
              </label>
              <input
                type="text"
                value={pageData.external_reference || ''}
                onChange={(e) => setPageData({ ...pageData, external_reference: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm"
              />
            </div>
          </div>

          {/* Editor de Texto Tiptap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo Principal
            </label>
            <TiptapEditor
              content={pageData.content}
              onChange={handleContentChange}
            />
          </div>
          
          {/* Botões de Ação */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loadingSubmit}
              className="flex items-center gap-2 rounded-btn bg-brand-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary/90 disabled:opacity-50"
            >
              {loadingSubmit ? <Loader2 className="animate-spin" /> : (isEditing ? 'Salvar Alterações' : 'Criar Documento')}
            </button>
            <button
              type="button"
              onClick={() => setIsFormVisible(false)}
              className="rounded-btn bg-gray-200 px-5 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* --- LISTA DE DOCUMENTOS EXISTENTES --- */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="font-title text-xl font-semibold mb-4">
          Documentos Publicados
        </h3>
        {loading && pages.length === 0 ? (
          <div className="flex justify-center p-4">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pages.map((page) => (
              <li
                key={page.id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="text-lg font-medium text-brand-primary">
                    {page.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    /{page.slug}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSelectToEdit(page)}
                    className="p-2 text-gray-600 hover:text-brand-primary"
                    title="Editar"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                    title="Excluir"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}