import { readdir, stat } from 'fs/promises';
import path from 'path';

const findByExt = async () => {
  // Write your code here
  // Recursively find all files with specific extension
  // Parse --ext CLI argument (default: .txt)
  const absoluteRootPath = process.cwd();
  const workspacePath = path.join(absoluteRootPath, 'workspace');

  const workspaceStat = await stat(workspacePath).catch(() => ''); // catching to avoid Unhandled rejection
  if (!workspaceStat || !workspaceStat.isDirectory()) {
    throw new Error('FS operation failed');
  }

  let extension = 'txt';
  const extensionArgIdx = process.argv.findIndex(arg => arg.startsWith('--ext'));
  if (extensionArgIdx >= 0) {
    extension = process.argv[extensionArgIdx + 1] ?? 'txt';
  }
  const extensionWithDot = extension.startsWith('.') ? extension : `.${extension}`;

  const relPaths = await readdir(workspacePath, { recursive: true });
  const filePaths = [];

  for (const relPath of relPaths) {
    const fullPath = path.join(workspacePath, relPath);
    const fileOrDirStat = await stat(fullPath);
    if (fileOrDirStat.isFile() && path.extname(relPath) === extensionWithDot) {
      filePaths.push(relPath);
    }
  }

  filePaths.sort((a, b) => a.localeCompare(b));
  filePaths.forEach(filePath => console.log(filePath));
};

await findByExt();
