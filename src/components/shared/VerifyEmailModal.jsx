import { useState, useRef, useEffect } from 'react';
import { generateCode, sendVerificationCode } from '../../services/emailService';
import './VerifyEmailModal.css';

export default function VerifyEmailModal({ email, name, onVerified, onClose }) {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [sentCode, setSentCode] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | sending | sent | verifying | success | error
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleSendCode = async () => {
        setStatus('sending');
        setError('');
        const newCode = generateCode();
        setSentCode(newCode);

        const result = await sendVerificationCode(email, name, newCode);
        if (result.success) {
            setStatus('sent');
            setCooldown(60);
            // Focus first input
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } else {
            setStatus('error');
            setError(result.error || 'Failed to send email. Check your EmailJS config.');
        }
    };

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];

        // Handle paste of full code
        if (value.length > 1) {
            const digits = value.slice(0, 6).split('');
            digits.forEach((d, i) => {
                if (i + index < 6) newCode[i + index] = d;
            });
            setCode(newCode);
            const nextIdx = Math.min(index + digits.length, 5);
            inputRefs.current[nextIdx]?.focus();
            return;
        }

        newCode[index] = value;
        setCode(newCode);

        // Auto-advance to next box
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const entered = code.join('');
        if (entered.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        if (entered === sentCode) {
            setStatus('success');
            setTimeout(() => onVerified(), 1500);
        } else {
            setError('Invalid verification code. Please try again.');
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };

    // Auto-verify when all 6 digits entered
    useEffect(() => {
        if (code.every(d => d !== '') && sentCode) {
            handleVerify();
        }
    }, [code]);

    return (
        <div className="verify-overlay">
            <div className="verify-card">
                {status === 'success' ? (
                    <div className="verify-success">
                        <div className="verify-success-icon">✅</div>
                        <h2 className="verify-success-title">Email Verified!</h2>
                        <p className="verify-success-text">Redirecting to dashboard...</p>
                    </div>
                ) : (
                    <>
                        <div className="verify-header">
                            <div className="verify-icon">📧</div>
                            <h2 className="verify-title">Verify Your Email</h2>
                            <p className="verify-subtitle">
                                {status === 'sent' || status === 'error'
                                    ? <>We sent a 6-digit code to <strong>{email}</strong></>
                                    : <>Click below to send a verification code to <strong>{email}</strong></>
                                }
                            </p>
                        </div>

                        {(status === 'idle' || status === 'sending') && (
                            <button
                                className="verify-send-btn"
                                onClick={handleSendCode}
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? (
                                    <span className="verify-spinner">
                                        <span className="verify-spinner-dot" />
                                        <span className="verify-spinner-dot" />
                                        <span className="verify-spinner-dot" />
                                    </span>
                                ) : '📩 Send Verification Code'}
                            </button>
                        )}

                        {(status === 'sent' || status === 'error') && (
                            <>
                                <div className="verify-code-row">
                                    {code.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={el => inputRefs.current[i] = el}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            className={`verify-digit ${digit ? 'filled' : ''}`}
                                            value={digit}
                                            onChange={(e) => handleChange(i, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(i, e)}
                                            onPaste={(e) => {
                                                e.preventDefault();
                                                const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
                                                handleChange(i, pasted);
                                            }}
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <div className="verify-error">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}

                                <button
                                    className="verify-confirm-btn"
                                    onClick={handleVerify}
                                    disabled={code.some(d => d === '')}
                                >
                                    Verify Code
                                </button>

                                <div className="verify-resend">
                                    {cooldown > 0 ? (
                                        <span className="verify-cooldown">Resend in {cooldown}s</span>
                                    ) : (
                                        <button className="verify-resend-btn" onClick={handleSendCode}>
                                            Resend Code
                                        </button>
                                    )}
                                </div>
                            </>
                        )}

                        <button className="verify-skip-btn" onClick={onClose}>
                            Skip for now
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
