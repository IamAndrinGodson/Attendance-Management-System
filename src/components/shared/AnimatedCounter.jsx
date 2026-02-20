import { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({ value, duration = 1500, prefix = '', suffix = '' }) {
    const [display, setDisplay] = useState('0');
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    animateValue();
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [value]);

    const animateValue = () => {
        const numericStr = String(value).replace(/[^0-9.]/g, '');
        const target = parseFloat(numericStr);
        const isFloat = numericStr.includes('.');
        const hasCommas = String(value).includes(',');
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            let formatted;
            if (isFloat) {
                formatted = current.toFixed(1);
            } else {
                formatted = Math.round(current).toString();
            }

            if (hasCommas) {
                formatted = Number(formatted).toLocaleString();
            }

            setDisplay(formatted);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // set final value exactly
                setDisplay(String(value).replace(prefix, '').replace(suffix, '').trim());
            }
        };

        requestAnimationFrame(step);
    };

    return (
        <span ref={ref} className="animated-counter">
            {prefix}{display}{suffix}
        </span>
    );
}
