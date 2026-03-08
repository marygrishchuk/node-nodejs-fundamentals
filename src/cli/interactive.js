import readline from 'readline';

const interactive = () => {
  // Write your code here
  // Use readline module for interactive CLI
  // Support commands: uptime, cwd, date, exit
  // Handle Ctrl+C and unknown commands
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
  });

  let isGoodbyePrinted = false;
  const sayGoodbye = () => {
    if (!isGoodbyePrinted) {
      console.log('Goodbye!');
      isGoodbyePrinted = true;
    }
  };

  rl.on('close', () => {
    sayGoodbye();
    process.exit();
  });

  rl.prompt();

  rl.on('line', (input) => {
    const command = input.trim();

    switch (command) {
      case 'uptime':
        console.log(`Uptime: ${process.uptime().toFixed(2)}s`);
        break;
      case 'cwd':
        console.log(process.cwd());
        break;
      case 'date':
        console.log(new Date().toISOString());
        break;
      case 'exit':
        rl.close();
        return;
      default:
        if (command.length > 0) {
          console.log('Unknown command');
        }
        break;
    }

    rl.prompt();
  });

  rl.on('SIGINT', rl.close);
};

interactive();
