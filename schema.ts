import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const uf = sqliteTable('uf', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  sigla: text('sigla').notNull()
});

export const cidade = sqliteTable('cidade', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  uf_id: integer('uf_id')
    .notNull()
    .references(() => uf.id)
});

export const noticia = sqliteTable('noticia', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo').notNull(),
  texto: text('texto').notNull(),
  cidade_id: integer('cidade_id')
    .notNull()
    .references(() => cidade.id),
  data_criacao: text('data_criacao')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

// --- NOVAS TABELAS ---

// Tabela TAG
export const tag = sqliteTable('tag', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull()
});

// Tabela Associativa (Relacionamento N:M entre Notícia e Tag)
export const noticia_tag = sqliteTable('noticia_tag', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  noticia_id: integer('noticia_id')
    .notNull()
    .references(() => noticia.id),
  tag_id: integer('tag_id')
    .notNull()
    .references(() => tag.id)
});