import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import { getOpportunities, deleteOpportunity } from '../../api/opportunityApi';
import { getCategoryColor, formatDate } from '../../utils/helpers';
import { CATEGORIES } from '../../utils/constants';
import { PageLoader } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Select from '../../components/common/Select';

const ManageOpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await getOpportunities(params);
      setOpportunities(data.opportunities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [search, category]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteOpportunity(id);
      setOpportunities((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert('Failed to delete. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Opportunities</h1>
          <p className="text-gray-500 mt-1">{opportunities.length} opportunities</p>
        </div>
        <Link to="/admin/opportunities/new" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <MdAdd size={18} />
          Add Opportunity
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search opportunities..."
            className="input-field pl-9"
          />
        </div>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={CATEGORIES}
          placeholder="All Categories"
          className="w-44"
        />
      </div>

      {/* Table */}
      {loading ? (
        <PageLoader />
      ) : opportunities.length === 0 ? (
        <EmptyState
          icon="📋"
          title={search || category ? 'No opportunities found' : 'No opportunities available yet'}
          description={
            search || category
              ? 'Try changing your search terms or category filter.'
              : 'Opportunities will appear here once they are added.'
          }
          action={
            <Link to="/admin/opportunities/new" className="btn-primary text-sm px-4 py-2">
              + Add Opportunity
            </Link>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Mode</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Deadline</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {opportunities.map((opp) => (
                  <tr key={opp._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 max-w-xs truncate">{opp.title}</p>
                        <p className="text-xs text-gray-400">{opp.organization}</p>
                        {opp.isSampleData && (
                          <span className="badge bg-amber-100 text-amber-800 text-xs font-semibold ml-2">DEMO DATA</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${getCategoryColor(opp.category)}`}>{opp.category}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{opp.mode}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(opp.deadline)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/opportunities/${opp._id}/edit`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <MdEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(opp._id, opp.title)}
                          disabled={deleting === opp._id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOpportunitiesPage;
