/**
 * Global XP Integrator
 * Import this in any skill to award XP automatically
 * 
 * Usage:
 *   const xp = require('../talent-tree/global-xp');
 *   xp.skillUsed('my-skill-name');
 *   xp.taskCompleted('complex');
 */

const path = require('path');

// Try to load XP tracker
let xpTracker = null;
const xpPath = path.join(__dirname, '..', 'talent-tree', 'xp-tracker.js');

try {
  xpTracker = require(xpPath);
} catch (e) {
  // XP tracker not available, create stub
  xpTracker = {
    awardSkillXP: () => ({ awarded: 0 }),
    awardTaskXP: () => ({ awarded: 0 }),
    awardAchievement: () => ({ awarded: 0 }),
    dailyBonus: () => ({ awarded: 0 }),
    checkAndUnlockCombos: () => []
  };
}

/**
 * Call this when a skill is used
 * @param {string} skillName - Name of the skill
 * @param {object} options - Optional context
 * @returns {object} XP result
 */
function skillUsed(skillName, options = {}) {
  const result = xpTracker.awardSkillXP(skillName, options);
  
  if (result.awarded > 0) {
    const msg = `🌳 +${result.awarded} XP from ${skillName}`;
    if (result.branch) {
      console.log(`${msg} (${result.branch})`);
    }
    
    if (result.leveledUp) {
      console.log(`🌟 LEVEL UP! Now level ${result.level}`);
    }
    
    if (result.newPoint) {
      console.log(`⭐ New talent point available!`);
    }
  }
  
  return result;
}

/**
 * Call this when a task is completed
 * @param {string} complexity - 'normal' or 'complex'
 * @returns {object} XP result
 */
function taskCompleted(complexity = 'normal') {
  const result = xpTracker.awardTaskXP(complexity);
  
  if (result.awarded > 0) {
    console.log(`🎯 Task complete! +${result.awarded} XP (Total: ${result.totalXP})`);
  }
  
  return result;
}

/**
 * Call this when an achievement is unlocked
 * @param {string} name - Achievement name
 * @returns {object} XP result
 */
function achievementUnlocked(name) {
  const result = xpTracker.awardAchievement(name);
  
  if (result.awarded > 0) {
    console.log(`🏆 Achievement: ${name}! +${result.awarded} XP`);
  }
  
  return result;
}

/**
 * Call this on daily heartbeat
 * @returns {object} XP result
 */
function dailyHeartbeat() {
  const result = xpTracker.dailyBonus();
  
  if (result.awarded > 0) {
    console.log(`🌟 Daily login bonus: +${result.awarded} XP`);
  }
  
  // Also check for combo unlocks
  const combos = xpTracker.checkAndUnlockCombos();
  if (combos.length > 0) {
    for (const combo of combos) {
      console.log(`⚡ COMBO UNLOCKED: ${combo.desc}`);
    }
  }
  
  return result;
}

/**
 * Check current talent status
 * @returns {object} Talent data
 */
function getStatus() {
  const talentPath = path.join(__dirname, '..', 'talent-tree', 'talent-manager.js');
  try {
    const { loadTalentData } = require(talentPath);
    return loadTalentData();
  } catch (e) {
    return null;
  }
}

/**
 * Quick display of talent progress
 * @returns {string} Mini status string
 */
function getMiniStatus() {
  const data = getStatus();
  if (!data) return 'Talent system not initialized';
  
  const spent = Object.values(data.talents).reduce((sum, branch) => 
    sum + Object.values(branch).reduce((a, b) => a + b, 0), 0
  );
  
  return `Lvl ${data.level} | XP ${data.total_xp} | Spec: ${data.specialization || 'None'} | Points: ${data.points_available} | Talents: ${spent}/60`;
}

module.exports = {
  skillUsed,
  taskCompleted,
  achievementUnlocked,
  dailyHeartbeat,
  getStatus,
  getMiniStatus
};