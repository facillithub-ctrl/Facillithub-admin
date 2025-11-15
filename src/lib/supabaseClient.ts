// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Documentação:
// Pegamos as variáveis do arquivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Documentação:
// Criamos e exportamos o cliente Supabase.
// O '!' no final diz ao TypeScript: "Confie em mim, essa variável existe".
export const supabase = createClient(supabaseUrl, supabaseAnonKey);