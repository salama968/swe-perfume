import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';

const TopAppBar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCloseMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 lg:px-12 py-5 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200">
      <div className="flex items-center gap-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="hover:opacity-70 transition-transform active:scale-95"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
      <nav className="hidden lg:flex gap-8">
        <Link
          to="/"
          className="font-serif uppercase tracking-widest text-xs text-stone-400 hover:text-stone-600 transition-opacity"
        >
          Perfumes
        </Link>
        <Link
          to="/"
          className="font-serif uppercase tracking-widest text-xs text-stone-400 hover:text-stone-600 transition-opacity"
        >
          Houses
        </Link>
        <Link
          to="/"
          className="font-serif uppercase tracking-widest text-xs text-stone-400 hover:text-stone-600 transition-opacity"
        >
          Olfactory Stories
        </Link>
        <Link
          to="/"
          className="font-serif uppercase tracking-widest text-xs text-stone-400 hover:text-stone-600 transition-opacity"
        >
          Boutique
        </Link>
      </nav>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-serif tracking-[0.3em] text-stone-900"
        >
          L'ESSENCE
        </Link>
      </div>
      <div className="hidden lg:flex items-center gap-4 sm:gap-6 text-stone-900">
        <button className="hover:opacity-70 transition-transform active:scale-95">
          <span className="material-symbols-outlined">search</span>
        </button>
        {user?.role === 'admin' ? (
          <Link
            to="/admin"
            className="hover:opacity-70 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined">
              admin_panel_settings
            </span>
          </Link>
        ) : null}
        {user?.role === 'vendor' ? (
          <Link
            to="/vendor"
            className="hover:opacity-70 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined">dashboard</span>
          </Link>
        ) : null}
        {user ? (
          <Link
            to="/orders"
            className="hover:opacity-70 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined">receipt_long</span>
          </Link>
        ) : null}
        <Link
          to="/checkout"
          className="hover:opacity-70 transition-transform active:scale-95 border-b border-stone-900 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">shopping_bag</span>
          {itemCount > 0 ? (
            <span className="text-xs font-semibold">{itemCount}</span>
          ) : null}
        </Link>
        {user ? (
          <button
            type="button"
            onClick={logout}
            className="hover:opacity-70 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="hover:opacity-70 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined">person</span>
          </Link>
        )}
      </div>
      {menuOpen ? (
        <div className="absolute top-full left-0 w-full bg-stone-50/95 border-b border-stone-200 shadow-sm lg:hidden">
          <div className="px-6 py-4 flex flex-col gap-4 text-stone-700 text-center items-center">
            <Link
              to="/"
              onClick={handleCloseMenu}
              className="font-serif uppercase tracking-widest text-xs text-stone-500 hover:text-stone-700"
            >
              Perfumes
            </Link>
            <Link
              to="/"
              onClick={handleCloseMenu}
              className="font-serif uppercase tracking-widest text-xs text-stone-500 hover:text-stone-700"
            >
              Houses
            </Link>
            <Link
              to="/"
              onClick={handleCloseMenu}
              className="font-serif uppercase tracking-widest text-xs text-stone-500 hover:text-stone-700"
            >
              Olfactory Stories
            </Link>
            <Link
              to="/"
              onClick={handleCloseMenu}
              className="font-serif uppercase tracking-widest text-xs text-stone-500 hover:text-stone-700"
            >
              Boutique
            </Link>
            <div className="border-t border-stone-200 pt-4 flex flex-col gap-3 items-center w-full">
              {user?.role === 'admin' ? (
                <Link to="/admin" onClick={handleCloseMenu}>
                  Admin Dashboard
                </Link>
              ) : null}
              {user?.role === 'vendor' ? (
                <Link to="/vendor" onClick={handleCloseMenu}>
                  Vendor Dashboard
                </Link>
              ) : null}
              {user ? (
                <Link to="/orders" onClick={handleCloseMenu}>
                  My Orders
                </Link>
              ) : null}
              <Link to="/checkout" onClick={handleCloseMenu}>
                Cart ({itemCount})
              </Link>
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    handleCloseMenu();
                  }}
                  className="text-left"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={handleCloseMenu}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default TopAppBar;
