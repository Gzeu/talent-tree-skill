/**
 * Talent Tree - Heartbeat Integration
 * Awards XP during heartbeats and tracks skill usage
 */

const { dailyBonus, checkAndUnlockCombos } = require('./xp-tracker');
const { loadTalentData, renderTree } = require('./talent-manager');

/**
 * Call this during heartbeat
 * Returns talent status if there's something to report
 */
function heartbeatIntegration() {
  // Award daily bonus
  const bonus = dailyBonus();
  
  // Check for new combos
  const newCombos = checkAndUnlockCombos();
  
  // Load current data
  const data = loadTalentData();
  if (!data) return null;
  
  // Check if we have unspent points
  if (data.points_available > 0 && data.specialization === null) {
    return {
      type: 'reminder',
      message: `🌳 You have ${data.points_available} unspent talent points!\n   Choose a specialization: talent spec <security|development|automation|research>`
    };
  }
  
  if (data.points_available > 0) {
    return {
      type: 'reminder',
      message: `🌳 You have ${data.points_available} talent points to spend!\n   Use: talent upgrade <talent-name>`
    };
  }
  
  // New combos?
  if (newCombos.length > 0) {
    return {
      type: 'achievement',
      message: `🌟 COMBO UNLOCKED!\n${newCombos.map(c => '   ' + c.desc).join('\n')}`
    };
  }
  
  // Daily bonus notification
  if (bonus.awarded > 0) {
    return {
      type: 'daily',
      message: `🌟 Daily login bonus: +${bonus.awarded} XP`
    };
  }
  
  return null;
}

/**
 * Get talent summary for status display
 */
function getTalentSummary() {
  const data = loadTalentData();
  if (!data) return 'No talent data';
  
  const spec = data.specialization ? `${TREES[data.specialization]?.emoji || ''} ${data.specialization}` : 'None';
  const spent = Object.values(data.talents).reduce((sum, branch) => 
    sum + Object.values(branch).reduce((a, b) => a + b, 0), 0
  );
  
  return `Lvl ${data.level} | XP ${data.total_xp} | Spec: ${spec} | Points: ${data.points_available} | Talents: ${spent}/60`;
}

/**
 * Award XP based on activity type
 */
function awardActivityXP(activityType, details = {}) {
  const { awardSkillXP, awardTaskXP, awardAchievement } = require('./xp-tracker');
  
  switch (activityType) {
    case 'skill':
      return awardSkillXP(details.skillName);
    case 'task':
      return awardTaskXP(details.complex ? 'complex' : 'normal');
    case 'achievement':
      return awardAchievement(details.name);
    default:
      return { awarded: 0 };
  }
}

module.exports = {
  heartbeatIntegration,
  getTalentSummary,
  awardActivityXP
};