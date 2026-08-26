# Fase 2 — contratos, SDK e sessão segura

## Resultado

A conta mobile agora possui cadastro, login, restauração, renovação e logout sobre um contrato
próprio para cliente público. O fluxo web continua usando cookie HTTP-only, mas passou a usar o
mesmo modelo revogável e a rotacionar o cookie a cada refresh.

## Contrato de sessão

Rotas mobile:

| Método | Rota                    | Credencial de refresh                      |
| ------ | ----------------------- | ------------------------------------------ |
| POST   | `/auth/mobile/register` | resposta JSON, após aceite das políticas   |
| POST   | `/auth/mobile/login`    | resposta JSON                              |
| POST   | `/auth/mobile/refresh`  | corpo da requisição e resposta rotacionada |
| POST   | `/auth/mobile/logout`   | corpo da requisição, seguido de revogação  |

O refresh token é um valor opaco aleatório. A API persiste somente seu hash SHA-256 em
`AuthenticationSession`, junto do usuário, tipo do cliente, dispositivo, expiração, último uso e
eventual revogação. Uma rotação usa atualização condicional atômica: o token anterior deixa de ser
aceito e somente uma tentativa concorrente pode vencer.

O cadastro mobile consulta `/auth/policies`, envia as versões aceitas e cria um registro imutável em
`PolicyAcceptance`. A idade mínima foi unificada em 18 anos na API, web e mobile.

## Armazenamento e ciclo de vida no aplicativo

- refresh token e identificador local do dispositivo ficam no `expo-secure-store`;
- access token e usuário autenticado existem somente na memória do processo;
- a abertura do app tenta rotacionar o refresh antes de decidir entre autenticação e abas;
- respostas `401` simultâneas compartilham uma única Promise de refresh;
- falha de refresh limpa o cofre e retorna ao login sem loop;
- logout sempre apaga a sessão local, mesmo sem rede ou com falha na revogação remota.

O `AuthProvider` expõe a sessão e o SDK autenticado. O guard de rotas impede acesso às tabs sem
sessão e impede retornar para login/cadastro após autenticar.

## SDK e contratos compartilhados

`packages/types` agora publica contratos de autenticação, erros discriminados, feed, posts,
comentários, likes, follows, perfis, academias e localização. `packages/sdk` oferece:

- transporte injetável e implementação padrão baseada em `fetch`;
- autenticação injetável e retry único depois de `401`;
- erro `OnlyFrangosApiError` com `code`, `status`, `message` e `details` seguros;
- JSON e multipart sem impor `Content-Type` indevido;
- métodos para autenticação e para os endpoints existentes do MVP.

## Banco e implantação

A migração `20260826120000_add_authentication_sessions` precisa ser aplicada antes de publicar a
nova API. Depois de atualizar o código:

```bash
pnpm db:generate
pnpm --filter @onlyfrangos/api prisma:migrate
```

Em ambientes compartilhados, a migração deve seguir o processo de deploy do banco, sem executar
`migrate dev` diretamente em produção.

## Ambientes locais

O build de desenvolvimento permite HTTP para a API local. Valores típicos de
`EXPO_PUBLIC_API_BASE_URL`:

- iOS Simulator: `http://localhost:3001/api/v1`;
- Android Emulator: `http://10.0.2.2:3001/api/v1`;
- aparelho em LAN: `http://192.168.x.y:3001/api/v1`;
- preview e produção: URL HTTPS pública.

Builds preview e production não permitem cleartext. Nenhuma variável pública contém segredo.

## Evidência automatizada

- API: emissão com hash, rotação, repetição, expiração, revogação e concorrência;
- SDK: transporte/autenticação injetáveis, erro discriminado e fila única diante de `401`;
- mobile: restauração, refresh coordenado, persistência exclusiva do refresh e logout offline;
- ambiente: URLs de emulador, LAN e HTTPS remoto;
- checks do monorepo: lint, Prettier, TypeScript e testes.

Ainda é necessário executar o checklist manual contra uma API com a migração aplicada em um
Android e um iPhone/iOS Simulator antes de considerar atendido o critério físico da fase.
