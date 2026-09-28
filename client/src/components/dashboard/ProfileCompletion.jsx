import { Link } from 'react-router-dom';

const ProfileCompletion = ({ percentage }) => {
  const getColor = (pct) => {
    if (pct >= 80) return 'bg-green-500';
    if (pct >= 50) return 'bg-orange-500';
    return 'bg-red-400';
  };

  const getMessage = (pct) => {
    if (pct >= 80) return 'Great profile! You\'ll get better recommendations.';
    if (pct >= 50) return 'Keep going! More details = better matches.';
    return 'Complete your profile to get personalized recommendations.';
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900">Profile Completion</p>
          <p className="text-xs text-gray-500 mt-0.5">{getMessage(percentage)}</p>
        </div>
        <span className="text-2xl font-bold text-orange-600">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${getColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage < 100 && (
        <Link
          to="/profile"
          className="mt-3 inline-flex text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Complete your profile →
        </Link>
      )}
    </div>
  );
};

export default ProfileCompletion;
