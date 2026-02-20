import { useState, useMemo } from 'react';
import './DataTable.css';

export default function DataTable({
    columns,
    data,
    pageSize = 8,
    searchable = true,
    onRowClick,
    emptyMessage = 'No data found',
}) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const [page, setPage] = useState(0);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const filtered = useMemo(() => {
        if (!search) return data;
        const lower = search.toLowerCase();
        return data.filter((row) =>
            columns.some((col) => {
                const val = row[col.key];
                return val && String(val).toLowerCase().includes(lower);
            })
        );
    }, [data, search, columns]);

    const sorted = useMemo(() => {
        if (!sortKey) return filtered;
        return [...filtered].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filtered, sortKey, sortDir]);

    const totalPages = Math.ceil(sorted.length / pageSize);
    const pageData = sorted.slice(page * pageSize, (page + 1) * pageSize);

    return (
        <div className="data-table-container">
            {searchable && (
                <div className="data-table-toolbar">
                    <div className="data-table-search">
                        <span className="data-table-search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        />
                    </div>
                    <div className="data-table-info">
                        {sorted.length} {sorted.length === 1 ? 'record' : 'records'}
                    </div>
                </div>
            )}

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                    className={col.sortable !== false ? 'sortable' : ''}
                                    style={col.width ? { width: col.width } : {}}
                                >
                                    <span className="th-content">
                                        {col.label}
                                        {sortKey === col.key && (
                                            <span className="sort-indicator">
                                                {sortDir === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="data-table-empty">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            pageData.map((row, idx) => (
                                <tr
                                    key={row.id || idx}
                                    onClick={() => onRowClick?.(row)}
                                    className={onRowClick ? 'clickable' : ''}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key}>
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="data-table-pagination">
                    <button
                        className="pagination-btn"
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                    >
                        ← Previous
                    </button>
                    <div className="pagination-pages">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={`pagination-page ${page === i ? 'active' : ''}`}
                                onClick={() => setPage(i)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        className="pagination-btn"
                        disabled={page === totalPages - 1}
                        onClick={() => setPage(page + 1)}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}
