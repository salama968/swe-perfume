import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';

const LoginPage = () => {
  const { login } = useAuth();
  const { mergeGuestCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(form);
      await mergeGuestCart();
      const role = data?.user?.role;
      const fallback =
        role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor' : '/';
      const redirectTo = location.state?.from?.pathname || fallback;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant p-8 relative">
        <Link
          className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface absolute top-6 right-6"
          to="/"
        >
          Back to store
        </Link>
        <h1 className="font-headline-lg text-on-surface mt-5 mb-2">
          Welcome Back
        </h1>
        <p className="text-on-surface-variant mb-6">
          Sign in to manage your account.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary"
            placeholder="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary"
            placeholder="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error ? <p className="text-error">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 font-label-caps uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-sm text-on-surface-variant">
          No account yet?{' '}
          <Link className="underline" to="/register">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
