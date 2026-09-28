import { useState } from 'react';
import { MdSearch, MdFilterList, MdClose } from 'react-icons/md';
import { CATEGORIES, MODES } from '../../utils/constants';
import Select from '../common/Select';

const OpportunityFilters = ({ filters, onFiltersChange, onReset }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onFiltersChange({ search: searchInput });
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({ [key]: value || undefined });
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length;

  return (
    <div className="space-y-3">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search opportunities, skills, organizations..."
            className="input-field pl-9"
          />
        </div>
        <button type="submit" className="btn-primary px-4 py-2 text-sm whitespace-nowrap">
          Search
        </button>
        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="md:hidden btn-secondary px-3 py-2 relative"
        >
          <MdFilterList size={18} />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </form>

      {/* Desktop Filters */}
      <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 ${showMobileFilters ? 'block' : 'hidden md:grid'}`}>
        <Select
          value={filters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          options={CATEGORIES}
          placeholder="All Categories"
        />
        <Select
          value={filters.mode || ''}
          onChange={(e) => handleFilterChange('mode', e.target.value)}
          options={MODES}
          placeholder="All Modes"
        />
        <input
          type="text"
          value={filters.location || ''}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          placeholder="Location..."
          className="input-field"
        />
        <Select
          value={filters.sortBy || ''}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          options={[
            { value: 'newest', label: 'Newest First' },
            { value: 'deadline', label: 'Deadline Soon' },
            { value: 'match', label: 'Best Match' },
          ]}
          placeholder="Sort by..."
        />
        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              onReset();
              setSearchInput('');
            }}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            <MdClose size={16} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default OpportunityFilters;
