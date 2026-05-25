import { useEffect, useMemo, useState } from 'react';
import { fetchProducts } from '../api/products';
import {
  bulkCreateProducts,
  createVendorProduct,
  deleteVendorProduct,
  fetchVendorOrders,
  updateVendorOrderStatus,
  updateVendorProduct,
} from '../api/vendor';
import SideNavBar from '../components/SideNavBar';
import useAuth from '../hooks/useAuth';

const VendorDashboardPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formState, setFormState] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    imageFile: null,
  });
  const [bulkText, setBulkText] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  const [bulkOpen, setBulkOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orderStatus, setOrderStatus] = useState({});
  const [orderSavingId, setOrderSavingId] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  const statusOptions = useMemo(
    () => ['pending', 'processing', 'shipped', 'delivered'],
    [],
  );

  const normalizeList = (data) => {
    const list = data?.products || data?.items || data?.data || data || [];
    return Array.isArray(list) ? list : [];
  };

  const load = async () => {
    setLoading(true);
    try {
      const [productData, orderData] = await Promise.all([
        fetchProducts({ page: 1, limit: 12 }),
        fetchVendorOrders(),
      ]);
      const ordersList =
        orderData?.orders ||
        orderData?.items ||
        orderData?.data ||
        orderData ||
        [];
      setProducts(normalizeList(productData));
      setOrders(Array.isArray(ordersList) ? ordersList : []);
    } catch (error) {
      setProducts([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenCreate = () => {
    setFormError('');
    setFormSuccess('');
    setFormState({
      id: null,
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      imageFile: null,
    });
    setFormOpen(true);
  };

  const handleEdit = (product) => {
    setFormError('');
    setFormSuccess('');
    setFormState({
      id: product.id || product._id,
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      imageUrl: product.imageUrl || '',
      imageFile: null,
    });
    setFormOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'imageFile') {
      setFormState((prev) => ({ ...prev, imageFile: files?.[0] || null }));
      return;
    }
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSaving(true);
    try {
      const isMultipart = Boolean(formState.imageFile);
      const payload = isMultipart
        ? (() => {
            const data = new FormData();
            data.append('name', formState.name);
            data.append('description', formState.description);
            data.append('price', formState.price);
            data.append('image', formState.imageFile);
            return data;
          })()
        : {
            name: formState.name,
            description: formState.description,
            price: Number(formState.price),
            imageUrl: formState.imageUrl,
          };

      if (formState.id) {
        await updateVendorProduct(formState.id, payload, isMultipart);
        setFormSuccess('Product updated successfully.');
      } else {
        await createVendorProduct(payload, isMultipart);
        setFormSuccess('Product created successfully.');
      }
      await load();
    } catch (error) {
      setFormError('Unable to save product. Please check the fields.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?',
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await deleteVendorProduct(id);
      await load();
    } catch (error) {
      setFormError('Unable to delete product.');
    }
  };

  const handleBulkSubmit = async () => {
    setBulkError('');
    setBulkSuccess('');
    try {
      const parsed = JSON.parse(bulkText);
      const payload = Array.isArray(parsed) ? { products: parsed } : parsed;
      await bulkCreateProducts(payload);
      setBulkSuccess('Bulk upload completed.');
      setBulkText('');
      await load();
    } catch (error) {
      setBulkError('Bulk payload must be valid JSON.');
    }
  };

  const handleOrderStatusChange = (id, value) => {
    setOrderStatus((prev) => ({ ...prev, [id]: value }));
  };

  const handleOrderUpdate = async (id) => {
    const nextStatus = orderStatus[id];
    if (!nextStatus) return;
    setOrderSavingId(id);
    try {
      await updateVendorOrderStatus(id, { status: nextStatus });
      await load();
    } catch (error) {
      // keep the select value for retry
    } finally {
      setOrderSavingId(null);
    }
  };

  return (
    <div className="flex bg-background min-h-screen">
      <SideNavBar
        active="vendor"
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
      />
      <main className="flex-1 ml-0 lg:ml-64 p-6 lg:p-12 max-w-[container-max] w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-stack-lg gap-6">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">
              Vendor Dashboard
            </h1>
            <p className="font-body-lg text-on-surface-variant">
              Welcome back, {user?.name || 'Vendor'}. Overview of your inventory
              and recent activity.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className="lg:hidden w-full sm:w-auto border border-outline px-4 py-3 font-label-caps text-label-caps uppercase tracking-widest"
            >
              Menu
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="bg-primary text-on-primary font-label-caps text-label-caps uppercase px-6 py-4 flex items-center gap-2 hover:bg-stone-800 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add New Fragrance
            </button>
            <button
              type="button"
              onClick={() => setBulkOpen((prev) => !prev)}
              className="border border-outline px-6 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:border-primary"
            >
              {bulkOpen ? 'Hide Bulk Upload' : 'Bulk Upload'}
            </button>
          </div>
        </header>
        {formOpen ? (
          <section className="mb-stack-lg border border-outline-variant bg-surface-container-lowest p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-headline-md text-on-surface">
                {formState.id ? 'Edit Product' : 'New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-sm uppercase tracking-widest text-on-surface-variant"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary"
                placeholder="Name"
                type="text"
                name="name"
                value={formState.name}
                onChange={handleFormChange}
                required
              />
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary"
                placeholder="Price"
                type="number"
                step="0.01"
                name="price"
                value={formState.price}
                onChange={handleFormChange}
                required
              />
              <input
                className="w-full md:col-span-2 bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary"
                placeholder="Image URL"
                type="text"
                name="imageUrl"
                value={formState.imageUrl}
                onChange={handleFormChange}
              />
              <textarea
                className="w-full md:col-span-2 bg-transparent border border-outline-variant py-2 px-3 focus:ring-0 focus:border-primary h-28"
                placeholder="Description"
                name="description"
                value={formState.description}
                onChange={handleFormChange}
              />
              <div className="md:col-span-2">
                <label className="text-sm text-on-surface-variant">
                  Optional image upload
                </label>
                <input
                  className="mt-2 block w-full"
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleFormChange}
                />
              </div>
              {formError ? (
                <p className="text-error md:col-span-2">{formError}</p>
              ) : null}
              {formSuccess ? (
                <p className="text-on-secondary-container md:col-span-2">
                  {formSuccess}
                </p>
              ) : null}
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-on-primary px-6 py-3 font-label-caps uppercase tracking-widest disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="border border-outline px-6 py-3 font-label-caps uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}
        {bulkOpen ? (
          <section className="mb-stack-lg border border-outline-variant bg-surface-container-lowest p-6">
            <h2 className="font-headline-md text-on-surface mb-2">
              Bulk Upload
            </h2>
            <p className="text-on-surface-variant mb-4">
              Paste a JSON array of products or an object with a products array.
            </p>
            <textarea
              className="w-full h-40 bg-transparent border border-outline-variant p-3"
              value={bulkText}
              onChange={(event) => setBulkText(event.target.value)}
              placeholder='[{"name":"Item A","description":"Desc","price":10,"imageUrl":"https://..."}]'
            />
            {bulkError ? <p className="text-error mt-2">{bulkError}</p> : null}
            {bulkSuccess ? (
              <p className="text-on-secondary-container mt-2">{bulkSuccess}</p>
            ) : null}
            <button
              type="button"
              onClick={handleBulkSubmit}
              className="mt-4 bg-primary text-on-primary px-6 py-3 font-label-caps uppercase tracking-widest"
            >
              Upload
            </button>
          </section>
        ) : null}
        <section className="mb-stack-lg">
          <div className="flex justify-between items-center mb-stack-sm border-b border-surface-container-high pb-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              My Listings
            </h2>
            <button
              type="button"
              onClick={load}
              className="font-label-caps text-on-surface-variant uppercase border-b border-transparent hover:border-primary"
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <p className="text-on-surface-variant">Loading listings...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {products.map((product) => (
                <div
                  key={product.id || product._id}
                  className="group border border-surface-container-highest bg-surface-container-lowest p-4 flex flex-col gap-4 hover:border-outline transition-colors relative"
                >
                  <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                      src={product.imageUrl}
                      alt={product.name}
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-surface-container-lowest text-[10px] font-label-caps uppercase border border-surface-container-high">
                      {product.isActive === false ? 'Hidden' : 'In Stock'}
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="font-headline-lg text-[20px] leading-tight mb-1">
                        {product.name}
                      </h3>
                      <p className="text-on-surface-variant text-sm">
                        Eau de Parfum
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-body-lg">${product.price}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="w-10 h-10 flex items-center justify-center border border-surface-container-high hover:border-primary"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            edit
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(product.id || product._id)
                          }
                          className="w-10 h-10 flex items-center justify-center border border-surface-container-high hover:border-error"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        <section>
          <div className="flex justify-between items-center mb-stack-sm border-b border-surface-container-high pb-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Recent Orders
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container-highest">
                  <th className="py-4 px-4 font-label-caps text-on-surface-variant uppercase tracking-widest font-normal">
                    Order ID
                  </th>
                  <th className="py-4 px-4 font-label-caps text-on-surface-variant uppercase tracking-widest font-normal">
                    Parent Order
                  </th>
                  <th className="py-4 px-4 font-label-caps text-on-surface-variant uppercase tracking-widest font-normal">
                    Customer
                  </th>
                  <th className="py-4 px-4 font-label-caps text-on-surface-variant uppercase tracking-widest font-normal">
                    Sub-order Status
                  </th>
                  <th className="py-4 px-4 font-label-caps text-on-surface-variant uppercase tracking-widest font-normal text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-on-surface">
                {(orders || []).slice(0, 4).map((order) => (
                  <tr
                    key={order.id || order._id}
                    className="border-b border-surface-container-highest hover:bg-surface-container-lowest transition-colors"
                  >
                    <td className="py-5 px-4 font-mono text-sm text-on-surface-variant">
                      {order.id || order._id}
                    </td>
                    <td className="py-5 px-4 font-mono text-xs text-on-surface-variant">
                      {order.parentOrderId || '—'}
                    </td>
                    <td className="py-5 px-4">
                      {order.customerName || 'Customer'}
                    </td>
                    <td className="py-5 px-4">
                      <span className="px-3 py-1 rounded-full bg-secondary-fixed/20 text-on-secondary-fixed-variant text-[10px] uppercase">
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          className="border border-outline rounded-DEFAULT px-2 py-1 bg-transparent text-sm"
                          value={
                            orderStatus[order.id || order._id] ||
                            order.status ||
                            'pending'
                          }
                          onChange={(event) =>
                            handleOrderStatusChange(
                              order.id || order._id,
                              event.target.value,
                            )
                          }
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            handleOrderUpdate(order.id || order._id)
                          }
                          disabled={orderSavingId === (order.id || order._id)}
                          className="text-[12px] font-label-caps uppercase border border-primary px-4 py-2 hover:bg-primary hover:text-on-primary disabled:opacity-60"
                        >
                          {orderSavingId === (order.id || order._id)
                            ? 'Saving...'
                            : 'Update'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VendorDashboardPage;
