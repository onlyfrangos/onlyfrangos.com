Quero que você planeje e implemente a infraestrutura de **armazenamento de imagens do OnlyFrangos utilizando Cloudflare R2**, seguindo a arquitetura e os requisitos abaixo.

Antes de implementar, analise a arquitetura atual do projeto e adapte a solução aos padrões já existentes. **Não crie abstrações desnecessárias nem duplique responsabilidades que já existam no projeto.**

## Contexto

O **OnlyFrangos** é uma rede social fitness brasileira open source.

A infraestrutura principal da aplicação continuará hospedada no **Google Cloud Platform (GCP)**, porém as imagens enviadas pelos usuários deverão ser armazenadas no **Cloudflare R2**.

A arquitetura desejada é:

```text
Frontend (Web/App)
        │
        ├──── API ────► NestJS / GCP
        │
        │
        └──── Imagens ────► Cloudflare R2
                                  │
                                  ▼
                         img.onlyfrangos.com
```

O backend **não deve atuar como proxy dos arquivos**.

Uploads e downloads de imagens devem ocorrer diretamente entre cliente e Cloudflare R2 sempre que possível.

---

## 1. Cloudflare R2

Utilize o **Cloudflare R2** como object storage.

Como o R2 possui API compatível com Amazon S3, utilize preferencialmente o AWS SDK para JavaScript/TypeScript:

```text
@aws-sdk/client-s3
@aws-sdk/s3-request-presigner
```

As credenciais e configurações devem vir exclusivamente de variáveis de ambiente.

Considere variáveis semelhantes a:

```env
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=https://img.onlyfrangos.com
```

Nunca coloque credenciais diretamente no código.

Atualize também o `.env.example`.

---

## 2. Upload direto

**Não envie os arquivos primeiro para o NestJS.**

O fluxo desejado é:

```text
1. Cliente
      │
      │ POST /media/uploads
      ▼
   NestJS
      │
      │ gera Presigned URL
      ▼
   Cliente
      │
      │ PUT imagem
      ▼
Cloudflare R2
```

O backend deve apenas:

1. autenticar o usuário;
2. validar a solicitação;
3. gerar um `objectKey`;
4. gerar uma Presigned URL de curta duração;
5. retornar as informações necessárias para o upload.

O arquivo deve ser enviado diretamente pelo navegador/app para o R2.

---

## 3. Object Keys

Não utilize o nome original do arquivo como identificador.

Gere identificadores seguros e imprevisíveis.

Prefira uma organização semelhante a:

```text
users/{userId}/posts/{mediaId}/original.webp
```

ou, enquanto não houver processamento de imagem:

```text
users/{userId}/posts/{mediaId}/{fileId}.jpg
```

Analise qual estrutura combina melhor com o modelo atual.

Evite:

```text
uploads/foto-do-shape.jpg
```

O sistema não deve depender do nome fornecido pelo usuário.

---

## 4. Banco de dados

**Não armazene a URL completa da imagem no banco.**

Armazene somente informações independentes do provedor, principalmente:

```text
objectKey
```

Exemplo conceitual:

```ts
PostMedia {
  id
  postId
  objectKey
  mimeType
  width
  height
  size
  createdAt
}
```

A URL pública deve ser construída utilizando:

```text
R2_PUBLIC_URL + objectKey
```

Por exemplo:

```text
objectKey:
users/abc/posts/xyz/image.webp

URL:
https://img.onlyfrangos.com/users/abc/posts/xyz/image.webp
```

Isso deve permitir trocar o domínio/CDN/storage futuramente sem alterar os registros existentes no banco.

---

## 5. Storage abstraction

Como o OnlyFrangos é **open source**, não quero que o domínio da aplicação fique diretamente acoplado ao Cloudflare.

Crie uma abstração simples de storage.

Algo conceitualmente semelhante a:

```ts
interface StorageProvider {
  createUploadUrl(...): Promise<...>;
  delete(...): Promise<void>;
  getPublicUrl(objectKey: string): string;
}
```

Implemente inicialmente:

```text
R2StorageProvider
```

Entretanto, mantenha a abstração pequena.

**Não crie uma arquitetura excessivamente genérica ou complexa.**

O objetivo é permitir que futuramente outra instalação do OnlyFrangos possa utilizar:

```text
Cloudflare R2
AWS S3
MinIO
Backblaze B2
outro storage S3-compatible
```

sem que seja necessário alterar módulos de posts, usuários etc.

---

## 6. Endpoint para upload

Planeje algo semelhante a:

```http
POST /media/uploads
```

Request conceitual:

```json
{
  "context": "post",
  "contentType": "image/jpeg",
  "size": 2456789
}
```

Response:

```json
{
  "mediaId": "...",
  "objectKey": "...",
  "uploadUrl": "...",
  "expiresIn": 300
}
```

Não considere necessariamente esse contrato definitivo.

Analise a arquitetura existente e proponha o contrato mais consistente.

---

## 7. Segurança

A API deve validar antes de gerar a Presigned URL:

* usuário autenticado;
* MIME type permitido;
* tamanho máximo;
* contexto do upload;
* permissões necessárias.

Inicialmente permita apenas imagens.

Considere formatos seguros e comuns, como:

```text
image/jpeg
image/png
image/webp
```

Defina um limite de tamanho razoável e deixe-o configurável.

Por exemplo:

```env
MAX_IMAGE_UPLOAD_SIZE_MB=10
```

A Presigned URL deve possuir validade curta, como aproximadamente **5 minutos**.

Não confie apenas na extensão do arquivo.

---

## 8. Confirmação do upload

Não considere que gerar uma Presigned URL significa que o upload foi concluído.

Planeje um fluxo que permita diferenciar:

```text
PENDING
READY
FAILED
```

Por exemplo:

```text
POST /media/uploads
        ↓
PENDING

Cliente envia para R2
        ↓

POST /media/{id}/complete
        ↓

Backend verifica objeto
        ↓
READY
```

Analise se esse fluxo é necessário neste momento ou se existe uma abordagem mais simples e segura.

O objetivo é impedir que registros apontem para arquivos inexistentes.

---

## 9. Exclusão

Quando uma imagem deixar de ser necessária, deve existir uma forma segura de removê-la do R2.

Exemplo:

```ts
await storage.delete(media.objectKey);
```

Tenha cuidado com consistência entre banco e storage.

Não espalhe chamadas diretamente ao SDK do R2 pelos módulos da aplicação.

---

## 10. Domínio das imagens

Planeje a utilização futura de:

```text
https://img.onlyfrangos.com
```

para servir imagens públicas.

Portanto:

```text
onlyfrangos.com
→ aplicação web

api.onlyfrangos.com
→ NestJS / GCP

img.onlyfrangos.com
→ Cloudflare / R2
```

A configuração deve permitir alterar esse domínio via variável de ambiente.

---

## 11. Imagens públicas

Inicialmente, as imagens dos posts serão **públicas**.

Portanto:

* upload → Presigned URL;
* leitura → URL pública através de `img.onlyfrangos.com`.

Não gere Presigned URLs para cada visualização do feed.

Isso deve manter a leitura das imagens simples e eficiente.

Entretanto, documente que essa estratégia precisará ser revista futuramente caso sejam implementados:

* perfis privados;
* conteúdo premium;
* assinaturas;
* mídia com controle de acesso.

Não implemente essa complexidade agora.

---

## 12. Preparação para otimização

Neste momento o foco é armazenamento/upload.

Entretanto, organize o código para que futuramente possamos gerar variantes como:

```text
original
1080px
640px
320px
```

Exemplo futuro:

```text
users/{userId}/posts/{mediaId}/
├── original.webp
├── large.webp
├── medium.webp
└── thumbnail.webp
```

Não implemente uma pipeline complexa de processamento agora, a menos que já exista infraestrutura apropriada no projeto.

Apenas evite decisões que tornem isso difícil posteriormente.

---

## 13. Vídeos

**Não implemente suporte a vídeos.**

O OnlyFrangos inicialmente aceitará somente imagens.

Não adicione:

* transcoding;
* HLS;
* DASH;
* FFmpeg;
* thumbnails de vídeo;
* upload de vídeo.

Evite adicionar complexidade que não será utilizada no MVP.

---

## 14. Experiência open source

O projeto deve continuar fácil de executar por contribuidores.

Não obrigue todos os desenvolvedores a possuírem uma conta Cloudflare apenas para executar o projeto localmente.

Analise uma estratégia apropriada para desenvolvimento, como:

```text
produção
→ Cloudflare R2

desenvolvimento
→ MinIO/local S3-compatible storage
```

ou outra solução simples.

O objetivo ideal continua sendo:

```bash
pnpm install
docker compose up -d
pnpm dev
```

e o projeto funcionar.

Se MinIO for utilizado, adicione-o ao `docker-compose.yml` e documente sua configuração.

---

## 15. Testes

Adicione testes para as regras importantes da camada de storage/media.

Principalmente:

* geração correta de object keys;
* validação de MIME type;
* validação de tamanho;
* usuário não autenticado;
* geração da URL pública;
* comportamento do provider;
* expiração/configuração das Presigned URLs.

Não faça testes dependerem do Cloudflare R2 real.

Utilize mocks/fakes apropriados.

---

## 16. Documentação

Atualize a documentação necessária.

Inclua pelo menos:

* variáveis de ambiente;
* configuração do Cloudflare R2;
* configuração de desenvolvimento;
* fluxo de upload;
* configuração de `img.onlyfrangos.com`;
* limitações atuais.

Se fizer sentido, crie:

```text
docs/STORAGE.md
```

com uma explicação da arquitetura:

```text
Client
   │
   │ request upload
   ▼
API
   │
   │ Presigned URL
   ▼
Client
   │
   │ direct upload
   ▼
R2
```

---

## 17. Antes de implementar

Antes de modificar código:

1. analise a estrutura atual do repositório;
2. identifique os módulos envolvidos;
3. identifique como configuração e variáveis de ambiente são tratadas;
4. identifique o schema Prisma atual;
5. verifique se já existe alguma abstração de storage/media;
6. proponha quais arquivos serão criados ou modificados.

Apresente primeiro um plano curto.

Depois implemente em etapas pequenas.

Ao final, informe:

* arquivos criados;
* arquivos modificados;
* novas dependências;
* novas variáveis de ambiente;
* como configurar o R2;
* como testar o upload localmente;
* como testar o upload utilizando Cloudflare R2;
* decisões arquiteturais relevantes.

Priorize **simplicidade, segurança, baixo acoplamento e facilidade de contribuição open source**.

Evite overengineering.
