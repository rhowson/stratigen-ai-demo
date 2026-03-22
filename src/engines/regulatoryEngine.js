import { regulatoryFramework } from '../data/recruitmentModel';

/**
 * Assess regulatory implications for AI use cases
 */
export function assessRegulations(aiOpportunities, geography = 'UK') {
  const assessments = [];

  aiOpportunities.forEach(opp => {
    const applicableRegs = regulatoryFramework.filter(reg =>
      (reg.geography === geography || reg.geography === 'EU/UK') &&
      reg.applicableTo.includes(opp.capabilityId)
    );

    if (applicableRegs.length > 0) {
      const riskLevel = calculateRisk(opp, applicableRegs);
      assessments.push({
        capabilityId: opp.capabilityId,
        capabilityName: opp.capabilityName,
        regulations: applicableRegs.map(r => ({
          id: r.id,
          name: r.name,
          scope: r.scope,
        })),
        riskClassification: riskLevel,
        governanceRequirements: generateGovernanceReqs(riskLevel, applicableRegs),
      });
    }
  });

  return assessments;
}

function calculateRisk(opportunity, regulations) {
  const hasAIReg = regulations.some(r => r.scope === 'AI Governance');
  const hasDataReg = regulations.some(r => r.scope === 'Data Protection');
  const isAgent = opportunity.levels.some(l => l.level === 3);

  if (hasAIReg && isAgent) return 'Critical';
  if (hasAIReg || (hasDataReg && isAgent)) return 'High';
  if (hasDataReg) return 'Moderate';
  return 'Low';
}

function generateGovernanceReqs(riskLevel, regulations) {
  const reqs = ['Document AI use case purpose and scope'];

  if (riskLevel === 'Moderate' || riskLevel === 'High' || riskLevel === 'Critical') {
    reqs.push('Conduct Data Protection Impact Assessment (DPIA)');
    reqs.push('Implement human oversight mechanism');
  }
  if (riskLevel === 'High' || riskLevel === 'Critical') {
    reqs.push('Establish AI ethics review board approval');
    reqs.push('Implement bias testing and monitoring');
    reqs.push('Maintain audit trail for AI decisions');
  }
  if (riskLevel === 'Critical') {
    reqs.push('Register with regulatory authority');
    reqs.push('Implement real-time monitoring and kill switch');
    reqs.push('Annual third-party audit requirement');
  }

  return reqs;
}
