import { Link } from 'react-router-dom';
import { MdCalendarToday, MdArrowForward } from 'react-icons/md';
import { formatDate, getDaysUntilDeadline, getCategoryColor } from '../../utils/helpers';
import EmptyState from '../common/EmptyState';

const DeadlineSection = ({ opportunities }) => {
  const upcoming = (opportunities || [])
    .filter((opp) => {
      const days = getDaysUntilDeadline(opp.deadline);
      return days !== null && days >= 0 && days <= 30;
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  if (upcoming.length === 0) {
    return (
      <EmptyState
        icon="📅"
        title="No upcoming deadlines"
        description="Bookmark opportunities to track their deadlines here."
      />
    );
  }

  return (
    <div className="space-y-3">
      {upcoming.map((opp) => {
        const days = getDaysUntilDeadline(opp.deadline);
        const isUrgent = days <= 7;
        return (
          <div
            key={opp._id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
              isUrgent ? 'border-red-100 bg-red-50' : 'border-gray-100 bg-gray-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isUrgent ? 'bg-red-100' : 'bg-orange-50'
            }`}>
              <MdCalendarToday size={18} className={isUrgent ? 'text-red-500' : 'text-orange-500'} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{opp.title}</p>
              <p className="text-xs text-gray-500">{opp.organization}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`text-xs font-bold ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                {days === 0 ? 'Today!' : `${days}d left`}
              </p>
              <p className="text-xs text-gray-400">{formatDate(opp.deadline)}</p>
            </div>
            <Link
              to={`/opportunities/${opp._id}`}
              className="text-gray-400 hover:text-orange-500 transition-colors"
            >
              <MdArrowForward size={16} />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default DeadlineSection;
