/**
 * XP Tracker - Intercepts skill usage and awards XP
 * Integrates with OpenClaw skill execution
 */

const { loadTalentData, saveTalentData, SKILL_TO_BRANCH } = require('./talent-manager');

// XP rewards
const XP_REWARDS = {
  skill_use: 5,
  skill_specialization: 10,  // Using skill in your spec
  task_complete: 25,
  task_complex: 50,
  daily_bonus: 1,
  achievement: 50,
  combo_unlock: 100
};

/**
 * Award XP when a skill is used
 * @param {string} skillName - Name of the skill used
 * @param {object} options - Additional context
 */
function awardSkillXP(skillName, options = {}) {
  const data = loadTalentData();
  if (!data) return { awarded: 0 };
  
  // Find branch for this skill
  const normalizedSkill = skillName.toLowerCase().replace(/-/g, '_');
  let branch = null;
  
  for (const [skill, b] of Object.entries(SKILL_TO_BRANCH)) {
    if (normalizedSkill.includes(skill.replace(/-/g, '_'))) {
      branch = b;
      break;
    }
  }
  
  if (!branch) {
    // Default XP for unknown skills
    return { awarded: 0, reason: 'Skill not mapped to any branch' };
  }
  
  // Calculate XP
  let xp = XP_REWARDS.skill_use;
  
  // Bonus for specialization
  if (data.specialization === branch) {
    xp = Math.floor(xp * 1.2); // +20% bonus
    xp += XP_REWARDS.skill_specialization;
  }
  
  // Apply XP
  const oldLevel = data.level;
  const oldPoints = data.points_available;
  
  data.total_xp += xp;
  data.level = Math.floor(data.total_xp / 500) + 1;
  data.points_available = Math.floor(data.total_xp / 100) - Math.floor((data.total_xp - xp) / 100);
  
  data.history.push({
    action: 'skill_xp',
    skill: skillName,
    branch,
    xp,
    timestamp: new Date().toISOString()
  });
  
  saveTalentData(data);
  
  const result = {
    awarded: xp,
    branch,
    totalXP: data.total_xp,
    level: data.level,
    leveledUp: data.level > oldLevel,
    newPoint: data.points_available > oldPoints
  };
  
  return result;
}

/**
 * Award bonus XP for task completion
 */
function awardTaskXP(taskType = 'normal') {
  const data = loadTalentData();
  if (!data) return { awarded: 0 };
  
  const xp = taskType === 'complex' ? XP_REWARDS.task_complex : XP_REWARDS.task_complete;
  
  data.total_xp += xp;
  data.level = Math.floor(data.total_xp / 500) + 1;
  data.points_available = Math.floor(data.total_xp / 100);
  
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
  data.total_xp += XP_REWARDS.achievement;
  data.level = Math.floor(data.total_xp / 500) + 1;
  data.points_available = Math.floor(data.total_xp / 100);
  
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
  
  // Check if we already gave bonus today
  const today = new Date().toISOString().split('T')[0];
  const lastBonus = data.history.find(h => 
    h.action === 'daily_bonus' && 
    h.timestamp.startsWith(today)
  );
  
  if (lastBonus) {
    return { awarded: 0, reason: 'Daily bonus already claimed' };
  }
  
  data.total_xp += XP_REWARDS.daily_bonus;
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
  const { loadTalentData, saveTalentData, checkCombos } = require('./talent-manager');
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