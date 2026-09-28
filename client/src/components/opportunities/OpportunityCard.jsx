import { Link } from 'react-router-dom';
import { MdLocationOn, MdComputer, MdCalendarToday, MdArrowForward } from 'react-icons/md';
import { getCategoryColor, getDeadlineLabel, truncateText, isDeadlineExpired } from '../../utils/helpers';
import { CATEGORY_ICONS } from '../../utils/constants';
import MatchScore from './MatchScore';
import BookmarkButton from './BookmarkButton';

const OpportunityCard = ({ opportunity, onBookmarkToggle }) => {
  const {
    _id,
    title,
    organization,
    category,
    mode,
    location,
    deadline,
    skills = [],
    matchScore,
    isBookmarked,
    isSampleData,
  } = opportunity;

  const deadlineInfo = getDeadlineLabel(deadline);
  const expired = isDeadlineExpired(deadline);
  const categoryColor = getCategoryColor(category);
  const categoryIcon = CATEGORY_ICONS[category] || '📌';

  return (
    <div className={`card p-5 flex flex-col gap-3 animate-fade-in ${expired ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-lg">
            {categoryIcon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className={`badge ${categoryColor} text-xs`}>{category}</span>
              {isSampleData && (
                <span className="badge bg-amber-100 text-amber-800 text-xs font-semibold">DEMO DATA</span>
              )}
              {expired && (
                <span className="badge bg-gray-100 text-gray-500 text-xs">Expired</span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{organization}</p>
          </div>
        </div>
        <BookmarkButton
          opportunityId={_id}
          isBookmarked={isBookmarked}
          onToggle={(newState) => onBookmarkToggle && onBookmarkToggle(_id, newState)}
          size="sm"
        />
      </div>

      {/* Info row */}
      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
        {location && (
          <span className="flex items-center gap-1">
            <MdLocationOn size={13} className="text-gray-400" />
            {location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <MdComputer size={13} className="text-gray-400" />
          {mode}
        </span>
        {deadlineInfo && (
          <span className={`flex items-center gap-1 ${deadlineInfo.color}`}>
            <MdCalendarToday size={13} />
            {deadlineInfo.label}
          </span>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full capitalize"
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-xs text-gray-400">+{skills.length - 4} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
        {matchScore !== undefined ? (
          <MatchScore score={matchScore} size="sm" />
        ) : (
          <div />
        )}
        <Link
          to={`/opportunities/${_id}`}
          className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
        >
          View Details
          <MdArrowForward size={14} />
        </Link>
      </div>
    </div>
  );
};

export default OpportunityCard;
