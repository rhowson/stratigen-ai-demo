import { aiPatterns } from '../data/recruitmentModel';

/**
 * Generate AI acceleration opportunities for capabilities
 */
export function generateAIOpportunities(fixes) {
  const opportunities = [];

  fixes.forEach(fix => {
    const pattern = aiPatterns[fix.capabilityId];
    if (pattern) {
      opportunities.push({
        capabilityId: fix.capabilityId,
        capabilityName: fix.capabilityName,
        l0Name: fix.l0Name,
        l1Name: fix.l1Name,
        maturityGap: fix.benchmark.bestInClass - fix.currentMaturity,
        levels: [
          { level: 1, ...pattern.level1 },
          { level: 2, ...pattern.level2 },
          { level: 3, ...pattern.level3 },
        ],
      });
    }
  });

  // Sort by maturity gap (highest first)
  opportunities.sort((a, b) => b.maturityGap - a.maturityGap);

  return opportunities;
}
