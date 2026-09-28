import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatCard from '../../components/dashboard/StatCard';
import { PageLoader } from '../../components/common/Loader';
import { getCategoryColor } from '../../utils/helpers';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/api/admin/stats');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform overview and management</p>
        </div>
        <Link to="/admin/opportunities/new" className="btn-primary text-sm py-2 px-4">
          + Add Opportunity
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📋" label="Total Opportunities" value={stats?.totalOpportunities || 0} color="orange" />
        <StatCard icon="👥" label="Student Users" value={stats?.totalUsers || 0} color="blue" />
        <StatCard icon="📌" label="Total Bookmarks" value={stats?.totalBookmarks || 0} color="green" />
        <StatCard icon="📂" label="Categories" value={stats?.categoryCounts?.length || 0} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Opportunities by Category</h2>
          {stats?.categoryCounts?.length > 0 ? (
            <div className="space-y-3">
              {stats.categoryCounts.map(({ _id, count }) => (
                <div key={_id} className="flex items-center justify-between">
                  <span className={`badge ${getCategoryColor(_id)}`}>{_id}</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full"
                        style={{
                          width: `${(count / stats.totalOpportunities) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm">
              <p className="mb-2">No categorized opportunities yet.</p>
              <Link to="/admin/opportunities/new" className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                + Add your first opportunity
              </Link>
            </div>
          )}
        </div>

        {/* Recent opportunities */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recently Added</h2>
            {stats?.recentOpportunities?.length > 0 && (
              <Link to="/admin/opportunities" className="text-sm text-orange-600 hover:text-orange-700">
                Manage all →
              </Link>
            )}
          </div>
          {stats?.recentOpportunities?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOpportunities.map((opp) => (
                <div key={opp._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{opp.title}</p>
                    <p className="text-xs text-gray-500">{opp.organization}</p>
                  </div>
                  <span className={`badge ${getCategoryColor(opp.category)} text-xs`}>
                    {opp.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm">
              <p className="mb-2">No opportunities created yet.</p>
              <Link to="/admin/opportunities/new" className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                + Add an opportunity
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
