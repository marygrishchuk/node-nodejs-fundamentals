const progress = () => {
  // Write your code here
  // Simulate progress bar from 0% to 100% over ~5 seconds
  // Update in place using \r every 100ms
  // Format: [████████████████████          ] 67%
  const argv = process.argv;

  const getNumberArgValue = (name, defaultValue) => {
    const idx = argv.indexOf(name);
    if (idx >= 0 && idx + 1 < argv.length) {
      const value = Number(argv[idx + 1]);
      if (Number.isFinite(value) && value > 0) {
        return value;
      }
    }
    return defaultValue;
  };

  const duration = getNumberArgValue('--duration', 5000);
  const interval = getNumberArgValue('--interval', 100);
  const length = getNumberArgValue('--length', 30);

  let foregroundColorEscape = '';
  let resetColorEscape = '';

  const colorIdx = argv.indexOf('--color');
  if (colorIdx >= 0 && colorIdx + 1 < argv.length) {
    const colorArgValue = argv[colorIdx + 1].trim();
    const matchDataArray = colorArgValue.match(/^#?([0-9a-fA-F]{6})$/);
    if (matchDataArray) {
      const hex = matchDataArray[1];
      // parsing hex to rgb:
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      foregroundColorEscape = `\x1b[38;2;${r};${g};${b}m`;
      resetColorEscape = '\x1b[0m';
    }
  }

  const startTime = Date.now();

  const timer = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    let ratio = elapsedTime / duration;
    if (ratio >= 1) ratio = 1;

    const filledCharsNumber = Math.round(length * ratio);
    const emptySpaceNumber = Math.max(0, length - filledCharsNumber);
    const percentage = Math.round(ratio * 100);
    const filledPart = '█'.repeat(filledCharsNumber);
    const emptyPart = ' '.repeat(emptySpaceNumber);
    const coloredFilledPart = foregroundColorEscape && resetColorEscape
      ? `${foregroundColorEscape}${filledPart}${resetColorEscape}`
      : filledPart;

    const progressBar = `[${coloredFilledPart}${emptyPart}] ${percentage}%`;
    process.stdout.write(`\r${progressBar}`);

    if (ratio >= 1) {
      clearInterval(timer);
      process.stdout.write('\nDone!\n');
    }
  }, interval);
};

progress();
