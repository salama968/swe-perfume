import { useEffect, useState } from 'react';
import {
  approveApplication,
  deleteProduct,
  deleteUser,
  fetchApplications,
  fetchUsers,
  rejectApplication,
} from '../api/admin';
import { fetchProducts } from '../api/products';
import SideNavBar from '../components/SideNavBar';

const AdminApprovalsPage = () => {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [adminMessage, setAdminMessage] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const formatDate = (value) => {
    if (!value) return 'Recent';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Recent';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const loadCounts = async () => {
    try {
      const [pendingData, approvedData, rejectedData] = await Promise.all([
        fetchApplications('pending'),
        fetchApplications('approved'),
        fetchApplications('rejected'),
      ]);
      const pendingList =
        pendingData?.applications ||
        pendingData?.items ||
        pendingData?.data ||
        pendingData ||
        [];
      const approvedList =
        approvedData?.applications ||
        approvedData?.items ||
        approvedData?.data ||
        approvedData ||
        [];
      const rejectedList =
        rejectedData?.applications ||
        rejectedData?.items ||
        rejectedData?.data ||
        rejectedData ||
        [];
      setCounts({
        pending: Array.isArray(pendingList) ? pendingList.length : 0,
        approved: Array.isArray(approvedList) ? approvedList.length : 0,
        rejected: Array.isArray(rejectedList) ? rejectedList.length : 0,
      });
    } catch (error) {
      setCounts({ pending: 0, approved: 0, rejected: 0 });
    }
  };

  const loadApplications = async (nextStatus) => {
    setLoading(true);
    try {
      const data = await fetchApplications(nextStatus);
      const list =
        data?.applications || data?.items || data?.data || data || [];
      setApplications(Array.isArray(list) ? list : []);
    } catch (error) {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setAdminMessage('');
      await Promise.all([loadApplications(status), loadCounts()]);
      try {
        const data = await fetchUsers();
        const list = data?.users || data?.items || data?.data || data || [];
        setUsers(Array.isArray(list) ? list : []);
      } catch (error) {
        setUsers([]);
      }
      try {
        const productData = await fetchProducts({ page: 1, limit: 20 });
        const list =
          productData?.products ||
          productData?.items ||
          productData?.data ||
          productData ||
          [];
        setProducts(Array.isArray(list) ? list : []);
      } catch (error) {
        setProducts([]);
      }
    };

    load();
  }, [status]);

  const handleDecision = async (id, action) => {
    try {
      if (action === 'approve') {
        await approveApplication(id);
      } else {
        await rejectApplication(id);
      }
      await loadApplications(status);
    } catch (error) {
      // errors are surfaced by refreshing the list
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?',
    );
    if (!confirmDelete) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((item) => (item.id || item._id) !== id));
      setAdminMessage('User deleted.');
    } catch (error) {
      setAdminMessage('Unable to delete user.');
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?',
    );
    if (!confirmDelete) return;
    try {
      await deleteProduct(id);
      setProducts((prev) =>
        prev.filter((item) => (item.id || item._id) !== id),
      );
      setAdminMessage('Product deleted.');
    } catch (error) {
      setAdminMessage('Unable to delete product.');
    }
  };

  return (
    <div className="flex bg-surface min-h-screen">
      <SideNavBar
        active="admin"
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
      />
      <main className="ml-0 lg:ml-64 flex-1 p-margin-edge">
        <header className="mb-stack-lg flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-outline-variant pb-6 gap-4">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
              Admin Portal
            </p>
            <h2 className="font-headline-xl text-headline-xl text-on-surface">
              Vendor Approvals
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            className="lg:hidden border border-outline px-4 py-3 font-label-caps text-label-caps uppercase tracking-widest"
          >
            Menu
          </button>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col justify-between h-32">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Total Vendors
            </p>
            <div className="flex items-end justify-between">
              <p className="font-headline-lg text-headline-lg text-on-surface">
                {
                  users.filter((member) =>
                    ['vendor', 'admin'].includes(
                      String(member.role || '').toLowerCase(),
                    ),
                  ).length
                }
              </p>
              <span className="material-symbols-outlined text-outline">
                group
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute inset-0 bg-secondary-fixed-dim opacity-10"></div>
            <p className="font-label-caps text-label-caps text-on-secondary-container uppercase relative z-10">
              Pending Approvals
            </p>
            <div className="flex items-end justify-between relative z-10">
              <p className="font-headline-lg text-headline-lg text-on-secondary-container">
                {counts.pending}
              </p>
              <span className="material-symbols-outlined text-on-secondary-container">
                hourglass_empty
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col justify-between h-32">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Approved
            </p>
            <div className="flex items-end justify-between">
              <p className="font-headline-lg text-headline-lg text-on-surface-variant">
                {counts.approved}
              </p>
              <span className="material-symbols-outlined text-outline">
                verified
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col justify-between h-32">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Rejected
            </p>
            <div className="flex items-end justify-between">
              <p className="font-headline-lg text-headline-lg text-on-surface-variant">
                {counts.rejected}
              </p>
              <span className="material-symbols-outlined text-outline">
                block
              </span>
            </div>
          </div>
        </section>
        <section className="mb-stack-lg">
          <div className="flex items-center justify-between mb-stack-sm">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {status.charAt(0).toUpperCase() + status.slice(1)} Registrations
              </h3>
              <p className="text-on-surface-variant text-sm">
                Filter applications by status.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-label-caps text-label-caps text-on-surface-variant bg-surface-variant px-3 py-1 rounded-full uppercase">
                {applications.length} Requests
              </span>
              <div className="flex items-center gap-3">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="border border-outline rounded-DEFAULT bg-transparent px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase w-1/4">
                    Vendor Name
                  </th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase w-1/5">
                    Email & Date
                  </th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase w-2/5">
                    Business Bio
                  </th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase text-right w-auto">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {loading ? (
                  <tr>
                    <td
                      className="py-6 px-6 text-on-surface-variant"
                      colSpan={4}
                    >
                      Loading applications...
                    </td>
                  </tr>
                ) : applications.length ? (
                  applications.map((application) => (
                    <tr
                      key={application.id || application._id}
                      className="hover:bg-surface-container-low transition-colors group"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-DEFAULT bg-surface-variant overflow-hidden"></div>
                          <div>
                            <p className="font-body-lg font-medium leading-tight">
                              {application.brandName || 'Vendor'}
                            </p>
                            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                              Vendor
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <p>{application.email || 'vendor@example.com'}</p>
                        <p className="text-on-surface-variant text-sm">
                          {formatDate(application.createdAt)}
                        </p>
                      </td>
                      <td className="py-5 px-6">
                        <p className="text-on-surface-variant line-clamp-2 pr-4">
                          {application.bio ||
                            'Specializing in curated collections of artisan fragrances.'}
                        </p>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() =>
                              handleDecision(
                                application.id || application._id,
                                'reject',
                              )
                            }
                            className="px-4 py-2 border border-outline rounded-DEFAULT font-label-caps uppercase"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDecision(
                                application.id || application._id,
                                'approve',
                              )
                            }
                            className="px-4 py-2 bg-primary text-on-primary rounded-DEFAULT font-label-caps uppercase"
                          >
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-6 px-6 text-on-surface-variant"
                      colSpan={4}
                    >
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        {adminMessage ? (
          <p className="text-on-surface-variant mb-stack-md">{adminMessage}</p>
        ) : null}
        <section>
          <div className="flex items-center justify-between mb-stack-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface">
              User Directory
            </h3>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">
                    User
                  </th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Role
                  </th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Created
                  </th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {users.slice(0, 6).map((member) => (
                  <tr key={member.id || member._id}>
                    <td className="py-4 px-6">{member.email}</td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {member.role}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {formatDate(member.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteUser(member.id || member._id)
                        }
                        className="text-[12px] font-label-caps uppercase border border-error px-4 py-2 hover:bg-error hover:text-on-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="mt-stack-lg">
          <div className="flex items-center justify-between mb-stack-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Product Management
            </h3>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Product
                  </th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Price
                  </th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Status
                  </th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {products.slice(0, 8).map((product) => (
                  <tr key={product.id || product._id}>
                    <td className="py-4 px-6">{product.name}</td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      ${product.price}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {product.isActive === false ? 'Hidden' : 'Active'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteProduct(product.id || product._id)
                        }
                        className="text-[12px] font-label-caps uppercase border border-error px-4 py-2 hover:bg-error hover:text-on-error"
                      >
                        Delete
                      </button>
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

export default AdminApprovalsPage;
