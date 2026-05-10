/**
 * Talent Analytics - Track progression and usage
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Use same base dir as talent-manager for consistency
const BASE_DIR = process.env.TALENT_TREE_PATH
  ? path.dirname(process.env.TALENT_TREE_PATH)
  : path.join(os.homedir(), '.openclaw', 'workspace');

const TALENT_FILE    = process.env.TALENT_TREE_PATH || path.join(BASE_DIR, '.talent-tree.json');
const ANALYTICS_FILE = path.join(BASE_DIR, '.talent-analytics.json');

function ensureDir() {
  if (!fs.existsSync(BASE_DIR)) fs.mkdirSync(BASE_DIR, { recursive: true });
}

function initAnalytics() {
  ensureDir();
  if (!fs.existsSync(ANALYTICS_FILE)) {
    const initial = {
      daily: {},
      skills_used: {},
      branches_used: {},
      achievements_unlocked: [],
      presets_used: [],
      first_session: new Date().toISOString(),
      total_sessions: 0,
      total_xp_earned: 0,
      total_skills_used: 0,
      total_tasks_completed: 0
    };
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf8'));
  } catch (e) {
    console.error('Error reading analytics:', e.message);
    return null;
  }
}

function saveAnalytics(data) {
  ensureDir();
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
}

function trackSkillUsed(skillName, branch, xpEarned) {
  const analytics = initAnalytics();
  if (!analytics) return null;
  const today = new Date().toISOString().split('T')[0];

  if (!analytics.daily[today]) analytics.daily[today] = { xp: 0, skills: 0, tasks: 0 };
  analytics.daily[today].xp += xpEarned;
  analytics.daily[today].skills += 1;

  analytics.skills_used[skillName] = (analytics.skills_used[skillName] || 0) + 1;

  if (branch) {
    analytics.branches_used[branch] = (analytics.branches_used[branch] || 0) + 1;
  }

  analytics.total_xp_earned += xpEarned;
  analytics.total_skills_used += 1;
  analytics.total_sessions += 1;

  saveAnalytics(analytics);
  return analytics;
}

function trackTaskCompleted(complexity = 'normal') {
  const analytics = initAnalytics();
  if (!analytics) return null;
  const today = new Date().toISOString().split('T')[0];

  if (!analytics.daily[today]) analytics.daily[today] = { xp: 0, skills: 0, tasks: 0 };
  analytics.daily[today].tasks += 1;
  analytics.total_tasks_completed += 1;

  saveAnalytics(analytics);
  return analytics;
}

function trackAchievement(name) {
  const analytics = initAnalytics();
  if (!analytics) return null;
  analytics.achievements_unlocked.push({ name, timestamp: new Date().toISOString() });
  saveAnalytics(analytics);
  return analytics;
}

function getSummary(days = 7) {
  const analytics = initAnalytics();
  if (!analytics) return null;

  const talentData = fs.existsSync(TALENT_FILE)
    ? (() => { try { return JSON.parse(fs.readFileSync(TALENT_FILE, 'utf8')); } catch { return null; } })()
    : null;

  const result = {
    overview: {
      totalXP: analytics.total_xp_earned,
      totalSkills: analytics.total_skills_used,
      totalTasks: analytics.total_tasks_completed,
      sessions: analytics.total_sessions,
      firstSession: analytics.first_session
    },
    recent: { xp: 0, skills: 0, tasks: 0 },
    byBranch: analytics.branches_used,
    topSkills: Object.entries(analytics.skills_used)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count })),
    daily: [],
    achievements: analytics.achievements_unlocked.length,
    recommendations: []
  };

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  for (const [date, data] of Object.entries(analytics.daily)) {
    if (new Date(date) >= cutoff) {
      result.recent.xp += data.xp;
      result.recent.skills += data.skills;
      result.recent.tasks += data.tasks;
      result.daily.push({ date, ...data });
    }
  }

  result.daily.sort((a, b) => a.date.localeCompare(b.date));

  if (talentData) {
    const branches = ['security', 'development', 'automation', 'research'];
    const spec = talentData.specialization;

    for (const branch of branches) {
      const branchTotal = Object.values(talentData.talents[branch] || {}).reduce((a, b) => a + b, 0);
      const usage = analytics.branches_used[branch] || 0;

      if (branch === spec && branchTotal < 10) {
        result.recommendations.push({ type: 'level_up', branch,
          message: `Focus on ${branch} talents - used ${usage} times` });
      }
      if (branchTotal === 0 && usage > 5) {
        result.recommendations.push({ type: 'invest', branch,
          message: `Consider investing in ${branch} - used ${usage} times` });
      }
    }

    const t = talentData.talents;
    const sec  = Object.values(t.security    || {}).reduce((a, b) => a + b, 0);
    const auto = Object.values(t.automation  || {}).reduce((a, b) => a + b, 0);
    const dev  = Object.values(t.development || {}).reduce((a, b) => a + b, 0);
    const res  = Object.values(t.research    || {}).reduce((a, b) => a + b, 0);

    if (sec >= 3 && auto >= 2 && !talentData.combos_unlocked?.includes('auto_shield'))
      result.recommendations.push({ type: 'combo', name: 'Auto-Shield', message: '1 more Automation point for Auto-Shield!' });
    if (dev >= 4 && res >= 2 && !talentData.combos_unlocked?.includes('code_oracle'))
      result.recommendations.push({ type: 'combo', name: 'Code Oracle', message: 'Close to Code Oracle - invest in Dev & Research' });
  }

  return result;
}

function exportAnalytics() {
  const analytics = initAnalytics();
  const talentData = fs.existsSync(TALENT_FILE)
    ? (() => { try { return JSON.parse(fs.readFileSync(TALENT_FILE, 'utf8')); } catch { return null; } })()
    : null;
  return { exported_at: new Date().toISOString(), talent: talentData, analytics };
}

function importAnalytics(data) {
  if (data.analytics) saveAnalytics(data.analytics);
  if (data.talent) {
    ensureDir();
    fs.writeFileSync(TALENT_FILE, JSON.stringify(data.talent, null, 2));
  }
  return { success: true };
}

module.exports = {
  initAnalytics,
  trackSkillUsed,
  trackTaskCompleted,
  trackAchievement,
  getSummary,
  exportAnalytics,
  importAnalytics
};
