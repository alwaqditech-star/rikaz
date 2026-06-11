/**
 * Applies database patch SQL files using project DB settings from .env.local
 * Usage: node scripts/apply-patch.mjs [patch-file]
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnv() {
  try {
    const envPath = resolve(root, '.env.local');
    const raw = readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore missing env file
  }
}

function splitStatements(sql) {
  return sql
    .split(';')
    .map((part) =>
      part
        .split('\n')
        .filter((line) => !line.trim().startsWith('--'))
        .join('\n')
        .trim(),
    )
    .filter(Boolean);
}

async function main() {
  loadEnv();
  const patchArg = process.argv[2] ?? 'database/patch-settings.sql';
  const patchPath = resolve(root, patchArg);
  const sql = readFileSync(patchPath, 'utf8');
  const statements = splitStatements(sql);

  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? 'root',
    password: process.env.MYSQL_PASSWORD ?? '',
    multipleStatements: false,
  });

  console.log(`Applying ${patchArg} ...`);

  for (const statement of statements) {
    const preview = statement.replace(/\s+/g, ' ').slice(0, 80);
    try {
      await conn.query(statement);
      console.log(`OK: ${preview}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (
        message.includes('Duplicate column') ||
        message.includes('already exists')
      ) {
        console.log(`SKIP (already applied): ${preview}`);
        continue;
      }
      console.error(`FAIL: ${preview}`);
      console.error(message);
      await conn.end();
      process.exit(1);
    }
  }

  await conn.end();
  console.log('Patch applied successfully.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
