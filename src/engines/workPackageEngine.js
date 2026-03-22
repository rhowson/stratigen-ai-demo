/**
 * Groups fixes into work packages and workstreams
 */
export function generateWorkPackages(fixes) {
  // Group fixes by L0 domain
  const groupedByL0 = {};
  fixes.forEach(fix => {
    if (!groupedByL0[fix.l0Name]) {
      groupedByL0[fix.l0Name] = [];
    }
    groupedByL0[fix.l0Name].push(fix);
  });

  const workstreams = [];
  let pkgIndex = 1;

  Object.entries(groupedByL0).forEach(([l0Name, domainFixes]) => {
    const workstream = {
      id: `ws-${l0Name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: `${l0Name} Transformation`,
      l0Domain: l0Name,
      packages: [],
      totalFixes: 0,
      avgMaturityGap: 0,
    };

    // Create work packages (group by L1)
    const groupedByL1 = {};
    domainFixes.forEach(fix => {
      if (!groupedByL1[fix.l1Name]) {
        groupedByL1[fix.l1Name] = [];
      }
      groupedByL1[fix.l1Name].push(fix);
    });

    let totalGap = 0;
    let totalCaps = 0;

    Object.entries(groupedByL1).forEach(([l1Name, l1Fixes]) => {
      const allDimensionFixes = l1Fixes.flatMap(f => [
        ...f.dimensions.process,
        ...f.dimensions.people,
        ...f.dimensions.technology,
        ...f.dimensions.data,
      ]);

      const impactScore = l1Fixes.reduce((sum, f) => sum + (f.targetMaturity - f.currentMaturity), 0);
      const avgGap = l1Fixes.reduce((sum, f) => sum + (f.benchmark.bestInClass - f.currentMaturity), 0) / l1Fixes.length;

      totalGap += avgGap * l1Fixes.length;
      totalCaps += l1Fixes.length;

      workstream.packages.push({
        id: `wp-${pkgIndex++}`,
        name: `${l1Name} Improvement`,
        l1Domain: l1Name,
        fixes: l1Fixes,
        fixCount: allDimensionFixes.length,
        impactScore,
        priority: avgGap > 2.5 ? 'High' : avgGap > 1.5 ? 'Medium' : 'Low',
        capabilities: l1Fixes.map(f => f.capabilityName),
        dependencies: detectDependencies(l1Name),
      });

      workstream.totalFixes += allDimensionFixes.length;
    });

    workstream.avgMaturityGap = totalCaps > 0 ? (totalGap / totalCaps).toFixed(1) : 0;
    workstreams.push(workstream);
  });

  // Sort workstreams by average maturity gap (highest first)
  workstreams.sort((a, b) => b.avgMaturityGap - a.avgMaturityGap);

  return workstreams;
}

function detectDependencies(l1Name) {
  const depMap = {
    'CV Screening': ['Data Management', 'ATS / CRM'],
    'Job Matching': ['CV Screening', 'Talent Pooling'],
    'Interview Coordination': ['Job Matching', 'Candidate Engagement'],
    'Offer Management': ['Interview Coordination'],
    'Timesheet Processing': ['Assignment Management', 'ATS / CRM'],
    'Invoice Generation': ['Timesheet Processing'],
    'Revenue Recognition': ['Invoice Generation'],
    'Contractor Onboarding': ['Regulatory Compliance'],
    'Reporting': ['Data Management'],
    'Advanced Analytics': ['Reporting', 'Data Management'],
  };
  return depMap[l1Name] || [];
}
