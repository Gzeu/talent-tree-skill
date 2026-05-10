/**
 * Global XP Integrator
 * Import this in any skill to award XP automatically
 *
 * Usage:
 *   const xp = require('../talent-tree-skill/global-xp');
 *   xp.skillUsed('my-skill-name');
 *   xp.taskCompleted('complex');
 */

const path = require('path');

// Resolve xp-tracker relative to this file (works regardless of cwd)
let xpTracker = null;
try {
  xpTracker = require(path.join(__dirname, 'xp-tracker.js'));
} catch (e) {
  xpTracker = {
    awardSkillXP:        () => ({ awarded: 0 }),
    awardTaskXP:         () => ({ awarded: 0 }),
    awardAchievement:    () => ({ awarded: 0 }),
    dailyBonus:          () => ({ awarded: 0 }),
    checkAndUnlockCombos: () => []
  };
}

let talentManager = null;
try {
  talentManager = require(path.join(__dirname, 'talent-manager.js'));
} catch (e) {
  talentManager = { loadTalentData: () => null };
}

function skillUsed(skillName, options = {}) {
  const result = xpTracker.awardSkillXP(skillName, options);
  if (result.awarded > 0) {
    console.log(`🌳 +${result.awarded} XP from ${skillName}${result.branch ? ` (${result.branch})` : ''}`);
    if (result.leveledUp)  console.log(`🌟 LEVEL UP! Now level ${result.level}`);
    if (result.newPoint)   console.log(`⭐ New talent point available!`);
  }
  return result;
}

function taskCompleted(complexity = 'normal') {
  const result = xpTracker.awardTaskXP(complexity);
  if (result.awarded > 0)
    console.log(`🎯 Task complete! +${result.awarded} XP (Total: ${result.totalXP})`);
  return result;
}

function achievementUnlocked(name) {
  const result = xpTracker.awardAchievement(name);
  if (result.awarded > 0)
    console.log(`🏆 Achievement: ${name}! +${result.awarded} XP`);
  return result;
}

function dailyHeartbeat() {
  const result = xpTracker.dailyBonus();
  if (result.awarded > 0)
    console.log(`🌟 Daily login bonus: +${result.awarded} XP`);

  const combos = xpTracker.checkAndUnlockCombos();
  for (const combo of combos)
    console.log(`⚡ COMBO UNLOCKED: ${combo.desc}`);

  return result;
}

function getStatus() {
  return talentManager.loadTalentData();
}

function getMiniStatus() {
  const data = getStatus();
  if (!data) return 'Talent system not initialized. Run: talent init';

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
