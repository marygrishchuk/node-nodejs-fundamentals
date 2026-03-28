import { readdir, readFile, writeFile, stat } from 'fs/promises';
import path from 'path';

const merge = async () => {
  // Write your code here
  // Default: read all .txt files from workspace/parts in alphabetical order
  // Optional: support --files filename1,filename2,... to merge specific files in provided order
  // Concatenate content and write to workspace/merged.txt
  const absoluteRootPath = process.cwd();
  const workspacePath = path.join(absoluteRootPath, 'workspace');
  const partsPath = path.join(workspacePath, 'parts');

  const throwError = () => { throw new Error('FS operation failed') };

  const partsStat = await stat(partsPath).catch(() => ''); // catching to avoid Unhandled rejection
  if (!partsStat || !partsStat.isDirectory()) {
    throwError();
  }

  const argv = process.argv;
  const filesFlagIdx = argv.indexOf('--files');

  let filesToMerge;

  if (filesFlagIdx >= 0) {
    const filesListFromArg = argv[filesFlagIdx + 1];

    const splitFilePathsArray = filesListFromArg
      ? filesListFromArg.split(',').map(name => name.trim()).filter(Boolean)
      : [];

    if (!splitFilePathsArray.length) {
      throwError();
    }

    filesToMerge = splitFilePathsArray;
  } else {
    const relPaths = await readdir(partsPath, { recursive: true });
    const txtFiles = relPaths.filter(filePath => path.extname(filePath) === '.txt');

    if (!txtFiles.length) {
      throwError();
    }

    filesToMerge = txtFiles.sort((a, b) => a.localeCompare(b));
  }

  let mergedContent = '';

  for (const fileToMerge of filesToMerge) {
    const fullPath = path.join(partsPath, fileToMerge);
    const fileStat = await stat(fullPath).catch(() => ''); // catching to avoid Unhandled rejection

    if (!fileStat || !fileStat.isFile()) {
      throwError();
    }

    const content = await readFile(fullPath, 'utf8');
    mergedContent += content;
  }

  const outputPath = path.join(workspacePath, 'merged.txt');
  await writeFile(outputPath, mergedContent);
};

await merge();
