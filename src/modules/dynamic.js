const dynamic = async () => {
  // Write your code here
  // Accept plugin name as CLI argument
  // Dynamically import plugin from plugins/ directory
  // Call run() function and print result
  // Handle missing plugin case
  const pluginName = process.argv[2];
  const printErrorAndExit = () => {
    console.log('Plugin not found');
    process.exit(1);
  }

  if (!pluginName) {
    printErrorAndExit();
  }

  try {
    const plugin = await import(`./plugins/${pluginName}.js`);
    const result = plugin.run();
    console.log(result);
  } catch {
    printErrorAndExit();
  }
};

await dynamic();
