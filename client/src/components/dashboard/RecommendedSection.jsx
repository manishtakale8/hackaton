import { Link } from 'react-router-dom';
import OpportunityCard from '../opportunities/OpportunityCard';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';

const RecommendedSection = ({ recommendations, loading, hasProfile }) => {
  if (loading) return <Loader className="py-8" />;

  if (!hasProfile) {
    return (
      <EmptyState
        icon="✨"
        title="Complete your profile to receive personalized matches"
        description="Add your skills, interests, and preferred categories to receive recommendations tailored to your profile."
        action={
          <Link to="/profile" className="btn-primary text-sm px-4 py-2">
            Complete Profile
          </Link>
        }
      />
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <EmptyState
        icon="🎯"
        title="No recommendations yet"
        description="Complete your profile to receive personalized matches, or check back as new opportunities are published."
        action={
          <Link to="/explore" className="btn-outline text-sm px-4 py-2">
            Browse All Opportunities
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recommendations.slice(0, 6).map((opp) => (
        <OpportunityCard key={opp._id} opportunity={opp} />
      ))}
    </div>
  );
};

export default RecommendedSection;
