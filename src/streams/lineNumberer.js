import { Transform, pipeline } from 'stream';

const lineNumberer = () => {
  // Write your code here
  // Read from process.stdin
  // Use Transform Stream to prepend line numbers
  // Write to process.stdout
  let lineNumber = 1;

  const transformer = new Transform({
    transform(chunk, _encoding, callback) {
      // splitting the chunk into lines if it contains \n:
      const lines = chunk.toString().includes('\\n') ? chunk.toString().split('\\n') : [chunk.toString()];

      // iterating over all lines:
      lines.forEach(line => {
        this.push(`${lineNumber++} | ${line}\n`);
      });

      callback();
    }
  });

  // connecting stdin -> transformer -> stdout:
  pipeline(process.stdin, transformer, process.stdout, (err) => {
    if (err) {
      console.error('Pipeline failed:', err);
    }
  });
};

lineNumberer();
