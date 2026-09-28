/**
 * Client-side match score preview.
 * The authoritative score comes from the backend API.
 * This is just for UI previews before data loads.
 */
export const previewMatchScore = (profile, opportunity) => {
  if (!profile || !opportunity) return 0;
  let score = 0;
  const profileSkills = (profile.skills || []).map(s => s.toLowerCase());
  const oppSkills = (opportunity.skills || []).map(s => s.toLowerCase());
  if (oppSkills.length > 0 && profileSkills.length > 0) {
    const matched = profileSkills.filter(s => oppSkills.includes(s));
    score += (matched.length / oppSkills.length) * 40;
  }
  const profileInterests = (profile.interests || []).map(i => i.toLowerCase());
  const oppInterests = (opportunity.interests || []).map(i => i.toLowerCase());
  if (oppInterests.length > 0 && profileInterests.length > 0) {
    const matched = profileInterests.filter(i => oppInterests.includes(i));
    score += (matched.length / oppInterests.length) * 30;
  }
  const preferredCategories = (profile.preferredCategories || []).map(c => c.toLowerCase());
  if (preferredCategories.includes((opportunity.category || '').toLowerCase())) {
    score += 20;
  }
  return Math.round(Math.min(score, 100));
};
