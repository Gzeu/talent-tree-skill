/**
 * XP Tracker - Intercepts skill usage and awards XP
 * Integrates with OpenClaw skill execution
 */

const { loadTalentData, saveTalentData, SKILL_TO_BRANCH } = require('./talent-manager');

// XP rewards
const XP_REWARDS = {
  skill_use: 5,
  skill_specialization: 10,
  task_complete: 25,
  task_complex: 50,
  daily_bonus: 1,
  achievement: 50,
  combo_unlock: 100
};

/**
 * Recalculate level and earned talent points from total_xp.
 * Points = floor(xp/100), level = floor(xp/500) + 1.
 * Does NOT touch points_available (spent points must stay deducted).
 */
function recalcLevel(data) {
  data.level = Math.floor(data.total_xp / 500) + 1;
}

/**
 * Award XP when a skill is used
 */
function awardSkillXP(skillName, options = {}) {
  if (!skillName || typeof skillName !== 'string') return { awarded: 0, reason: 'Invalid skill name' };

  const data = loadTalentData();
  if (!data) return { awarded: 0 };

  const normalizedSkill = skillName.toLowerCase().replace(/-/g, '_');
  let branch = null;

  for (const [skill, b] of Object.entries(SKILL_TO_BRANCH)) {
    if (normalizedSkill.includes(skill.replace(/-/g, '_'))) {
      branch = b;
      break;
    }
  }

  if (!branch) {
    return { awarded: 0, reason: 'Skill not mapped to any branch' };
  }

  let xp = XP_REWARDS.skill_use;

  if (data.specialization === branch) {
    xp = Math.floor(xp * 1.2) + XP_REWARDS.skill_specialization;
  }

  const oldLevel = data.level;
  const oldPointsEarned = Math.floor(data.total_xp / 100);

  data.total_xp += xp;
  const newPointsEarned = Math.floor(data.total_xp / 100);
  recalcLevel(data);

  const pointsGained = newPointsEarned - oldPointsEarned;
  if (pointsGained > 0) data.points_available += pointsGained;

  data.history.push({
    action: 'skill_xp',
    skill: skillName,
    branch,
    xp,
    timestamp: new Date().toISOString()
  });

  saveTalentData(data);

  return {
    awarded: xp,
    branch,
    totalXP: data.total_xp,
    level: data.level,
    leveledUp: data.level > oldLevel,
    newPoint: pointsGained > 0
  };
}

/**
 * Award bonus XP for task completion
 */
function awardTaskXP(taskType = 'normal') {
  const data = loadTalentData();
  if (!data) return { awarded: 0 };

  const xp = taskType === 'complex' ? XP_REWARDS.task_complex : XP_REWARDS.task_complete;

  const oldPointsEarned = Math.floor(data.total_xp / 100);
  data.total_xp += xp;
  const newPointsEarned = Math.floor(data.total_xp / 100);
  recalcLevel(data);

  const pointsGained = newPointsEarned - oldPointsEarned;
  if (pointsGained > 0) data.points_available += pointsGained;

  data.history.push({
    action: 'task_xp',
    taskType,
    xp,
    timestamp: new Date().toISOString()
  });

  saveTalentData(data);

  return {
    awarded: xp,
    totalXP: data.total_xp,
    level: data.level,
    pointsAvailable: data.points_available
  };
}

/**
 * Award achievement XP
 */
function awardAchievement(achievementName) {
  const data = loadTalentData();
  if (!data) return { awarded: 0 };

  if (data.achievements.includes(achievementName)) {
    return { awarded: 0, reason: 'Achievement already unlocked' };
  }

  data.achievements.push(achievementName);

  const oldPointsEarned = Math.floor(data.total_xp / 100);
  data.total_xp += XP_REWARDS.achievement;
  const newPointsEarned = Math.floor(data.total_xp / 100);
  recalcLevel(data);

  const pointsGained = newPointsEarned - oldPointsEarned;
  if (pointsGained > 0) data.points_available += pointsGained;

  data.history.push({
    action: 'achievement',
    name: achievementName,
    xp: XP_REWARDS.achievement,
    timestamp: new Date().toISOString()
  });

  saveTalentData(data);

  return {
    awarded: XP_REWARDS.achievement,
    achievement: achievementName,
    totalXP: data.total_xp,
    level: data.level
  };
}

/**
 * Daily heartbeat bonus
 */
function dailyBonus() {
  const data = loadTalentData();
  if (!data) return { awarded: 0 };

  const today = new Date().toISOString().split('T')[0];
  const lastBonus = data.history.find(h =>
    h.action === 'daily_bonus' &&
    h.timestamp.startsWith(today)
  );

  if (lastBonus) {
    return { awarded: 0, reason: 'Daily bonus already claimed' };
  }

  data.total_xp += XP_REWARDS.daily_bonus;
  recalcLevel(data);

  data.history.push({
    action: 'daily_bonus',
    xp: XP_REWARDS.daily_bonus,
    timestamp: new Date().toISOString()
  });

  saveTalentData(data);

  return { awarded: XP_REWARDS.daily_bonus };
}

/**
 * Check and unlock combos
 */
function checkAndUnlockCombos() {
  const { checkCombos } = require('./talent-manager');
  const data = loadTalentData();
  if (!data) return [];

  const newCombos = checkCombos(data);

  for (const combo of newCombos) {
    data.combos_unlocked.push(combo.name);
    data.total_xp += XP_REWARDS.combo_unlock;
    data.history.push({
      action: 'combo_unlock',
      combo: combo.name,
      xp: XP_REWARDS.combo_unlock,
      timestamp: new Date().toISOString()
    });
  }

  if (newCombos.length > 0) {
    recalcLevel(data);
    saveTalentData(data);
  }

  return newCombos;
}

module.exports = {
  awardSkillXP,
  awardTaskXP,
  awardAchievement,
  dailyBonus,
  checkAndUnlockCombos,
  XP_REWARDS
};
