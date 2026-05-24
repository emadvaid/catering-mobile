import React, { useEffect, useMemo, useState } from 'react';
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
  Printer,
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
const CONFIRMATION_STATUSES = new Set(['completed', 'cancelled', 'archived']);

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

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

function ConfirmationDialog({ pendingStatusChange, onCancel, onConfirm, saving }) {
  if (!pendingStatusChange) {
    return null;
  }

  const { order, status } = pendingStatusChange;

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-confirm-title"
      >
        <div className="confirm-icon">
          <AlertCircle size={24} aria-hidden="true" />
        </div>
        <div>
          <h2 id="status-confirm-title">Confirm status change</h2>
          <p>
            Mark order <strong>#{order.id}</strong> for <strong>{getCustomerName(order)}</strong>{' '}
            as <strong>{status}</strong>?
          </p>
        </div>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className="danger-button" type="button" onClick={onConfirm} disabled={saving}>
            {saving ? <LoaderCircle className="spin" size={17} aria-hidden="true" /> : null}
            Confirm
          </button>
        </div>
      </section>
    </div>
  );
}

function OrderDetail({ order, updatingOrderId, onStatusChange, onPrint }) {
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

      <button className="print-button" type="button" onClick={() => onPrint(order)}>
        <Printer size={17} aria-hidden="true" />
        Print order
      </button>

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
  const [pendingStatusChange, setPendingStatusChange] = useState(null);

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

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  useEffect(() => {
    if (loadingOrders) {
      return;
    }

    const visibleSelected = filteredOrders.some((order) => order.id === selectedOrderId);
    if (!visibleSelected) {
      setSelectedOrderId(filteredOrders[0]?.id || '');
    }
  }, [filteredOrders, loadingOrders, selectedOrderId]);

  async function commitStatusChange(orderId, status) {
    setUpdatingOrderId(orderId);
    setStatusMessage('');

    try {
      await updateOrderStatus(orderId, status);
      setStatusMessage(`Order #${orderId} marked ${status}.`);
    } catch (error) {
      setStatusMessage(error?.message || 'Could not update order status.');
    } finally {
      setUpdatingOrderId('');
    }
  }

  function handleStatusChange(orderId, status) {
    const order = orders.find((entry) => entry.id === orderId);
    if (!order) {
      setStatusMessage('Could not find that order. Refresh and try again.');
      return;
    }

    if (CONFIRMATION_STATUSES.has(status)) {
      setPendingStatusChange({ order, status });
      return;
    }

    commitStatusChange(orderId, status);
  }

  async function confirmPendingStatusChange() {
    if (!pendingStatusChange) {
      return;
    }

    const { order, status } = pendingStatusChange;
    await commitStatusChange(order.id, status);
    setPendingStatusChange(null);
  }

  function printOrder(order) {
    const items = Array.isArray(order.items) ? order.items : [];
    const itemRows = items
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>
              <strong>${escapeHtml(item.name || 'Unnamed item')}</strong>
              <span>${escapeHtml(item.type || 'menu')}</span>
            </td>
            <td>${escapeHtml(item.quantity || 1)}</td>
            <td>${escapeHtml(item.priceLabel || formatMoney(item.price))}</td>
          </tr>
        `
      )
      .join('');

    const printHtml = `
      <!doctype html>
      <html>
        <head>
          <title>Order ${order.id}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              color: #111827;
              background: #fff;
              padding: 28px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              gap: 24px;
              border-bottom: 2px solid #7f1d1d;
              padding-bottom: 18px;
              margin-bottom: 22px;
            }
            h1 { margin: 0 0 6px; font-size: 26px; }
            h2 { margin: 24px 0 10px; font-size: 16px; }
            p { margin: 4px 0; }
            .muted { color: #6b7280; }
            .status {
              display: inline-block;
              border: 1px solid #eadfd2;
              border-radius: 6px;
              padding: 6px 10px;
              color: #7f1d1d;
              font-weight: 700;
              text-transform: capitalize;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 10px 18px;
              margin-bottom: 18px;
            }
            .box {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 12px;
            }
            .label {
              display: block;
              color: #6b7280;
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 9px;
              text-align: left;
              vertical-align: top;
            }
            th {
              background: #f9fafb;
              font-size: 12px;
              text-transform: uppercase;
            }
            td span {
              display: block;
              color: #6b7280;
              font-size: 12px;
              margin-top: 2px;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <header class="header">
            <div>
              <h1>Kabab Hut Catering Order</h1>
              <p class="muted">Order ID: ${escapeHtml(order.id)}</p>
              <p class="muted">Created: ${escapeHtml(formatDateTime(order.createdAt))}</p>
            </div>
            <div>
              <span class="status">${escapeHtml(order.status || 'pending')}</span>
            </div>
          </header>

          <section class="grid">
            <div class="box">
              <span class="label">Customer</span>
              <strong>${escapeHtml(getCustomerName(order))}</strong>
              <p>${escapeHtml(order.userEmail || 'N/A')}</p>
              <p>${escapeHtml(getCustomerPhone(order))}</p>
            </div>
            <div class="box">
              <span class="label">Event</span>
              <strong>${escapeHtml(order.eventDate || 'N/A')}</strong>
              <p>Guests: ${escapeHtml(order.guestCount || 'N/A')}</p>
              <p>Total: ${escapeHtml(formatMoney(order.total))}</p>
            </div>
            <div class="box">
              <span class="label">Address</span>
              <p>${escapeHtml(buildAddress(order.userDetails))}</p>
            </div>
            <div class="box">
              <span class="label">Notes</span>
              <p>${escapeHtml(order.notes || 'No notes provided.')}</p>
            </div>
          </section>

          <section>
            <h2>Items (${items.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Pricing</th>
                </tr>
              </thead>
              <tbody>
                ${
                  itemRows ||
                  '<tr><td colspan="4">No items found.</td></tr>'
                }
              </tbody>
            </table>
          </section>
        </body>
      </html>
    `;

    const blob = new Blob([printHtml], { type: 'text/html' });
    const printUrl = URL.createObjectURL(blob);
    const printWindow = window.open(printUrl, '_blank', 'width=900,height=700');

    if (!printWindow) {
      URL.revokeObjectURL(printUrl);
      setStatusMessage('Pop-up blocked. Allow pop-ups to print this order.');
      return;
    }

    const printAndCleanup = () => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => URL.revokeObjectURL(printUrl), 30000);
    };

    printWindow.addEventListener('load', () => setTimeout(printAndCleanup, 250), { once: true });
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
                          <div className="table-state">
                            {orders.length === 0
                              ? 'No orders found yet.'
                              : 'No orders match this search or filter.'}
                          </div>
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
              onPrint={printOrder}
            />
          </section>
        </main>
      </div>

      <ConfirmationDialog
        pendingStatusChange={pendingStatusChange}
        onCancel={() => setPendingStatusChange(null)}
        onConfirm={confirmPendingStatusChange}
        saving={Boolean(updatingOrderId)}
      />
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="loading-shell">
          <section className="auth-panel">
            <div className="brand-row">
              <div className="brand-mark">
                <AlertCircle size={24} aria-hidden="true" />
              </div>
              <div>
                <p className="eyebrow">Admin Portal</p>
                <h1>Something went wrong</h1>
              </div>
            </div>
            <p className="muted">Refresh the page and sign in again if needed.</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
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
    <ErrorBoundary>
      <Dashboard
        user={authState.user}
        adminProfile={authState.adminProfile}
        onLogout={handleLogout}
      />
    </ErrorBoundary>
  );
}
