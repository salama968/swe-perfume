import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';

const RegisterPage = () => {
  const { register } = useAuth();
  const { mergeGuestCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await register(form);
      await mergeGuestCart();
      navigate('/');
    } catch (err) {
      setError('Unable to register. Please check your details.');
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
          Join L'Essence
        </h1>
        <p className="text-on-surface-variant mb-6">
          Create your account to explore curated fragrances.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary"
            placeholder="Name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
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
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link className="underline" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
