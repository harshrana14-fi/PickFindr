import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

type HistoryItem = { _id: string; term: string; timestamp: string };

export const HistoryPage: React.FC = () => {
	const [items, setItems] = useState<HistoryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		api.get('/history')
			.then(({ data }) => setItems(data.history || []))
			.catch(() => setItems([]))
			.finally(() => setLoading(false));
	}, []);

	function formatDate(timestamp: string): string {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
		if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
		if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
	}

	function formatFullDate(timestamp: string): string {
		const date = new Date(timestamp);
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
		});
	}

	function handleHistoryClick(term: string) {
		navigate('/', { state: { searchTerm: term } });
	}

	return (
		<div className="history-page">
			<div className="history-header">
				<h1 className="history-title">
					Search <span className="gradient-text">History</span>
				</h1>
				<p className="history-subtitle">View all your previous searches</p>
			</div>

			<div className="history-container">
				{loading ? (
					<div className="loading-state">
						<div className="loading-spinner"></div>
						<p>Loading your history...</p>
					</div>
				) : items.length === 0 ? (
					<div className="empty-state">
						<svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.5, marginBottom: 16 }}>
							<path d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8Z" stroke="currentColor" strokeWidth="2"/>
							<path d="M32 16V32M32 40H32.04" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
						</svg>
						<h3>No search history yet</h3>
						<p>Start searching to see your history here</p>
					</div>
				) : (
					<div className="history-grid">
						{items.map((it) => (
							<div
								key={it._id}
								className="history-card"
								onClick={() => handleHistoryClick(it.term)}
							>
								<div className="history-card-content">
									<div className="history-card-header">
										<svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="history-icon">
											<path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											<path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span className="history-term">{it.term}</span>
									</div>
									<div className="history-card-footer">
										<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
											<circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
											<path d="M8 4V8L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
										</svg>
										<span className="history-time">{formatDate(it.timestamp)}</span>
										<span className="history-full-date" title={formatFullDate(it.timestamp)}>
											{formatFullDate(it.timestamp)}
										</span>
									</div>
								</div>
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="history-arrow">
									<path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};


