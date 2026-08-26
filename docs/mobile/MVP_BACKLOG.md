# Backlog do MVP mobile — OnlyFrangos

> Backlog inicial criado na Fase 0. Cada linha pode originar uma issue.  
> Prioridades: `P0` bloqueia o release; `P1` compõe a jornada principal; `P2` melhora a experiência.

## Convenções

- O campo "Responsável" representa uma função, não uma pessoa já designada.
- Uma issue só pode ser encerrada quando satisfizer a definição de pronto do plano mobile.
- Alterações de API devem incluir compatibilidade web e contrato em `packages/types`.
- Itens de segurança e conformidade não podem ser removidos do MVP apenas para cumprir prazo.

## Progresso

- [x] `MOB-001` — Bootstrap de `apps/mobile`.
- [x] `MOB-002` — Rotas, abas, stacks e modais.
- [x] `MOB-003` — Tokens e primitivas visuais.
- [x] `MOB-004` — Estados loading, vazio, erro e offline.
- [x] `MOB-005` — Ambientes local, preview e production.
- [x] `MOB-006` — Test harness e mocks de API.
- [~] Fase 2 — implementação concluída; validação manual Android/iOS pendente.

## Fundação e design system

| ID      | Prioridade | Entrega                            | Responsável   | Dependência | Aceite resumido                                       |
| ------- | ---------- | ---------------------------------- | ------------- | ----------- | ----------------------------------------------------- |
| MOB-001 | P0         | Bootstrap de `apps/mobile`         | Mobile        | Fase 0      | Abre em Android/iOS e passa nos checks                |
| MOB-002 | P0         | Rotas, abas, stacks e modais       | Mobile/UX     | MOB-001     | Mapa da Fase 0 navegável e back nativo correto        |
| MOB-003 | P1         | Tokens e primitivas visuais        | Mobile/Design | MOB-001     | Tema web adaptado, acessível e sem valores duplicados |
| MOB-004 | P1         | Estados loading/vazio/erro/offline | Mobile        | MOB-003     | Padrões reutilizáveis e anunciados ao leitor de tela  |
| MOB-005 | P1         | Ambiente local, preview e produção | Mobile/DevOps | MOB-001     | URLs validadas e nenhum segredo público               |
| MOB-006 | P1         | Test harness e mocks de API        | Mobile/QA     | MOB-001     | Teste de componente e smoke test executáveis na raiz  |

## Sessão e conta

| ID      | Prioridade | Entrega                          | Responsável     | Dependência | Aceite resumido                                          |
| ------- | ---------- | -------------------------------- | --------------- | ----------- | -------------------------------------------------------- |
| MOB-010 | P0         | Modelo de sessão por dispositivo | API/Security    | —           | Refresh hash, rotação, expiração e revogação testados    |
| MOB-011 | P0         | Contratos de auth mobile         | API/SDK         | MOB-010     | Login/register/refresh/logout sem quebrar a web          |
| MOB-012 | P0         | Cofre e coordenador de sessão    | Mobile          | MOB-011     | Refresh no SecureStore, access token só em memória       |
| MOB-013 | P0         | Login e restauração              | Mobile          | MOB-012     | Sem flash indevido, loop de refresh ou destino perdido   |
| MOB-014 | P0         | Cadastro e aceite versionado     | Mobile/API      | MOB-011     | Validação, termos e política registrados                 |
| MOB-015 | P0         | Recuperação de senha             | API/Mobile      | MOB-011     | Link de uso único, expiração e resposta anti-enumeração  |
| MOB-016 | P0         | Exclusão de conta                | API/Mobile      | MOB-012     | Iniciada no app, revoga sessões e limpa dados aplicáveis |
| MOB-017 | P1         | Conta, políticas e suporte       | Mobile/Conteúdo | MOB-002     | Links públicos acessíveis dentro do app                  |
| MOB-018 | P0         | Unificar idade mínima            | Produto/API/Web | —           | Web, API, termos e mobile aplicam a mesma regra          |

## Contratos e feed

| ID      | Prioridade | Entrega                      | Responsável | Dependência      | Aceite resumido                                            |
| ------- | ---------- | ---------------------------- | ----------- | ---------------- | ---------------------------------------------------------- |
| MOB-020 | P0         | Tipos públicos completos     | API/SDK     | —                | Auth, feed, comments, likes, follows, gyms e erros tipados |
| MOB-021 | P0         | SDK com transporte injetável | SDK         | MOB-020          | Auth, erro, JSON e multipart testados em web/mobile        |
| MOB-022 | P1         | Estado do viewer no feed     | API         | MOB-020          | `isLiked` e permissões evitam chamada N+1 por card         |
| MOB-023 | P1         | Feed paginado                | Mobile      | MOB-013, MOB-021 | Cursor, deduplicação, refresh e retry funcionam            |
| MOB-024 | P1         | Card e carrossel de post     | Mobile      | MOB-023          | Imagens estáveis, acessíveis e com cache controlado        |
| MOB-025 | P2         | Medição e ajuste da lista    | Mobile/QA   | MOB-024          | Scroll fluido em aparelho Android intermediário            |

## Publicações e comentários

| ID      | Prioridade | Entrega                       | Responsável | Dependência      | Aceite resumido                                        |
| ------- | ---------- | ----------------------------- | ----------- | ---------------- | ------------------------------------------------------ |
| MOB-030 | P1         | Permissões e seletor de mídia | Mobile      | MOB-003          | Câmera/galeria contextuais, negação recuperável        |
| MOB-031 | P1         | Pipeline de imagem            | Mobile/API  | MOB-030          | Orientação, dimensão, compressão e limite formalizados |
| MOB-032 | P1         | Criar publicação              | Mobile      | MOB-021, MOB-031 | Progresso, cancelamento, idempotência e rascunho       |
| MOB-033 | P1         | Editar/excluir publicação     | Mobile      | MOB-032          | Permissão por autor e confirmação destrutiva           |
| MOB-034 | P1         | Likes e lista de curtidas     | Mobile/API  | MOB-021          | Otimista com rollback e lista paginada/limitada        |
| MOB-035 | P1         | Comentários e respostas       | Mobile/API  | MOB-021          | Criar, responder, curtir e excluir com autorização     |

## Perfis, relações e academias

| ID      | Prioridade | Entrega                       | Responsável | Dependência | Aceite resumido                                    |
| ------- | ---------- | ----------------------------- | ----------- | ----------- | -------------------------------------------------- |
| MOB-040 | P1         | Perfil público                | Mobile      | MOB-021     | Privacidade aplicada e grid navegável              |
| MOB-041 | P1         | Follow/unfollow               | Mobile/API  | MOB-040     | Otimista com rollback e contadores coerentes       |
| MOB-042 | P1         | Perfil próprio e edição       | Mobile/API  | MOB-040     | Todos os campos e preferências suportados          |
| MOB-043 | P1         | Upload de avatar              | Mobile/API  | MOB-042     | Preview, compressão, progresso e erro recuperável  |
| MOB-044 | P1         | Lista e filtros de academias  | Mobile      | MOB-021     | Nome/estado/cidade e paginação funcionam           |
| MOB-045 | P1         | Detalhe e membros da academia | Mobile      | MOB-044     | Ordenação, vazio e navegação para perfil funcionam |

## Confiança, segurança e moderação

| ID      | Prioridade | Entrega                           | Responsável      | Dependência | Aceite resumido                                           |
| ------- | ---------- | --------------------------------- | ---------------- | ----------- | --------------------------------------------------------- |
| MOB-050 | P0         | Modelo e API de denúncias         | API/Security     | MOB-020     | Post, comentário e usuário; categoria, estado e auditoria |
| MOB-051 | P0         | Denúncia dentro do app            | Mobile           | MOB-050     | Ação clara, confirmação e protocolo sem conteúdo sensível |
| MOB-052 | P0         | Bloquear/desbloquear usuário      | API/Mobile       | MOB-020     | Conteúdo e relações respeitam bloqueio após reinício      |
| MOB-053 | P0         | Filtro de conteúdo proibido       | API/Produto      | MOB-020     | Regras versionadas, mensagem segura e teste de bypass     |
| MOB-054 | P0         | Fila administrativa de moderação  | Web/API          | MOB-050     | Triagem, atribuição, ação e histórico auditável           |
| MOB-055 | P0         | Termos e diretrizes da comunidade | Produto/Jurídico | —           | URL pública, aceite versionado e condutas proibidas       |
| MOB-056 | P0         | Operação e SLA de moderação       | Operações        | MOB-054     | Responsável, escala, recurso e triagem em até 24 h        |

## Links, qualidade e release

| ID      | Prioridade | Entrega                         | Responsável      | Dependência      | Aceite resumido                                          |
| ------- | ---------- | ------------------------------- | ---------------- | ---------------- | -------------------------------------------------------- |
| MOB-060 | P1         | Universal links e app links     | Mobile/Web       | MOB-002          | Perfil/post/academia com fallback web e auth preservada  |
| MOB-061 | P0         | Telemetria privada              | Mobile/DevOps    | MOB-005          | Scrubbing testado, sem token, conteúdo ou dados fitness  |
| MOB-062 | P0         | Suíte E2E crítica               | QA/Mobile        | Jornadas prontas | 100% Android/iOS no release candidate                    |
| MOB-063 | P0         | Auditoria de acessibilidade     | QA/Design        | Jornadas prontas | Zero bloqueador com leitor de tela e fonte ampliada      |
| MOB-064 | P0         | Auditoria de segurança          | Security/API     | Jornadas prontas | Zero achado crítico/alto aberto                          |
| MOB-065 | P0         | Política e declarações de dados | Produto/Jurídico | MOB-055, MOB-061 | URLs públicas e formulários das lojas coerentes          |
| MOB-066 | P0         | Assets e metadata das lojas     | Design/Produto   | —                | Ícone, splash, screenshots, textos e classificação       |
| MOB-067 | P0         | Beta fechado                    | Produto/QA       | MOB-062–066      | Gates da Fase 0 medidos por sete dias                    |
| MOB-068 | P0         | Release público                 | Produto/DevOps   | MOB-067          | Checklists aprovados, monitoramento e rollback definidos |

## Itens pós-MVP

| ID      | Entrega                    | Observação                                           |
| ------- | -------------------------- | ---------------------------------------------------- |
| MOB-F01 | Busca unificada e Explorar | Exige endpoint e ranking de resultados               |
| MOB-F02 | Push notifications         | Exige preferências, tokens de dispositivo e operação |
| MOB-F03 | Mensagens diretas          | Exige modelo de segurança e moderação adicional      |
| MOB-F04 | Publicações salvas         | Contrato ainda inexistente                           |
| MOB-F05 | Desafios e rankings        | Domínio ainda inexistente                            |
| MOB-F06 | Vídeo                      | Exige pipeline e custos de mídia dedicados           |
| MOB-F07 | Tema claro                 | Estrutura de tokens já deve permitir a evolução      |
