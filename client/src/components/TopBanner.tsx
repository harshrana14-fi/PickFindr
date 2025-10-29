import React, { useEffect, useState } from 'react';
import { api } from '../api';

type TopItem = { term: string; count: number };

export const TopBanner: React.FC = () => {
	const [items, setItems] = useState<TopItem[]>([]);
	useEffect(() => {
		api.get('/top-searches').then(({ data }) => setItems(data.top || [])).catch(() => setItems([]));
	}, []);
    if (!items.length) return null;
    return (
        <div className="banner">
            <div className="container">
                Top searches: {items.map((i) => `${i.term} (${i.count})`).join(' • ')}
            </div>
        </div>
    );
};


