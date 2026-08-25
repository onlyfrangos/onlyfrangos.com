# OnlyFrangos

O **onlyfrangos.com** é uma rede social fitness brasileira criada para aproximar praticantes de musculação e outros esportes, permitindo compartilhar experiências, evolução, treinos e conquistas em uma comunidade voltada para quem gosta de atividade física.

## Open Source

O OnlyFrangos é desenvolvido de forma aberta.

Contribuições são bem-vindas, independentemente do nível de experiência. Você pode contribuir com código, documentação, testes, design, sugestões de funcionalidades ou reportando problemas.

Consulte o arquivo `CONTRIBUTING.md` para conhecer as orientações para contribuição.

## Stack

O projeto utiliza principalmente tecnologias do ecossistema TypeScript.

```text
TypeScript
Next.js
React
NestJS
PostgreSQL
Prisma
pnpm
Turborepo
Docker
```

## Desenvolvimento local

### Requisitos

Antes de começar, tenha instalado:

* Node.js
* pnpm
* Docker
* Docker Compose
* Git

Clone o repositório:

```bash
git clone git@github.com:onlyfrangos/onlyfrangos.com.git
cd onlyfrangos.com
```

Instale as dependências:

```bash
pnpm install
```

Copie as variáveis de ambiente:

```bash
cp .env.example .env
```

Inicie os serviços necessários:

```bash
docker compose up -d
```

Execute a aplicação:

```bash
pnpm dev
```

## Como contribuir

Quer ajudar o OnlyFrangos?

1. Faça um fork do projeto.
2. Crie uma branch para sua alteração.
3. Faça suas alterações.
4. Adicione ou atualize os testes quando necessário.
5. Faça o commit.
6. Envie um Pull Request.

Exemplo:

```bash
git checkout -b feat/my-feature
git commit -m "feat: add my feature"
git push origin feat/my-feature
```

Além de código, você pode contribuir:

* reportando bugs;
* sugerindo funcionalidades;
* melhorando documentação;
* criando testes;
* discutindo arquitetura;
* melhorando acessibilidade;
* ajudando com UI/UX.

## Encontrou um problema?

Abra uma **Issue** descrevendo:

* o comportamento encontrado;
* o comportamento esperado;
* passos para reproduzir;
* ambiente utilizado;
* screenshots ou logs, quando relevantes.

Para vulnerabilidades de segurança, **não publique detalhes sensíveis em uma Issue pública**. Consulte a política de segurança do projeto.

## Licença

O OnlyFrangos é software livre e open source distribuído sob a licença **GNU Affero General Public License v3.0 (AGPL-3.0)**.

Em termos gerais, a AGPLv3 permite usar, estudar, modificar e redistribuir o software sob os termos estabelecidos pela licença. Ela também possui requisitos específicos relacionados a versões modificadas disponibilizadas para usuários por meio de uma rede.

Consulte o arquivo [`LICENSE`](./LICENSE) para os termos completos.

```text
SPDX-License-Identifier: AGPL-3.0-only
```

## OnlyFrangos

**Treine. Compartilhe. Evolua. 🐔💪**

OnlyFrangos — uma rede social fitness brasileira, feita pela comunidade e para a comunidade.
