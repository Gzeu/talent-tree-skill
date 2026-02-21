# Talent Tree System

A World of Warcraft-inspired talent system for AI agents. Gamify your agent's capabilities with specializations, progression, and combo abilities.

## Installation

```bash
npx clawhub install talent-tree
```

## Quick Start

```javascript
const { handleCommand } = require('talent-tree/commands');

// Show your talent tree
console.log(handleCommand('show'));

// Choose specialization
console.log(handleCommand('spec security'));

// Upgrade talent
console.log(handleCommand('upgrade threat_scanner'));
```

## Features

- **4 Specializations:** Security, Development, Automation, Research
- **12 Talents:** 3 per branch, 5 levels each
- **XP System:** Earn XP through actions
- **Combos:** Mix specializations for powerful abilities
- **Presets:** Quick-start builds

## Commands

| Command | Description |
|---------|-------------|
| `talent show` | Display tree |
| `talent spec <branch>` | Choose spec |
| `talent upgrade <talent>` | Spend point |
| `talent progress` | Stats |
| `talent preset <name>` | Apply preset |

## License

MIT