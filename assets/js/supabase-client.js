/**
 * supabase-client.js — Cliente Supabase compartilhado
 * ---------------------------------------------------
 * Importa a biblioteca oficial do Supabase via CDN e cria
 * UMA instância usada por todas as páginas.
 *
 * O Supabase mantém a sessão automaticamente no localStorage.
 */

// Importa via CDN ESM (sem necessidade de bundler)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const config = window.ASTRI_CONFIG;
if (!config) {
  throw new Error('[Astri] config.js precisa carregar ANTES de supabase-client.js');
}
if (!config.SUPABASE_URL || config.SUPABASE_URL.includes('SEU_PROJETO')) {
  throw new Error('[Astri] SUPABASE_URL não configurado em config.js');
}

export const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // necessário para magic link callback
      flowType: 'pkce',         // OAuth2 PKCE: mais seguro que implicit
      storage: window.localStorage,
      storageKey: 'astri.auth.session',
    },
    global: {
      headers: {
        'x-application': 'astri-vagas-ri',
      },
    },
  }
);

/**
 * Helper: extrai mensagem amigável de erros do Supabase.
 */
export function formatError(err) {
  if (!err) return 'Erro desconhecido';

  // Erros conhecidos do Supabase Auth (em inglês) — traduzidos
  const map = {
    'Invalid login credentials': 'Email ou senha inválidos',
    'Email not confirmed': 'Email ainda não confirmado',
    'User already registered': 'Email já cadastrado',
    'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos.',
    'For security purposes, you can only request this after': 'Aguarde alguns segundos antes de tentar novamente',
  };

  const msg = err.message || err.error_description || String(err);
  for (const [en, pt] of Object.entries(map)) {
    if (msg.includes(en)) return pt;
  }
  return msg;
}

/**
 * Helper: log estruturado (não loga dados sensíveis).
 */
export function log(level, msg, extra = {}) {
  const safe = { ...extra };
  // Remove campos sensíveis caso vazem
  delete safe.password;
  delete safe.token;
  delete safe.access_token;
  delete safe.refresh_token;
  console[level](`[Astri] ${msg}`, safe);
}
