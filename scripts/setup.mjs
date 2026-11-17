import { randomBytes } from 'node:crypto';
import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const envPath = resolve(root, 'backend/.env');
if (!existsSync(envPath)) {
  writeFileSync(envPath, [
    'PORT=3333',
    `JWT_SECRET=${randomBytes(48).toString('hex')}`,
    'CORS_ORIGIN=http://localhost:5173',
    'DATABASE_FILE=./data/daily-diet.sqlite',
    '',
  ].join('\n'), { mode: 0o600 });
  console.log('Arquivo backend/.env criado com segredo JWT aleatório.');
}

for (const folder of ['backend', 'frontend']) {
  console.log(`\nInstalando dependências de ${folder}...`);
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--no-audit', '--no-fund'], {
    cwd: resolve(root, folder), stdio: 'inherit', shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    console.error(`Falha na instalação em ${folder}. Verifique sua conexão e o Node.js.`);
    process.exit(result.status || 1);
  }
}
console.log('\nConfiguração concluída! Execute: npm run dev');
