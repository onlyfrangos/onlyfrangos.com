# Contribuindo com o OnlyFrangos

Obrigado pelo interesse em contribuir com o **OnlyFrangos**!

O OnlyFrangos é um projeto open source e contribuições são muito bem-vindas. Você pode ajudar desenvolvendo funcionalidades, corrigindo bugs, escrevendo testes, melhorando a documentação, discutindo arquitetura ou propondo melhorias para a plataforma.

## Configurando o ambiente

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js
- pnpm
- Docker
- Docker Compose
- Git

### 1. Faça um fork

Faça um fork do repositório e clone sua versão:

```bash
git clone git@github.com:onlyfrangos/onlyfrangos.com.git
cd onlyfrangos.com
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Inicie os serviços

```bash
docker compose up -d
```

### 4. Execute o projeto

```bash
pnpm dev
```

## Fluxo de desenvolvimento

Crie suas alterações sempre a partir da branch `main` atualizada.

```bash
git checkout main
git pull origin main
git checkout -b feat/my-feature
```

Mantenha cada Pull Request focado em um único problema ou funcionalidade sempre que possível.

Evite misturar grandes refatorações com novas funcionalidades ou correções não relacionadas.

## Nomenclatura de branches

Prefira nomes curtos e descritivos:

```text
feat/user-profile
feat/post-comments
fix/feed-pagination
fix/avatar-upload
refactor/auth-service
docs/local-setup
test/profile-service
```

Prefixos recomendados:

| Prefixo     | Uso                                      |
| ----------- | ---------------------------------------- |
| `feat/`     | Nova funcionalidade                      |
| `fix/`      | Correção de bug                          |
| `refactor/` | Refatoração sem mudança de comportamento |
| `docs/`     | Documentação                             |
| `test/`     | Testes                                   |
| `chore/`    | Manutenção e configuração                |

## Padrões de desenvolvimento

Alguns princípios que buscamos manter no projeto:

- TypeScript como linguagem principal;
- código simples e legível;
- módulos pequenos e coesos;
- responsabilidades bem definidas;
- evitar abstrações prematuras;
- evitar overengineering;
- reutilizar componentes quando fizer sentido;
- manter tipagem forte sempre que possível;
- adicionar ou atualizar testes quando houver mudança de comportamento;
- manter documentação atualizada quando necessário.

Prefira:

> Código fácil de entender a código excessivamente inteligente.

Lembre-se de que o OnlyFrangos é um projeto open source. O código deve ser compreensível não apenas para quem o escreveu, mas também para quem estiver conhecendo o projeto pela primeira vez.

## Commits

Faça commits pequenos e focados.

Prefira mensagens que expliquem claramente a alteração:

```text
feat: add profile page
fix: fix feed load
refactor: simplifies user services
docs: updates installation instructions
test: adds tests for post creation
```

Evite mensagens pouco descritivas como:

```text
update

fix

changes

ajustes
```

## Testes

Alterações que modificam o comportamento da aplicação devem, sempre que aplicável, incluir testes.

Antes de enviar seu Pull Request, execute os comandos de validação disponíveis no projeto e certifique-se de que:

- a aplicação compila;
- o lint passa;
- os testes existentes continuam passando;
- novos comportamentos possuem testes quando necessário.

Não remova ou altere testes apenas para fazer uma implementação incorreta passar.

## Alterações de interface

Para alterações relacionadas à interface, procure manter:

- consistência visual;
- responsividade;
- acessibilidade;
- reutilização adequada de componentes;
- compatibilidade com o design existente.

Pull Requests que modificarem significativamente a interface devem incluir **screenshots ou vídeos curtos** demonstrando o resultado.

Quando relevante, mostre versões desktop e mobile.

## Reportando bugs

Antes de abrir uma Issue, verifique se o problema já não foi reportado.

Ao reportar um bug, tente incluir:

- descrição clara do problema;
- comportamento esperado;
- comportamento atual;
- passos para reprodução;
- navegador ou ambiente utilizado;
- logs relevantes;
- screenshots, quando aplicável.

Quanto mais fácil for reproduzir o problema, mais fácil será corrigi-lo.

## Sugerindo funcionalidades

Sugestões são bem-vindas.

Antes de implementar uma funcionalidade grande, recomendamos abrir uma Issue para discutir a proposta com a comunidade.

Explique:

- qual problema a funcionalidade resolve;
- como você imagina a solução;
- quais partes do projeto seriam afetadas;
- possíveis alternativas consideradas.

Isso evita trabalho desnecessário em funcionalidades que talvez precisem ser discutidas antes da implementação.

## Pull Requests

Ao abrir um Pull Request:

1. Dê um título claro.
2. Explique o problema ou funcionalidade.
3. Descreva as principais alterações.
4. Relacione a Issue correspondente, quando existir.
5. Inclua screenshots quando houver alterações visuais.
6. Informe como a alteração pode ser testada.

Evite Pull Requests muito grandes sempre que for possível dividi-los em alterações menores e independentes.

## Checklist do Pull Request

Antes de enviar:

- [ ] O código compila corretamente.
- [ ] O lint passa sem erros.
- [ ] Os testes existentes continuam passando.
- [ ] Novos comportamentos possuem testes quando necessário.
- [ ] Não há código temporário ou logs de debug.
- [ ] Não há secrets, tokens ou credenciais no código.
- [ ] A documentação foi atualizada quando necessário.
- [ ] O Pull Request possui contexto suficiente para ser revisado.
- [ ] Alterações de UI possuem screenshots quando necessário.

## Segurança

Não abra Issues públicas contendo detalhes de vulnerabilidades que possam comprometer usuários ou a infraestrutura do OnlyFrangos.

Caso encontre uma vulnerabilidade de segurança, entre em contato com a gente pelos canais oficiais.

## Licença

Ao contribuir com o OnlyFrangos, você concorda que suas contribuições serão disponibilizadas sob a mesma licença utilizada pelo projeto:

**GNU Affero General Public License v3.0 (AGPL-3.0).**

Consulte o arquivo [`LICENSE`](./LICENSE) para os termos completos.

## Obrigado!

Toda contribuição ajuda o OnlyFrangos a crescer.

Código, documentação, testes, ideias, feedback e discussões são formas válidas de contribuir.

**Obrigado por ajudar a construir o OnlyFrangos. 🐔💪**
