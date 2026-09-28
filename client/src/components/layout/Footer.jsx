import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-white border-t border-gray-100 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">O</span>
          </div>
          <span className="font-semibold text-gray-800">
            Opportunity<span className="text-orange-500">Hub</span>
          </span>
        </div>
        <p className="text-xs text-gray-400">
          A student opportunity discovery platform connecting learners with genuine opportunities.
        </p>
        <div className="flex gap-4 text-sm text-gray-500">
          <Link to="/explore" className="hover:text-orange-500 transition-colors">Explore</Link>
          <Link to="/register" className="hover:text-orange-500 transition-colors">Register</Link>
          <Link to="/login" className="hover:text-orange-500 transition-colors">Login / Admin</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
