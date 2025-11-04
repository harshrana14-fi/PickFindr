import React, { useEffect, useState } from 'react';
import { api, type ImageItem } from '../api';
import { useAuth } from '../context/AuthContext';

type TopItem = { term: string; count: number; images: ImageItem[] };

export const TopBanner: React.FC = () => {
	const { user } = useAuth();
	const [items, setItems] = useState<TopItem[]>([]);
	
	useEffect(() => {
		if (user) {
			api.get('/top-searches')
				.then(({ data }) => setItems(data.top || []))
				.catch(() => setItems([]));
		}
	}, [user]);

	if (!user || !items.length) return null;

	return (
		<div className="banner">
			<div className="container">
				<div style={{ marginBottom: 12, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
					Top Searches:
				</div>
				<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
					{items.map((item) => (
						<div key={item.term} style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 180 }}>
							<div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
								<span style={{ fontWeight: 600, color: 'var(--text)' }}>{item.term}</span>
								<span style={{ fontSize: 12, color: 'var(--muted)' }}>({item.count})</span>
							</div>
							{item.images && item.images.length > 0 && (
								<div style={{ display: 'flex', gap: 6 }}>
									{item.images.map((img) => (
										<img
											key={img.id}
											src={img.src || img.thumb || ''}
											alt={img.alt || item.term}
											style={{
												width: 60,
												height: 60,
												objectFit: 'cover',
												borderRadius: 6,
												border: '1px solid rgba(255,255,255,0.1)',
											}}
										/>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};


