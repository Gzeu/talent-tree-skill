/**
 * Talent Tree - Enhanced Visual Display
 * WoW-style talent tree rendering
 */

const
 fs = require('fs');
const path = require('path');

const TALENT_FILE = path.join('C:', 'Users', 'el', '.openclaw', 'workspace', '.talent-tree.json');

const TREE_ART = {
  security: `
      ╭─────────────────────────────────────╮
      │           🛡️  SECURITY              │
      │         "Fortress of Shield"        │
      ╰─────────────────────────────────────╯
         │
         ├── 🎯 Threat Scanner
         │      └── "Detect malice before it strikes"
         │
         ├── 📋 Audit Master
         │      └── "Every action, recorded"
         │
         └── ⚔️ ClawdStrike Ultimate
                └── "Maximum security protocols"`,

  development: `
      ╭─────────────────────────────────────╮
      │           💻 DEVELOPMENT            │
      │         "Arcane Code Forge"         │
      ╰─────────────────────────────────────╯
         │
         ├── 🏗️ Code Architect
         │      └── "Build with precision"
         │
         ├── 🔀 Git Master
         │      └── "Control the timeline"
         │
         └── ✨ Refactor Legendary
                └── "Transform chaos to order"`,

  automation: `
      ╭─────────────────────────────────────╮
      │           ⚙️ AUTOMATION             │
      │         "Engine of Efficiency"      │
      ╰─────────────────────────────────────╯
         │
         ├── 🔄 Workflow Builder
         │      └── "Chains ofautomation"
         │
         ├── ⏰ Cron Master
         │      └── "Time bends to your will"
         │
         └── 🧬 Auto-Evolver
                └── "Self-improving systems"`,

  research: `
      ╭─────────────────────────────────────╮
      │           🔬 RESEARCH               │
      │         "Library of Infinite"       │
      ╰─────────────────────────────────────╯
         │
         ├── 🌐 Web Hunter
         │      └── "Nothing hides from sight"
         │
         ├── 📊 Data Miner
         │      └── "Extract truth from noise"
         │
         └── 🧠 Knowledge Synthesizer
                └── "Connect the unconnected"`
};

const TALENT_ICONS = {
  threat_scanner: '🎯',
  audit_master: '📋',
  clawdstrike_ultimate: '⚔️',
  code_architect: '🏗️',
  git_master: '🔀',
  refactor_legendary: '✨',
  workflow_builder: '🔄',
  cron_master: '⏰',
  auto_evolver: '🧬',
  web_hunter: '🌐',
  data_miner: '📊',
  knowledge_synthesizer: '🧠'
};

const TALENT_NAMES = {
  threat_scanner: 'Threat Scanner',
  audit_master: 'Audit Master',
  clawdstrike_ultimate: 'ClawdStrike Ultimate',
  code_architect: 'Code Architect',
  git_master: 'Git Master',
  refactor_legendary: 'Refactor Legendary',
  workflow_builder: 'Workflow Builder',
  cron_master: 'Cron Master',
  auto_evolver: 'Auto-Evolver',
  web_hunter: 'Web Hunter',
  data_miner: 'Data Miner',
  knowledge_synthesizer: 'Knowledge Synthesizer'
};

const BRANCH_COLORS = {
  security: '\x1b[31m',     // Red
  development: '\x1b[32m', // Green
  automation: '\x1b[33m',  // Yellow
  research: '\x1b[36m'     // Cyan
};

const RANKS = ['', '★', '★★', '★★★', '★★★★', '★★★★★'];

function renderProgressBar(current, max, width = 10) {
  const filled = Math.floor((current / max) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}]`;
}

function renderTalentTree(data, focusBranch = null) {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const dim = '\x1b[2m';
  const gold = '\x1b[38;5;220m';
  const purple = '\x1b[38;5;141m';

  // Header
  const specDisplay = data.specialization 
    ? `${BRANCH_COLORS[data.specialization]}${branchEmojis[data.specialization]} ${data.specialization.toUpperCase()}${reset}` 
    : 'None';

  let output = `
${gold}╔══════════════════════════════════════════════════════════════════╗${reset}
${gold}║${reset}                    ${bold}${purple}🌳 TALENT TREE SYSTEM 🌳${reset}                    ${gold}║${reset}
${gold}╠══════════════════════════════════════════════════════════════════╣${reset}
${gold}║${reset}   ${bold}Level:${reset} ${(data.level || 1).toString().padEnd(3)}     ${bold}XP:${reset} ${(data.total_xp || 0).toString().padEnd(6)}   ${bold}Points:${reset} ${(data.points_available || 0).toString().padEnd(2)}        ${gold}║${reset}
${gold}║${reset}   ${bold}Spec:${reset} ${specDisplay.padEnd(50)}${gold}║${reset}
${gold}╚══════════════════════════════════════════════════════════════════╝${reset}

`;

  // If focusing on one branch, show detailed view
  if (focusBranch && TREE_ART[focusBranch]) {
    output += `${BRANCH_COLORS[focusBranch]}${TREE_ART[focusBranch]}${reset}\n\n`;
  }

  // Compact view of all branches
  output += `${bold}┌────────────────────────────────────────────────────────────────┐${reset}\n`;

  const branches = ['security', 'development', 'automation', 'research'];
  const branchEmojis = { security: '🛡️', development: '💻', automation: '⚙️', research: '🔬' };

  for (const branch of branches) {
    const isSpec = data.specialization === branch;
    const color = BRANCH_COLORS[branch];
    const talents = data.talents?.[branch] || {};
    const total = Object.values(talents).reduce((a, b) => a + b, 0);
    const maxTotal = 15; // 5 talents * 3 talents per branch

    const marker = isSpec ? '★' : ' ';
    const progress = renderProgressBar(total, maxTotal, 15);

    output += `${bold}│${reset} ${marker}${color}${bold}${branchEmojis[branch]} ${branch.toUpperCase().padEnd(12)}${reset} ${progress} ${total}/15 `;
    output += isSpec ? `${gold}(SPECIALIZED)${reset}` : '             ';
    output += `\n${bold}│${reset}   `;

    // Show individual talents
    const talentKeys = Object.keys(talents);
    for (const key of talentKeys) {
      const level = talents[key];
      const icon = TALENT_ICONS[key] || '•';
      if (level > 0) {
        output += `${color}${icon}${level}${reset} `;
      } else {
        output += `${dim}${icon}0${reset} `;
      }
    }
    output += `\n${bold}│${reset}`.padEnd(65) + `\n`;
  }

  output += `${bold}└────────────────────────────────────────────────────────────────┘${reset}\n`;

  // Combos section
  if (data.combos_unlocked?.length > 0) {
    output += `\n${gold}⚡ UNLOCKED COMBOS:${reset}\n`;
    for (const combo of data.combos_unlocked) {
      output += `   ${gold}★${reset}${combo.replace(/_/g, ' ').toUpperCase()}\n`;
    }
  }

  // Achievements
  if (data.achievements?.length > 0) {
    output += `\n${purple}🏆 ACHIEVEMENTS:${reset} ${data.achievements.length}\n`;
  }

  return output;
}

function renderTalentDetail(data, branch, talentKey) {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const color = BRANCH_COLORS[branch];
  const level = data.talents?.[branch]?.[talentKey] || 0;
  const icon = TALENT_ICONS[talentKey] || '•';
  const name = TALENT_NAMES[talentKey] || talentKey;

  let output = `
${color}${bold}╭─────────────────────────────────────╮${reset}
${color}${bold}│${reset}  ${icon}${bold}${name.toUpperCase()}${reset}${' '.repeat(Math.max(0, 30 - name.length))}${color}${bold}│${reset}
${color}${bold}╰─────────────────────────────────────╯${reset}

   Level: ${'★'.repeat(level)}${'☆'.repeat(5 - level)} (${level}/5)
   
   ${renderProgressBar(level, 5, 20)}

`;

  // Talent descriptions by level
  const descriptions = {
    threat_scanner: {
      1: '+10% malware detection',
      2: '+20% anomaly alerts',
      3: '+30% threat intelligence',
      4: '+40% proactive blocking',
      5: 'MAX: Real-time threat radar'
    },
    audit_master: {
      1: 'Basic compliance checks',
      2: 'Detailed vulnerability scans',
      3: 'Audit trail generation',
      4: 'Compliance report builder',
      5: 'MAX: Full SOC2/ISO compliance'
    }
    // Add more as needed
  };

  if (descriptions[talentKey]) {
    output += `   ${bold}ABILITIES:${reset}\n`;
    for (let i = 1; i <= 5; i++) {
      const unlocked = i <= level;
      const prefix = unlocked ? '✅' : '🔒';
      const desc = descriptions[talentKey][i] || `Level ${i} ability`;
      output += `   ${prefix}${i}. ${desc}\n`;
    }
  }

  return output;
}

function renderXPGain(xp, source, branch) {
  const reset = '\x1b[0m';
  const gold = '\x1b[38;5;220m';
  const green = '\x1b[32m';
  const color = branch ? BRANCH_COLORS[branch] : green;

  return `
${gold}│${reset} ${color}${bold}+${xp} XP${reset} from ${source}${gold}│${reset}
`;
}

module.exports = {
  renderTalentTree,
  renderTalentDetail,
  renderProgressBar,
  renderXPGain,
  TREE_ART,
  TALENT_ICONS,
  TALENT_NAMES,
  BRANCH_COLORS,
  RANKS
};