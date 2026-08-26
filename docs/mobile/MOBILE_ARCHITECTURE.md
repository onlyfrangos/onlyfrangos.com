# Arquitetura inicial do aplicativo mobile

## Responsabilidades

```text
app/                 rotas, stacks, abas e composição
src/components/      primitivas e layout compartilhados no mobile
src/features/        telas e comportamento por domínio
src/config/          ambiente e configuração validada
src/providers/       providers globais com ciclo de vida do app
src/testing/         wrappers e mocks reutilizáveis
src/theme/           adaptação mobile dos tokens compartilhados
```

`packages/ui` é exclusivo da web. O mobile importa `packages/design-tokens`, `packages/types` e,
quando seus contratos forem expandidos, `packages/sdk`.

## Navegação da fundação

- `app/(auth)`: stack sem tabs para login e cadastro;
- `app/(tabs)`: Início, Academias e Perfil;
- Publicar intercepta a tab central e abre `app/compose.tsx` como modal;
- Menu intercepta sua tab e abre `app/menu.tsx` como modal;
- detalhes de post, perfil público e academia vivem na stack raiz;
- `app/index.tsx` aguarda a restauração e direciona para autenticação ou tabs;
- o guard global protege deep links e rotas abertas diretamente conforme o estado da sessão.

## Estado e dados

- TanStack Query gerencia somente estado remoto;
- o `QueryClient` nasce uma vez por ciclo de vida da aplicação;
- estado efêmero permanece local ao componente;
- `AuthProvider` mantém access token e usuário somente em memória;
- `SessionCoordinator` serializa refresh e conecta autenticação injetável ao SDK;
- somente refresh token e identificador do dispositivo são persistidos no SecureStore;
- componentes não acessam URLs ou `process.env` diretamente: usam `src/config`.

## Tema

Os valores independentes de plataforma ficam em `packages/design-tokens`. O tema mobile os adapta
em `src/theme` e é distribuído por contexto. Nenhum componente mobile importa Tailwind, CSS ou
componentes React DOM.

## Testes

- Jest com preset `jest-expo`;
- React Native Testing Library para comportamento e acessibilidade;
- wrappers de Query Client e mocks de `fetch` em `src/testing`;
- testes fora de `app` para não serem interpretados como rotas.

## Ambientes

`APP_VARIANT` altera nome, scheme e identificador nativo. `EXPO_PUBLIC_API_BASE_URL` é validada em
runtime: HTTP só é aceito para hosts locais conhecidos; ambientes remotos exigem HTTPS.
