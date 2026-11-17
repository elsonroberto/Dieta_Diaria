import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [];
console.log('Iniciando Daily Diet: API em http://localhost:3333 | Frontend em http://localhost:5173\n');
for (const folder of ['backend', 'frontend']) {
  const child = spawn(npm, ['run', 'dev'], {
    cwd: resolve(root, folder),
    stdio: 'inherit', shell: process.platform === 'win32',
  });
  children.push(child);
  child.on('error', (error) => console.error(`Erro ao iniciar ${folder}: ${error.message}`));
}
function shutdown() {
  children.forEach((child) => { if (!child.killed) child.kill(); });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
