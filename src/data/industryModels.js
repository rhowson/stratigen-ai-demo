import {
  suggestedObjectives as recruitmentObjectives,
  painPointExamples as recruitmentPainPoints,
} from './recruitmentModel';
import {
  suggestedObjectives as nonProfitObjectives,
  painPointExamples as nonProfitPainPoints,
} from './nonProfitModel';

const INDUSTRY_DATA = {
  'recruitment-services': {
    suggestedObjectives: recruitmentObjectives,
    painPointExamples: recruitmentPainPoints,
  },
  'non-profit': {
    suggestedObjectives: nonProfitObjectives,
    painPointExamples: nonProfitPainPoints,
  },
};

export function getIndustryData(industryId) {
  return INDUSTRY_DATA[industryId] ?? INDUSTRY_DATA['recruitment-services'];
}
