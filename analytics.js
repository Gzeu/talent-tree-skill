/**
 * Talent Analytics - Track progression and usage
 */

const fs = require('fs');
const path = require('path');

const TALENT_FILE = path.join(process.env.WORKSPACE_PATH || process.cwd(), '.talent-tree.json');
const ANALYTICS_FILE = path.join(process.env.WORKSPACE_PATH || process.cwd(), '.talent-analytics.json');

/**
 * Initialize analytics storage
 */
function initAnalytics() {
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
  }
  return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf8'));
}

/**
 * Save analytics
 */
function saveAnalytics(data) {
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
}

/**
 * Track skill usage
 */
function trackSkillUsed(skillName, branch, xpEarned) {
  const analytics = initAnalytics();
  const today = new Date().toISOString().split('T')[0];

  // Daily tracking
  if (!analytics.daily[today]) {
    analytics.daily[today] = { xp: 0, skills: 0, tasks: 0 };
  }
  analytics.daily[today].xp += xpEarned;
  analytics.daily[today].skills += 1;

  // Skill tracking
  if (!analytics.skills_used[skillName]) {
    analytics.skills_used[skillName] = 0;
  }
  analytics.skills_used[skillName] += 1;

  // Branch tracking
  if (branch) {
    if (!analytics.branches_used[branch]) {
      analytics.branches_used[branch] = 0;
    }
    analytics.branches_used[branch] += 1;
  }

  // Totals
  analytics.total_xp_earned += xpEarned;
  analytics.total_skills_used += 1;
  analytics.total_sessions += 1;

  saveAnalytics(analytics);
  return analytics;
}

/**
 * Track task completion
 */
function trackTaskCompleted(complexity = 'normal') {
  const analytics = initAnalytics();
  const today = new Date().toISOString().split('T')[0];

  if (!analytics.daily[today]) {
    analytics.daily[today] = { xp: 0, skills: 0, tasks: 0 };
  }
  analytics.daily[today].tasks += 1;

  analytics.total_tasks_completed += 1;

  saveAnalytics(analytics);
  return analytics;
}

/**
 * Track achievement unlocked
 */
function trackAchievement(name) {
  const analytics = initAnalytics();
  analytics.achievements_unlocked.push({
    name,
    timestamp: new Date().toISOString()
  });
  saveAnalytics(analytics);
  return analytics;
}

/**
 * Get analytics summary
 */
function getSummary(days = 7) {
  const analytics = initAnalytics();
  const talentData = fs.existsSync(TALENT_FILE) 
    ? JSON.parse(fs.readFileSync(TALENT_FILE, 'utf8'))
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

  // Calculate recent activity
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  for (const [date, data] of Object.entries(analytics.daily)) {
    const d = new Date(date);
    if (d >= cutoff) {
      result.recent.xp += data.xp;
      result.recent.skills += data.skills;
      result.recent.tasks += data.tasks;
      result.daily.push({ date, ...data });
    }
  }

  // Generate recommendations based on data
  if (talentData) {
    const branches = ['security', 'development', 'automation', 'research'];
    const spec = talentData.specialization;

    for (const branch of branches) {
      const branchTotal = Object.values(talentData.talents[branch] || {}).reduce((a, b) => a + b, 0);
      const usage = analytics.branches_used[branch] || 0;

      if (branch === spec && branchTotal < 10) {
        result.recommendations.push({
          type: 'level_up',
          branch,
          message: `Focus on ${branch} talents - you use this branch ${usage} times`
        });
      }

      if (branchTotal === 0 && usage > 5) {
        result.recommendations.push({
          type: 'invest',
          branch,
          message: `Consider investing in ${branch} - you've used it ${usage} times`
        });
      }
    }

    // Combo recommendations
    const secTotal = Object.values(talentData.talents.security || {}).reduce((a, b) => a + b, 0);
    const autoTotal = Object.values(talentData.talents.automation || {}).reduce((a, b) => a + b, 0);
    const devTotal = Object.values(talentData.talents.development || {}).reduce((a, b) => a + b, 0);
    const resTotal = Object.values(talentData.talents.research || {}).reduce((a, b) => a + b, 0);

    if (secTotal >= 3 && autoTotal >= 2 && !talentData.combos_unlocked?.includes('auto_shield')) {
      result.recommendations.push({
        type: 'combo',
        name: 'Auto-Shield',
        message: '1 more point in Automation for Auto-Shield combo!'
      });
    }

    if (devTotal >= 4 && resTotal >= 2 && !talentData.combos_unlocked?.includes('code_oracle')) {
      result.recommendations.push({
        type: 'combo',
        name: 'Code Oracle',
        message: 'Close to Code Oracle combo - invest in Development and Research'
      });
    }
  }

  return result;
}

/**
 * Export analytics to JSON
 */
function exportAnalytics() {
  const analytics = initAnalytics();
  const talentData = fs.existsSync(TALENT_FILE)
    ? JSON.parse(fs.readFileSync(TALENT_FILE, 'utf8'))
    : null;

  return {
    exported_at: new Date().toISOString(),
    talent: talentData,
    analytics
  };
}

/**
 * Import analytics from JSON
 */
function importAnalytics(data) {
  if (data.analytics) {
    saveAnalytics(data.analytics);
  }
  if (data.talent) {
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