import { useEffect, useState } from 'react';
import { fetchMyOrders } from '../api/orders';
import Footer from '../components/Footer';
import TopAppBar from '../components/TopAppBar';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyOrders();
        const list = data?.orders || data?.items || data?.data || data || [];
        setOrders(Array.isArray(list) ? list : []);
      } catch (err) {
        setError('Unable to load your orders right now.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <TopAppBar />
      <main className="flex-grow pt-[120px] pb-stack-lg px-margin-edge w-full max-w-container-max mx-auto">
        <div className="mb-stack-md">
          <h1 className="font-headline-xl text-headline-xl text-on-surface">
            My Orders
          </h1>
          <p className="font-body-md text-on-surface-variant mt-2">
            Track your recent purchases and order statuses.
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Order ID
                </th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Placed
                </th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Status
                </th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Sub-orders
                </th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Items
                </th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td className="py-6 px-6 text-on-surface-variant" colSpan={6}>
                    Loading orders...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="py-6 px-6 text-error" colSpan={6}>
                    {error}
                  </td>
                </tr>
              ) : orders.length ? (
                orders.map((order) => {
                  const orderId = order.id || order._id;
                  const placedAt = order.placedAt || order.createdAt;
                  const subOrders = Array.isArray(order.subOrders)
                    ? order.subOrders
                    : [];
                  const formattedDate = placedAt
                    ? new Date(placedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '—';
                  const total = Number(order.totalAmount || 0).toFixed(2);
                  const subOrderSummary = subOrders.length
                    ? subOrders.map((sub) => sub.status || 'pending')
                    : [];
                  return (
                    <tr key={orderId}>
                      <td className="py-4 px-6 font-mono text-sm text-on-surface-variant">
                        {orderId}
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">
                        {formattedDate}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full bg-secondary-fixed/20 text-on-secondary-fixed-variant text-[10px] uppercase">
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          {subOrderSummary.length ? (
                            subOrderSummary.map((status, index) => (
                              <span
                                key={`${orderId}-sub-${index}`}
                                className="px-2 py-1 rounded-full bg-surface-container-low text-[10px] uppercase text-on-surface-variant"
                              >
                                {status}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-on-surface-variant">
                              —
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">
                        {order.items?.length || 0}
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">
                        ${total}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-6 px-6 text-on-surface-variant" colSpan={6}>
                    You have no orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
