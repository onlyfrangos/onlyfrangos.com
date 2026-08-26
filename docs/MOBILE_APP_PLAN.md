# Plano de desenvolvimento do aplicativo mobile — OnlyFrangos

> Documento de acompanhamento do desenvolvimento do aplicativo para iOS e Android.
>
> Última atualização: 26 de agosto de 2026
> Estado geral: Fases 0 e 1 concluídas; Fase 2 implementada, com validação manual pendente
> Responsável atual: a definir

## 1. Objetivo

Criar um aplicativo mobile do OnlyFrangos que preserve a identidade e os principais fluxos já
construídos na web, mas use padrões nativos de navegação, interação, acessibilidade e desempenho.

O primeiro lançamento deve permitir que uma pessoa:

- crie uma conta, entre e mantenha sua sessão com segurança;
- acompanhe e atualize o feed;
- crie, edite e exclua publicações com até quatro imagens;
- curta publicações e interaja por comentários e respostas;
- veja perfis, siga ou deixe de seguir pessoas;
- consulte e edite o próprio perfil;
- encontre academias e consulte seus detalhes e membros.

O aplicativo fará parte do monorepo atual e consumirá a mesma API NestJS usada pela aplicação web.

## 2. Princípios do projeto

- **Paridade de produto, não cópia literal:** manter identidade, conteúdo e linguagem da web, usando
  componentes e gestos adequados a iOS e Android.
- **Uma API, contratos compartilhados:** web e mobile devem usar os mesmos tipos de domínio e
  contratos REST sempre que possível.
- **Mobile primeiro na interação:** respeitar áreas seguras, teclado, gesto de voltar, pull to
  refresh, estados offline e permissões do sistema.
- **Segurança desde o início:** tokens sensíveis apenas em armazenamento seguro, renovação de
  sessão com rotação e nenhum segredo dentro do bundle.
- **Entrega incremental:** cada fase deve terminar em um fluxo demonstrável e testável.
- **Acessibilidade como critério de aceite:** alvos de toque, contraste, leitor de tela, escala de
  fonte e redução de movimento devem ser considerados durante a implementação.
- **Administração permanece na web:** telas administrativas não fazem parte do aplicativo mobile
  inicial.

## 3. Decisões técnicas propostas

As decisões abaixo são o ponto de partida. Mudanças relevantes devem ser registradas na seção
"Registro de decisões" deste documento antes da implementação.

| Área              | Decisão inicial                                                                     | Motivo                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Aplicativo        | Expo + React Native + TypeScript                                                    | Integração rápida com câmera, galeria, builds e atualizações, mantendo a stack TypeScript |
| Local no monorepo | `apps/mobile`                                                                       | Mantém aplicativos separados e permite compartilhar pacotes do workspace                  |
| Navegação         | Expo Router                                                                         | Rotas tipadas e estrutura por arquivos adequada a stacks, abas e modais                   |
| Dados remotos     | TanStack Query                                                                      | Cache, paginação infinita, revalidação e mutações otimistas consistentes                  |
| Estado local      | React Context e estado local; biblioteca dedicada apenas se surgir necessidade real | Evita estado global desnecessário no MVP                                                  |
| Formulários       | React Hook Form + Zod                                                               | Validação previsível no cliente e mensagens de erro por campo                             |
| Sessão            | Access token em memória e refresh token em SecureStore                              | Reduz exposição de credenciais no dispositivo                                             |
| Imagens           | Expo Image Picker, Camera e Image Manipulator                                       | Seleção/captura, correção de orientação e compressão antes do upload                      |
| Listas            | `FlatList` inicialmente; avaliar FlashList com medição real                         | Favorece APIs nativas sem otimização prematura                                            |
| Ícones            | Família compatível com Lucide usada na web                                          | Preserva a linguagem visual atual                                                         |
| Testes            | Jest + React Native Testing Library; E2E com Maestro                                | Cobre unidade, integração visual/comportamental e jornadas reais                          |
| Entrega           | EAS Build/Submit com perfis development, preview e production                       | Builds reproduzíveis para as duas plataformas                                             |

### 3.1 Estrutura alvo

```text
apps/
├── api/
├── web/
└── mobile/
    ├── app/
    │   ├── (auth)/
    │   ├── (tabs)/
    │   ├── post/
    │   ├── profile/
    │   └── gym/
    ├── src/
    │   ├── components/
    │   ├── features/
    │   │   ├── auth/
    │   │   ├── feed/
    │   │   ├── posts/
    │   │   ├── profile/
    │   │   └── gyms/
    │   ├── hooks/
    │   ├── lib/
    │   ├── providers/
    │   └── theme/
    ├── assets/
    ├── app.config.ts
    └── package.json
packages/
├── config/
├── design-tokens/       # proposta: valores compartilháveis, sem CSS ou APIs do DOM
├── sdk/
├── types/
└── ui/                  # continua voltado à web; não importar no React Native
```

Não compartilhar componentes visuais entre web e mobile. Compartilhar tipos, regras puras,
contratos de API, cliente HTTP quando compatível e tokens como cores, espaçamento e tipografia.

## 4. Direção de interface

### 4.1 Identidade herdada da web

| Token                | Referência atual | Uso mobile                          |
| -------------------- | ---------------- | ----------------------------------- |
| Fundo                | `#0B0B0F`        | Fundo principal e barras do sistema |
| Superfície           | `#15151B`        | Cards, modais, sheets e campos      |
| Primária             | `#E80000`        | CTA principal, seleção e destaque   |
| Primária pressionada | `#C90000`        | Estado pressed                      |
| Texto                | `#FCFAF4`        | Conteúdo principal                  |
| Texto secundário     | `#A7A7B0`        | Metadados e placeholders            |
| Borda                | `#292930`        | Separadores e contornos             |
| Títulos              | Bebas Neue       | Marca e títulos de destaque         |
| Corpo                | Manrope          | Conteúdo, navegação e formulários   |

O tema inicial será escuro, como a web. A estrutura deve aceitar um tema claro no futuro sem
espalhar valores de cor diretamente pelos componentes.

### 4.2 Adaptação da navegação

A sidebar da web será convertida em navegação inferior e telas empilhadas:

- **Início:** feed com atualização por gesto e paginação infinita;
- **Academias:** busca/lista de academias e acesso ao detalhe;
- **Publicar:** ação central de destaque que abre o compositor em modal;
- **Perfil:** perfil da pessoa autenticada;
- **Menu:** sheet com editar perfil, itens futuros, informações da conta e sair.

Perfis de outras pessoas, detalhes de publicação, comentários, academia, edição e configurações
abrem em uma stack acima das abas. O botão voltar e o gesto nativo devem funcionar em todas elas.

"Explorar" só deve virar uma aba quando existir um contrato de busca/descoberta real na API. Até
lá, academias ocupa esse espaço e evita uma rota sem função.

### 4.3 Padrões de componentes

- Cards mantêm superfícies escuras, borda discreta e raio visual semelhante ao da web.
- Alvos de toque devem ter ao menos 44 × 44 pontos.
- Ações destrutivas usam confirmação nativa ou bottom sheet explícito.
- Comentários e listas de curtidas abrem como tela ou sheet, conforme teste de usabilidade.
- Feedback de ações usa estado inline, toast acessível e resposta tátil com moderação.
- Skeleton, vazio, erro com tentativa novamente e offline são obrigatórios em telas de dados.
- Imagens usam placeholder, proporção estável e cache; carrosséis exibem página atual.
- Conteúdo deve respeitar safe areas, teclado, orientação e tamanhos de fonte do sistema.

## 5. Escopo por lançamento

### 5.1 MVP — primeiro lançamento público

- Splash e restauração de sessão.
- Login, cadastro e logout.
- Recuperação de senha.
- Feed cronológico, paginação infinita e pull to refresh.
- Criação de publicação com uma a quatro imagens, legenda e progresso de upload.
- Edição e exclusão das próprias publicações.
- Curtir/descurtir e visualizar curtidas.
- Listar, criar, responder, curtir e excluir comentários permitidos.
- Perfil próprio e perfil público.
- Seguir/deixar de seguir.
- Denunciar conteúdo/usuário e bloquear/desbloquear usuário.
- Editar informações do próprio perfil e avatar.
- Excluir a própria conta dentro do aplicativo.
- Lista/filtro de academias, detalhe e membros.
- Deep links internos para perfil, publicação e academia.
- Estados de carregamento, vazio, erro, sessão expirada e conexão ausente.
- Telemetria mínima de falhas e desempenho, sem registrar conteúdo ou credenciais.
- Aceite versionado de termos, política de privacidade e diretrizes da comunidade.

### 5.2 Pós-MVP

- Busca unificada e Explorar.
- Notificações e push notifications.
- Mensagens diretas.
- Publicações salvas.
- Desafios e rankings.
- Vídeo e pipeline de mídia dedicado.
- Verificação de e-mail e autenticação adicional.
- Tema claro, widgets e recursos específicos de plataforma.

### 5.3 Fora de escopo do mobile inicial

- Cadastro e edição administrativa de usuários.
- Cadastro e edição administrativa de academias.
- Impersonação administrativa.
- Replicar o layout desktop ou renderizar a web em WebView.

## 6. Lacunas atuais da API e dos pacotes compartilhados

Estas lacunas devem ser tratadas antes ou durante as fases indicadas:

1. **Refresh token mobile:** a API lê o refresh token somente de cookie HTTP-only. O mobile precisa
   receber e renovar um token rotativo por um contrato próprio para cliente público, armazenando-o
   no SecureStore. Logout deve revogar a sessão do dispositivo.
2. **Sessões revogáveis:** refresh tokens atuais são JWTs sem persistência. Criar sessões por
   dispositivo, armazenar apenas hash do token e oferecer rotação/revogação reduz o impacto de
   vazamento.
3. **SDK incompleto:** `packages/sdk` cobre apenas leitura de feed, perfil, sugestões e posts. Deve
   receber autenticação injetável, tratamento uniforme de erros e métodos para todas as mutações do
   MVP.
4. **Tipos incompletos:** várias respostas são tipadas localmente na web ou não possuem contratos
   compartilhados. Consolidar DTOs públicos de auth, comentários, curtidas, follows, academias,
   localização e erros em `packages/types`.
5. **Estado do usuário no feed:** o feed não informa diretamente `isLiked` e outros estados do
   viewer, causando uma requisição de curtidas por card na web. Criar uma resposta autenticada com
   estado do viewer evita N+1 no aplicativo.
6. **Perfil do viewer:** garantir que `GET /users/me` retorne todo o formato necessário à edição e
   às preferências de privacidade.
7. **Busca:** a barra de busca da web ainda não tem um fluxo correspondente completo. Fica fora do
   MVP até existir endpoint paginado e comportamento definido.
8. **Uploads:** formalizar limites, dimensões, formato, compressão, ordem e códigos de erro das
   imagens. Avaliar upload direto para object storage antes de aumentar escala.
9. **Deep links:** definir URLs canônicas para publicação, perfil e academia, incluindo fallback
   web quando o aplicativo não estiver instalado.
10. **Observabilidade e privacidade:** padronizar request ID e erros seguros; nunca enviar tokens,
    senha, legenda, comentário ou imagem para logs de telemetria.
11. **Confiança e segurança:** criar denúncias de post, comentário e usuário, bloqueio bilateral,
    filtro de conteúdo proibido e fila administrativa auditável antes do beta público.
12. **Gestão da conta:** adicionar recuperação de senha, aceite versionado de políticas e exclusão
    da conta com revogação de sessões e tratamento dos dados associados.

Qualquer alteração de contrato deve manter compatibilidade com a web ou ser lançada com uma
migração coordenada.

## 7. Roadmap de execução

### Legenda

- `[ ]` não iniciado
- `[~]` em andamento
- `[x]` concluído
- `[!]` bloqueado

Os tamanhos `P`, `M` e `G` representam esforço relativo, não prazo de calendário.

### Fase 0 — Alinhamento de produto e UX (`P`)

**Objetivo:** remover ambiguidades antes do bootstrap.

- [x] Confirmar escopo do MVP e plataformas do primeiro beta.
- [x] Confirmar nomes, ícone, splash e identificadores propostos de bundle Android/iOS.
- [x] Produzir wireframes dos fluxos principais a partir das telas web.
- [x] Validar mapa de navegação, composição das abas e comportamento dos sheets.
- [x] Definir requisitos de privacidade, termos, suporte, moderação e exclusão de conta.
- [x] Criar backlog de paridade web/mobile com prioridade e responsável funcional.
- [x] Registrar métricas de sucesso do beta.

**Evidências:** [definição de produto e UX](./mobile/PHASE_0_PRODUCT_DEFINITION.md) e
[backlog do MVP](./mobile/MVP_BACKLOG.md).

**Critério de saída:** escopo, mapa de navegação e fluxos críticos aprovados, sem decisões que
bloqueiem o bootstrap.

### Fase 1 — Fundação do aplicativo (`M`)

**Dependência:** Fase 0.

- [x] Criar `apps/mobile` com Expo, TypeScript estrito e Expo Router.
- [x] Integrar scripts `dev`, `lint`, `format`, `typecheck`, `test` e `build` ao Turborepo.
- [x] Configurar aliases, variáveis de ambiente validadas e perfis de build.
- [x] Criar providers globais de tema, safe area, query client e tratamento de erros.
- [x] Adicionar fontes, logo e assets oficiais, verificando licenças e tamanhos.
- [x] Extrair tokens visuais puros para `packages/design-tokens`.
- [x] Criar primitivas mobile: texto, botão, campo, avatar, card, feedback e skeleton.
- [x] Configurar testes unitários, mocks de rede e uma tela de smoke test.
- [x] Documentar execução em emulador, simulador e aparelho físico.

**Evidências:** [relatório da Fase 1](./mobile/PHASE_1_FOUNDATION.md),
[arquitetura mobile](./mobile/MOBILE_ARCHITECTURE.md) e
[`apps/mobile/README.md`](../apps/mobile/README.md).

**Critério de saída:** o app abre nas duas plataformas, navega por uma shell vazia e passa nos
checks do monorepo.

### Fase 2 — Contratos, SDK e sessão segura (`G`)

**Dependência:** Fase 1. **Bloqueia todos os fluxos autenticados.**

- [x] Definir contrato de sessão mobile com rotação e revogação de refresh token.
- [x] Implementar migração/modelo de sessão por dispositivo na API.
- [x] Implementar login, cadastro, refresh e logout mobile mantendo o fluxo web compatível.
- [x] Guardar refresh token apenas no SecureStore e access token apenas em memória.
- [x] Implementar fila única de refresh para requisições simultâneas com `401`.
- [x] Limpar sessão local mesmo se o logout remoto falhar.
- [x] Expandir `packages/types` com contratos e erros discriminados do MVP.
- [x] Refatorar `packages/sdk` para transporte e autenticação injetáveis.
- [x] Cobrir rotação, expiração, revogação, repetição de refresh e concorrência com testes.
- [x] Configurar URL da API para emulador, simulador, dispositivo em LAN e ambientes remotos.

**Evidências:** [relatório da Fase 2](./mobile/PHASE_2_SECURE_SESSION.md), testes de sessão da API,
SDK e coordenador mobile. A validação manual em Android e iOS permanece como gate do critério de
saída.

**Critério de saída:** cadastro, login, restauração e logout funcionam em Android e iOS; uma sessão
revogada não pode ser renovada; a web continua autenticando normalmente.

### Fase 3 — Feed somente leitura (`M`)

**Dependência:** Fase 2.

- [ ] Implementar tela de feed com `FlatList`, cursor e deduplicação de posts.
- [ ] Implementar pull to refresh sem perder a posição desnecessariamente.
- [ ] Criar card com autor, data, legenda, contadores e carrossel de imagens.
- [ ] Abrir o perfil ao tocar em autor/avatar.
- [ ] Tratar skeleton, feed vazio, erro inicial, erro de próxima página e offline.
- [ ] Adicionar cache de imagens e evitar mudanças de layout durante carregamento.
- [ ] Medir renderizações, memória e fluidez em aparelho Android intermediário.

**Critério de saída:** uma conta autenticada percorre o feed paginado de forma fluida e consegue se
recuperar de perda temporária de conexão.

### Fase 4 — Publicações e interações (`G`)

**Dependência:** Fase 3 e fechamento dos contratos de mutação.

- [ ] Criar seletor de uma a quatro imagens com preview, reordenação e remoção.
- [ ] Solicitar permissões de câmera/galeria apenas no contexto da ação.
- [ ] Corrigir orientação, reduzir dimensões e comprimir imagens antes do upload.
- [ ] Implementar criação com validação, progresso, cancelamento e prevenção de envio duplicado.
- [ ] Implementar edição de legenda/imagens e exclusão com confirmação.
- [ ] Implementar like/unlike otimista com rollback em falha.
- [ ] Implementar lista de curtidas paginada ou limitada conforme contrato.
- [ ] Implementar comentários, respostas, likes em comentários e exclusão permitida.
- [ ] Implementar denúncia de publicação e comentário pelo menu contextual.
- [ ] Preservar rascunho quando o app for para segundo plano ou o upload falhar.
- [ ] Tratar acessibilidade do carrossel, botões e mensagens de estado.

**Critério de saída:** toda interação de publicação prevista no MVP funciona com respostas lentas,
falhas recuperáveis e toque repetido sem duplicar dados.

### Fase 5 — Perfis e rede social (`G`)

**Dependência:** Fase 2; pode avançar em paralelo à Fase 4 após estabilizar contratos.

- [ ] Implementar perfil público com avatar, bio, localização, academia, objetivo e contadores.
- [ ] Respeitar `showGym`, `showCity` e `showPhysicalInfo` em todos os cenários.
- [ ] Implementar grid de publicações e detalhe da publicação.
- [ ] Implementar seguir/deixar de seguir com estado otimista e rollback.
- [ ] Implementar bloquear/desbloquear com atualização consistente do conteúdo e relações.
- [ ] Implementar perfil próprio e edição dos campos suportados pela API.
- [ ] Implementar troca de avatar com crop/preview, compressão e progresso.
- [ ] Exibir dashboard físico apenas quando houver dados públicos.
- [ ] Verificar que dados privados nunca chegam em respostas públicas.

**Critério de saída:** perfil próprio e público têm paridade funcional com o escopo web existente,
incluindo privacidade e follow/unfollow.

### Fase 6 — Academias e localização (`M`)

**Dependência:** Fase 2.

- [ ] Implementar lista paginada de academias.
- [ ] Implementar filtros por nome, estado e cidade.
- [ ] Implementar detalhe com imagem, localização e lista paginada de membros.
- [ ] Implementar ordenação de membros suportada pela API.
- [ ] Conectar academia ao perfil quando o usuário editar seus dados.
- [ ] Tratar localidade inexistente, academia sem imagem e lista vazia.

**Critério de saída:** uma pessoa encontra uma academia, abre seus detalhes, percorre membros e a
associa ao próprio perfil.

### Fase 7 — Qualidade, segurança e observabilidade (`G`)

**Dependência:** Fases 3 a 6.

- [ ] Auditar armazenamento local para garantir ausência de senha e access token persistente.
- [ ] Revisar exposição de PII, logs, screenshots e breadcrumbs de erro.
- [ ] Cobrir fluxos críticos com testes de integração e E2E.
- [ ] Testar leitor de tela, fonte ampliada, contraste, reduced motion e alvos de toque.
- [ ] Testar modo avião, rede lenta, troca de rede, timeout e retomada do background.
- [ ] Testar aparelhos pequenos, tablets e versões mínimas suportadas de Android/iOS.
- [ ] Validar denúncia, bloqueio, filtro de conteúdo e fluxo operacional de moderação.
- [ ] Validar recuperação de senha e exclusão de conta ponta a ponta.
- [ ] Medir tempo de inicialização, travamentos, consumo de memória e rolagem do feed.
- [ ] Validar deep links e comportamento quando a sessão estiver expirada.
- [ ] Fazer revisão de segurança da autenticação e dos uploads.
- [ ] Garantir que `pnpm quality` passe sem regressões introduzidas.

**Critério de saída:** zero falha crítica aberta, jornadas E2E passam nas duas plataformas e os
orçamentos de qualidade definidos na Fase 0 são atingidos.

### Fase 8 — Beta e publicação (`M`)

**Dependência:** Fase 7.

- [ ] Criar projetos, certificados e perfis de assinatura sem versionar segredos.
- [ ] Configurar builds internos e distribuição para TestFlight e faixa interna do Google Play.
- [ ] Preparar nome, descrições, screenshots, ícone, splash e classificação indicativa.
- [ ] Publicar política de privacidade, termos, URL de suporte e instrução de exclusão de conta.
- [ ] Configurar monitoramento de crashes e alertas da API com consentimento adequado.
- [ ] Executar beta fechado e classificar feedback por severidade.
- [ ] Corrigir bloqueadores e realizar checklist manual de release.
- [ ] Submeter para revisão das lojas e documentar processo de rollback/hotfix.

**Critério de saída:** versões aprovadas e disponíveis nos canais definidos, com monitoramento e
responsáveis por incidentes estabelecidos.

## 8. Sequência recomendada de entregas demonstráveis

1. **Shell navegável:** tema, abas, stacks, componentes básicos e build em aparelho.
2. **Conta segura:** cadastro, login, restauração e logout.
3. **Leitor social:** feed e perfis somente leitura.
4. **Interação social:** follows, likes e comentários.
5. **Criação:** câmera/galeria, publicação, edição e exclusão.
6. **Identidade:** edição do perfil, avatar e privacidade.
7. **Comunidade local:** academias, filtros e membros.
8. **Release candidate:** E2E, segurança, acessibilidade, desempenho e lojas.

Uma entrega só deve avançar de "em andamento" para "concluída" quando seu critério de saída tiver
evidência: teste automatizado, checklist manual, gravação curta ou build distribuído.

## 9. Estratégia de testes

### Unidade

- normalização e validação de formulários;
- formatação de datas e contadores em `pt-BR`;
- gerenciamento de sessão e fila de refresh;
- atualizações otimistas e rollback;
- construção de `FormData` e regras de mídia.

### Componentes e integração

- estados loading, vazio, erro, offline e sucesso de cada tela;
- navegação com e sem sessão;
- feed paginado sem duplicações;
- criação/edição de post com falha parcial;
- privacidade do perfil;
- permissões negadas de câmera e galeria.

### E2E obrigatório

1. cadastrar, fechar o app, reabrir e restaurar sessão;
2. entrar, atualizar feed, curtir e comentar;
3. criar publicação com múltiplas imagens e depois editá-la;
4. abrir outro perfil, seguir e deixar de seguir;
5. editar perfil/avatar e verificar a atualização;
6. filtrar academia e abrir um membro;
7. expirar/revogar sessão e retornar de forma segura ao login;
8. operar com rede interrompida e recuperar sem duplicar mutações.

## 10. Ambientes e configuração

Prever quatro ambientes:

| Ambiente        | Uso                               | Distribuição            |
| --------------- | --------------------------------- | ----------------------- |
| Local           | desenvolvimento com API local/LAN | Expo development build  |
| Development     | integração contínua da equipe     | build interno           |
| Preview/Staging | QA e beta fechado                 | TestFlight/Play interno |
| Production      | usuários finais                   | App Store/Google Play   |

Variáveis públicas podem conter apenas URLs e identificadores não sensíveis. Chaves privadas,
tokens de assinatura e credenciais de serviços devem permanecer no provedor de secrets. Em
dispositivo físico, `localhost` aponta para o próprio telefone; a documentação deve explicar URL
LAN ou túnel HTTPS e as restrições de cleartext de cada plataforma.

## 11. Riscos e mitigação

| Risco                                         | Impacto                                 | Mitigação                                                                          |
| --------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------- |
| Refresh baseado somente em cookie             | Bloqueia sessão confiável no app        | Resolvido na Fase 2 com sessão por dispositivo, SecureStore, rotação e revogação   |
| Contratos espalhados entre web e API          | Divergência e bugs de integração        | Consolidar respostas públicas em `packages/types` e testar o SDK                   |
| Uma chamada de likes por card                 | Lentidão e carga N+1 no feed            | Incluir estado do viewer no payload autenticado do feed                            |
| Upload passa pelo processo da API             | Memória, timeout e baixa escalabilidade | Comprimir no cliente agora; planejar object storage/upload direto para escala      |
| Escopo sugerido pela sidebar ainda não existe | Abas vazias e atraso                    | Limitar MVP aos fluxos sustentados pela API e manter backlog pós-MVP explícito     |
| Diferenças entre plataformas                  | Bugs tardios                            | Testar Android e iOS desde a fundação, não apenas antes da loja                    |
| Dependências nativas incompatíveis            | Builds quebrados                        | Preferir módulos Expo compatíveis e validar development build a cada adição nativa |
| Dados fitness são sensíveis                   | Risco de privacidade                    | Privacidade por padrão, minimização, testes de autorização e política clara        |
| Feed com imagens consome memória              | Travamentos em aparelhos modestos       | Dimensões adequadas, cache limitado, virtualização e medição em aparelho real      |
| Regras das lojas mudam                        | Rejeição do release                     | Revisar checklists oficiais no início da Fase 8 e antes de cada submissão          |

## 12. Definição de pronto para cada tarefa

Uma tarefa é considerada pronta quando:

- comportamento e estados alternativos atendem ao critério de aceite;
- TypeScript não introduz `any` ou assertions inseguras sem justificativa;
- testes proporcionais ao risco foram adicionados e passam;
- acessibilidade básica foi verificada;
- Android e iOS foram considerados e, em UI nativa, testados;
- não existem logs de credenciais ou conteúdo sensível;
- documentação e contratos foram atualizados quando necessário;
- `pnpm quality` passa, ou problemas comprovadamente preexistentes estão registrados à parte;
- a checklist correspondente deste documento foi atualizada.

## 13. Métricas sugeridas para o beta

Definir metas numéricas na Fase 0 e acompanhar, no mínimo:

- taxa de sessões sem crash;
- tempo de abertura até conteúdo utilizável;
- latência percebida e taxa de erro do feed;
- sucesso de login/restauração de sessão;
- sucesso e duração do upload de publicação;
- travamentos ou falta de memória durante rolagem;
- conclusão das jornadas críticas do beta;
- feedback de acessibilidade e usabilidade.

Métricas de produto devem ser agregadas e minimizadas. Não coletar legenda, comentário, imagem,
senha, token ou informação física em ferramentas de analytics.

## 14. Questões a decidir antes da implementação

- [x] O primeiro beta será Android e iOS simultaneamente.
- [x] A baseline é Android 7+ e iOS 16.4+, revalidada ao fixar o Expo SDK estável.
- [x] O identificador proposto é `com.onlyfrangos.app`, sob contas da organização OnlyFrangos.
- [x] A criação de post terá câmera e galeria no MVP.
- [x] O aplicativo aceitará cadastro imediatamente com aceite versionado das políticas.
- [x] A exclusão completa da conta será iniciada dentro do aplicativo.
- [x] Os gates mensuráveis estão definidos no documento da Fase 0.
- [x] Sentry é a proposta para crashes/desempenho, com scrubbing e sem analytics comportamental.
- [x] Deep links usarão `onlyfrangos.com` como domínio universal desde o MVP.

## 15. Registro de decisões

| Data       | Decisão                                                | Motivo                                                                         | Estado                     |
| ---------- | ------------------------------------------------------ | ------------------------------------------------------------------------------ | -------------------------- |
| 2026-08-25 | Manter o mobile dentro do monorepo em `apps/mobile`    | Reuso de contratos, tooling e fluxo de contribuição                            | Proposta                   |
| 2026-08-25 | Usar Expo + React Native + TypeScript                  | Melhor equilíbrio entre velocidade, APIs nativas e stack existente             | Proposta                   |
| 2026-08-25 | Não compartilhar componentes React da web              | Componentes DOM/Tailwind não são portáveis nem oferecem boa UX nativa          | Proposta                   |
| 2026-08-25 | Administração continua na web no MVP                   | Reduz escopo e prioriza a experiência da comunidade                            | Proposta                   |
| 2026-08-25 | Substituir Explorar por Academias na navegação inicial | A API já suporta academias; busca/descoberta ainda não tem contrato completo   | Proposta                   |
| 2026-08-25 | Desenvolver Android e iOS desde o beta fechado         | Detectar diferenças de plataforma antes do release                             | Aprovada                   |
| 2026-08-25 | Incluir denúncia, bloqueio e moderação no MVP          | Requisito de segurança para uma rede com conteúdo gerado por usuários          | Aprovada                   |
| 2026-08-25 | Incluir recuperação e exclusão de conta no MVP         | Jornada mínima de conta e requisito atual das lojas                            | Aprovada                   |
| 2026-08-25 | Adotar baseline etária de 18 anos no beta              | Reduz risco até existir uma política específica para menores                   | Aprovada para planejamento |
| 2026-08-26 | Usar refresh opaco, rotativo e armazenado como hash    | Permite revogação por dispositivo sem persistir a credencial em texto          | Implementada               |
| 2026-08-26 | Migrar também a sessão web para o modelo revogável     | Mantém um único modelo de segurança e preserva o contrato por cookie HTTP-only | Implementada               |
| 2026-08-26 | Persistir aceite versionado no cadastro mobile         | Garante evidência do documento aceito sem registrar conteúdo sensível          | Implementada               |

## 16. Próxima ação

Aplicar a migração da Fase 2 em um ambiente de desenvolvimento e executar cadastro, login,
restauração e logout em Android e iOS. Com esse gate registrado, iniciar a Fase 3 por `MOB-022`,
`MOB-023` e `MOB-024`: estado do viewer, feed paginado e card de publicação.
