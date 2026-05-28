/**
 * jobs-api.js — API de vagas
 * --------------------------
 * Operações sobre vagas: listar (público), criar, editar,
 * publicar/despublicar, deletar (admin).
 *
 * O RLS no banco garante que apenas admins consigam mutar.
 * Aqui não precisamos verificar permissão — o banco recusa.
 */

import { supabase, formatError, log } from './supabase-client.js';

/**
 * PÚBLICO: lista vagas publicadas (ordenadas por mais recentes).
 * Retorna array vazio em caso de erro.
 */
export async function listPublishedJobs({ search = '' } = {}) {
  let query = supabase
    .from('jobs')
    .select('id, title, company, location, description, external_url, published_at, source')
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false });

  if (search && search.trim()) {
    const q = search.trim();
    // Busca em título, empresa e localização (case-insensitive)
    query = query.or(
      `title.ilike.%${q}%,company.ilike.%${q}%,location.ilike.%${q}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    log('error', 'Falha ao listar vagas públicas', { error: error.message });
    return [];
  }
  return data || [];
}

/**
 * ADMIN: lista TODAS as vagas (publicadas + não publicadas).
 * RLS filtra: só admin enxerga as não publicadas.
 */
export async function listAllJobs({ filter = 'all' } = {}) {
  let query = supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (filter === 'published') query = query.eq('is_published', true);
  if (filter === 'unpublished') query = query.eq('is_published', false);

  const { data, error } = await query;

  if (error) {
    log('error', 'Falha ao listar vagas', { error: error.message });
    return { error: formatError(error) };
  }
  return { data: data || [] };
}

/**
 * ADMIN: criar nova vaga.
 */
export async function createJob(payload) {
  const clean = sanitizeJobPayload(payload);
  const validationError = validateJobPayload(clean);
  if (validationError) return { error: validationError };

  const { data, error } = await supabase
    .from('jobs')
    .insert([{ ...clean, is_published: true }])  // já publicada ao criar
    .select()
    .single();

  if (error) {
    log('error', 'Falha ao criar vaga', { error: error.message });
    return { error: formatError(error) };
  }
  return { data };
}

/**
 * ADMIN: atualizar vaga existente.
 */
export async function updateJob(id, payload) {
  const clean = sanitizeJobPayload(payload);
  const validationError = validateJobPayload(clean);
  if (validationError) return { error: validationError };

  const { data, error } = await supabase
    .from('jobs')
    .update(clean)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    log('error', 'Falha ao atualizar vaga', { error: error.message });
    return { error: formatError(error) };
  }
  return { data };
}

/**
 * ADMIN: alterna estado de publicação.
 */
export async function togglePublish(id, publish) {
  const { data, error } = await supabase
    .from('jobs')
    .update({ is_published: !!publish })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    log('error', 'Falha ao alterar publicação', { error: error.message });
    return { error: formatError(error) };
  }
  return { data };
}

/**
 * ADMIN: deletar vaga.
 */
export async function deleteJob(id) {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

  if (error) {
    log('error', 'Falha ao deletar vaga', { error: error.message });
    return { error: formatError(error) };
  }
  return { success: true };
}

/**
 * Sanitização: remove HTML tags, espaços extras, controla tamanho.
 * O banco também valida, mas evitamos round-trip desnecessário.
 */
function sanitizeJobPayload(p) {
  const stripHtml = (s) => (s || '').toString().replace(/<[^>]*>/g, '').trim();
  return {
    title: stripHtml(p.title).substring(0, 200),
    company: stripHtml(p.company).substring(0, 150),
    location: stripHtml(p.location).substring(0, 150) || 'Brasil',
    description: stripHtml(p.description).substring(0, 2000),
    external_url: (p.external_url || '').toString().trim().substring(0, 500),
    source: 'linkedin',
  };
}

function validateJobPayload(p) {
  if (!p.title) return 'Título obrigatório';
  if (!p.company) return 'Empresa obrigatória';
  if (!p.external_url) return 'Link da vaga obrigatório';
  if (!/^https?:\/\/.+/.test(p.external_url)) return 'Link inválido (precisa começar com https://)';
  return null;
}
