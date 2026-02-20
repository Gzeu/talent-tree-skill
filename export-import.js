/**
 * Export/Import functionality
 * Backup and share talent builds
 */

const fs = require('fs');
const path = require('path');

const TALENT_FILE = path.join(process.env.WORKSPACE_PATH || process.cwd(), '.talent-tree.json');
const ANALYTICS_FILE = path.join(process.env.WORKSPACE_PATH || process.cwd(), '.talent-analytics.json');

/**
 * Export talent build to JSON
 */
function exportBuild(includeAnalytics = true) {
  const build = {
    exported_at: new Date().toISOString(),
    version: '1.0.0',
    type: 'talent-tree-build'
  };

  // Load talent data
  if (fs.existsSync(TALENT_FILE)) {
    build.talent = JSON.parse(fs.readFileSync(TALENT_FILE, 'utf8'));
  } else {
    return { success: false, error: 'No talent data found' };
  }

  // Optionally include analytics
  if (includeAnalytics && fs.existsSync(ANALYTICS_FILE)) {
    build.analytics = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf8'));
  }

  return {
    success: true,
    build,
    json: JSON.stringify(build, null, 2)
  };
}

/**
 * Import talent build from JSON
 */
function importBuild(jsonString, options = {}) {
  let build;
  
  try {
    build = JSON.parse(jsonString);
  } catch (e) {
    return { success: false, error: 'Invalid JSON' };
  }

  // Validate
  if (build.type !== 'talent-tree-build') {
    return { success: false, error: 'Not a valid talent build file' };
  }

  if (!build.talent) {
    return { success: false, error: 'No talent data in build' };
  }

  // Backup current data
  const backup = {
    timestamp: new Date().toISOString(),
    talent: fs.existsSync(TALENT_FILE) 
      ? JSON.parse(fs.readFileSync(TALENT_FILE, 'utf8'))
      : null,
    analytics: fs.existsSync(ANALYTICS_FILE)
      ? JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf8'))
      : null
  };

  // Import talent data
  const talentData = {
    ...build.talent,
    imported_at: new Date().toISOString(),
    imported_from: build.exported_at
  };
  fs.writeFileSync(TALENT_FILE, JSON.stringify(talentData, null, 2));

  // Import analytics if provided and enabled
  if (options.includeAnalytics && build.analytics) {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(build.analytics, null, 2));
  }

  return {
    success: true,
    message: `Imported build from ${build.exported_at}`,
    specialization: build.talent.specialization,
    level: talentData.level,
    points: talentData.points_available,
    backup
  };
}

/**
 * Share build as URL-safe string
 */
function shareBuild() {
  const result = exportBuild(false);
  if (!result.success) return result;

  // Compress to base64
  const compressed = Buffer.from(result.json).toString('base64');
  
  return {
    success: true,
    code: compressed,
    url: `https://clawhub.com/skills/talent-tree/import#${compressed}`,
    usage: 'Share this code or URL with others'
  };
}

/**
 * Import from share code
 */
function importFromCode(code) {
  try {
    const json = Buffer.from(code, 'base64').toString('utf8');
    return importBuild(json);
  } catch (e) {
    return { success: false, error: 'Invalid share code' };
  }
}

/**
 * Compare two builds
 */
function compareBuilds(build1, build2) {
  const diff = {
    specialization: { 
      old: build1.specialization, 
      new: build2.specialization,
      changed: build1.specialization !== build2.specialization 
    },
    level: { old: build1.level, new: build2.level },
    points: { old: build1.points_available, new: build2.points_available },
    talents: {},
    combos: {
      added: (build2.combos_unlocked || []).filter(c => !(build1.combos_unlocked || []).includes(c)),
      removed: (build1.combos_unlocked || []).filter(c => !(build2.combos_unlocked || []).includes(c))
    }
  };

  // Compare talents
  for (const branch of ['security', 'development', 'automation', 'research']) {
    diff.talents[branch] = {};
    for (const talent of Object.keys(build1.talents[branch] || {})) {
      const oldVal = build1.talents[branch]?.[talent] || 0;
      const newVal = build2.talents[branch]?.[talent] || 0;
      if (oldVal !== newVal) {
        diff.talents[branch][talent] = { old: oldVal, new: newVal, diff: newVal - oldVal };
      }
    }
  }

  return diff;
}

/**
 * Generate build summary text
 */
function generateSummary(build) {
  if (!build || !build.talent) return 'No build data';

  const t = build.talent;
  const totalPoints = Object.values(t.talents).reduce((sum, branch) => 
    sum + Object.values(branch).reduce((a, b) => a + b, 0), 0
  );

  let summary = `🌳 Talent Build Summary\n`;
  summary += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  summary += `Level: ${t.level}\n`;
  summary += `Spec: ${t.specialization || 'None'}\n`;
  summary += `Points: ${totalPoints}/60\n\n`;

  for (const [branch, talents] of Object.entries(t.talents)) {
    const total = Object.values(talents).reduce((a, b) => a + b, 0);
    const emojis = { security: '🛡️', development: '💻', automation: '⚙️', research: '🔬' };
    const marker = t.specialization === branch ? '★' : ' ';
    summary += `${marker}${emojis[branch]} ${branch.toUpperCase()}: ${total}/15\n`;
  }

  if (t.combos_unlocked?.length > 0) {
    summary += `\n⚡ Combos: ${t.combos_unlocked.join(', ')}`;
  }

  return summary;
}

module.exports = {
  exportBuild,
  importBuild,
  shareBuild,
  importFromCode,
  compareBuilds,
  generateSummary
};