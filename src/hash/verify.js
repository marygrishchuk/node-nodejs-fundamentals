import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { readFile } from 'fs/promises';
import { createHash } from 'crypto';
import { join } from 'path';

const verify = async () => {
  // Write your code here
  // Read checksums.json
  // Calculate SHA256 hash using Streams API
  // Print result: filename — OK/FAIL
  const absoluteRootPath = process.cwd();
  const checksumsPath = join(absoluteRootPath, 'checksums.json');

  let checksumsDataObj = {};

  try {
    // read and parse the checksums.json file:
    const content = await readFile(checksumsPath, 'utf-8');
    checksumsDataObj = JSON.parse(content);
  } catch (error) {
    // standardizing the error message as requested:
    throw new Error('FS operation failed');
  }

  // iterating through each file entry in the checksums.json file:
  for (const [filePath, expectedHash] of Object.entries(checksumsDataObj)) {
    try {
      const absolutefilePath = join(absoluteRootPath, filePath);
      const hash = createHash('sha256');
      await pipeline(createReadStream(absolutefilePath), hash);
      const actualHash = hash.digest('hex');
      console.log(`${filePath} — ${actualHash === expectedHash ? 'OK' : 'FAIL'}`);
    } catch (error) {
      // if a file is missing, we mark it as FAIL:
      console.log(`${filePath} — FAIL`);
    }
  }
};

await verify();
