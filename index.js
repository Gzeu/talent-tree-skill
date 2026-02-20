const { runDemo, runDemoPreset, runDemoAnalytics } = require('./demo');
const { handleCommand } = require('./commands');

// Run based on argument
const arg = process.argv[2];

if (arg === 'demo') {
  runDemo();
} else if (arg === 'presets') {
  runDemoPreset();
} else if (arg === 'analytics') {
  runDemoAnalytics();
} else if (arg) {
  console.log(handleCommand(arg));
} else {
  runDemo();
}