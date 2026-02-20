import { useCallback } from 'react';
import './Button.css';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    fullWidth = false,
    disabled = false,
    onClick,
    type = 'button',
}) {
    const handleClick = useCallback((e) => {
        // Create ripple
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        btn.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);

        onClick?.(e);
    }, [onClick]);

    return (
        <button
            type={type}
            className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ripple-container`}
            disabled={disabled}
            onClick={handleClick}
        >
            {icon && <span className="btn-icon">{icon}</span>}
            {children}
        </button>
    );
}
