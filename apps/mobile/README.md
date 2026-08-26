# OnlyFrangos Mobile

Aplicativo Expo + React Native do OnlyFrangos para Android e iOS.

## Requisitos

- Node.js 22.13 ou superior;
- pnpm 9;
- Android Studio/Emulator para Android;
- Xcode/Simulator em macOS para iOS, ou um aparelho físico;
- API do OnlyFrangos em execução.

## Instalação

Na raiz do monorepo:

```bash
pnpm install
cp apps/mobile/.env.example apps/mobile/.env
```

Defina `EXPO_PUBLIC_API_BASE_URL` conforme o ambiente onde o aplicativo será executado.

## Desenvolvimento

```bash
pnpm --filter @onlyfrangos/mobile start
```

Atalhos adicionais:

```bash
pnpm --filter @onlyfrangos/mobile android
pnpm --filter @onlyfrangos/mobile ios
pnpm --filter @onlyfrangos/mobile dev
```

`dev` usa um development build. `start` também permite validar a shell com uma instalação Expo
compatível, mas o fluxo normal do projeto será baseado em development builds à medida que módulos
nativos forem adicionados.

## URL da API por ambiente

| Destino                   | Exemplo                                               |
| ------------------------- | ----------------------------------------------------- |
| iOS Simulator             | `http://localhost:3001/api/v1`                        |
| Android Emulator          | `http://10.0.2.2:3001/api/v1`                         |
| Android com `adb reverse` | `http://localhost:3001/api/v1`                        |
| Aparelho físico           | `http://IP_DA_MAQUINA:3001/api/v1` em desenvolvimento |
| Preview                   | URL HTTPS pública do ambiente                         |
| Produção                  | `https://api.onlyfrangos.com/api/v1`                  |

Para encaminhar a porta da API a um aparelho Android conectado por USB:

```bash
adb reverse tcp:3001 tcp:3001
```

O servidor NestJS precisa aceitar a origem/configuração do ambiente e estar acessível pela rede. Em
aparelho físico, `localhost` é o próprio telefone, não a máquina de desenvolvimento.

## Ambientes de build

`app.config.ts` reconhece `APP_VARIANT`:

- `development`: `OnlyFrangos Dev`, identificador `com.onlyfrangos.app.dev`;
- `preview`: `OnlyFrangos Preview`, identificador `com.onlyfrangos.app.preview`;
- `production`: `OnlyFrangos`, identificador `com.onlyfrangos.app`.

As URLs públicas são configuradas por ambiente no EAS. Segredos nunca devem usar o prefixo
`EXPO_PUBLIC_`, pois variáveis públicas são incorporadas ao bundle.

O app declara `https://onlyfrangos.com` como domínio associado no iOS e Android. Antes da
publicação, o domínio precisa servir os arquivos `apple-app-site-association` e `assetlinks.json`
com o Team ID da Apple e a impressão digital do certificado Android usados nos builds finais.

## Qualidade

```bash
pnpm --filter @onlyfrangos/mobile lint
pnpm --filter @onlyfrangos/mobile typecheck
pnpm --filter @onlyfrangos/mobile test
pnpm --filter @onlyfrangos/mobile build
pnpm quality
```

Os testes ficam em `__tests__`, fora de `app`, porque todos os arquivos dentro de `app` são tratados
como rotas pelo Expo Router.
