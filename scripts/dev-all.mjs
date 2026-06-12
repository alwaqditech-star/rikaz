import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apiDir = path.resolve(root, '..', 'api_project');

function run(name, cwd, command, args) {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
  });
  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
    }
  });
  return child;
}

console.log('تشغيل api_project (3001) ثم rikaz_project (3000)...\n');

const api = run('api', apiDir, 'npm', ['run', 'dev']);
setTimeout(() => {
  run('web', root, 'npm', ['run', 'dev']);
}, 2500);

process.on('SIGINT', () => {
  api.kill('SIGINT');
  process.exit(0);
});
