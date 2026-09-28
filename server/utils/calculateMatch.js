/**
 * Rule-based recommendation algorithm
 *
 * Score breakdown (transparent, no ML claims):
 *   Skills Match       40%
 *   Interests Match    30%
 *   Category Match     20%
 *   Eligibility        10%
 *
 * Returns score 0-100 and reasons for the match.
 */

const calculateMatch = (profile, opportunity) => {
  if (!profile) return { score: 0, reasons: [] };

  const reasons = [];
  let totalScore = 0;

  // --- Skills Match (40%) ---
  const profileSkills = (profile.skills || []).map((s) =>
    s.toLowerCase().trim()
  );
  const oppSkills = (opportunity.skills || []).map((s) =>
    s.toLowerCase().trim()
  );

  let skillScore = 0;
  if (oppSkills.length > 0 && profileSkills.length > 0) {
    const matchedSkills = profileSkills.filter((s) => oppSkills.includes(s));
    skillScore = Math.min((matchedSkills.length / oppSkills.length) * 40, 40);
    if (matchedSkills.length > 0) {
      reasons.push(`${matchedSkills.length} matching skill${matchedSkills.length > 1 ? 's' : ''}`);
    }
  } else if (oppSkills.length === 0) {
    // Opportunity has no skill requirement – give partial credit
    skillScore = 20;
  }
  totalScore += skillScore;

  // --- Interests Match (30%) ---
  const profileInterests = (profile.interests || []).map((i) =>
    i.toLowerCase().trim()
  );
  const oppInterests = (opportunity.interests || []).map((i) =>
    i.toLowerCase().trim()
  );

  let interestScore = 0;
  if (oppInterests.length > 0 && profileInterests.length > 0) {
    const matchedInterests = profileInterests.filter((i) =>
      oppInterests.includes(i)
    );
    interestScore = Math.min(
      (matchedInterests.length / oppInterests.length) * 30,
      30
    );
    if (matchedInterests.length > 0) {
      reasons.push(`Interest matched`);
    }
  } else if (oppInterests.length === 0) {
    interestScore = 15;
  }
  totalScore += interestScore;

  // --- Category Match (20%) ---
  const preferredCategories = (profile.preferredCategories || []).map((c) =>
    c.toLowerCase()
  );
  const oppCategory = (opportunity.category || '').toLowerCase();

  let categoryScore = 0;
  if (preferredCategories.includes(oppCategory)) {
    categoryScore = 20;
    reasons.push(`Preferred category matched`);
  } else if (preferredCategories.length === 0) {
    categoryScore = 10;
  }
  totalScore += categoryScore;

  // --- Eligibility / Year Check (10%) ---
  const eligibilityText = (opportunity.eligibility || '').toLowerCase();
  const currentYear = profile.currentYear;
  const graduationYear = profile.graduationYear;

  let eligibilityScore = 5; // Default partial

  if (eligibilityText) {
    // Check if year mentioned in eligibility
    if (currentYear) {
      const yearMentions = eligibilityText.match(/\d+/g);
      if (yearMentions && yearMentions.some((y) => parseInt(y) >= currentYear)) {
        eligibilityScore = 10;
        reasons.push(`Eligible by year`);
      }
    } else {
      eligibilityScore = 5;
    }
  } else {
    // No specific eligibility – open to all
    eligibilityScore = 10;
    reasons.push(`Open eligibility`);
  }
  totalScore += eligibilityScore;

  const finalScore = Math.round(Math.min(totalScore, 100));

  return {
    score: finalScore,
    reasons,
  };
};

module.exports = calculateMatch;
