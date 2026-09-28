import { useState, useEffect } from 'react';
import { MdBookmark } from 'react-icons/md';
import { getBookmarks } from '../../api/bookmarkApi';
import OpportunityGrid from '../../components/opportunities/OpportunityGrid';
import EmptyState from '../../components/common/EmptyState';
import { PageLoader } from '../../components/common/Loader';
import { Link } from 'react-router-dom';

const SavedPage = () => {
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

  const handleBookmarkToggle = (oppId, newState) => {
    if (!newState) {
      setBookmarks((prev) => prev.filter((opp) => opp._id !== oppId));
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MdBookmark className="text-orange-500" size={28} />
          Saved Opportunities
        </h1>
        <p className="text-gray-500 mt-1">
          {bookmarks.length > 0 ? `${bookmarks.length} saved opportunities` : 'No saved opportunities yet'}
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon="📌"
          title="No saved opportunities"
          description="Save opportunities to see them here."
          action={
            <Link to="/explore" className="btn-primary text-sm px-4 py-2">
              Explore Opportunities
            </Link>
          }
        />
      ) : (
        <OpportunityGrid
          opportunities={bookmarks}
          loading={false}
          onBookmarkToggle={handleBookmarkToggle}
        />
      )}
    </div>
  );
};

export default SavedPage;
