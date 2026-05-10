/**
 * Talent Tree Commands
 * CLI-style commands for managing talents
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  loadTalentData,
  saveTalentData,
  renderTree,
  upgradeTalent,
  setSpecialization,
  checkCombos,
  TREES,
  TALENT_NAMES
} = require('./talent-manager');
const { awardSkillXP, awardAchievement, checkAndUnlockCombos } = require('./xp-tracker');

const TALENT_FILE = process.env.TALENT_TREE_PATH ||
  path.join(os.homedir(), '.openclaw', 'workspace', '.talent-tree.json');

const COMMANDS = {
  init: initTalents,
  show: displayTree,
  tree: displayTree,
  spec: setSpec,
  choose: setSpec,
  upgrade: upgrade,
  spend: upgrade,
  progress: showProgress,
  stats: showProgress,
  reset: resetTalents,
  help: showHelp
};

function initTalents() {
  if (fs.existsSync(TALENT_FILE)) {
    return '⚠️  Talent tree already initialized. Use `talent show` to view it.\n   To start over: talent reset';
  }

  const initial = {
    level: 1,
    total_xp: 0,
    points_available: 3,
    specialization: null,
    talents: {
      security:    { threat_scanner: 0, audit_master: 0, clawdstrike_ultimate: 0 },
      development: { code_architect: 0, git_master: 0, refactor_legendary: 0 },
      automation:  { workflow_builder: 0, cron_master: 0, auto_evolver: 0 },
      research:    { web_hunter: 0, data_miner: 0, knowledge_synthesizer: 0 }
    },
    achievements: [],
    combos_unlocked: [],
    history: [{ action: 'init', timestamp: new Date().toISOString() }],
    last_activity: new Date().toISOString()
  };

  const dir = path.dirname(TALENT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TALENT_FILE, JSON.stringify(initial, null, 2));

  return `✅ Talent tree initialized!

🌳 You start with 3 talent points.

Next steps:
  1. Choose a specialization: talent spec <security|development|automation|research>
  2. Upgrade a talent:        talent upgrade <talent-name>
  3. View your tree:          talent show

Run \`talent help\` for all commands.`;
}

function displayTree() {
  const data = loadTalentData();
  if (!data) {
    return '❌ No talent data found. Run `talent init` first.';
  }

  let output = renderTree(data);

  if (data.combos_unlocked.length > 0) {
    output += '\n🌟 UNLOCKED COMBOS:\n';
    for (const combo of data.combos_unlocked) {
      output += `   ✅ ${combo}\n`;
    }
  }

  return output;
}

function setSpec(branch) {
  if (!branch) {
    return '❌ Usage: talent spec <branch>\n   Valid branches: security, development, automation, research';
  }

  const result = setSpecialization(branch);

  if (result.success) {
    awardAchievement('first_specialization');
    return `✅ ${result.message}

${result.emoji} You are now specialized in ${result.specialization.toUpperCase()}!

Bonus: +20% XP for all ${result.specialization} activities.
Available talent points: ${loadTalentData().points_available}`;
  } else {
    return `❌ ${result.error}`;
  }
}

function upgrade(talentName) {
  if (!talentName) {
    return '❌ Usage: talent upgrade <talent-name>\n   Example: talent upgrade "threat scanner"';
  }

  const data = loadTalentData();
  if (!data) return '❌ No talent data found. Run `talent init` first.';

  const result = upgradeTalent(talentName);

  if (result.success) {
    const newCombos = checkAndUnlockCombos();

    let output = `✅ ${result.talent} upgraded to level ${result.newLevel}/5!
   Points remaining: ${result.pointsRemaining}`;

    if (newCombos.length > 0) {
      output += '\n\n🌟 COMBO UNLOCKED!\n';
      for (const combo of newCombos) {
        output += `   ${combo.desc}\n`;
      }
    }

    return output;
  } else {
    return `❌ ${result.error}`;
  }
}

function showProgress() {
  const data = loadTalentData();
  if (!data) return '❌ No talent data found. Run `talent init` first.';

  const totals = {};
  let grandTotal = 0;

  for (const [branch, talents] of Object.entries(data.talents)) {
    const sum = Object.values(talents).reduce((a, b) => a + b, 0);
    totals[branch] = sum;
    grandTotal += sum;
  }

  let output = `
📊 PROGRESS REPORT
═══════════════════════════════════

👤 Level: ${data.level}
⭐ Total XP: ${data.total_xp}
🎯 Points Available: ${data.points_available}
🛡️ Specialization: ${data.specialization ? data.specialization.toUpperCase() : 'None'}

📈 TALENT PROGRESS:
`;

  for (const [branch, total] of Object.entries(totals)) {
    const info = TREES[branch];
    const isSpec = data.specialization === branch;
    const marker = isSpec ? '★' : ' ';
    output += `   ${marker} ${info.emoji} ${branch.padEnd(15)} ${'\u2588'.repeat(total)}${'\u2591'.repeat(15 - total)} ${total}/15\n`;
  }

  output += `\n   Grand Total: ${grandTotal}/60 talent points\n`;

  if (data.achievements.length > 0) {
    output += `\n🏆 ACHIEVEMENTS (${data.achievements.length}):\n`;
    for (const ach of data.achievements) {
      output += `   ✅ ${ach}\n`;
    }
  }

  if (data.combos_unlocked.length > 0) {
    output += `\n🌟 COMBOS (${data.combos_unlocked.length}):\n`;
    for (const combo of data.combos_unlocked) {
      output += `   ✅ ${combo}\n`;
    }
  }

  const recent = data.history.slice(-5).reverse();
  if (recent.length > 0) {
    output += `\n📜 RECENT ACTIVITY:\n`;
    for (const h of recent) {
      const time = new Date(h.timestamp).toLocaleString('ro-RO');
      output += `   ${time} - ${h.action}\n`;
    }
  }

  return output;
}

function resetTalents() {
  const data = loadTalentData();
  if (!data) return '❌ No talent data found. Run `talent init` first.';

  // Count spent points (sum of all talent levels)
  const spentPoints = Object.values(data.talents).reduce((sum, branch) =>
    sum + Object.values(branch).reduce((a, b) => a + b, 0), 0
  );

  // Earned points = floor(total_xp / 100), refund all of them
  const earnedPoints = Math.floor(data.total_xp / 100);
  const basePoints = 3;

  // Reset talents
  for (const branch of Object.keys(data.talents)) {
    for (const talent of Object.keys(data.talents[branch])) {
      data.talents[branch][talent] = 0;
    }
  }

  data.specialization = null;
  data.points_available = basePoints + earnedPoints;
  data.combos_unlocked = [];
  data.achievements = [];
  data.history.push({ action: 'reset', timestamp: new Date().toISOString() });

  saveTalentData(data);

  return `🔄 TALENTS RESET!
   Refunded: ${spentPoints} spent points
   Total available: ${data.points_available} points (${basePoints} base + ${earnedPoints} earned)

Choose your new path: talent spec <branch>`;
}

function showHelp() {
  return `
🌳 TALENT TREE COMMANDS
═══════════════════════════════════

talent init              - Initialize your talent tree
talent show              - Show your talent tree
talent tree              - Same as show
talent spec <branch>     - Choose specialization
talent choose <branch>   - Same as spec

talent upgrade <talent>  - Spend 1 point to upgrade
talent spend <talent>    - Same as upgrade

talent progress          - Show detailed stats
talent stats             - Same as progress

talent reset             - Reset all talents (refunds points)
talent help              - This help message

BRANCHES:
  🛡️ security    - Threat detection, auditing, protection
  💻 development - Coding, git, refactoring
  ⚙️ automation  - Workflows, scheduling, orchestration
  🔬 research    - Searching, data mining, knowledge

EXAMPLES:
  talent init
  talent spec security
  talent upgrade "threat scanner"
  talent upgrade git-master
  talent progress
`;
}

function handleCommand(input) {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  const args = parts.slice(1).join(' ');

  if (!cmd || cmd === 'talent') {
    return displayTree();
  }

  const handler = COMMANDS[cmd];
  if (handler) {
    return handler(args || undefined);
  }

  return upgrade(cmd + (args ? ' ' + args : ''));
}

module.exports = {
  handleCommand,
  COMMANDS,
  initTalents,
  displayTree,
  setSpec,
  upgrade,
  showProgress,
  resetTalents,
  showHelp
};
