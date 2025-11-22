import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

const Navbar = () => {
  const activeLinkStyle = {
    color: '#1e293b', // slate-800
    fontWeight: '600',
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              FairML Predictor
            </span>
          </NavLink>
          <nav className="flex items-center gap-8">
            <NavLink
              to="/"
              className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/about"
              className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            >
              About
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;