import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdSchedule, MdArrowForward, MdCalendarToday } from 'react-icons/md';
import { getBookmarks } from '../../api/bookmarkApi';
import { formatDate, getDaysUntilDeadline, getCategoryColor } from '../../utils/helpers';
import { PageLoader } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const DeadlinesPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getBookmarks();
        setBookmarks(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <PageLoader />;

  const withDeadlines = bookmarks
    .filter((opp) => opp.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const upcoming = withDeadlines.filter(opp => getDaysUntilDeadline(opp.deadline) >= 0);
  const expired = withDeadlines.filter(opp => getDaysUntilDeadline(opp.deadline) < 0);

  const DeadlineRow = ({ opp }) => {
    const days = getDaysUntilDeadline(opp.deadline);
    const isExpired = days < 0;
    const isUrgent = !isExpired && days <= 7;

    return (
      <div className={`card p-4 flex items-center gap-4 ${isExpired ? 'opacity-60' : ''}`}>
        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
          isExpired ? 'bg-gray-100' : isUrgent ? 'bg-red-50' : 'bg-orange-50'
        }`}>
          <MdCalendarToday size={16} className={isExpired ? 'text-gray-400' : isUrgent ? 'text-red-500' : 'text-orange-500'} />
          {!isExpired && (
            <span className={`text-xs font-bold ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
              {days === 0 ? 'Today' : `${days}d`}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`badge ${getCategoryColor(opp.category)} text-xs`}>{opp.category}</span>
            {isExpired && <span className="badge bg-gray-100 text-gray-400 text-xs">Expired</span>}
          </div>
          <h3 className="font-semibold text-gray-900 text-sm truncate">{opp.title}</h3>
          <p className="text-xs text-gray-500">{opp.organization}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`text-sm font-semibold ${isExpired ? 'text-gray-400' : isUrgent ? 'text-red-600' : 'text-gray-700'}`}>
            {formatDate(opp.deadline)}
          </p>
        </div>
        <Link to={`/opportunities/${opp._id}`} className="text-gray-400 hover:text-orange-500 transition-colors flex-shrink-0">
          <MdArrowForward size={18} />
        </Link>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MdSchedule className="text-orange-500" size={28} />
          Deadline Tracker
        </h1>
        <p className="text-gray-500 mt-1">
          Track deadlines from your saved opportunities
        </p>
      </div>

      {withDeadlines.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No deadlines to track"
          description="Bookmark opportunities with deadlines and they'll appear here."
          action={
            <Link to="/explore" className="btn-primary text-sm px-4 py-2">
              Find Opportunities
            </Link>
          }
        />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                Upcoming ({upcoming.length})
              </h2>
              {upcoming.map((opp) => <DeadlineRow key={opp._id} opp={opp} />)}
            </div>
          )}
          {expired.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-gray-400 text-sm uppercase tracking-wide">
                Past Deadlines ({expired.length})
              </h2>
              {expired.map((opp) => <DeadlineRow key={opp._id} opp={opp} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DeadlinesPage;
