/**
 * Talent Presets - Quick start builds for common use cases
 */

const PRESETS = {
  'security-analyst': {
    name: '🔒 Security Analyst',
    description: 'Maximize threat detection and auditing capabilities',
    specialization: 'security',
    talents: {
      security: { threat_scanner: 5, audit_master: 5, clawdstrike_ultimate: 5 },
      development: { code_architect: 0, git_master: 0, refactor_legendary: 0 },
      automation: { workflow_builder: 0, cron_master: 0, auto_evolver: 0 },
      research: { web_hunter: 0, data_miner: 0, knowledge_synthesizer: 0 }
    },
    recommended: ['code_architect:2', 'workflow_builder:2'],
    unlocks: ['Auto-Shield combo at Automation L3']
  },

  'full-stack-dev': {
    name: '💻 Full-Stack Developer',
    description: 'Optimized for coding, refactoring, and git mastery',
    specialization: 'development',
    talents: {
      security: { threat_scanner: 0, audit_master: 0, clawdstrike_ultimate: 0 },
      development: { code_architect: 5, git_master: 5, refactor_legendary: 5 },
      automation: { workflow_builder: 0, cron_master: 0, auto_evolver: 0 },
      research: { web_hunter: 0, data_miner: 0, knowledge_synthesizer: 0 }
    },
    recommended: ['web_hunter:2', 'threat_scanner:1'],
    unlocks: ['Code Oracle combo at Research L3']
  },

  'automation-expert': {
    name: '⚙️ Automation Expert',
    description: 'Master of workflows, scheduling, and self-improvement',
    specialization: 'automation',
    talents: {
      security: { threat_scanner: 0, audit_master: 0, clawdstrike_ultimate: 0 },
      development: { code_architect: 0, git_master: 0, refactor_legendary: 0 },
      automation: { workflow_builder: 5, cron_master: 5, auto_evolver: 5 },
      research: { web_hunter: 0, data_miner: 0, knowledge_synthesizer: 0 }
    },
    recommended: ['threat_scanner:3', 'code_architect:2'],
    unlocks: ['Megamind combo at any other branch L3']
  },

  'researcher': {
    name: '🔬 Research Specialist',
    description: 'Deep search, data mining, and knowledge synthesis',
    specialization: 'research',
    talents: {
      security: { threat_scanner: 0, audit_master: 0, clawdstrike_ultimate: 0 },
      development: { code_architect: 0, git_master: 0, refactor_legendary: 0 },
      automation: { workflow_builder: 0, cron_master: 0, auto_evolver: 0 },
      research: { web_hunter: 5, data_miner: 5, knowledge_synthesizer: 5 }
    },
    recommended: ['code_architect:3', 'threat_scanner:2'],
    unlocks: ['Code Oracle combo at Development L5']
  },

  'balanced': {
    name: '⚖️ Balanced Agent',
    description: 'Well-rounded for general tasks',
    specialization: null,
    talents: {
      security: { threat_scanner: 2, audit_master: 2, clawdstrike_ultimate: 1 },
      development: { code_architect: 2, git_master: 2, refactor_legendary: 1 },
      automation: { workflow_builder: 2, cron_master: 2, auto_evolver: 1 },
      research: { web_hunter: 2, data_miner: 2, knowledge_synthesizer: 1 }
    },
    recommended: ['Focus on one branch for combos'],
    unlocks: ['Ascended combo when all branches reach L9 total']
  },

  'devops': {
    name: '🚀 DevOps Engineer',
    description: 'Development + Automation hybrid for CI/CD mastery',
    specialization: 'automation',
    talents: {
      security: { threat_scanner: 2, audit_master: 1, clawdstrike_ultimate: 0 },
      development: { code_architect: 3, git_master: 4, refactor_legendary: 2 },
      automation: { workflow_builder: 5, cron_master: 5, auto_evolver: 3 },
      research: { web_hunter: 1, data_miner: 0, knowledge_synthesizer: 0 }
    },
    recommended: ['audit_master:2 for compliance'],
    unlocks: ['Auto-Shield + Megamind combos']
  }
};

/**
 * Apply a preset to talent data
 */
function applyPreset(presetName, currentData = null) {
  const preset = PRESETS[presetName.toLowerCase().replace(/[_\s]/g, '-')];
  if (!preset) {
    return { success: false, error: `Preset "${presetName}" not found. Available: ${Object.keys(PRESETS).join(', ')}` };
  }

  const fs = require('fs');
  const path = require('path');
  const TALENT_FILE = path.join(process.env.WORKSPACE_PATH || process.cwd(), '.talent-tree.json');

  // Deep clone preset talents
  const talents = JSON.parse(JSON.stringify(preset.talents));

  const data = {
    version: '1.0.0',
    specialization: preset.specialization,
    points_available: 0, // Preset uses all points
    total_xp: Object.values(talents).reduce((sum, branch) => 
      sum + Object.values(branch).reduce((a, b) => a + b, 0), 0
    ) * 100, // Estimated XP
    level: 1 + Math.floor(Object.values(talents).reduce((sum, branch) => 
      sum + Object.values(branch).reduce((a, b) => a + b, 0), 0
    ) / 3),
    talents,
    combos_unlocked: [],
    achievements: ['preset_applied'],
    history: [{
      action: 'preset_applied',
      preset: presetName,
      timestamp: new Date().toISOString()
    }],
    created: currentData?.created || new Date().toISOString(),
    last_activity: new Date().toISOString(),
    preset: presetName
  };

  fs.writeFileSync(TALENT_FILE, JSON.stringify(data, null, 2));

  return {
    success: true,
    preset: preset.name,
    description: preset.description,
    specialization: preset.specialization,
    totalPoints: data.total_xp / 100,
    recommended: preset.recommended,
    message: `Preset "${preset.name}" applied! You're now a ${preset.description}.`
  };
}

/**
 * List available presets
 */
function listPresets() {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const cyan = '\x1b[36m';
  const yellow = '\x1b[33m';

  let output = `\n${bold}═══════════════════════════════════════════════════════════════${reset}
${bold}                    🎯 TALENT PRESETS${reset}
${bold}═══════════════════════════════════════════════════════════════${reset}\n\n`;

  for (const [key, preset] of Object.entries(PRESETS)) {
    const totalPoints = Object.values(preset.talents).reduce((sum, branch) => 
      sum + Object.values(branch).reduce((a, b) => a + b, 0), 0
    );
    
    output += `${preset.name}\n`;
    output += `${preset.description}\n`;
    output += `${yellow}Points: ${totalPoints}/60${reset} | Spec: ${preset.specialization || 'None'}\n`;
    output += `${cyan}Apply: talent preset ${key}${reset}\n\n`;
  }

  return output;
}

module.exports = {
  PRESETS,
  applyPreset,
  listPresets
};