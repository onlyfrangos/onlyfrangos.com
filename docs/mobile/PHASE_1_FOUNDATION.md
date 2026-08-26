# Fase 1 — Fundação do aplicativo mobile

> Concluída em 25 de agosto de 2026.  
> Escopo: `MOB-001` a `MOB-006`.

## Resultado

Foi criado `apps/mobile` com Expo 57, React Native 0.86, React 19, TypeScript estrito e Expo Router.
O aplicativo gera bundles Android e iOS, integra os checks do monorepo e oferece uma shell
navegável baseada na definição de UX da Fase 0.

## Entregas

- app Expo dentro do workspace pnpm, sem configuração manual desnecessária do Metro;
- stacks de autenticação, tabs e rotas de detalhes;
- Início, Academias e Perfil como tabs persistentes;
- Publicar e Menu interceptados como apresentações modais;
- variantes development, preview e production em `app.config.ts` e `eas.json`;
- URL da API validada, permitindo HTTP apenas para hosts locais conhecidos;
- TanStack Query, safe area, gesture handler, tema e error boundary globais;
- fontes Bebas Neue e Manrope e logo compartilhado com os assets da web;
- tokens puros em `packages/design-tokens`, sem CSS ou dependência de React DOM;
- primitivas mobile de texto, botão, campo, avatar, superfície, skeleton e estados de tela;
- telas-base coerentes com feed, perfil, academias, publicação, menu e autenticação;
- Jest, React Native Testing Library, mock de fetch e wrapper de Query Client;
- documentação para emulador, simulador, aparelho físico e ambientes EAS.

## Decisões implementadas

| Decisão                      | Implementação                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------- |
| Isolar React 18 e React 19   | Cada app declara sua própria versão no workspace isolado do pnpm                 |
| Não compartilhar UI DOM      | Mobile não importa `packages/ui`; usa `packages/design-tokens`                   |
| Metro em monorepo            | Configuração automática do Expo 57, sem `watchFolders` ou hoisting manual        |
| Development builds           | Script `dev` usa `expo start --dev-client`; `start` permanece disponível         |
| Variantes instaláveis juntas | Sufixos `.dev` e `.preview` nos identificadores não produtivos                   |
| Assets da marca              | Logo existente da web referenciado pelo app config, sem cópia binária divergente |
| Tratamento global de falhas  | Error boundary sem exibir detalhes sensíveis, mais estados reutilizáveis         |

## Verificação

- `expo config --type public`: configuração development resolvida;
- `expo install --check`: dependências compatíveis com o SDK instalado;
- export Android: concluído;
- export iOS: concluído;
- testes mobile: quatro suítes e oito testes passando;
- `pnpm quality`: concluído para todo o monorepo;
- `git diff --check`: deve permanecer como gate final de entrega.

Os exports confirmam o bundle JavaScript e a resolução de assets para as duas plataformas. Builds
nativos assinados dependem das contas/certificados EAS e continuam previstos na fase de release.

## Próxima etapa

Iniciar a Fase 2 pelos itens `MOB-010`, `MOB-011`, `MOB-020` e `MOB-021`: contrato de sessão por
dispositivo, autenticação mobile compatível com a web, tipos públicos e SDK com transporte
injetável. A tela inicial permanece direcionada às tabs até a restauração segura de sessão existir.
