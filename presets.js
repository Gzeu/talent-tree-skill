/**
 * Talent Presets - Quick start builds for common use cases
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const TALENT_FILE = process.env.TALENT_TREE_PATH ||
  path.join(os.homedir(), '.openclaw', 'workspace', '.talent-tree.json');

const PRESETS = {
  'security-analyst': {
    name: '🔒 Security Analyst',
    description: 'Maximize threat detection and auditing capabilities',
    specialization: 'security',
    talents: {
      security:    { threat_scanner: 5, audit_master: 5, clawdstrike_ultimate: 5 },
      development: { code_architect: 0, git_master: 0, refactor_legendary: 0 },
      automation:  { workflow_builder: 0, cron_master: 0, auto_evolver: 0 },
      research:    { web_hunter: 0, data_miner: 0, knowledge_synthesizer: 0 }
    },
    recommended: ['code_architect:2', 'workflow_builder:2'],
    unlocks: ['Auto-Shield combo at Automation L3']
  },
  'full-stack-dev': {
    name: '💻 Full-Stack Developer',
    description: 'Optimized for coding, refactoring, and git mastery',
    specialization: 'development',
    talents: {
      security:    { threat_scanner: 0, audit_master: 0, clawdstrike_ultimate: 0 },
      development: { code_architect: 5, git_master: 5, refactor_legendary: 5 },
      automation:  { workflow_builder: 0, cron_master: 0, auto_evolver: 0 },
      research:    { web_hunter: 0, data_miner: 0, knowledge_synthesizer: 0 }
    },
    recommended: ['web_hunter:2', 'threat_scanner:1'],
    unlocks: ['Code Oracle combo at Research L3']
  },
  'automation-expert': {
    name: '⚙️ Automation Expert',
    description: 'Master of workflows, scheduling, and self-improvement',
    specialization: 'automation',
    talents: {
      security:    { threat_scanner: 0, audit_master: 0, clawdstrike_ultimate: 0 },
      development: { code_architect: 0, git_master: 0, refactor_legendary: 0 },
      automation:  { workflow_builder: 5, cron_master: 5, auto_evolver: 5 },
      research:    { web_hunter: 0, data_miner: 0, knowledge_synthesizer: 0 }
    },
    recommended: ['threat_scanner:3', 'code_architect:2'],
    unlocks: ['Megamind combo at any other branch L3']
  },
  'researcher': {
    name: '🔬 Research Specialist',
    description: 'Deep search, data mining, and knowledge synthesis',
    specialization: 'research',
    talents: {
      security:    { threat_scanner: 0, audit_master: 0, clawdstrike_ultimate: 0 },
      development: { code_architect: 0, git_master: 0, refactor_legendary: 0 },
      automation:  { workflow_builder: 0, cron_master: 0, auto_evolver: 0 },
      research:    { web_hunter: 5, data_miner: 5, knowledge_synthesizer: 5 }
    },
    recommended: ['code_architect:3', 'threat_scanner:2'],
    unlocks: ['Code Oracle combo at Development L5']
  },
  'balanced': {
    name: '⚖️ Balanced Agent',
    description: 'Well-rounded for general tasks',
    specialization: null,
    talents: {
      security:    { threat_scanner: 2, audit_master: 2, clawdstrike_ultimate: 1 },
      development: { code_architect: 2, git_master: 2, refactor_legendary: 1 },
      automation:  { workflow_builder: 2, cron_master: 2, auto_evolver: 1 },
      research:    { web_hunter: 2, data_miner: 2, knowledge_synthesizer: 1 }
    },
    recommended: ['Focus on one branch for combos'],
    unlocks: ['Ascended combo when all branches reach L9 total']
  },
  'devops': {
    name: '🚀 DevOps Engineer',
    description: 'Development + Automation hybrid for CI/CD mastery',
    specialization: 'automation',
    talents: {
      security:    { threat_scanner: 2, audit_master: 1, clawdstrike_ultimate: 0 },
      development: { code_architect: 3, git_master: 4, refactor_legendary: 2 },
      automation:  { workflow_builder: 5, cron_master: 5, auto_evolver: 3 },
      research:    { web_hunter: 1, data_miner: 0, knowledge_synthesizer: 0 }
    },
    recommended: ['audit_master:2 for compliance'],
    unlocks: ['Auto-Shield + Megamind combos']
  }
};

function applyPreset(presetName, currentData = null) {
  const key = presetName.toLowerCase().replace(/[_\s]/g, '-');
  const preset = PRESETS[key];
  if (!preset) {
    return {
      success: false,
      error: `Preset "${presetName}" not found. Available: ${Object.keys(PRESETS).join(', ')}`
    };
  }

  const talents = JSON.parse(JSON.stringify(preset.talents));
  const totalSpent = Object.values(talents).reduce((sum, branch) =>
    sum + Object.values(branch).reduce((a, b) => a + b, 0), 0
  );

  const data = {
    version: '1.0.0',
    specialization: preset.specialization,
    points_available: 0,
    total_xp: totalSpent * 100,
    level: Math.floor((totalSpent * 100) / 500) + 1,
    talents,
    combos_unlocked: [],
    achievements: ['preset_applied'],
    history: [{ action: 'preset_applied', preset: key, timestamp: new Date().toISOString() }],
    created: currentData?.created || new Date().toISOString(),
    last_activity: new Date().toISOString(),
    preset: key
  };

  const dir = path.dirname(TALENT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TALENT_FILE, JSON.stringify(data, null, 2));

  return {
    success: true,
    preset: preset.name,
    description: preset.description,
    specialization: preset.specialization,
    totalPoints: totalSpent,
    recommended: preset.recommended,
    message: `Preset "${preset.name}" applied! ${preset.description}.`
  };
}

function listPresets() {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const cyan = '\x1b[36m';
  const yellow = '\x1b[33m';

  let output = `\n${bold}════════════════════════════════════════════════════════${reset}\n`;
  output += `${bold}                  🎯 TALENT PRESETS${reset}\n`;
  output += `${bold}════════════════════════════════════════════════════════${reset}\n\n`;

  for (const [key, preset] of Object.entries(PRESETS)) {
    const totalPoints = Object.values(preset.talents).reduce((sum, branch) =>
      sum + Object.values(branch).reduce((a, b) => a + b, 0), 0
    );
    output += `${preset.name}\n`;
    output += `   ${preset.description}\n`;
    output += `   ${yellow}Points: ${totalPoints}/60${reset} | Spec: ${preset.specialization || 'None'}\n`;
    output += `   ${cyan}Apply: talent preset ${key}${reset}\n\n`;
  }

  return output;
}

module.exports = { PRESETS, applyPreset, listPresets };
