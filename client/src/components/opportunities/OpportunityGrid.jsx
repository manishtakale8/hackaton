import OpportunityCard from './OpportunityCard';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';

const OpportunityGrid = ({
  opportunities,
  loading,
  onBookmarkToggle,
  emptyTitle = 'No opportunities found',
  emptyDescription = 'Try changing your filters or check back later.',
  emptyAction,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader size="lg" />
      </div>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {opportunities.map((opp) => (
        <OpportunityCard
          key={opp._id}
          opportunity={opp}
          onBookmarkToggle={onBookmarkToggle}
        />
      ))}
    </div>
  );
};

export default OpportunityGrid;
