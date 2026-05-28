/**
 * auth.js — Autenticação e autorização
 * ------------------------------------
 * Funções para login (magic link), logout, verificação de
 * sessão e proteção de rotas admin.
 */

import { supabase, formatError, log } from './supabase-client.js';

/**
 * Envia magic link para o email informado.
 * O Supabase só envia para emails de usuários já cadastrados
 * (porque desabilitamos signup público — ver docs).
 */
export async function sendMagicLink(email) {
  if (!email || !email.includes('@')) {
    return { error: 'Email inválido' };
  }

  const redirectTo = window.location.origin + window.ASTRI_CONFIG.ROUTES.ADMIN;

  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      emailRedirectTo: redirectTo,
      // shouldCreateUser: false impede criação automática de conta
      // Apenas usuários previamente cadastrados pelo admin recebem o link
      shouldCreateUser: false,
    },
  });

  if (error) {
    log('warn', 'Falha no envio do magic link', { error: error.message });
    return { error: formatError(error) };
  }

  return { success: true };
}

/**
 * Faz logout, limpa sessão local.
 */
export async function logout() {
  try {
    await supabase.auth.signOut();
    log('info', 'Logout efetuado');
  } catch (e) {
    log('warn', 'Erro no logout (continuando)', { error: e.message });
  }
  // Garante limpeza local mesmo se signOut falhar (ex: offline)
  localStorage.removeItem('astri.auth.session');
  window.location.href = window.ASTRI_CONFIG.ROUTES.LOGIN;
}

/**
 * Retorna a sessão atual (ou null).
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Retorna o profile completo do usuário logado (com role).
 * Retorna null se não logado.
 */
export async function getCurrentProfile() {
  const session = await getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, is_active, last_login_at')
    .eq('id', session.user.id)
    .single();

  if (error) {
    log('error', 'Falha ao buscar profile', { error: error.message });
    return null;
  }
  return data;
}

/**
 * Verifica se o usuário atual é admin ativo.
 */
export async function isAdmin() {
  const profile = await getCurrentProfile();
  return profile?.role === 'admin' && profile?.is_active === true;
}

/**
 * GUARDA DE ROTA: chame no topo de toda página admin.
 *
 * Se o usuário não está logado OU não é admin, redireciona
 * para login. Retorna o profile se estiver tudo OK.
 *
 * Uso:
 *   import { requireAdmin } from './auth.js';
 *   const profile = await requireAdmin();
 *   // se chegou aqui, é admin
 */
export async function requireAdmin() {
  const profile = await getCurrentProfile();

  if (!profile) {
    log('info', 'Acesso admin negado: sem sessão');
    redirectToLogin('Faça login para acessar');
    return null;
  }

  if (profile.role !== 'admin' || !profile.is_active) {
    log('warn', 'Acesso admin negado: usuário sem privilégios', { email: profile.email });
    redirectToLogin('Você não tem permissão para acessar o painel');
    return null;
  }

  // Atualiza last_login_at (best-effort, ignora erro)
  supabase
    .from('profiles')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', profile.id)
    .then(() => {});

  // Registra evento de login (best-effort)
  supabase.rpc('log_admin_event', {
    p_event_type: 'auth.login',
    p_metadata: { user_agent: navigator.userAgent.substring(0, 200) },
  }).then(() => {});

  return profile;
}

function redirectToLogin(reason) {
  const url = new URL(window.ASTRI_CONFIG.ROUTES.LOGIN, window.location.origin);
  if (reason) url.searchParams.set('reason', reason);
  window.location.href = url.toString();
}

/**
 * Idle timeout: faz logout automático após inatividade.
 * Chame uma vez em páginas admin.
 */
export function startIdleTimeout() {
  let timer;
  const timeout = window.ASTRI_CONFIG.ADMIN_IDLE_TIMEOUT;

  function reset() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      log('info', 'Sessão expirada por inatividade');
      logout();
    }, timeout);
  }

  ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
    document.addEventListener(evt, reset, { passive: true });
  });

  reset();
}

/**
 * Listener de mudanças de auth (logout em outras abas, expiração, etc).
 */
export function setupAuthListener(onChange) {
  return supabase.auth.onAuthStateChange((event, session) => {
    log('info', `Auth event: ${event}`);
    if (onChange) onChange(event, session);
  });
}
