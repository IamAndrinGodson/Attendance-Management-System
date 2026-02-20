import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateCode, sendVerificationCode } from '../services/emailService';
import './Login.css';

const demoAccounts = [
    { email: 'admin@greenwood.edu', password: 'admin123', name: 'John Doe', role: 'Administrator', avatarClass: 'admin' },
    { email: 'prof.sharma@greenwood.edu', password: 'prof123', name: 'Prof. Sharma', role: 'Faculty', avatarClass: 'faculty' },
    { email: 'student@university.edu', password: 'student123', name: 'Aarav Sharma', role: 'Student', avatarClass: 'student' },
];

// ─── Sign Up OTP panel ────────────────────────────────────────────────────────
function SignupPanel({ onSuccess }) {
    const { register } = useAuth();
    const [step, setStep] = useState('form'); // 'form' | 'otp' | 'done'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Student');
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const [sentCode, setSentCode] = useState(null);
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    /* ── Step 1: send OTP ── */
    const handleSendCode = async (e) => {
        e && e.preventDefault();
        setError('');
        if (!name.trim()) { setError('Please enter your full name'); return; }
        if (!email.trim()) { setError('Please enter your email'); return; }

        setSending(true);
        const code = generateCode();
        setSentCode(code);
        const result = await sendVerificationCode(email, name, code);
        setSending(false);

        if (result.success) {
            setStep('otp');
            setCooldown(60);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } else {
            // For demo: allow testing without real EmailJS by showing code in console
            console.log('[DEMO] Verification code:', code);
            setError(result.error + ' (Demo mode: check browser console for code)');
            // Still move to OTP step so demo can be tested
            setStep('otp');
            setCooldown(60);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    };

    /* ── Step 2: verify OTP ── */
    const handleDigitChange = (i, val) => {
        if (!/^\d*$/.test(val)) return;
        const next = [...digits];
        if (val.length > 1) {
            // handle paste
            const pasted = val.replace(/\D/g, '').slice(0, 6);
            pasted.split('').forEach((d, j) => { if (i + j < 6) next[i + j] = d; });
            setDigits(next);
            inputRefs.current[Math.min(i + pasted.length, 5)]?.focus();
            return;
        }
        next[i] = val;
        setDigits(next);
        if (val && i < 5) inputRefs.current[i + 1]?.focus();
    };

    const handleDigitKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !digits[i] && i > 0) inputRefs.current[i - 1]?.focus();
    };

    const handleVerify = () => {
        const entered = digits.join('');
        if (entered.length !== 6) { setError('Enter all 6 digits'); return; }
        if (entered !== sentCode) {
            setError('Wrong code. Try again.');
            setDigits(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
            return;
        }
        // Create the account and auto-login
        register({ name, email, role });
        setStep('done');
        setTimeout(() => onSuccess(), 1200);
    };

    // Auto-verify
    useEffect(() => {
        if (step === 'otp' && digits.every(d => d !== '') && sentCode) handleVerify();
    }, [digits]);

    if (step === 'done') return (
        <div className="signup-success">
            <div className="signup-success-icon">🎉</div>
            <h3 className="signup-success-title">Account Created!</h3>
            <p className="signup-success-text">Welcome, {name}. Redirecting…</p>
        </div>
    );

    if (step === 'otp') return (
        <div className="signup-otp">
            <div className="signup-otp-icon">📬</div>
            <h3 className="signup-otp-title">Check your inbox</h3>
            <p className="signup-otp-sub">A 6-digit code was sent to <strong>{email}</strong></p>
            <p className="signup-otp-demo">
                💡 No EmailJS setup? Check the <strong>browser console</strong> for the demo code.
            </p>

            <div className="signup-digit-row">
                {digits.map((d, i) => (
                    <input
                        key={i}
                        ref={el => inputRefs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        className={`signup-digit ${d ? 'filled' : ''}`}
                        value={d}
                        onChange={e => handleDigitChange(i, e.target.value)}
                        onKeyDown={e => handleDigitKeyDown(i, e)}
                        onPaste={e => { e.preventDefault(); handleDigitChange(i, e.clipboardData.getData('text')); }}
                    />
                ))}
            </div>

            {error && <div className="signup-error">⚠️ {error}</div>}

            <button className="login-submit" onClick={handleVerify} disabled={digits.some(d => !d)}>
                Verify & Create Account
            </button>

            <div className="signup-resend">
                {cooldown > 0
                    ? <span className="signup-cooldown">Resend in {cooldown}s</span>
                    : <button className="signup-resend-btn" onClick={handleSendCode}>↩ Resend Code</button>
                }
            </div>
        </div>
    );

    return (
        <form className="login-form" onSubmit={handleSendCode}>
            {error && <div className="login-error"><span className="login-error-icon">⚠️</span><span>{error}</span></div>}

            <div className="login-field">
                <label className="login-field-label">Full Name</label>
                <div className="login-field-wrapper">
                    <input
                        type="text"
                        className="login-input"
                        placeholder="e.g. Aarav Sharma"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={sending}
                        autoFocus
                    />
                    <span className="login-field-icon">👤</span>
                </div>
            </div>

            <div className="login-field">
                <label className="login-field-label">Email Address</label>
                <div className="login-field-wrapper">
                    <input
                        type="email"
                        className="login-input"
                        placeholder="you@university.edu"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={sending}
                    />
                    <span className="login-field-icon">📧</span>
                </div>
            </div>

            <div className="login-field">
                <label className="login-field-label">Role</label>
                <select className="form-select" value={role} onChange={e => setRole(e.target.value)} disabled={sending}>
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Administrator">Administrator</option>
                </select>
            </div>

            <button type="submit" className="login-submit" disabled={sending}>
                {sending ? (
                    <span className="login-spinner">
                        <span className="login-spinner-dot" />
                        <span className="login-spinner-dot" />
                        <span className="login-spinner-dot" />
                    </span>
                ) : '📩 Send Verification Code'}
            </button>
        </form>
    );
}

// ─── Main Login page ──────────────────────────────────────────────────────────
export default function Login() {
    const [tab, setTab] = useState('login'); // 'login' | 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim() || !password.trim()) { setError('Please enter both email and password'); return; }
        const result = await login(email, password);
        if (result.success) navigate('/', { replace: true });
        else setError(result.error);
    };

    const handleDemoLogin = (account) => {
        setTab('login');
        setEmail(account.email);
        setPassword(account.password);
        setError('');
    };

    return (
        <div className="login-page">
            <div className="login-bg-orb login-bg-orb--1" />
            <div className="login-bg-orb login-bg-orb--2" />
            <div className="login-bg-orb login-bg-orb--3" />

            <div className="login-card">
                <div className="login-logo">A</div>

                <div className="login-header">
                    <h1 className="login-title">{tab === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
                    <p className="login-subtitle">AMS — College Management</p>
                </div>

                {/* Tab switcher */}
                <div className="login-tabs">
                    <button className={`login-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>
                        Sign In
                    </button>
                    <button className={`login-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => { setTab('signup'); setError(''); }}>
                        Sign Up
                    </button>
                </div>

                {tab === 'login' ? (
                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="login-error">
                                <span className="login-error-icon">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="login-field">
                            <label className="login-field-label">Email Address</label>
                            <div className="login-field-wrapper">
                                <input
                                    id="login-email"
                                    type="email"
                                    className="login-input"
                                    placeholder="you@greenwood.edu"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    autoComplete="email"
                                    disabled={isLoading}
                                />
                                <span className="login-field-icon">📧</span>
                            </div>
                        </div>

                        <div className="login-field">
                            <label className="login-field-label">Password</label>
                            <div className="login-field-wrapper">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="login-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                />
                                <span className="login-field-icon">🔒</span>
                                <button type="button" className="login-toggle-password" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <div className="login-options">
                            <label className="login-remember"><input type="checkbox" defaultChecked /> Remember me</label>
                            <button type="button" className="login-forgot">Forgot password?</button>
                        </div>

                        <button type="submit" className="login-submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="login-spinner">
                                    <span className="login-spinner-dot" />
                                    <span className="login-spinner-dot" />
                                    <span className="login-spinner-dot" />
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>
                ) : (
                    <SignupPanel onSuccess={() => navigate('/', { replace: true })} />
                )}

                {/* Demo accounts (login tab only) */}
                {tab === 'login' && (
                    <>
                        <div className="login-divider">
                            <div className="login-divider-line" />
                            <span className="login-divider-text">Demo Accounts</span>
                            <div className="login-divider-line" />
                        </div>
                        <div className="login-demo">
                            <div className="login-demo-list">
                                {demoAccounts.map((account) => (
                                    <div key={account.email} className="login-demo-item" onClick={() => handleDemoLogin(account)}>
                                        <div className="login-demo-item-info">
                                            <div className={`login-demo-avatar login-demo-avatar--${account.avatarClass}`}>
                                                {account.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="login-demo-name">{account.name}</div>
                                                <div className="login-demo-role">{account.role}</div>
                                            </div>
                                        </div>
                                        <span className="login-demo-arrow">→</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <div className="login-footer">
                    © 2026 Greenwood Institute of Technology
                </div>
            </div>
        </div>
    );
}
