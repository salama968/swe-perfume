import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import Footer from '../components/Footer';
import TopAppBar from '../components/TopAppBar';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, subtotal, clear, mergeGuestCart, updateQuantity, removeItem } =
    useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    street: '',
    city: '',
    zip: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPrice = (value) => {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) return '0.00';
    return numberValue.toFixed(2);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!items.length) {
      setError('Your bag is empty.');
      return;
    }

    setLoading(true);
    try {
      await mergeGuestCart();
      await createOrder({
        shippingAddress: {
          street: form.street,
          city: form.city,
          zip: form.zip,
          country: form.country,
        },
      });
      await clear();
      setSuccess('Order placed. You will receive a confirmation shortly.');
    } catch (err) {
      setError('Unable to complete purchase. Please review your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <TopAppBar />
      <main className="flex-grow pt-[120px] pb-stack-lg px-margin-edge w-full max-w-container-max mx-auto">
        <div className="mb-stack-md">
          <h1 className="font-headline-xl text-headline-xl text-on-surface">
            Checkout
          </h1>
          <p className="font-body-md text-on-surface-variant mt-2">
            Review your curated selection and complete your purchase.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-7 flex flex-col gap-stack-md">
            <div className="border-t border-outline-variant pt-unit flex flex-col gap-stack-sm">
              {items.length ? (
                items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-gutter items-center py-stack-sm border-b border-surface-variant"
                  >
                    <div className="w-24 h-32 bg-surface-container-low shrink-0 overflow-hidden group">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src={
                          item.imageUrl ||
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuAUvjgGGtb3BTFHuc1YTStP2OPvWqRsU8iGuIH_kaZWqxUnEvveHY8XO-X8MZ3u9Nb0esTAsJn3iSZMYtLbCVxi0z2A_D_tdnlDB7F1QHy5cJSMmBZJ3HN22bGhroUMO8mqeztS-6TsSkSVusJ1CyjKAO_Qg_Mww4_VSUlSG97McL6bwQiqS2HPNkfP7qPZA56hP7uJH6yWmZzKNN7MPbZ1hqDHLqqgu5cvXZRSM_3GkeBQJlrHI7NgrWLZPQTsy2Tm-zpk2U2wjlDT'
                        }
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-2">
                      <div>
                        <p className="font-label-caps text-on-surface-variant uppercase mb-1">
                          L'Essence
                        </p>
                        <h3 className="font-headline-md text-on-surface">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-outline-variant px-3 py-2 min-w-[110px] justify-between">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                remove
                              </span>
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                add
                              </span>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-error"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-on-surface">Each</span>
                        <span className="font-body-lg">
                          ${formatPrice(item.price)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-on-surface-variant text-sm">
                          Line total
                        </span>
                        <span className="text-on-surface">
                          ${formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-on-surface-variant">
                  Your bag is empty. Explore the{' '}
                  <Link to="/" className="underline">
                    collection
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-stack-md lg:pl-gutter">
            <div className="bg-surface-container-low p-stack-md flex flex-col gap-stack-sm">
              <h2 className="font-headline-md text-on-surface mb-2">
                Order Summary
              </h2>
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span>${formatPrice(subtotal)}</span>
              </div>
              <div className="border-t border-outline-variant pt-stack-sm mt-2 flex justify-between items-center">
                <span className="font-body-lg font-semibold">Total</span>
                <span className="font-headline-md">
                  ${formatPrice(subtotal)}
                </span>
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-stack-sm"
            >
              <h2 className="font-headline-md text-on-surface mb-2">
                Shipping
              </h2>
              <div className="flex flex-col gap-4">
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary"
                  placeholder="Full Name"
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary"
                  placeholder="Street Address"
                  type="text"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary"
                  placeholder="City"
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary"
                  placeholder="ZIP"
                  type="text"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary"
                  placeholder="Country"
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                />
                {error ? <p className="text-error">{error}</p> : null}
                {success ? (
                  <p className="text-on-secondary-container">{success}</p>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-stack-sm w-full bg-primary text-on-primary py-4 font-label-caps uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Processing...' : 'Complete Purchase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
