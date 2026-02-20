# 🌳 Talent Tree System

> WoW-style talent progression for AI agents

A gamification system that adds RPG-style progression to OpenClaw agents. Choose specializations, unlock abilities, track progression.

## Features

- **4 Branches:** Security, Development, Automation, Research
- **12 Talents:** 3 per branch, each with5 levels  
- **60 Total Points:** Earn through XP or use presets
- **Combo Abilities:** Unlock powerful combinations
- **Analytics:** Track your progression
- **Export/Import:** Backup and share builds

## Quick Start

```bash
# Install via ClawHub
npx clawhub install talent-tree
```

```javascript
const talent = require('talent-tree');

// Show your tree
talent.show();

// Choose specialization
talent.spec('security');

// Upgrade talent
talent.upgrade('threat_scanner');

// View progress
talent.progress();
```

## Commands

| Command | Description |
|---------|-------------|
| `talent show` | Display your talent tree |
| `talent spec <branch>` | Choose specialization |
| `talent upgrade <talent>` | Spend a point |
| `talent progress` | Detailed stats |
| `talent preset <name>` | Apply a preset build |
| `talent presets` | List available presets |
| `talent analytics` | View usage stats |
| `talent export` | Export to JSON |
| `talent import <file>` | Import from JSON |
| `talent reset` | Reset all talents |

## Presets

Quick-start builds for common use cases:

| Preset | Focus | Description |
|--------|-------|-------------|
| `security-analyst` | 🛡️ Security | Threat detection & auditing |
| `full-stack-dev` | 💻 Development | Coding & git mastery |
| `automation-expert` | ⚙️ Automation | Workflows & scheduling |
| `researcher` | 🔬 Research | Search & data mining |
| `devops` | ⚙️+💻 Hybrid | CI/CD mastery |
| `balanced` | All | General purpose |

## Integration

### Add XP to Your Skills

```javascript
const xp = require('talent-tree/global-xp');

// When your skill is used
xp.skillUsed('my-skill-name');

// On task completion
xp.taskCompleted('complex');

// Unlock achievement
xp.achievementUnlocked('first_deploy');
```

### Heartbeat Integration

```javascript
const { dailyHeartbeat } = require('talent-tree/global-xp');

// In your heartbeat
dailyHeartbeat(); // +1 XP per day
```

## API

### `handleCommand(command)`

Main entry point for CLI-style commands.

```javascript
const { handleCommand } = require('talent-tree/commands');

handleCommand('show');          // Display tree
handleCommand('spec security'); // Set specialization
handleCommand('upgrade git_master'); // Upgrade talent
```

### `awardSkillXP(skillName, options)`

Award XP when a skill is used.

```javascript
const { awardSkillXP } = require('talent-tree/xp-tracker');

const result = awardSkillXP('security-scanner');
// { awarded: 16, branch: 'security', totalXP: 116, ... }
```

### `applyPreset(presetName)`

Apply a preset build.

```javascript
const { applyPreset } = require('talent-tree/presets');

applyPreset('devops');
```

## Branches

### 🛡️ Security

| Talent | Level 5 Ability |
|--------|-----------------|
| Threat Scanner | Real-time threat radar |
| Audit Master | SOC2/ISO compliance |
| ClawdStrike Ultimate | Full security suite |

### 💻 Development  

| Talent | Level 5 Ability |
|--------|-----------------|
| Code Architect | Optimal pattern suggestions |
| Git Master | Advanced workflows |
| Refactor Legendary | Auto-refactoring |

### ⚙️ Automation

| Talent | Level 5 Ability |
|--------|-----------------|
| Workflow Builder | Complex multi-step chains |
| Cron Master | Smart scheduling |
| Auto-Evolver | Self-improving systems |

### 🔬 Research

| Talent | Level 5 Ability |
|--------|-----------------|
| Web Hunter | Deep search |
| Data Miner | Pattern extraction |
| Knowledge Synthesizer | Cross-domain connections |

## Combos

| Requirement | Combo | Effect |
|-------------|-------|--------|
| Security L3 + Automation L3 | Auto-Shield | Auto threat response |
| Development L5 + Research L3 | Code Oracle | Optimal solutions |
| Automation L5 + Any L3 | Megamind | Multi-agent orchestration |
| All branches L3+ | Ascended | Full potential |

## Data Storage

```
workspace/
├── .talent-tree.json      # Your talents & XP
├── .talent-analytics.json # Usage statistics
└── skills/talent-tree/    # This skill
```

## Export/Import

```bash
# Export your build
talent export > my-build.json

# Import a build
talent import my-build.json
```

## Screenshots

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
```

## Pricing

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Core system, 2 specializations |
| Pro | $9.99 | All branches, combos, analytics |
| Enterprise | $49.99 | Pro + custom branches, API |

## Changelog

### v1.1.0 (2026-02-20)
- Added presets for quick builds
- Added analytics tracking
- Added export/import
- Added demo mode

### v1.0.0 (2026-02-20)
- Initial release
- 4 talent branches
- XP progression
- Combo abilities

## License

MIT

---

*Build your agent. Forge your legend.* ⚔️