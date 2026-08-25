# Instruções do projeto

## TypeScript: qualidade e convenções

### Validação obrigatória

- Antes de finalizar qualquer alteração TypeScript, execute `pnpm quality`.
- Não considere uma tarefa concluída enquanto houver erros introduzidos pela alteração.
- Se formatar todo o projeto gerar um diff excessivo, aplique ESLint e Prettier somente nos
  arquivos alterados e registre separadamente problemas preexistentes.
- Preserve o estilo e a arquitetura existentes quando forem consistentes; não altere comportamento
  apenas por preferência estética.
- Use o agente `typescript_quality_reviewer` quando uma revisão TypeScript for solicitada.
- Em tarefas grandes, o agente pode revisar as alterações depois da implementação.
- Não use o agente em tarefas pequenas quando ESLint, Prettier e TypeScript forem suficientes.

### Nomenclatura

- Use `camelCase` em variáveis, parâmetros, propriedades e funções.
- Use `PascalCase` em classes, interfaces, types e enums.
- Constantes globais podem usar `UPPER_SNAKE_CASE`.
- Escolha nomes que revelem a finalidade. Valores numéricos que representam quantidades devem
  indicá-la, por exemplo, `mediaCount`.
- Booleanos devem preferencialmente começar com `is`, `has`, `can`, `should` ou `allow`.
- Evite abreviações pouco claras e nomes genéricos como `data`, `item`, `result` e `value` quando
  houver um nome de domínio mais preciso.
- Não renomeie identificadores consolidados quando isso quebrar APIs públicas, contratos ou
  integrações.

### Formatação e legibilidade

- Use aspas simples, ponto e vírgula, indentação de dois espaços e linhas de aproximadamente 100
  caracteres, conforme o Prettier.
- Use chaves em todos os blocos de controle. Não mantenha condicionais complexas e exceções na
  mesma linha.
- Quebre chamadas, objetos e assinaturas extensas em várias linhas.
- Evite ternários aninhados ou difíceis de ler.
- Evite funções com muitos parâmetros posicionais; quando houver muitos argumentos relacionados,
  considere um objeto tipado.
- Prefira retornos antecipados quando reduzirem aninhamento.
- Extraia métodos auxiliares quando uma função tiver responsabilidades diferentes, sem criar
  abstrações desnecessárias apenas para reduzir seu tamanho.
- Mantenha funções focadas e legíveis.

### Tipagem e assincronismo

- Prefira tipagem segura e evite `any` desnecessário, assertions perigosas e conversões que ocultem
  incompatibilidades.
- Trate promises explicitamente: aguarde, retorne ou marque intencionalmente as que não precisam ser
  aguardadas.
- Mantenha uso consistente de `interface` para formatos de objetos e de `type` para uniões, aliases e
  composições.
- Mantenha imports únicos e organizados sem contrariar exigências do NestJS ou do Next.js.
