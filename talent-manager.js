/**
 * Talent Tree Manager
 * Manages agent talents, XP, and specializations
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const TALENT_FILE = process.env.TALENT_TREE_PATH ||
  path.join(os.homedir(), '.openclaw', 'workspace', '.talent-tree.json');

// Talent definitions
const TREES = {
  security: {
    emoji: '🛡️',
    color: '\x1b[31m',
    talents: ['threat_scanner', 'audit_master', 'clawdstrike_ultimate']
  },
  development: {
    emoji: '💻',
    color: '\x1b[32m',
    talents: ['code_architect', 'git_master', 'refactor_legendary']
  },
  automation: {
    emoji: '⚙️',
    color: '\x1b[33m',
    talents: ['workflow_builder', 'cron_master', 'auto_evolver']
  },
  research: {
    emoji: '🔬',
    color: '\x1b[36m',
    talents: ['web_hunter', 'data_miner', 'knowledge_synthesizer']
  }
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

// Skill to branch mapping
const SKILL_TO_BRANCH = {
  // Security
  'clawdstrike': 'security',
  'skillguard': 'security',
  'prompt-guard': 'security',
  'healthcheck': 'security',
  'security': 'security',
  'agent-security': 'security',
  'threat': 'security',
  'audit': 'security',

  // Development
  'git': 'development',
  'github': 'development',
  'git-summary': 'development',
  'git-workflows': 'development',
  'gitai': 'development',
  'coding-agent': 'development',
  'manim': 'development',
  'refactor': 'development',
  'code': 'development',

  // Automation
  'cron': 'automation',
  'agent-orchestrator': 'automation',
  'cc-godmode': 'automation',
  'evolver': 'automation',
  'deployment': 'automation',
  'deploy': 'automation',
  'docker': 'automation',
  'workflow': 'automation',
  'auto': 'automation',

  // Research
  'web_search': 'research',
  'web_fetch': 'research',
  'memory': 'research',
  'tenzing': 'research',
  'moltbook': 'research',
  'search': 'research',
  'research': 'research',
  'data': 'research'
};

const HISTORY_LIMIT = 200;

function loadTalentData() {
  try {
    if (fs.existsSync(TALENT_FILE)) {
      return JSON.parse(fs.readFileSync(TALENT_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading talent data:', e.message);
  }
  return null;
}

function saveTalentData(data) {
  data.last_activity = new Date().toISOString();
  // Prune history to avoid unbounded file growth
  if (data.history && data.history.length > HISTORY_LIMIT) {
    data.history = data.history.slice(-HISTORY_LIMIT);
  }
  const dir = path.dirname(TALENT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TALENT_FILE, JSON.stringify(data, null, 2));
}

function renderTree(data) {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const dim = '\x1b[2m';

  let output = `\n${bold} ╔══════════════════════════════════════════════════════════════╗ ${reset}\n`;
  output += `${bold} ║                🌳 TALENT TREE SYSTEM 🌳                      ║ ${reset}\n`;
  output += `${bold} ╠══════════════════════════════════════════════════════════════╣ ${reset}\n`;
  output += `${bold} ║${reset} Level: ${data.level}  |  XP: ${data.total_xp}  |  Points: ${data.points_available}  |  Spec: ${data.specialization || 'None'}\n`;
  output += `${bold} ╚══════════════════════════════════════════════════════════════╝ ${reset}\n\n`;

  for (const [branch, info] of Object.entries(TREES)) {
    const isSpec = data.specialization === branch;
    const marker = isSpec ? '★' : ' ';
    const branchColor = info.color;

    output += `${branchColor}${bold}  ${marker} ${info.emoji} ${branch.toUpperCase()}${reset}\n`;
    output += `  ${dim}├────────────────────────${reset}\n`;

    for (const talent of info.talents) {
      const level = data.talents[branch][talent];
      const name = TALENT_NAMES[talent];
      const bar = '█'.repeat(level) + '░'.repeat(5 - level);
      output += `  │  ${name.padEnd(22)} [${bar}] ${level}/5\n`;
    }
    output += '\n';
  }

  return output;
}

function addXP(amount, source = 'activity') {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return null;
  }
  const data = loadTalentData();
  if (!data) return null;

  const oldPointsEarned = Math.floor(data.total_xp / 100);
  data.total_xp += amount;
  const newPointsEarned = Math.floor(data.total_xp / 100);

  if (newPointsEarned > oldPointsEarned) {
    data.points_available += (newPointsEarned - oldPointsEarned);
    data.level = Math.floor(data.total_xp / 500) + 1;
  }

  data.history.push({
    action: 'xp_gained',
    amount,
    source,
    timestamp: new Date().toISOString()
  });

  saveTalentData(data);
  return data;
}

function upgradeTalent(talentName) {
  const data = loadTalentData();
  if (!data) return { success: false, error: 'No talent data found' };

  let foundBranch = null;
  let foundTalent = null;

  for (const [branch, talents] of Object.entries(data.talents)) {
    const normalized = talentName.toLowerCase().replace(/[\s-]/g, '_');
    if (talents[normalized] !== undefined) {
      foundBranch = branch;
      foundTalent = normalized;
      break;
    }
  }

  if (!foundTalent) {
    return { success: false, error: `Talent "${talentName}" not found` };
  }

  const currentLevel = data.talents[foundBranch][foundTalent];
  if (currentLevel >= 5) {
    return { success: false, error: 'Talent already at max level (5)' };
  }

  if (data.points_available < 1) {
    return { success: false, error: 'No talent points available' };
  }

  data.talents[foundBranch][foundTalent] = currentLevel + 1;
  data.points_available -= 1;
  data.history.push({
    action: 'upgrade',
    talent: foundTalent,
    branch: foundBranch,
    new_level: currentLevel + 1,
    timestamp: new Date().toISOString()
  });

  saveTalentData(data);

  return {
    success: true,
    talent: TALENT_NAMES[foundTalent],
    newLevel: currentLevel + 1,
    pointsRemaining: data.points_available
  };
}

function setSpecialization(branch) {
  const data = loadTalentData();
  if (!data) return { success: false, error: 'No talent data found' };

  const normalized = branch.toLowerCase();
  if (!TREES[normalized]) {
    return { success: false, error: `Invalid branch: ${branch}. Valid: security, development, automation, research` };
  }

  const oldSpec = data.specialization;
  data.specialization = normalized;

  if (!data.achievements.includes('first_specialization')) {
    data.achievements.push('first_specialization');
  }

  data.history.push({
    action: 'specialization_change',
    from: oldSpec,
    to: normalized,
    timestamp: new Date().toISOString()
  });

  saveTalentData(data);

  return {
    success: true,
    specialization: normalized,
    emoji: TREES[normalized].emoji,
    message: `Specialization set to ${normalized.toUpperCase()}! +20% XP for ${normalized} activities.`
  };
}

function checkCombos(data) {
  const combos = [];
  const talents = data.talents;

  const secTotal = Object.values(talents.security).reduce((a, b) => a + b, 0);
  const autoTotal = Object.values(talents.automation).reduce((a, b) => a + b, 0);
  const devTotal = Object.values(talents.development).reduce((a, b) => a + b, 0);
  const resTotal = Object.values(talents.research).reduce((a, b) => a + b, 0);

  if (secTotal >= 3 && autoTotal >= 3 && !data.combos_unlocked.includes('auto_shield')) {
    combos.push({ name: 'auto_shield', desc: '🛡️⚙️ Auto-Shield - Automatic threat response' });
  }

  if (devTotal >= 5 && resTotal >= 3 && !data.combos_unlocked.includes('code_oracle')) {
    combos.push({ name: 'code_oracle', desc: '💻🔮 Code Oracle - Find optimal solutions' });
  }

  if (autoTotal >= 5 && (secTotal >= 3 || devTotal >= 3 || resTotal >= 3) && !data.combos_unlocked.includes('megamind')) {
    combos.push({ name: 'megamind', desc: '🧠⚡ Megamind - Multi-agent orchestration' });
  }

  if (secTotal >= 3 && devTotal >= 3 && autoTotal >= 3 && resTotal >= 3 && !data.combos_unlocked.includes('ascended')) {
    combos.push({ name: 'ascended', desc: '🌟 Ascended - Full agent potential unlocked!' });
  }

  return combos;
}

module.exports = {
  loadTalentData,
  saveTalentData,
  renderTree,
  addXP,
  upgradeTalent,
  setSpecialization,
  checkCombos,
  TREES,
  TALENT_NAMES,
  SKILL_TO_BRANCH
};
