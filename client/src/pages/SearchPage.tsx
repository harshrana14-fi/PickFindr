import React, { useMemo, useState } from 'react';
import { api, type ImageItem } from '../api';
import { TopBanner } from '../components/TopBanner';
import { useAuth } from '../context/AuthContext';

export const SearchPage: React.FC = () => {
    const { user } = useAuth();
	const [term, setTerm] = useState('');
	const [results, setResults] = useState<ImageItem[]>([]);
	const [last, setLast] = useState<string | null>(null);
	const [selected, setSelected] = useState<Record<string, boolean>>({});
	const countSelected = useMemo(() => Object.values(selected).filter(Boolean).length, [selected]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSearch(e: React.FormEvent) {
		e.preventDefault();
        setError(null);
        if (!term.trim()) return;
        try {
            setLoading(true);
            const { data } = await api.post('/search', { term: term.trim() });
            setResults(data.results || []);
            setLast(data.term);
            setSelected({});
        } catch (err: any) {
            if (err?.response?.status === 401) {
                setError('Please log in to search images.');
            } else {
                setError('Search failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
	}

	function toggle(id: string) {
		setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
	}

    return (
        <div>
            <TopBanner />
            <section>
                {!user && (
                    <div className="meta" style={{ marginBottom: 10 }}>You must log in to search images.</div>
                )}
                <form onSubmit={onSearch} className="search-row">
                    <input
                        type="text"
                        placeholder="Search images..."
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="input"
                    />
                    <button className="btn btn-primary" type="submit" disabled={!user || loading}>
                        {loading ? 'Searching…' : 'Search'}
                    </button>
                </form>
                {error && <p className="meta" style={{ color: '#fca5a5' }}>{error}</p>}
                {last && (
                    <p className="meta">
                        You searched for "{last}" — {results.length} results. Selected: {countSelected} images
                    </p>
                )}
                <div className="grid">
                    {results.map((img) => (
                        <div key={img.id} className="card">
                            <img
                                src={img.src || img.thumb || ''}
                                alt={img.alt || ''}
                                className="card-img"
                            />
                            <label className="chip">
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    checked={!!selected[img.id]}
                                    onChange={() => toggle(img.id)}
                                />
                                Select
                            </label>
                        </div>
                    ))}
                </div>
                {!loading && results.length === 0 && last && (
                    <div className="meta" style={{ marginTop: 16 }}>No results found.</div>
                )}
            </section>
        </div>
    );
};


