import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import {
  AlertCircle,
  CalendarDays,
  ClipboardList,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  Package,
  Phone,
  Search,
  ShieldCheck,
  Utensils,
} from 'lucide-react';
import { auth } from './lib/firebase';
import { getAdminProfile, isActiveAdmin, signOutAdmin } from './lib/adminAuth';
import { listenToOrders, ORDER_STATUSES, updateOrderStatus } from './lib/orders';

const EMPTY_FORM = {
  email: '',
  password: '',
};
const PAGE_SIZE = 8;

function validateEmail(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Email is required.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'Enter a valid email address.';
  }

  return '';
}

function validatePassword(value) {
  if (!value) {
    return 'Password is required.';
  }

  if (value.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return '';
}

function getFirebaseAuthMessage(error) {
  switch (error?.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is incorrect.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    default:
      return error?.message || 'Unable to sign in. Please try again.';
  }
}

function LoginScreen({ onLogin }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const errors = useMemo(
    () => ({
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    }),
    [form]
  );

  const hasErrors = Boolean(errors.email || errors.password);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSubmitError('');
  }

  function markTouched(key) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched({ email: true, password: true });
    setSubmitError('');

    if (hasErrors) {
      return;
    }

    setSubmitting(true);
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );
      const adminProfile = await getAdminProfile(credential.user);

      if (!isActiveAdmin(credential.user, adminProfile)) {
        await signOutAdmin();
        setSubmitError('This account does not have active admin access.');
        return;
      }

      onLogin(credential.user, adminProfile);
    } catch (error) {
      setSubmitError(getFirebaseAuthMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-label="Admin sign in">
        <div className="brand-row">
          <div className="brand-mark">
            <ShieldCheck size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="eyebrow">Kabab Hut Catering</p>
            <h1>Admin Portal</h1>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <div className={`input-shell ${touched.email && errors.email ? 'invalid' : ''}`}>
              <Mail size={18} aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="kababhutatlanta@gmail.com"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                onBlur={() => markTouched('email')}
                disabled={submitting}
                aria-invalid={Boolean(touched.email && errors.email)}
                aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
              />
            </div>
            {touched.email && errors.email ? (
              <p className="field-error" id="email-error">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <div className={`input-shell ${touched.password && errors.password ? 'invalid' : ''}`}>
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                onBlur={() => markTouched('password')}
                disabled={submitting}
                aria-invalid={Boolean(touched.password && errors.password)}
                aria-describedby={
                  touched.password && errors.password ? 'password-error' : undefined
                }
              />
              <button
                className="icon-button"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={submitting}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched.password && errors.password ? (
              <p className="field-error" id="password-error">
                {errors.password}
              </p>
            ) : null}
          </div>

          {submitError ? (
            <div className="form-alert" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{submitError}</span>
            </div>
          ) : null}

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? <LoaderCircle className="spin" size={18} aria-hidden="true" /> : null}
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}

function toDate(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value) {
  const date = toDate(value);
  if (!date) {
    return 'N/A';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatDateTime(value) {
  const date = toDate(value);
  if (!date) {
    return 'N/A';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatMoney(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    return 'Contact for quote';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number);
}

function getCustomerName(order) {
  return order?.userDetails?.fullName || 'Unnamed customer';
}

function getCustomerPhone(order) {
  return order?.userDetails?.phone || 'N/A';
}

function buildAddress(userDetails = {}) {
  return [
    userDetails.addressLine1,
    userDetails.addressLine2,
    userDetails.city,
    userDetails.state,
    userDetails.zipCode,
  ]
    .filter(Boolean)
    .join(', ') || 'N/A';
}

function normalizeSearch(value) {
  return value.toLowerCase().trim();
}

function OrderStatusSelect({ order, onStatusChange, disabled }) {
  return (
    <select
      className="status-select"
      value={order.status || 'pending'}
      onChange={(event) => onStatusChange(order.id, event.target.value)}
      disabled={disabled}
      aria-label={`Update status for order ${order.id}`}
    >
      {ORDER_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function OrderDetail({ order, updatingOrderId, onStatusChange }) {
  if (!order) {
    return (
      <aside className="detail-panel empty-detail">
        <ClipboardList size={34} aria-hidden="true" />
        <h2>Select an order</h2>
        <p>Choose an order from the list to review customer details, items, and notes.</p>
      </aside>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <aside className="detail-panel">
      <div className="detail-header">
        <div>
          <p className="eyebrow">Order Detail</p>
          <h2>{getCustomerName(order)}</h2>
          <p className="muted">#{order.id}</p>
        </div>
        <OrderStatusSelect
          order={order}
          onStatusChange={onStatusChange}
          disabled={updatingOrderId === order.id}
        />
      </div>

      <div className="detail-grid">
        <div>
          <span>Email</span>
          <strong>{order.userEmail || 'N/A'}</strong>
        </div>
        <div>
          <span>Phone</span>
          <strong>{getCustomerPhone(order)}</strong>
        </div>
        <div>
          <span>Event Date</span>
          <strong>{order.eventDate || 'N/A'}</strong>
        </div>
        <div>
          <span>Guest Count</span>
          <strong>{order.guestCount || 'N/A'}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>{formatMoney(order.total)}</strong>
        </div>
        <div>
          <span>Created</span>
          <strong>{formatDateTime(order.createdAt)}</strong>
        </div>
      </div>

      <section className="detail-section">
        <h3>Address</h3>
        <p>{buildAddress(order.userDetails)}</p>
      </section>

      <section className="detail-section">
        <h3>Notes</h3>
        <p>{order.notes || 'No notes provided.'}</p>
      </section>

      <section className="detail-section">
        <h3>Items</h3>
        <div className="item-list">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div className="order-item" key={`${item.id || item.name}-${index}`}>
                <div>
                  <strong>{item.name || 'Unnamed item'}</strong>
                  <span>{item.type || 'menu'}</span>
                </div>
                <div className="item-meta">
                  <span>Qty {item.quantity || 1}</span>
                  <span>{item.priceLabel || formatMoney(item.price)}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No items found.</p>
          )}
        </div>
      </section>

      <section className="detail-section">
        <h3>Email Delivery</h3>
        <p>
          Admin: {order.emailDelivery?.status || 'N/A'} | Customer:{' '}
          {order.customerEmailDelivery?.status || 'N/A'}
        </p>
      </section>
    </aside>
  );
}

function Dashboard({ user, adminProfile, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToOrders({
      onData: (nextOrders) => {
        setOrders(nextOrders);
        setLoadingOrders(false);
        setOrdersError('');
        setSelectedOrderId((currentId) => currentId || nextOrders[0]?.id || '');
      },
      onError: (error) => {
        setOrdersError(error?.message || 'Unable to load orders.');
        setLoadingOrders(false);
      },
    });

    return unsubscribe;
  }, []);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  const filteredOrders = useMemo(() => {
    const search = normalizeSearch(searchText);

    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || (order.status || 'pending') === statusFilter;
      if (!matchesStatus) {
        return false;
      }

      if (!search) {
        return true;
      }

      const haystack = [
        order.id,
        getCustomerName(order),
        getCustomerPhone(order),
        order.userEmail,
        order.eventDate,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(search);
    });
  }, [orders, searchText, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginatedOrders = filteredOrders.slice(pageStartIndex, pageStartIndex + PAGE_SIZE);
  const visibleStart = filteredOrders.length === 0 ? 0 : pageStartIndex + 1;
  const visibleEnd = Math.min(pageStartIndex + PAGE_SIZE, filteredOrders.length);

  const metrics = useMemo(() => {
    const pending = orders.filter((order) => (order.status || 'pending') === 'pending').length;
    const upcoming = orders.filter((order) => {
      if (!order.eventDate) {
        return false;
      }

      const eventDate = new Date(`${order.eventDate}T00:00:00`);
      if (Number.isNaN(eventDate.getTime())) {
        return false;
      }

      return eventDate >= new Date();
    }).length;

    return { pending, upcoming };
  }, [orders]);

  async function handleStatusChange(orderId, status) {
    setUpdatingOrderId(orderId);
    setStatusMessage('');

    try {
      await updateOrderStatus(orderId, status);
      setStatusMessage('Order status updated.');
    } catch (error) {
      setStatusMessage(error?.message || 'Could not update order status.');
    } finally {
      setUpdatingOrderId('');
    }
  }

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar" aria-label="Admin navigation">
        <div className="sidebar-brand">
          <div className="brand-mark compact">
            <ShieldCheck size={20} aria-hidden="true" />
          </div>
          <div className="sidebar-label">
            <strong>Kabab Hut</strong>
            <span>Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active" type="button" title="Orders">
            <ClipboardList size={19} aria-hidden="true" />
            <span>Orders</span>
          </button>
          <button className="nav-item" type="button" disabled title="Menu manager coming later">
            <Utensils size={19} aria-hidden="true" />
            <span>Menu</span>
          </button>
          <button className="nav-item" type="button" disabled title="Package manager coming later">
            <Package size={19} aria-hidden="true" />
            <span>Packages</span>
          </button>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="app-navbar">
          <div className="navbar-left">
            <button
              className="nav-toggle"
              type="button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu size={21} aria-hidden="true" />
            </button>
            <div>
              <p className="eyebrow">Current Tab</p>
              <h1>Orders</h1>
            </div>
          </div>

          <div className="navbar-right">
            <p className="signed-in">Signed in as {adminProfile?.name || user?.email}</p>
            <button className="secondary-button signout-button" type="button" onClick={onLogout}>
              <LogOut size={18} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </header>

        <main className="dashboard-shell">
          <section className="metrics-grid" aria-label="Order metrics">
            <MetricCard
              icon={<ClipboardList size={20} aria-hidden="true" />}
              label="Total orders"
              value={orders.length}
            />
            <MetricCard
              icon={<AlertCircle size={20} aria-hidden="true" />}
              label="Pending"
              value={metrics.pending}
            />
            <MetricCard
              icon={<CalendarDays size={20} aria-hidden="true" />}
              label="Upcoming"
              value={metrics.upcoming}
            />
          </section>

          <section className="workspace">
            <div className="orders-panel">
              <div className="toolbar">
                <div className="search-shell">
                  <Search size={18} aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Search orders"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    aria-label="Search orders"
                  />
                </div>

                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="all">All statuses</option>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {statusMessage ? <p className="status-message">{statusMessage}</p> : null}
              {ordersError ? <div className="form-alert">{ordersError}</div> : null}

              <div className="orders-table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Event</th>
                      <th>Guests</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingOrders ? (
                      <tr>
                        <td colSpan="6">
                          <div className="table-state">
                            <LoaderCircle className="spin" size={20} aria-hidden="true" />
                            Loading orders...
                          </div>
                        </td>
                      </tr>
                    ) : paginatedOrders.length > 0 ? (
                      paginatedOrders.map((order) => (
                        <tr
                          key={order.id}
                          className={order.id === selectedOrderId ? 'selected-row' : ''}
                          onClick={() => setSelectedOrderId(order.id)}
                        >
                          <td>
                            <button
                              className="customer-button"
                              type="button"
                              onClick={() => setSelectedOrderId(order.id)}
                            >
                              <strong>{getCustomerName(order)}</strong>
                              <span>{order.userEmail || 'No email'}</span>
                              <span className="phone-line">
                                <Phone size={13} aria-hidden="true" />
                                {getCustomerPhone(order)}
                              </span>
                            </button>
                          </td>
                          <td>{order.eventDate || 'N/A'}</td>
                          <td>{order.guestCount || 'N/A'}</td>
                          <td>{formatMoney(order.total)}</td>
                          <td>
                            <OrderStatusSelect
                              order={order}
                              onStatusChange={handleStatusChange}
                              disabled={updatingOrderId === order.id}
                            />
                          </td>
                          <td>{formatDate(order.createdAt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">
                          <div className="table-state">No orders match this view.</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination-bar">
                <span>
                  Showing {visibleStart}-{visibleEnd} of {filteredOrders.length}
                </span>
                <div className="pagination-actions">
                  <button
                    className="pager-button"
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={safeCurrentPage === 1}
                  >
                    Previous
                  </button>
                  <strong>
                    Page {safeCurrentPage} of {totalPages}
                  </strong>
                  <button
                    className="pager-button"
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={safeCurrentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <OrderDetail
              order={selectedOrder}
              updatingOrderId={updatingOrderId}
              onStatusChange={handleStatusChange}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [authState, setAuthState] = useState({
    loading: true,
    user: null,
    adminProfile: null,
  });

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (active) {
          setAuthState({ loading: false, user: null, adminProfile: null });
        }
        return;
      }

      try {
        const adminProfile = await getAdminProfile(user);
        if (!isActiveAdmin(user, adminProfile)) {
          await signOutAdmin();
          if (active) {
            setAuthState({ loading: false, user: null, adminProfile: null });
          }
          return;
        }

        if (active) {
          setAuthState({ loading: false, user, adminProfile });
        }
      } catch (error) {
        await signOutAdmin();
        if (active) {
          setAuthState({ loading: false, user: null, adminProfile: null });
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await signOutAdmin();
    setAuthState({ loading: false, user: null, adminProfile: null });
  }

  if (authState.loading) {
    return (
      <main className="loading-shell">
        <LoaderCircle className="spin" size={28} aria-hidden="true" />
        <p>Checking admin access...</p>
      </main>
    );
  }

  if (!authState.user) {
    return (
      <LoginScreen
        onLogin={(user, adminProfile) =>
          setAuthState({ loading: false, user, adminProfile })
        }
      />
    );
  }

  return (
    <Dashboard
      user={authState.user}
      adminProfile={authState.adminProfile}
      onLogout={handleLogout}
    />
  );
}
