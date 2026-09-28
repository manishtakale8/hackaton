import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getOpportunities } from '../../api/opportunityApi';
import OpportunityGrid from '../../components/opportunities/OpportunityGrid';
import OpportunityFilters from '../../components/opportunities/OpportunityFilters';
import { MdExplore } from 'react-icons/md';

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    mode: searchParams.get('mode') || '',
    location: searchParams.get('location') || '',
    sortBy: searchParams.get('sortBy') || '',
  });

  const fetchOpportunities = useCallback(async (currentFilters) => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(currentFilters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const { data } = await getOpportunities(params);
      setOpportunities(data.opportunities || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities(filters);
  }, [filters, fetchOpportunities]);

  const handleFiltersChange = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    const params = {};
    Object.entries(updated).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    setSearchParams(params);
  };

  const handleReset = () => {
    setFilters({ search: '', category: '', mode: '', location: '', sortBy: '' });
    setSearchParams({});
  };

  const handleBookmarkToggle = (oppId, newState) => {
    setOpportunities((prev) =>
      prev.map((opp) =>
        opp._id === oppId ? { ...opp, isBookmarked: newState } : opp
      )
    );
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.category || filters.mode || filters.location || filters.sortBy
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MdExplore className="text-orange-500" size={28} />
          Explore Opportunities
        </h1>
        {!loading && (
          <p className="text-gray-500 mt-1">
            {total > 0
              ? `${total} opportunities found`
              : hasActiveFilters
              ? 'No opportunities match your filters'
              : 'No opportunities available yet'}
          </p>
        )}
      </div>

      {/* Filters */}
      <OpportunityFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
      />

      {/* Results */}
      <OpportunityGrid
        opportunities={opportunities}
        loading={loading}
        onBookmarkToggle={handleBookmarkToggle}
        emptyTitle={hasActiveFilters ? 'No opportunities found' : 'No opportunities available yet'}
        emptyDescription={
          hasActiveFilters
            ? 'Try changing your filters or check back later.'
            : 'Opportunities will appear here once they are added.'
        }
      />
    </div>
  );
};

export default ExplorePage;
