import { Link } from 'react-router-dom';
import { MdSearch, MdPeople, MdStar, MdArrowForward, MdCheckCircle } from 'react-icons/md';
import { CATEGORIES, CATEGORY_ICONS } from '../../utils/constants';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full mb-6 font-medium">
            <MdStar size={16} />
            Student Opportunity Discovery Platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Discover Opportunities
            <span className="block text-orange-100">That Match You</span>
          </h1>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Find internships, hackathons, scholarships, courses and competitions in one place.
            Get personalized recommendations based on your skills and interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <MdSearch size={20} />
              Explore Opportunities
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-orange-800/30 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-xl hover:bg-orange-800/50 transition-all border border-white/30 active:scale-95"
            >
              <MdPeople size={20} />
              Create Your Profile
              <MdArrowForward size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">The Problem</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                Students Miss Valuable Opportunities
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Information about internships, hackathons, scholarships, and competitions is scattered across
                dozens of websites, social media platforms, college WhatsApp groups, and notice boards.
              </p>
              <ul className="space-y-3">
                {[
                  'Opportunities buried in different websites',
                  'Deadline-related information hard to track',
                  'No personalization – same list for everyone',
                  'Missing out due to lack of awareness',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-red-400 font-bold mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-orange-50 rounded-2xl p-8">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">The Solution</span>
              <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-4">
                One Platform. Personalized for You.
              </h3>
              <ul className="space-y-3">
                {[
                  'All opportunities in one place',
                  'Personalized match scores based on your profile',
                  'Deadline tracking and reminders',
                  'Smart search and filtering',
                  'Bookmark and track your favorites',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700 text-sm">
                    <MdCheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Three simple steps to find opportunities that match your profile</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Add your education, skills, interests, and preferred categories to build your student profile.',
                icon: '👤',
              },
              {
                step: '02',
                title: 'Discover & Filter',
                description: 'Browse opportunities with smart search and filters. See your personalized match score for each.',
                icon: '🔍',
              },
              {
                step: '03',
                title: 'Bookmark & Apply',
                description: 'Save opportunities you like and apply through official external links before the deadline.',
                icon: '🚀',
              },
            ].map(({ step, title, description, icon }) => (
              <div key={step} className="card p-6 text-center hover:border-orange-200 transition-colors">
                <div className="text-4xl mb-4">{icon}</div>
                <div className="text-xs font-bold text-orange-500 mb-2">Step {step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Opportunity Categories</h2>
            <p className="text-gray-500">Explore across multiple opportunity types</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/explore?category=${cat}`}
                className="card p-4 text-center hover:border-orange-300 hover:shadow-md group transition-all"
              >
                <div className="text-3xl mb-2">{CATEGORY_ICONS[cat]}</div>
                <p className="text-xs font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">{cat}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Personalized Matching */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">Personalized Match Score</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                Know How Well You Fit
              </h2>
              <p className="text-gray-600 mb-6">
                Our transparent rule-based matching system calculates a score for every opportunity based on your profile.
                No black-box AI — you can see exactly why each score is assigned.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Skills Match', pct: '40%', color: 'bg-orange-500' },
                  { label: 'Interests Match', pct: '30%', color: 'bg-blue-500' },
                  { label: 'Category Match', pct: '20%', color: 'bg-green-500' },
                  { label: 'Eligibility', pct: '10%', color: 'bg-purple-500' },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm text-gray-700 flex-1">{label}</span>
                    <span className="text-sm font-bold text-gray-900">{pct}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Match Score Criteria</h4>
                  <p className="text-xs text-gray-500">Transparent Rule-Based Breakdown</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                  0 – 100% Scale
                </div>
              </div>
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-gray-500">Evaluated criteria breakdown:</p>
                {[
                  'Skills Match (up to 40%): Direct overlap of technical and domain skills',
                  'Interests Match (up to 30%): Alignment with selected interest areas',
                  'Category Match (up to 20%): Matching chosen opportunity types',
                  'Eligibility Match (up to 10%): Academic level and graduation year check',
                ].map((r) => (
                  <div key={r} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 italic border-t pt-3">
                Calculated directly from profile data. Deterministic and transparent with no black-box AI claims.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Features</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔍', title: 'Smart Search & Filter', desc: 'Search by title, skills, organization. Filter by category, mode, location.' },
              { icon: '🎯', title: 'Personalized Matching', desc: 'Transparent rule-based match scores show how well you fit each opportunity.' },
              { icon: '📌', title: 'Bookmark & Track', desc: 'Save opportunities you\'re interested in and revisit them anytime.' },
              { icon: '⏰', title: 'Deadline Tracking', desc: 'Never miss a deadline. See upcoming deadlines sorted by urgency.' },
              { icon: '📊', title: 'Student Dashboard', desc: 'All your stats, recommendations, and saved opportunities in one view.' },
              { icon: '🔗', title: 'Direct Apply Links', desc: 'Apply through official external links. We never collect your application.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card p-5 hover:border-orange-200 transition-colors">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-orange-500 to-orange-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Opportunity?</h2>
          <p className="text-orange-100 mb-8">
            Create a free profile and start discovering opportunities that match your skills and interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-all shadow-lg active:scale-95"
            >
              Get Started — It's Free
              <MdArrowForward size={18} />
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all active:scale-95"
            >
              Browse Opportunities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
