import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdExplore, MdBookmark, MdSchedule, MdTrendingUp } from 'react-icons/md';
import useAuth from '../../hooks/useAuth';
import { getProfile } from '../../api/profileApi';
import { getRecommendations } from '../../api/opportunityApi';
import { getBookmarks } from '../../api/bookmarkApi';
import StatCard from '../../components/dashboard/StatCard';
import RecommendedSection from '../../components/dashboard/RecommendedSection';
import DeadlineSection from '../../components/dashboard/DeadlineSection';
import ProfileCompletion from '../../components/dashboard/ProfileCompletion';
import { getDaysUntilDeadline } from '../../utils/helpers';

const DashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, bookmarksRes] = await Promise.all([
          getProfile(),
          getBookmarks(),
        ]);
        setProfile(profileRes.data);
        setBookmarks(bookmarksRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const { data } = await getRecommendations();
        setRecommendations(data.recommendations || []);
        setHasProfile(data.hasProfile);
      } catch (err) {
        console.error(err);
      } finally {
        setRecLoading(false);
      }
    };
    loadRecommendations();
  }, []);

  const upcomingDeadlines = bookmarks.filter((opp) => {
    const days = getDaysUntilDeadline(opp.deadline);
    return days !== null && days >= 0 && days <= 30;
  });

  const completionPct = profile?.completionPercentage ?? 0;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your opportunities</p>
        </div>
        <Link to="/explore" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <MdExplore size={16} />
          Explore Opportunities
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="🎯"
          label="Recommended"
          value={recommendations.length}
          color="orange"
          sub="Based on your profile"
        />
        <StatCard
          icon="📌"
          label="Saved"
          value={bookmarks.length}
          color="blue"
          sub="Bookmarked opportunities"
        />
        <StatCard
          icon="⏰"
          label="Deadlines Soon"
          value={upcomingDeadlines.length}
          color="green"
          sub="Within 30 days"
        />
        <StatCard
          icon="👤"
          label="Profile"
          value={`${completionPct}%`}
          color="purple"
          sub="Completion"
        />
      </div>

      {/* Profile Completion */}
      {completionPct < 80 && <ProfileCompletion percentage={completionPct} />}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommendations */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MdTrendingUp className="text-orange-500" size={20} />
              Recommended for You
            </h2>
            <Link to="/explore?sortBy=match" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View all →
            </Link>
          </div>
          <RecommendedSection
            recommendations={recommendations}
            loading={recLoading}
            hasProfile={hasProfile}
          />
        </div>

        {/* Deadlines */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MdSchedule className="text-orange-500" size={20} />
              Upcoming Deadlines
            </h2>
            <Link to="/deadlines" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View all →
            </Link>
          </div>
          <DeadlineSection opportunities={bookmarks} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
