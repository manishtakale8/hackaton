import { NavLink } from 'react-router-dom';
import { MdDashboard, MdExplore, MdBookmark, MdPerson, MdSchedule } from 'react-icons/md';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { to: '/explore', label: 'Explore', icon: MdExplore },
  { to: '/saved', label: 'Saved', icon: MdBookmark },
  { to: '/deadlines', label: 'Deadlines', icon: MdSchedule },
  { to: '/profile', label: 'Profile', icon: MdPerson },
];

const Sidebar = () => (
  <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-white border-r border-gray-100 pt-6 pb-8 px-3 sticky top-16">
    <nav className="flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-orange-50 text-orange-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
