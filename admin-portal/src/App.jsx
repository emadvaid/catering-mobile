import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { auth } from './lib/firebase';
import { getAdminProfile, isActiveAdmin, signOutAdmin } from './lib/adminAuth';

const EMPTY_FORM = {
  email: '',
  password: '',
};

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

function DashboardPlaceholder({ user, adminProfile, onLogout }) {
  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Admin Portal</p>
          <h1>Welcome, {adminProfile?.name || user?.email}</h1>
        </div>
        <button className="secondary-button" type="button" onClick={onLogout}>
          <LogOut size={18} aria-hidden="true" />
          Sign out
        </button>
      </header>

      <section className="status-card">
        <CheckCircle2 size={28} aria-hidden="true" />
        <div>
          <h2>Login is ready</h2>
          <p>
            This account is verified against <code>admins/{user?.uid}</code>. Next we can add
            orders, menu CRUD, and package CRUD without changing the mobile app screens.
          </p>
        </div>
      </section>
    </main>
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
    <DashboardPlaceholder
      user={authState.user}
      adminProfile={authState.adminProfile}
      onLogout={handleLogout}
    />
  );
}
