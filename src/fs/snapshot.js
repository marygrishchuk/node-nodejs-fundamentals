import { readdir, readFile, stat, writeFile } from 'fs/promises';
import path from 'path';

const snapshot = async () => {
  // Write your code here
  // Recursively scan workspace directory
  // Write snapshot.json with:
  // - rootPath: absolute path to workspace
  // - entries: flat array of relative paths and metadata
  const absoluteRootPath = process.cwd();
  const workspacePath = path.join(absoluteRootPath, 'workspace');
  const entries = [];

  // checking whether or not the workspace is a directory and do exist:
  const workspaceStat = await stat(workspacePath).catch(() => ''); // catching to avoid Unhandled rejection
  if (!workspaceStat || !workspaceStat.isDirectory()) {
    throw new Error('FS operation failed');
  }
  // find all nested files and directories relative paths recursively:
  const relPaths = await readdir(workspacePath, { recursive: true });

  // fill entries array with files and directories relative paths and info:
  for (const relPath of relPaths) {
    const fullPath = path.join(workspacePath, relPath);
    const fileOrDirStat = await stat(fullPath);

    if (fileOrDirStat.isDirectory()) {
      entries.push({ path: relPath, type: 'directory' });
    } else {
      entries.push({
        path: relPath,
        type: 'file',
        size: fileOrDirStat.size,
        content: await readFile(fullPath, 'base64'),
      });
    }
  }

  await writeFile(
    path.join(absoluteRootPath, 'snapshot.json'),
    JSON.stringify({ rootPath: workspacePath, entries }, null, 2)
  );
};

await snapshot();
