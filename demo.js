/**
 * Talent Tree Demo Mode
 * Show off the system without needing real data
 */

function runDemo() {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const gold = '\x1b[38;5;220m';
  const purple = '\x1b[38;5;141m';
  const green = '\x1b[32m';
  const cyan = '\x1b[36m';
  const red = '\x1b[31m';

  console.log(`
${gold}╔══════════════════════════════════════════════════════════════════╗${reset}
${gold}║${reset}                    ${bold}${purple}🌳 TALENT TREE DEMO 🌳${reset}                    ${gold}║${reset}
${gold}╠══════════════════════════════════════════════════════════════════╣${reset}
${gold}║${reset}   Demonstrating a Level 12 Security Specialist                ${gold}║${reset}
${gold}╚══════════════════════════════════════════════════════════════════╝${reset}

${bold}┌────────────────────────────────────────────────────────────────┐${reset}
${bold}│${reset} ★${red}🛡️ SECURITY${reset} [████████████#░░] 13/15 ${green}(SPECIALIZED)${reset}
${bold}│${reset}   ${red}🎯 Threat Scanner${reset}     [██████████░] 4/5${bold}│${reset}
${bold}│${reset}   ${red}📋 Audit Master${reset}       [████████░░░] 3/5${bold}│${reset}
${bold}│${reset}   ${red}⚔️ ClawdStrike Ultimate${reset} [██████████░] 4/5${bold}│${reset}
${bold}│${reset}${bold}│${reset}
${bold}│${reset}   💻 DEVELOPMENT${reset}     [████░░░░░░░░] 4/15
${bold}│${reset}   🏗️ Code Architect${reset}      [██░░░░░░░░░░] 1/5
${bold}│${reset}   🔀 Git Master${reset}          [██░░░░░░░░░░] 1/5
${bold}│${reset}   ✨ Refactor Legendary${reset}   [██░░░░░░░░░░] 2/5
${bold}│${reset}${bold}│${reset}
${bold}│${reset}   ⚙️ AUTOMATION${reset}        [██████░░░░░░] 6/15
${bold}│${reset}   🔄 Workflow Builder${reset}    [████░░░░░░░░] 2/5
${bold}│${reset}   ⏰ Cron Master${reset}         [████░░░░░░░░] 2/5
${bold}│${reset}   🧬 Auto-Evolver${reset}        [██░░░░░░░░░░] 2/5
${bold}│${reset}${bold}│${reset}
${bold}│${reset}   🔬 RESEARCH${reset}          [██░░░░░░░░░░] 2/15
${bold}│${reset}   🌐 Web Hunter${reset}          [██░░░░░░░░░░] 1/5
${bold}│${reset}   📊 Data Miner${reset}          [░░░░░░░░░░░░] 0/5
${bold}│${reset}   🧠 Knowledge Synthesizer${reset} [░░░░░░░░░░░░] 1/5
${bold}└────────────────────────────────────────────────────────────────┘${reset}

${gold}⚡ UNLOCKED COMBOS:${reset}
   🛡️⚙️ Auto-Shield - Automatic threat response
   🧠⚡ Megamind - Multi-agent orchestration

${purple}🏆 ACHIEVEMENTS:${reset} 8
   ✅ First Specialization
   ✅ Security Expert (Security L5)
   ✅ Threat Hunter (Threat Scanner L5)
   ✅ Combo Master (2 combos)
   ✅ Dedicated (10+ hours active)

${cyan}📊 STATISTICS:${reset}
   Total XP: 2,450
   Level: 12
   Playtime: 47 hours
   Skills Used: 312
   Tasks Completed: 89
`);
}

function runDemoPreset() {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const gold = '\x1b[38;5;220m';
  const cyan = '\x1b[36m';

  console.log(`
${gold}════════════════════════════════════════════════════════════════${reset}
                    ${bold}🎯 AVAILABLE PRESETS${reset}
${gold}════════════════════════════════════════════════════════════════${reset}

🔒 Security Analyst
   Maximize threat detection and auditing capabilities
   Points: 15/60 | Spec: security
   ${cyan}Apply: talent preset security-analyst${reset}

💻 Full-Stack Developer  
   Optimized for coding, refactoring, and git mastery
   Points: 15/60 | Spec: development
   ${cyan}Apply: talent preset full-stack-dev${reset}

⚙️ Automation Expert
   Master of workflows, scheduling, and self-improvement
   Points: 15/60 | Spec: automation
   ${cyan}Apply: talent preset automation-expert${reset}

🔬 Research Specialist
   Deep search, data mining, and knowledge synthesis
   Points: 15/60 | Spec: research
   ${cyan}Apply: talent preset researcher${reset}

🚀 DevOps Engineer
   Development + Automation hybrid for CI/CD mastery
   Points: 23/60 | Spec: automation
   ${cyan}Apply: talent preset devops${reset}

⚖️ Balanced Agent
   Well-rounded for general tasks
   Points: 18/60 | Spec: None
   ${cyan}Apply: talent preset balanced${reset}
`);
}

function runDemoAnalytics() {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const gold = '\x1b[38;5;220m';
  const green = '\x1b[32m';
  const cyan = '\x1b[36m';
  const red = '\x1b[31m';
  const yellow = '\x1b[33m';

  console.log(`
${gold}╔══════════════════════════════════════════════════════════════════╗${reset}
${gold}║${reset}                    ${bold}📊 TALENT ANALYTICS${reset}                    ${gold}║${reset}
${gold}╠══════════════════════════════════════════════════════════════════╣${reset}
${gold}║${reset}                                                                  ${gold}║${reset}
${gold}║${reset}   PROGRESSION OVER 7 DAYS                                       ${gold}║${reset}
${gold}║${reset}   ${green}████████████████████████████████${reset} +245 XP           ${gold}║${reset}
${gold}║${reset}   Mon:  +12 | Tue: +45 | Wed: +38 | Thu: +67 | Fri: +83       ${gold}║${reset}
${gold}║${reset}                                                                  ${gold}║${reset}
${gold}║${reset}   XP SOURCES                                                     ${gold}║${reset}
${gold}║${reset}   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ${gold}║${reset}
${gold}║${reset}   Skills Used:        +156 XP (63.7%${cyan}████████████████${reset})       ${gold}║${reset}
${gold}║${reset}   Tasks Completed:    +62 XP  (25.3%${cyan}██████${reset})             ${gold}║${reset}
${gold}║${reset}   Daily Bonuses:      +7 XP   (2.9%${cyan}█${reset})                ${gold}║${reset}
${gold}║${reset}   Achievements:       +20 XP  (8.1%${cyan}██${reset})               ${gold}║${reset}
${gold}║${reset}                                                                  ${gold}║${reset}
${gold}║${reset}   MOST USED SKILLS (by branch)                                  ${gold}║${reset}
${gold}║${reset}   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ${gold}║${reset}
${gold}║${reset}   ${red}🛡️ Security${reset}      89 uses   ${cyan}████████████████████${reset}    ${gold}║${reset}
${gold}║${reset}   ${green}💻 Development${reset}    42 uses   ${cyan}████████${reset}                ${gold}║${reset}
${gold}║${reset}   ${yellow}⚙️ Automation${reset}     28 uses   ${cyan}█████${reset}                   ${gold}║${reset}
${gold}║${reset}   ${cyan}🔬 Research${reset}       15 uses   ${cyan}███${reset}                     ${gold}║${reset}
${gold}║${reset}                                                                  ${gold}║${reset}
${gold}║${reset}   RECOMMENDATIONS                                                ${gold}║${reset}
${gold}║${reset}   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ${gold}║${reset}
${gold}║${reset}   ${green}✓${reset} Your Security focus is paying off!               ${gold}║${reset}
${gold}║${reset}   ${yellow}!${reset} Consider investing in Research for Code Oracle combo ${gold}║${reset}
${gold}║${reset}   ${cyan}→${reset} Audit Master at 3/5 - 2 points to max talent    ${gold}║${reset}
${gold}║${reset}                                                                  ${gold}║${reset}
${gold}╚══════════════════════════════════════════════════════════════════╝${reset}
`);
}

// Run demo if called directly
if (require.main === module) {
  const arg = process.argv[2];
  if (arg === 'presets') {
    runDemoPreset();
  } else if (arg === 'analytics') {
    runDemoAnalytics();
  } else {
    runDemo();
  }
}

module.exports = { runDemo, runDemoPreset, runDemoAnalytics };