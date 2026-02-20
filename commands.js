/**
 * Talent Tree Commands
 * CLI-style commands for managing talents
 */

const {
  loadTalentData,
  renderTree,
  upgradeTalent,
  setSpecialization,
  checkCombos,
  TREES,
  TALENT_NAMES
} = require('./talent-manager');
const { awardSkillXP, awardAchievement, checkAndUnlockCombos } = require('./xp-tracker');

const COMMANDS = {
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

function displayTree() {
  const data = loadTalentData();
  if (!data) {
    return '❌ No talent data found. Initialize with `talent init`';
  }
  
  let output = renderTree(data);
  
  // Check for unlocked combos
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
    // Award achievement
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
  if (!data) {
    return '❌ No talent data found.';
  }
  
  const result = upgradeTalent(talentName);
  
  if (result.success) {
    // Check for new combos
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
  if (!data) {
    return '❌ No talent data found.';
  }
  
  // Calculate totals
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
    output += `   ${marker} ${info.emoji} ${branch.padEnd(15)} ${'█'.repeat(total)}${'░'.repeat(15 - total)} ${total}/15\n`;
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
  
  // Recent activity
  const recent = data.history.slice(-5);
  if (recent.length > 0) {
    output += `\n📜 RECENT ACTIVITY:\n`;
    for (const h of recent.reverse()) {
      const time = new Date(h.timestamp).toLocaleString('ro-RO');
      output += `   ${time} - ${h.action}\n`;
    }
  }
  
  return output;
}

function resetTalents() {
  const data = loadTalentData();
  if (!data) {
    return '❌ No talent data found.';
  }
  
  const totalPoints = Object.values(data.talents).reduce((sum, branch) => {
    return sum + Object.values(branch).reduce((a, b) => a + b, 0);
  }, 0);
  
  data.specialization = null;
  data.points_available = 3 + totalPoints; // Base points + refunded
  data.total_xp = 0;
  data.level = 1;
  
  for (const branch of Object.keys(data.talents)) {
    for (const talent of Object.keys(data.talents[branch])) {
      data.talents[branch][talent] = 0;
    }
  }
  
  data.combos_unlocked = [];
  data.achievements = [];
  data.history.push({
    action: 'reset',
    timestamp: new Date().toISOString()
  });
  
  const { saveTalentData } = require('./talent-manager');
  saveTalentData(data);
  
  return `🔄 TALENTS RESET!
   Refunded: ${totalPoints} points
   New total: ${data.points_available} points
   
Choose your new path: talent spec <branch>`;
}

function showHelp() {
  return `
🌳 TALENT TREE COMMANDS
═══════════════════════════════════

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
  talent spec security
  talent upgrade "threat scanner"
  talent upgrade git-master
`;
}

/**
 * Main command handler
 */
function handleCommand(input) {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  const args = parts.slice(1).join(' ');
  
  if (!cmd || cmd === 'talent') {
    // Just "talent" shows the tree
    return displayTree();
  }
  
  const handler = COMMANDS[cmd];
  if (handler) {
    return handler(args);
  }
  
  // Try to interpret as talent name for upgrade
  return upgrade(cmd + ' ' + args);
}

module.exports = {
  handleCommand,
  COMMANDS,
  displayTree,
  setSpec,
  upgrade,
  showProgress,
  showHelp
};