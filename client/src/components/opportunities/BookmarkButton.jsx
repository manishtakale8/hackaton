import { useState } from 'react';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import { addBookmark, removeBookmark } from '../../api/bookmarkApi';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const BookmarkButton = ({ opportunityId, isBookmarked: initialBookmarked, onToggle, size = 'md' }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    const prev = bookmarked;
    setBookmarked(!prev); // Optimistic update
    try {
      if (prev) {
        await removeBookmark(opportunityId);
      } else {
        await addBookmark(opportunityId);
      }
      if (onToggle) onToggle(!prev);
    } catch (err) {
      setBookmarked(prev); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  const iconSize = size === 'sm' ? 18 : 22;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
        bookmarked
          ? 'text-orange-500 hover:text-orange-600 bg-orange-50'
          : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
      }`}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this opportunity'}
    >
      {bookmarked ? (
        <MdBookmark size={iconSize} />
      ) : (
        <MdBookmarkBorder size={iconSize} />
      )}
    </button>
  );
};

export default BookmarkButton;
