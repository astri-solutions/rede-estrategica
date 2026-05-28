/**
 * leads-api.js — Captura e gestão de leads
 * ----------------------------------------
 * Funções para a LP (captura) e admin (listagem).
 */

import { supabase, formatError, log } from './supabase-client.js';

/**
 * PÚBLICO: captura lead a partir do formulário da LP.
 * Retorna um token de acesso para a página de vagas.
 *
 * Esta função chama o RPC `capture_lead` no Supabase,
 * que faz validação server-side e gera o token.
 */
export async function captureLead({
  email,
  fullName,
  phone,
  linkedinUrl,
  company,
  jobTitle,
  message,
  consentMarketing = false,
  utm = {},
}) {
  if (!email) return { error: 'Email obrigatório' };

  const { data, error } = await supabase.rpc('capture_lead', {
    p_email: email.trim().toLowerCase(),
    p_full_name: fullName?.trim() || null,
    p_phone: phone?.trim() || null,
    p_linkedin_url: linkedinUrl?.trim() || null,
    p_company: company?.trim() || null,
    p_job_title: jobTitle?.trim() || null,
    p_message: message?.trim() || null,
    p_consent_marketing: consentMarketing,
    p_utm_source: utm.source || null,
    p_utm_medium: utm.medium || null,
    p_utm_campaign: utm.campaign || null,
  });

  if (error) {
    log('error', 'Falha ao capturar lead', { error: error.message });
    return { error: formatError(error) };
  }

  // O RPC retorna um array com um único objeto {success, token, message}
  const result = Array.isArray(data) ? data[0] : data;
  if (!result?.success) {
    return { error: result?.message || 'Não foi possível processar o cadastro' };
  }

  return {
    token: result.token,
    message: result.message,
  };
}

/**
 * PÚBLICO: valida se um token é válido (sem expor detalhes).
 * Usado pela página de vagas para gate.
 */
export async function validateAccessToken(token) {
  if (!token || typeof token !== 'string' || token.length < 16) {
    return false;
  }

  const { data, error } = await supabase.rpc('validate_access_token', {
    p_token: token,
  });

  if (error) {
    log('warn', 'Falha ao validar token', { error: error.message });
    return false;
  }
  return data === true;
}

/**
 * PÚBLICO: registra evento de lead (page view, click).
 * Best-effort: nunca quebra o fluxo se falhar.
 */
export async function logLeadEvent(token, eventType, targetId = null, metadata = {}) {
  try {
    await supabase.rpc('log_lead_event', {
      p_token: token,
      p_event_type: eventType,
      p_target_id: targetId,
      p_metadata: metadata,
    });
  } catch (e) {
    // Silencioso, é tracking
  }
}

/**
 * ADMIN: lista leads cadastrados.
 */
export async function listLeads({ limit = 100, offset = 0 } = {}) {
  const { data, error, count } = await supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    log('error', 'Falha ao listar leads', { error: error.message });
    return { error: formatError(error) };
  }
  return { data: data || [], total: count || 0 };
}

/**
 * ADMIN: estatísticas do dashboard.
 */
export async function getDashboardStats() {
  const { data, error } = await supabase
    .from('admin_dashboard_stats')
    .select('*')
    .single();

  if (error) {
    log('error', 'Falha ao buscar stats', { error: error.message });
    return null;
  }
  return data;
}

/**
 * ADMIN: lista eventos do audit log.
 */
export async function listAuditLog({ limit = 50, eventType = null } = {}) {
  let query = supabase
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (eventType) query = query.eq('event_type', eventType);

  const { data, error } = await query;
  if (error) {
    log('error', 'Falha ao listar audit log', { error: error.message });
    return { error: formatError(error) };
  }
  return { data: data || [] };
}
