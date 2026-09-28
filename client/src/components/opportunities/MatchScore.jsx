import { getMatchScoreClass, getMatchScoreLabel } from '../../utils/helpers';

const MatchScore = ({ score, reasons = [], showReasons = false, size = 'md' }) => {
  if (score === undefined || score === null) return null;

  const scoreClass = getMatchScoreClass(score);
  const label = getMatchScoreLabel(score);

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <div className={`badge ${scoreClass} ${sizes[size]} font-semibold`}>
        {score}% Match
      </div>
      {showReasons && reasons.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 font-medium mb-1">Personalized Match Score</p>
          <ul className="space-y-0.5">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="text-green-500 font-bold">✓</span>
                {reason}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-2 italic">
            Based on skills, interests, category & eligibility match
          </p>
        </div>
      )}
    </div>
  );
};

export default MatchScore;
