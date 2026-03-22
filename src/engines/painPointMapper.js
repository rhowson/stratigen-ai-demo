import { painPointKeywords } from '../data/recruitmentModel';

/**
 * Maps free-text pain point to L0–L2 capability IDs using keyword matching
 */
export function mapPainPointToCapabilities(text, capabilities) {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const matchedL2Ids = new Set();

  // Keyword matching
  words.forEach(word => {
    // Check exact matches
    if (painPointKeywords[word]) {
      painPointKeywords[word].forEach(id => matchedL2Ids.add(id));
    }
    // Check partial matches
    Object.entries(painPointKeywords).forEach(([keyword, ids]) => {
      if (word.includes(keyword) || keyword.includes(word)) {
        ids.forEach(id => matchedL2Ids.add(id));
      }
    });
  });

  // Resolve matched IDs to full capability paths
  const matched = [];
  capabilities.forEach(l0 => {
    l0.l1.forEach(l1 => {
      l1.l2.forEach(l2 => {
        if (matchedL2Ids.has(l2.id) || matchedL2Ids.has(l1.id) || matchedL2Ids.has(l0.id)) {
          matched.push({
            l0Id: l0.id,
            l0Name: l0.name,
            l1Id: l1.id,
            l1Name: l1.name,
            l2Id: l2.id,
            l2Name: l2.name,
          });
        }
      });
    });
  });

  return matched;
}
