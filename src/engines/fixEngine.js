import { benchmarkProfiles } from '../data/recruitmentModel';

/**
 * Generate structured fixes for a capability based on pain points and benchmark gaps
 */
export function generateFixes(capability, painPoints, currentMaturity) {
  const benchmark = benchmarkProfiles[capability.l2Id] || { industryBaseline: 3, bestInClass: 5 };
  const gap = benchmark.bestInClass - (currentMaturity || 1);

  if (gap <= 0) return null;

  const targetMaturity = Math.min(currentMaturity + Math.ceil(gap / 2), benchmark.bestInClass);

  const fixes = {
    capabilityId: capability.l2Id,
    capabilityName: capability.l2Name,
    l0Name: capability.l0Name,
    l1Name: capability.l1Name,
    currentMaturity: currentMaturity || 1,
    targetMaturity,
    benchmark,
    painPoints: painPoints.map(p => p.text),
    dimensions: {
      process: generateProcessFix(capability, gap),
      people: generatePeopleFix(capability, gap),
      technology: generateTechnologyFix(capability, gap),
      data: generateDataFix(capability, gap),
    }
  };

  return fixes;
}

function generateProcessFix(cap, gap) {
  const fixes = [
    `Standardise ${cap.l2Name} processes with documented SOPs`,
    `Implement quality gates and review checkpoints`,
    `Define clear handoff points and escalation paths`,
  ];
  return gap > 2 ? fixes : [fixes[0]];
}

function generatePeopleFix(cap, gap) {
  const fixes = [
    `Train team on ${cap.l2Name} best practices`,
    `Define clear RACI for ${cap.l1Name} activities`,
    `Recruit specialist capability in ${cap.l0Name}`,
  ];
  return gap > 2 ? fixes : [fixes[0]];
}

function generateTechnologyFix(cap, gap) {
  const fixes = [
    `Evaluate and implement tooling for ${cap.l2Name}`,
    `Integrate ${cap.l2Name} systems with core ATS/CRM`,
    `Implement automation for repetitive ${cap.l2Name} tasks`,
  ];
  return gap > 2 ? fixes : [fixes[0]];
}

function generateDataFix(cap, gap) {
  const fixes = [
    `Establish data quality standards for ${cap.l2Name}`,
    `Implement data capture and reporting for ${cap.l1Name}`,
    `Build analytics dashboard for ${cap.l0Name} metrics`,
  ];
  return gap > 2 ? fixes : [fixes[0]];
}

/**
 * Generate fixes for all impacted capabilities
 */
export function generateAllFixes(impactedCapabilities, painPointsByCapability, maturityScores) {
  const allFixes = [];

  impactedCapabilities.forEach(cap => {
    const pains = painPointsByCapability[cap.l2Id] || [];
    const maturity = maturityScores[cap.l2Id] || 1;
    const fix = generateFixes(cap, pains, maturity);
    if (fix) allFixes.push(fix);
  });

  return allFixes;
}
