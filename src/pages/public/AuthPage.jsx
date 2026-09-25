import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { User, Home, Wrench, ShieldCheck, Mail, Lock, Phone, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import './AuthPage.css';

// 4 Predefined Frontend Login Credentials
export const LOGIN_CREDENTIALS = [
  {
    id: 'guest',
    role: 'guest',
    label: 'Guest / Traveler',
    name: 'Priya Sharma',
    email: 'guest',
    altEmail: 'priya.sharma@example.com',
    password: '123456',
    altPassword: 'guest123',
    dest: '/guest/dashboard',
    desc: 'Browse villas, booking management, concierge requests',
    icon: User,
    badgeClass: 'badge-guest'
  },
  {
    id: 'owner',
    role: 'owner',
    label: 'Property Owner',
    name: 'Owner',
    email: 'owner',
    altEmail: 'vikram.singhania@example.com',
    password: '123456',
    altPassword: 'owner123',
    dest: '/owner/dashboard',
    desc: 'Manage listings, booking approvals, guest communication',
    icon: Home,
    badgeClass: 'badge-owner'
  },
  {
    id: 'provider',
    role: 'provider',
    label: 'Service Provider',
    name: 'Ramesh Kumar',
    email: 'provider',
    altEmail: 'ramesh.kumar@coastalmobility.in',
    password: '123456',
    altPassword: 'provider123',
    dest: '/provider/dashboard',
    desc: 'Accept service tickets, schedules, partner earnings',
    icon: Wrench,
    badgeClass: 'badge-provider'
  },
  {
    id: 'admin',
    role: 'admin',
    label: 'Platform Admin',
    name: 'Ananya Deshmukh',
    email: 'admin',
    altEmail: 'admin@stayease.com',
    password: '123456',
    altPassword: 'admin123',
    dest: '/admin/dashboard',
    desc: 'System oversight, quality audits, user & disputes control',
    icon: ShieldCheck,
    badgeClass: 'badge-admin'
  }
];

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, showToast } = useApp();

  const [mode, setMode] = useState('login'); // login, register, forgot
  const [selectedRole, setSelectedRole] = useState('guest');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('form'); // form, verify
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedRole, setCopiedRole] = useState('');

  const roles = [
    { id: 'guest', label: 'Guest / Traveler', desc: 'Book stays & order concierge services', icon: User },
    { id: 'owner', label: 'Property Owner', desc: 'List holiday homes & coordinate providers', icon: Home },
    { id: 'provider', label: 'Service Provider', desc: 'Accept jobs (transfers, chef, cleaning)', icon: Wrench },
    { id: 'admin', label: 'StayEase Admin', desc: 'Platform oversight & quality audits', icon: ShieldCheck }
  ];

  const handleAutofill = (cred) => {
    setEmailOrPhone(cred.email);
    setPassword(cred.password);
    setErrorMessage('');
    setCopiedRole(cred.id);
    setTimeout(() => setCopiedRole(''), 2500);
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage('');

    if (mode === 'forgot') {
      if (showToast) {
        showToast(`If an account exists for ${emailOrPhone}, reset instructions have been sent.`, 'info');
      }
      setMode('login');
      return;
    }

    if (mode === 'register' && step === 'form') {
      setStep('verify');
      return;
    }

    if (mode === 'register' && step === 'verify') {
      register({ name: fullName || 'User', email: emailOrPhone, phone, role: selectedRole });
      const dest =
        selectedRole === 'owner'
          ? '/owner/dashboard'
          : selectedRole === 'provider'
          ? '/provider/dashboard'
          : selectedRole === 'admin'
          ? '/admin/dashboard'
          : '/';
      navigate(dest);
      return;
    }

    // Standard Login Authentication against the 4 credentials
    const inputVal = (emailOrPhone || '').toLowerCase().trim();
    const inputPass = (password || '').trim();

    if (!inputVal) {
      setErrorMessage('Please enter your email or username.');
      return;
    }

    if (!inputPass) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const matchedCred = LOGIN_CREDENTIALS.find(
      (c) =>
        c.email.toLowerCase() === inputVal ||
        (c.altEmail && c.altEmail.toLowerCase() === inputVal) ||
        inputVal.includes(c.role) ||
        (c.role === 'owner' && inputVal.includes('vikram')) ||
        (c.role === 'provider' && inputVal.includes('ramesh')) ||
        (c.role === 'admin' && inputVal.includes('ananya')) ||
        (c.role === 'guest' && inputVal.includes('priya'))
    );

    if (matchedCred) {
      const allowedPasswords = [
        matchedCred.password,
        matchedCred.altPassword,
        '123456',
        'password123',
        `${matchedCred.role}123`,
        matchedCred.role
      ];

      if (!allowedPasswords.includes(inputPass)) {
        setErrorMessage(`Invalid password for ${matchedCred.label}. Expected "${matchedCred.password}".`);
        return;
      }

      login(matchedCred.role);
      const targetDestination = matchedCred.role === 'guest' ? '/' : matchedCred.dest;
      navigate(targetDestination);
      return;
    }

    // Allow general user if password is at least 6 characters
    if (inputPass.length >= 6) {
      login('guest');
      navigate('/');
      return;
    }

    setErrorMessage('Invalid credentials. Please enter a valid username/email and password.');
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card animate-fade-in">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">
              <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
                <rect width="32" height="32" rx="8" fill="#ED7014" />
                <path d="M16 7 C10 14 9 21 16 26 C23 21 22 14 16 7 Z" fill="#FFFFFF" />
                <path d="M16 11 L16 23" stroke="#ED7014" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="auth-brand-name">StayEase</span>
            </div>
            <h2 className="auth-title">
              {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create an Account' : 'Reset Password'}
            </h2>
            <p className="auth-subtitle">
              {mode === 'login'
                ? 'Sign in to manage your stays and concierge orders'
                : mode === 'register'
                  ? 'Join StayEase as a Guest, Villa Host, or Service Specialist'
                  : 'Enter your email or mobile to receive recovery instructions'}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="auth-error-banner animate-fade-in">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <div
            className="auth-form"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          >
            {mode === 'register' && step === 'form' && (
              <>
                <div className="role-selector-group">
                  <label className="field-label">I am joining as a:</label>
                  <div className="role-options-grid">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          className={`role-option-card ${selectedRole === r.id ? 'active' : ''}`}
                          onClick={() => setSelectedRole(r.id)}
                        >
                          <Icon size={18} />
                          <div>
                            <div className="role-title">{r.label}</div>
                            <div className="role-desc">{r.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="auth-field">
                  <label className="field-label">Full Name</label>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Priya Sharma"
                    value={fullName}
                    autoComplete="off"
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label className="field-label">Phone Number (SMS Verification)</label>
                  <input
                    type="tel"
                    className="auth-input"
                    placeholder="+91 98765 43210"
                    value={phone}
                    autoComplete="off"
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {mode === 'register' && step === 'verify' && (
              <div className="verify-step-box">
                <p className="verify-text">
                  We sent a 6-digit verification code to <strong>{phone || 'your phone'}</strong>.
                </p>
                <input
                  type="text"
                  className="auth-input verify-input"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  autoComplete="off"
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
            )}

            {/* Email field */}
            {step === 'form' && (
              <div className="auth-field">
                <label className="field-label">
                  {mode === 'login' ? 'Email Address or Mobile' : 'Email Address'}
                </label>
                <input
                  type={mode === 'login' ? 'text' : 'email'}
                  className="auth-input"
                  placeholder={mode === 'login' ? 'name@example.com or mobile' : 'name@example.com'}
                  value={emailOrPhone}
                  autoComplete="off"
                  data-lpignore="true"
                  onChange={(e) => {
                    setEmailOrPhone(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                />
              </div>
            )}

            {/* Password field */}
            {step === 'form' && mode !== 'forgot' && (
              <div className="auth-field">
                <div className="password-label-row">
                  <label className="field-label">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      className="forgot-link"
                      onClick={() => setMode('forgot')}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-form-type="other"
                  name="secret_key"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                />
              </div>
            )}

            {/* Remember Me row for Login */}
            {mode === 'login' && (
              <div className="auth-extra-row">
                <label className="auth-remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              type="button"
              onClick={handleSubmit}
            >
              {mode === 'forgot'
                ? 'Send Reset Link'
                : mode === 'register'
                  ? step === 'verify'
                    ? 'Verify & Complete Registration'
                    : 'Send Verification Code'
                  : 'Sign In'}
            </Button>
          </div>

          {/* 4 Login Credentials Helper (shown in login mode) */}
          {/* {mode === 'login' && (
            <div className="demo-credentials-box">
              <div className="demo-credentials-header">
                <div className="demo-credentials-title">
                  <Key size={14} className="demo-key-icon" />
                  <span>4 Demo Login Credentials</span>
                </div>
                <span className="demo-hint-sub">Click 'Fill' to test any role</span>
              </div>

              <div className="demo-credentials-grid">
                {LOGIN_CREDENTIALS.map((cred) => {
                  const Icon = cred.icon;
                  const isCopied = copiedRole === cred.id;
                  return (
                    <div key={cred.id} className="demo-credential-item">
                      <div className="cred-top-row">
                        <span className={`cred-role-pill ${cred.badgeClass}`}>
                          <Icon size={11} />
                          {cred.label}
                        </span>
                        <button
                          type="button"
                          className={`cred-autofill-btn ${isCopied ? 'copied' : ''}`}
                          onClick={() => handleAutofill(cred)}
                        >
                          {isCopied ? (
                            <>
                              <CheckCircle2 size={11} /> Filled
                            </>
                          ) : (
                            'Fill'
                          )}
                        </button>
                      </div>
                      <div className="cred-details">
                        <div className="cred-line">
                          <span className="cred-label">User:</span>
                          <code>{cred.email}</code>
                        </div>
                        <div className="cred-line">
                          <span className="cred-label">Pass:</span>
                          <code>{cred.password}</code>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )} */}

          {/* Footer toggle */}
          <div className="auth-switch-row">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="switch-btn"
                  onClick={() => {
                    setMode('register');
                    setStep('form');
                    setErrorMessage('');
                  }}
                >
                  Register here
                </button>
              </p>
            ) : mode === 'register' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="switch-btn"
                  onClick={() => {
                    setMode('login');
                    setStep('form');
                    setErrorMessage('');
                  }}
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Remember your password?{' '}
                <button
                  type="button"
                  className="switch-btn"
                  onClick={() => {
                    setMode('login');
                    setStep('form');
                    setErrorMessage('');
                  }}
                >
                  Back to Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
