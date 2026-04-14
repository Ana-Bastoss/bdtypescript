import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Cria (ou abre) o arquivo físico do banco de dados chamado "banco.sqlite"
const sqlite = new Database('banco.sqlite');

// Exporta a conexão para ser usada no resto do projeto
export const db = drizzle(sqlite, { schema });