# Talent Tree System

A World of Warcraft-inspired talent system for AI agents. Gamify your agent's capabilities with specializations, progression, and combo abilities.

## Overview

Transform your AI agent into a specialized powerhouse with:

- **4 Branches** — Security, Development, Automation, Research
- **12 Talents** — 3 per branch, each with 5 levels
- **Progression** — Earn XP through actions, unlock new abilities
- **Combos** — Unlock powerful combinations by investing in multiple branches

## Installation

```bash
# Clone into your OpenClaw skills directory
cd ~/.openclaw/workspace/skills
git clone https://github.com/Gzeu/talent-tree-skill.git talent-tree
```

Or copy the files manually to your skills folder.

## Quick Start

```javascript
const { handleCommand } = require('./talent-tree/commands');

// Show your talent tree
console.log(handleCommand('show'));

// Choose a specialization
console.log(handleCommand('spec security'));

// Upgrade a talent
console.log(handleCommand('upgrade threat_scanner'));

// Check progress
console.log(handleCommand('progress'));
```

## Talent Branches

### 🛡️ Security
| Talent | Description | Max Level |
|--------|-------------|-----------|
| Threat Scanner | Detect malice before it strikes | 5 |
| Audit Master | Every action, recorded | 5 |
| ClawdStrike Ultimate | Maximum security protocols | 5 |

**Bonus:** +20% XP for security-related tasks

### 💻 Development
| Talent | Description | Max Level |
|--------|-------------|-----------|
| Code Architect | Build with precision | 5 |
| Git Master | Control the timeline | 5 |
| Refactor Legendary | Transform chaos to order | 5 |

**Bonus:** +20% XP for coding tasks

### ⚙️ Automation
| Talent | Description | Max Level |
|--------|-------------|-----------|
| Workflow Builder | Chains of automation | 5 |
| Cron Master | Time bends to your will | 5 |
| Auto-Evolver | Self-improving systems | 5 |

**Bonus:** +20% XP for automation tasks

### 🔬 Research
| Talent | Description | Max Level |
|--------|-------------|-----------|
| Web Hunter | Nothing hides from sight | 5 |
| Data Miner | Extract truth from noise | 5 |
| Knowledge Synthesizer | Connect the unconnected | 5 |

**Bonus:** +20% XP for research tasks

## Earning XP

| Action | XP |
|--------|-----|
| Using a skill | +5 |
| Using skill in specialization | +10 (+20% bonus) |
| Completing a task | +25 |
| Completing a complex task | +50 |
| Daily heartbeat | +1 |
| Unlocking an achievement | +50 |
| Unlocking a combo | +100 |

**Level up:** Every 500 XP

**Talent point:** Every 100 XP

## Combo Abilities

Unlock powerful combinations by investing across branches:

| Requirement | Combo | Effect |
|-------------|-------|--------|
| Security L3 + Automation L3 | 🛡️⚙️ Auto-Shield | Automatic threat response |
| Development L5 + Research L3 | 💻🔮 Code Oracle | Find optimal solutions |
| Automation L5 + Any L3 | 🧠⚡ Megamind | Multi-agent orchestration |
| All branches L3+ | 🌟 Ascended | Full agent potential |

## Files

```
talent-tree/
├── SKILL.md              # This documentation
├── talent-manager.js     # Core logic (load, save, upgrade)
├── xp-tracker.js         # XP and achievements
├── commands.js           # CLI interface
├── display.js            # Visual rendering
├── heartbeat-xp.js       # Heartbeat integration
├── global-xp.js          # Easy import for other skills
└── package.json          # NPM metadata
```

## Integration

### Integrating XP into Your Skills

```javascript
const xp = require('../talent-tree/global-xp');

// Award XP when skill is used
xp.skillUsed('my-skill-name');

// Award XP on task completion
xp.taskCompleted('complex');  // or 'normal'

// Award achievement
xp.achievementUnlocked('first_deploy');

// Daily heartbeat bonus
xp.dailyHeartbeat();
```

### Auto-XP in Heartbeats

Add to your `HEARTBEAT.md`:

```markdown
## 🌳 Talent Tree Integration
- Daily bonus: +1 XP per heartbeat
- Auto-XP from skill usage
- Check for combo unlocks
```

### Skill-to-Branch Mapping

The system automatically maps common skills to branches:

| Pattern | Branch |
|---------|--------|
| security, audit, threat, clawdstrike | 🛡️ Security |
| git, code, refactor, github | 💻 Development |
| cron, deploy, workflow, docker | ⚙️ Automation |
| search, research, data, memory | 🔬 Research |

## Example Output

```
╔══════════════════════════════════════════════════════════════════╗
║                    🌳 TALENT TREE SYSTEM 🌳                      ║
╠══════════════════════════════════════════════════════════════════╣
║   Level: 5       XP: 1250       Points: 2                       ║
║   Spec: 🛡️ SECURITY                                             ║
╚══════════════════════════════════════════════════════════════════╝

 ★ 🛡️ SECURITY
├────────────────────────
│  Threat Scanner         [████░░░░░░] 4/5
│  Audit Master           [██░░░░░░░░] 2/5
│  ClawdStrike Ultimate   [░░░░░░░░░░] 0/5

   💻 DEVELOPMENT
├────────────────────────
│  Code Architect         [█░░░░░░░░░] 1/5
...
```

## Pricing

| Version | Price | Features |
|---------|-------|----------|
| Free | $0 | Core talent system, 2 specializations |
| Pro | $9.99 | All 4 specializations, combos, achievements |
| Enterprise | $49.99 | Pro + priority support, custom branches |

## Changelog

### v1.0.0 (2026-02-20)
- Initial release
- 4 talent branches with 12 talents
- XP progression system
- Combo abilities
- Visual display with colors
- Global XP integration

## License

MIT License - Free for personal and commercial use.

## Support

- GitHub Issues: https://github.com/Gzeu/talent-tree-skill/issues
- ClawHub: https://clawhub.com/skills/talent-tree

---

*Build your agent. Forge your legend.* ⚔️