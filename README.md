# Fake News - Portal e Gestão de Notícias

## 📑 Sumário

1.  [Sistema de Gestão de Notícias (CLI)](https://www.google.com/search?q=%23sistema-de-gest%C3%A3o-de-not%C3%ADcias-cli)
      - [Tecnologias Utilizadas](https://www.google.com/search?q=%23-tecnologias-utilizadas)
      - [Pré-requisitos](https://www.google.com/search?q=%23-pr%C3%A9-requisitos)
      - [Como rodar o projeto](https://www.google.com/search?q=%23como-rodar-o-projeto)
      - [Funcionalidades do Menu](https://www.google.com/search?q=%23funcionalidades-do-menu)
2.  [Portal Web Estático (HTML/CSS)](https://www.google.com/search?q=%23-portal-web-est%C3%A1tico-htmlcss)
      - [Como Acessar e Testar](https://www.google.com/search?q=%23-como-acessar-e-testar)
      - [Estrutura de Blocos e Fluxos Estáticos](https://www.google.com/search?q=%23-estrutura-de-blocos-e-fluxos-est%C3%A1ticos)
      - [Preparação para Integração com Backend](https://www.google.com/search?q=%23-prepara%C3%A7%C3%A3o-para-integra%C3%A7%C3%A3o-com-backend)
      - [Automação do DateTime (Data de Criação)](https://www.google.com/search?q=%23-automa%C3%A7%C3%A3o-do-datetime-data-de-cria%C3%A7%C3%A3o)

-----

# Sistema de Gestão de Notícias (CLI)

Esta é uma aplicação interativa de linha de comando (CLI) desenvolvida para gerenciar notícias, cidades, estados (UFs) e categorias (Tags).

O projeto foi construído utilizando **TypeScript**, **Drizzle ORM** e o banco de dados **SQLite**, cumprindo todos os requisitos de estruturação, consultas ordenadas e relacionamentos.

## 🚀 Tecnologias Utilizadas

  * **TypeScript**
  * **Node.js**
  * **Drizzle ORM** (com Drizzle Kit)
  * **SQLite** (`better-sqlite3`)
  * **tsx** (para execução direta dos arquivos `.ts`)

## 📋 Pré-requisitos

Certifique-se de ter o **Node.js** instalado na sua máquina para executar os comandos abaixo.

## Como rodar o projeto

**1. Instale as dependências**
Abra o terminal na raiz do projeto (onde está o arquivo `package.json`) e instale as bibliotecas necessárias:

```bash
npm install
```

**2. Sincronize o Banco de Dados (Opcional)**
O arquivo físico `banco.sqlite` já está incluso e configurado. Se por algum motivo for necessário recriar as tabelas do zero com base no arquivo `schema.ts`, você pode executar o comando abaixo para forçar o "push" do Drizzle:

```bash
npm run db:push
```

**3. Inicie a aplicação**
Para rodar o menu interativo diretamente no seu terminal, execute o script de inicialização:

```bash
npm start
```

## Funcionalidades do Menu

Ao iniciar a aplicação, você poderá navegar pelo seguinte menu:

  * `0` - Cadastrar notícia (incluindo seleção dinâmica de cidade e vinculação opcional de tags).
  * `1` - Exibir todas as notícias (ordenadas das mais recentes para as mais antigas).
  * `2` - Exibir todas as notícias (ordenadas das mais antigas para as mais recentes).
  * `3` - Exibir notícias filtradas por um estado (UF) específico.
  * `4` - Exibir todas as notícias agrupadas visualmente por estado, com opção de expandir os detalhes e ver as tags.
  * `5` - Cadastrar um novo Estado (UF).
  * `6` - Cadastrar uma nova Cidade (vinculada a uma UF existente).
  * `7` - Encerrar a aplicação.

-----

# 🌐 Portal Web Estático (HTML/CSS)

**[LINK POSTADO](https://fakenewspink.netlify.app/)**

A pasta `/fakenews_grupo_01` contém a prototipação completa das telas do portal "Fake News", desenvolvida com **HTML5** e **CSS3** puro (sem uso de frameworks), respeitando rigorosamente a hierarquia de atores, diagramas e regras estabelecidas na documentação do projeto.

## Como Acessar e Testar

Para testar a navegação e o layout responsivo:

1.  Abra o projeto no **VS Code**.
2.  Utilize a extensão **Live Server** e execute o arquivo `index.html` localizado na **raiz** da pasta `/fakenews_grupo_01`.
3.  A partir da Home (`index.html`), toda a navegação do bloco **Público** está interligada através dos menus superiores.
4.  Para acessar os fluxos específicos dos outros atores logados, utilize as seguintes rotas diretas no navegador (ou clicando no botão Login para simular o acesso):
      - **Leitor:** `/leitor/meu_perfil.html`
      - **Autor:** `/autor/meu_perfil.html`
      - **Editor:** `/editor/painel.html`
      - **Superadmin:** `/superadmin/dashboard.html`

## Estrutura de Blocos e Fluxos Estáticos

Para validar a experiência de uso sem a necessidade de um backend momentâneo, implementei **direcionamentos simulados** usando o atributo `action` dos formulários HTML apontando para rotas correras, criando a "ilusão" das ações (CRUD):

  * **Público (`/publico`):** Tem acesso livre à Home, visualização de notícias completas, filtros por UF e Tag, Cadastro e Login. A área de comentários em `detalhe_noticia.html` fica bloqueada, solicitando login.
  * **Leitor (`/leitor`):** Acesso a uma página de perfil (`meu_perfil.html`) e à versão logada das notícias (`detalhe_noticia_logado.html`), onde o formulário de comentários está desbloqueado para uso.
  * **Autor (`/autor`):** Acesso ao painel `minhas_noticias.html`. Ao interagir com os formulários de `nova_noticia.html` ou `editar_noticia.html`, o botão "submit" recarrega o painel principal. Foi adicionada a rota `ver_comentarios.html` para o autor acompanhar o engajamento.
  * **Editor (`/editor`):** Possui um `painel.html` com filtros e controle de moderação. Simula as funções de "Publicar/Despublicar" via refresh de página e possui permissão para editar matérias de terceiros.
  * **Superadmin (`/superadmin`):** O Administrador do sistema possui um `dashboard.html` central. **Todos os 7 CRUDs exigidos (Cidades, UFs, Tags, Notícias, Perfis, Usuários e Comentários) possuem as 5 telas obrigatórias (Listar, Criar, Exibir, Atualizar e Apagar).** Qualquer ação submetida nesses formulários retorna para a listagem principal, simulando o processamento em banco de dados.

## Preparação para Integração com Backend

Toda a arquitetura HTML foi desenhada para facilitar a futura conexão com o código em **TypeScript/Node.js**:

  - **Formulários Parametrizados:** Todos os inputs possuem os atributos `name` definidos corretamente (ex: `name="titulo"`, `name="uf_filtro"`), prontos para serem capturados pelo `req.body` ou `req.query` num servidor Express.
  - **Classes Reutilizáveis:** O CSS modular permite que componentes como `<span class="tag">` e `.news-card` sejam iterados por laços de repetição (como `for` no EJS ou Handlebars) injetando dados do Drizzle ORM sem quebrar o layout.
  - **Rotas Padronizadas:** A estrutura de pastas reflete o que seria um sistema de rotas autêntico (ex: `GET /superadmin/cidades`).

## Automação do DateTime (Data de Criação)

No HTML (ex: arquivo `index.html`), simulamos a visualização das datas nas notícias com horário fixado (`16/04/2026 - 20:42`). Esta simulação visual está diretamente ligada à estratégia desenvolvida no nosso Banco de Dados (CLI).

Ao conectarmos o HTML ao banco futuramente, **não haverá campo de data nos formulários de "Nova Notícia"**. Como estruturado em nosso `schema.ts`:

```typescript
data_criacao: text('data_criacao').default(sql`CURRENT_TIMESTAMP`).notNull()
```

O próprio **SQLite** registrará automaticamente o exato momento da inserção (milissegundo do clique em "Publicar"), cumprindo a exigência do PDF de que a data não deve ser informada manualmente, economizando código na API e garantindo integridade aos dados.
