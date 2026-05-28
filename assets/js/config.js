/**
 * config.js — Configuração pública do Astri Vagas RI
 * ---------------------------------------------------
 * IMPORTANTE: este arquivo é carregado pelo navegador,
 * então TUDO aqui é público. Apenas a anon key (que é
 * desenhada para isso) pode estar aqui.
 *
 * NUNCA coloque service_role_key, secrets ou credenciais
 * sensíveis neste arquivo. A segurança vem do RLS no banco.
 *
 * COMO PREENCHER:
 *  1. Vá ao painel do Supabase do seu projeto
 *  2. Settings > API
 *  3. Copie "Project URL" para SUPABASE_URL
 *  4. Copie "anon public" para SUPABASE_ANON_KEY
 *     (NÃO confundir com "service_role")
 */

window.ASTRI_CONFIG = {
  // URL base do projeto Supabase (sem /rest/v1/)
  SUPABASE_URL: 'https://rfnkjvvvnplbfamknqbg.supabase.co',
  // Publishable key (antiga "anon key") — segura para frontend, RLS protege os dados
  SUPABASE_ANON_KEY: 'sb_publishable_nDeoJ0h2Z1wP_c1t81BNWw_Sz49Wa28',

  // URLs públicas das páginas (relativas ao domínio)
  // Ajuste se mudar a estrutura de pastas no servidor Astri
  ROUTES: {
    LP: '/lp/rede-estrategica/',
    VAGAS: '/lp/rede-estrategica/vagas/',
    LOGIN: '/lp/rede-estrategica/login/',
    ADMIN: '/lp/rede-estrategica/admin/',
  },

  // Validade do token de acesso (apenas informativa no frontend;
  // a expiração real é controlada no banco)
  ACCESS_TOKEN_DAYS: 30,

  // Tempo de inatividade antes de auto-logout do admin (ms)
  ADMIN_IDLE_TIMEOUT: 30 * 60 * 1000, // 30 minutos
};

// Trava o objeto para evitar mutação acidental
Object.freeze(window.ASTRI_CONFIG);
Object.freeze(window.ASTRI_CONFIG.ROUTES);
