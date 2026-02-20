import './Skeleton.css';

export function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-line skeleton-line--sm"></div>
            <div className="skeleton-line skeleton-line--lg"></div>
            <div className="skeleton-line skeleton-line--md"></div>
        </div>
    );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
    return (
        <div className="skeleton-table">
            <div className="skeleton-table-header">
                {Array.from({ length: cols }, (_, i) => (
                    <div key={i} className="skeleton-line skeleton-line--sm"></div>
                ))}
            </div>
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="skeleton-table-row" style={{ animationDelay: `${i * 0.08}s` }}>
                    {Array.from({ length: cols }, (_, j) => (
                        <div key={j} className="skeleton-line skeleton-line--md"></div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export function SkeletonRow() {
    return (
        <div className="skeleton-row">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-text-group">
                <div className="skeleton-line skeleton-line--md"></div>
                <div className="skeleton-line skeleton-line--sm"></div>
            </div>
        </div>
    );
}
