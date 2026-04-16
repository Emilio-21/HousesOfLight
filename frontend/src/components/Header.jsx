import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, X, MagnifyingGlass } from '@phosphor-icons/react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/videos', label: 'Videos' },
    { href: '/categories', label: 'Categorías' },
    { href: '/speakers', label: 'Oradores' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black" data-testid="header">
      <div className="px-6 sm:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <span className="text-xl lg:text-2xl font-black tracking-tighter">HOUSES OF LIGHT</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-xs uppercase tracking-widest font-medium transition-colors ${
                  isActive(link.href) ? 'text-black' : 'text-gray-500 hover:text-black'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/videos"
              className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
            >
              <MagnifyingGlass size={20} weight="bold" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-black bg-white">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-6 py-4 text-sm uppercase tracking-widest font-medium border-b border-black/10 ${
                  isActive(link.href) ? 'bg-black text-white' : 'text-black hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
