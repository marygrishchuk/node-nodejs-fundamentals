import { readFile, writeFile, mkdir, stat } from 'fs/promises';
import path from 'path';

const restore = async () => {
  // Write your code here
  // Read snapshot.json
  // Treat snapshot.rootPath as metadata only
  // Recreate directory/file structure in workspace_restored
  const absoluteRootPath = process.cwd();
  const snapshotPath = path.join(absoluteRootPath, 'snapshot.json');
  const workspaceRestoredPath = path.join(absoluteRootPath, 'workspace_restored');

  const snapshotFileContent = await readFile(snapshotPath).catch(() => ''); // catching to avoid Unhandled rejection
  const existingWorkspaceRestored = await stat(workspaceRestoredPath).catch(() => ''); // catching to avoid Unhandled rejection
  if (!snapshotFileContent || existingWorkspaceRestored) {
    throw new Error('FS operation failed');
  }

  const { entries } = JSON.parse(snapshotFileContent.toString());

  await mkdir(workspaceRestoredPath);

  for (const entry of entries) {
    const fullPath = path.join(workspaceRestoredPath, entry.path);
    if (entry.type === 'directory') {
      await mkdir(fullPath, { recursive: true });
    } else {
      await mkdir(path.dirname(fullPath), { recursive: true });
      await writeFile(fullPath, Buffer.from(entry.content ?? '', 'base64'));
    }
  }
};

await restore();
