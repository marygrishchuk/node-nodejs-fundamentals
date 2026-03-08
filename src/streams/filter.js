import { Transform, pipeline } from 'stream';

const filter = () => {
  // Write your code here
  // Read from process.stdin
  // Filter lines by --pattern CLI argument
  // Use Transform Stream
  // Write to process.stdout
  const patternIndex = process.argv.indexOf('--pattern');
  const pattern = patternIndex >= 0 ? process.argv[patternIndex + 1] : null;
  const patternRegex = new RegExp(pattern);

  const transformer = new Transform({
    transform(chunk, _encoding, callback) {
      // splitting the chunk into lines if it contains \n:
      const lines = chunk.toString().includes('\\n') ? chunk.toString().split('\\n') : [chunk.toString()];

      // iterating over all lines:
      lines.forEach(line => {
        if (patternRegex.test(line) || !pattern) {
          this.push(line + '\n');
        }
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

filter();
