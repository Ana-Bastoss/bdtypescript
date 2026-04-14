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
