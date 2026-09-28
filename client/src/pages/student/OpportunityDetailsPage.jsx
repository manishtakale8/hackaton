import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MdArrowBack, MdLocationOn, MdComputer, MdCalendarToday, MdOpenInNew, MdBusiness, MdInfo } from 'react-icons/md';
import { getOpportunityById } from '../../api/opportunityApi';
import { getCategoryColor, formatDate, getDeadlineLabel, isDeadlineExpired } from '../../utils/helpers';
import { CATEGORY_ICONS } from '../../utils/constants';
import MatchScore from '../../components/opportunities/MatchScore';
import BookmarkButton from '../../components/opportunities/BookmarkButton';
import { PageLoader } from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';

const OpportunityDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getOpportunityById(id);
        setOpportunity(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load opportunity');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!opportunity) return null;

  const {
    title, organization, description, category, mode, location,
    deadline, skills, interests, eligibility, applicationUrl,
    matchScore, matchReasons, isBookmarked, isSampleData,
  } = opportunity;

  const deadlineInfo = getDeadlineLabel(deadline);
  const expired = isDeadlineExpired(deadline);
  const categoryColor = getCategoryColor(category);
  const categoryIcon = CATEGORY_ICONS[category] || '📌';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <MdArrowBack size={18} />
        Back
      </button>

      {/* Header Card */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-3xl flex-shrink-0">
              {categoryIcon}
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`badge ${categoryColor}`}>{category}</span>
                {isSampleData && (
                  <span className="badge bg-amber-100 text-amber-800 text-xs font-semibold">
                    DEMO DATA – For development testing only
                  </span>
                )}
                {expired && (
                  <span className="badge bg-red-100 text-red-600">Deadline Passed</span>
                )}
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">{title}</h1>
              <div className="flex items-center gap-1 text-gray-600">
                <MdBusiness size={16} />
                <span className="font-medium">{organization}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {matchScore !== undefined && (
              <MatchScore score={matchScore} size="md" />
            )}
            <BookmarkButton
              opportunityId={opportunity._id}
              isBookmarked={isBookmarked}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-xl">
          {location && (
            <div className="flex items-center gap-2 text-sm">
              <MdLocationOn className="text-orange-400" size={18} />
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="font-medium text-gray-700">{location}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <MdComputer className="text-orange-400" size={18} />
            <div>
              <p className="text-xs text-gray-400">Mode</p>
              <p className="font-medium text-gray-700">{mode}</p>
            </div>
          </div>
          {deadline && (
            <div className="flex items-center gap-2 text-sm">
              <MdCalendarToday className="text-orange-400" size={18} />
              <div>
                <p className="text-xs text-gray-400">Deadline</p>
                <p className={`font-medium ${deadlineInfo?.color || 'text-gray-700'}`}>
                  {formatDate(deadline)}
                  {deadlineInfo && !expired && ` (${deadlineInfo.label})`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Apply Button */}
        {applicationUrl ? (
          <div className="mt-4">
            {expired ? (
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-500 text-center">
                This opportunity's deadline has passed. Check the official website for updates.
              </div>
            ) : (
              <a
                href={applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-primary px-6 py-3 text-base"
              >
                Apply Now (External Link)
                <MdOpenInNew size={18} />
              </a>
            )}
            <p className="text-xs text-gray-400 mt-2">
              ↗ This will open the official application page in a new tab.
              We do not collect your application data.
            </p>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-500 flex items-center justify-between">
            <span>Application link unavailable</span>
            <span className="text-xs text-gray-400">Official link not provided</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-3">About this Opportunity</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
          </div>

          {/* Eligibility */}
          {eligibility && (
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MdInfo size={18} className="text-blue-500" />
                Eligibility
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{eligibility}</p>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Match Score */}
          {matchScore !== undefined && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Personalized Match Score</h3>
              <MatchScore score={matchScore} reasons={matchReasons} showReasons size="md" />
            </div>
          )}

          {/* Skills */}
          {skills?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="text-sm bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1 rounded-full capitalize">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {interests?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Related Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span key={interest} className="text-sm bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full capitalize">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Demo Data Notice */}
          {isSampleData && (
            <div className="card p-4 border-amber-200 bg-amber-50">
              <p className="text-xs text-amber-800">
                <strong>DEMO DATA</strong><br />
                This entry is for development testing only. It is not an active real-world listing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailsPage;
