import { CATEGORY_COLORS } from './constants';

export const formatDate = (dateString) => {
  if (!dateString) return 'No deadline';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getDaysUntilDeadline = (dateString) => {
  if (!dateString) return null;
  const deadline = new Date(dateString);
  const now = new Date();
  const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  return diff;
};

export const getDeadlineLabel = (dateString) => {
  const days = getDaysUntilDeadline(dateString);
  if (days === null) return null;
  if (days < 0) return { label: 'Expired', color: 'text-gray-400' };
  if (days === 0) return { label: 'Today!', color: 'text-red-600 font-bold' };
  if (days <= 3) return { label: `${days}d left`, color: 'text-red-500 font-semibold' };
  if (days <= 7) return { label: `${days}d left`, color: 'text-orange-500 font-semibold' };
  if (days <= 30) return { label: `${days}d left`, color: 'text-yellow-600' };
  return { label: formatDate(dateString), color: 'text-gray-500' };
};

export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';
};

export const getMatchScoreClass = (score) => {
  if (score >= 70) return 'match-score-high';
  if (score >= 40) return 'match-score-medium';
  return 'match-score-low';
};

export const getMatchScoreLabel = (score) => {
  if (score >= 80) return 'Excellent Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Partial Match';
  return 'Low Match';
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
};

export const isDeadlineSoon = (dateString) => {
  const days = getDaysUntilDeadline(dateString);
  return days !== null && days >= 0 && days <= 7;
};

export const isDeadlineExpired = (dateString) => {
  const days = getDaysUntilDeadline(dateString);
  return days !== null && days < 0;
};
