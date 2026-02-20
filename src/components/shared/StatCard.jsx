import './StatCard.css';

export default function StatCard({ icon, title, value, trend, trendLabel, color = 'accent' }) {
    const trendClass = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';

    return (
        <div className={`stat-card stat-card--${color}`}>
            <div className="stat-card-header">
                <div className={`stat-card-icon stat-card-icon--${color}`}>
                    {icon}
                </div>
                {trend !== undefined && (
                    <div className={`stat-card-trend stat-card-trend--${trendClass}`}>
                        <span>{trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}</span>
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            <div className="stat-card-body">
                <div className="stat-card-value">{value}</div>
                <div className="stat-card-title">{title}</div>
            </div>
            {trendLabel && (
                <div className="stat-card-footer">
                    <span className="stat-card-trend-label">{trendLabel}</span>
                </div>
            )}
        </div>
    );
}
