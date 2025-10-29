import React, { useEffect, useState } from 'react';
import { api } from '../api';

type HistoryItem = { _id: string; term: string; timestamp: string };

export const HistoryPage: React.FC = () => {
	const [items, setItems] = useState<HistoryItem[]>([]);
	useEffect(() => {
		api.get('/history').then(({ data }) => setItems(data.history || [])).catch(() => setItems([]));
	}, []);
	return (
		<section>
			<h2 style={{ marginBottom: 12 }}>Your Search History</h2>
			<ul className="history-list">
				{items.map((it) => (
					<li key={it._id} className="history-item">
						<span className="history-date">{new Date(it.timestamp).toLocaleString()}</span>
						<span>{it.term}</span>
					</li>
				))}
			</ul>
		</section>
	);
};


