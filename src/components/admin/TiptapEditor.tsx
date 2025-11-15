// src/components/admin/TiptapEditor.tsx
"use client";

// 1. IMPORTAÇÕES CORRIGIDAS
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Code, Quote,
} from 'lucide-react';
// 2. IMPORTAÇÕES NOVAS DOS PACOTES QUE INSTALAMOS
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import { FloatingMenu } from '@tiptap/extension-floating-menu';

// Documentação:
// Este é o nosso componente de editor Tiptap.
// Ele recebe o 'content' (o texto) e uma função 'onChange'
// para atualizar o estado no componente pai (nossa página /legal).

interface TiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      // 3. REGISTRAR AS EXTENSÕES NO EDITOR
      BubbleMenu.configure({
        // Opções do tippy (tooltip)
        tippyOptions: {
          duration: 100,
        },
      }),
      FloatingMenu.configure({
        tippyOptions: {
          duration: 100,
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[200px] rounded-b-md border border-gray-300 bg-white p-4 shadow-sm',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-md border border-gray-300">
      {/* Menu de "Bolha" (aparece ao selecionar) */}
      <BubbleMenu
        editor={editor}
        // As opções tippy agora são configuradas na extensão (acima)
        className="flex gap-1 rounded-md bg-gray-900 p-2 shadow-lg"
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'rounded bg-brand-primary p-2 text-white' : 'rounded p-2 text-white/70 hover:bg-gray-700'}
        >
          <Bold className="h-5 w-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'rounded bg-brand-primary p-2 text-white' : 'rounded p-2 text-white/70 hover:bg-gray-700'}
        >
          <Italic className="h-5 w-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'rounded bg-brand-primary p-2 text-white' : 'rounded p-2 text-white/70 hover:bg-gray-700'}
        >
          <Strikethrough className="h-5 w-5" />
        </button>
      </BubbleMenu>

      {/* Menu Flutuante (aparece em linha vazia) */}
      <FloatingMenu
        editor={editor}
        className="flex flex-col gap-1 rounded-md bg-gray-900 p-2 shadow-lg"
      >
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="flex w-full items-center gap-2 rounded p-2 text-white/70 hover:bg-gray-700"
        >
          <span className="text-xl font-bold">T1</span> Título 1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="flex w-full items-center gap-2 rounded p-2 text-white/70 hover:bg-gray-700"
        >
          <span className="text-lg font-bold">T2</span> Título 2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="flex w-full items-center gap-2 rounded p-2 text-white/70 hover:bg-gray-700"
        >
          <List className="h-5 w-5" /> Lista
        </button>
      </FloatingMenu>

      {/* Onde o texto é realmente editado */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;