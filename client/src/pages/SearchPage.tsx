import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api, type ImageItem } from '../api';
import { TopBanner } from '../components/TopBanner';
import { useAuth } from '../context/AuthContext';

export const SearchPage: React.FC = () => {
    const { user } = useAuth();
	const location = useLocation();
	const [term, setTerm] = useState('');
	const [results, setResults] = useState<ImageItem[]>([]);
	const [last, setLast] = useState<string | null>(null);
	const [selected, setSelected] = useState<Record<string, boolean>>({});
	const [popularImages, setPopularImages] = useState<ImageItem[]>([]);
	const [loadingPopular, setLoadingPopular] = useState(false);
	const countSelected = useMemo(() => Object.values(selected).filter(Boolean).length, [selected]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

	const suggestedTerms = ['Nature', 'Technology', 'Travel', 'Food', 'Animals', 'Architecture', 'Art', 'Sports'];

	useEffect(() => {
		// Load popular images when component mounts
		const loadPopularImages = async () => {
			try {
				setLoadingPopular(true);
				const { data } = await api.get('/popular-images');
				setPopularImages(data.images || []);
			} catch (err) {
				console.error('Failed to load popular images:', err);
			} finally {
				setLoadingPopular(false);
			}
		};

		loadPopularImages();
	}, []);

	// Perform search function
	async function performSearch(searchTerm: string) {
        setError(null);
		if (!searchTerm.trim()) return;
        try {
            setLoading(true);
			const { data } = await api.post('/search', { term: searchTerm.trim() });
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

	// Handle navigation from history page
	useEffect(() => {
		const searchTerm = (location.state as any)?.searchTerm;
		if (searchTerm && typeof searchTerm === 'string') {
			setTerm(searchTerm);
			performSearch(searchTerm);
			// Clear the state to prevent re-triggering
			window.history.replaceState({}, document.title);
		}
	}, [location]);

    async function onSearch(e: React.FormEvent) {
		e.preventDefault();
		performSearch(term);
	}

	function toggle(id: string) {
		setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
	}

	function handleDownload(img: ImageItem, e: React.MouseEvent) {
		e.stopPropagation();
		const imageUrl = img.full || img.src || img.thumb;
		if (!imageUrl) return;

		// Create a temporary anchor element to trigger download
		const link = document.createElement('a');
		link.href = imageUrl;
		link.download = `image-${img.id}.jpg`;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	async function handleSuggestionClick(suggestion: string) {
		setTerm(suggestion);
		performSearch(suggestion);
	}

    const hasSearched = last !== null;
    const hasResults = results.length > 0;

    return (
        <div className="search-page">
            <TopBanner />
            
            {!user && !hasSearched && (
                <div className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Discover Beautiful Images
                            <span className="gradient-text"> Instantly</span>
                        </h1>
                        <p className="hero-subtitle">
                            Search through millions of high-quality images. Find the perfect photo for your next project.
                        </p>
                        <div className="auth-prompt">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8 }}>
                                <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="currentColor"/>
                                <path d="M10 11.6667C5.4 11.6667 1.66667 14.0667 1.66667 17.0833V20H18.3333V17.0833C18.3333 14.0667 14.6 11.6667 10 11.6667Z" fill="currentColor"/>
                            </svg>
                            <span>Sign in to start searching</span>
                        </div>
                    </div>
                </div>
            )}

            <section className={`search-section ${hasSearched ? 'searched' : ''}`}>
                <div className="search-container">
                    <form onSubmit={onSearch} className="search-form">
                        <div className="search-wrapper">
                            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                    <input
                        type="text"
                                placeholder={user ? "Search for images..." : "Sign in to search images"}
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                                className="search-input"
                                disabled={!user}
                            />
                            <button 
                                className="search-button" 
                                type="submit" 
                                disabled={!user || loading || !term.trim()}
                            >
                                {loading ? (
                                    <>
                                        <svg className="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="43.98" strokeDashoffset="10.99">
                                                <animate attributeName="stroke-dasharray" dur="1.5s" values="0 43.98;21.99 21.99;0 43.98;0 43.98" repeatCount="indefinite"/>
                                                <animate attributeName="stroke-dashoffset" dur="1.5s" values="0;-10.99;-43.98;-43.98" repeatCount="indefinite"/>
                                            </circle>
                                        </svg>
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        Search
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </>
                                )}
                    </button>
                        </div>
                </form>

                    {!hasSearched && user && (
                        <div className="suggestions-section">
                            <p className="suggestions-label">Popular Searches:</p>
                            <div className="suggestions-list">
                                {suggestedTerms.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        className="suggestion-chip"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
                                <path d="M8 5V8M8 11H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    {hasSearched && (
                        <div className="search-results-header">
                            <div className="results-info">
                                <h2 className="results-title">Search Results</h2>
                                <p className="results-meta">
                                    Found <strong>{results.length}</strong> {results.length === 1 ? 'image' : 'images'} for "<strong>{last}</strong>"
                                    {countSelected > 0 && (
                                        <span className="selected-count"> • {countSelected} selected</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {!hasSearched && user && popularImages.length > 0 && (
                    <div className="popular-section">
                        <h2 className="section-title">Trending Now</h2>
                        <div className="images-grid">
                            {popularImages.map((img) => (
                                <div key={img.id} className={`image-card ${selected[img.id] ? 'selected' : ''}`}>
                                    <div className="image-wrapper">
                                        <img
                                            src={img.src || img.thumb || ''}
                                            alt={img.alt || 'Popular image'}
                                            className="image"
                                            loading="lazy"
                                        />
                                        <div className="image-overlay">
                                            <div className="image-buttons">
                                                <button
                                                    className={`select-button ${selected[img.id] ? 'active' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggle(img.id);
                                                    }}
                                                    aria-label={selected[img.id] ? 'Deselect image' : 'Select image'}
                                                    title={selected[img.id] ? 'Deselect' : 'Select'}
                                                >
                                                    {selected[img.id] && (
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    )}
                                                </button>
                                                <button
                                                    className="download-button"
                                                    onClick={(e) => handleDownload(img, e)}
                                                    aria-label="Download image"
                                                    title="Download"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M8 11V2M8 11L5 8M8 11L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M2 13H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {hasResults && (
                    <div className="images-grid">
                    {results.map((img) => (
                            <div key={img.id} className={`image-card ${selected[img.id] ? 'selected' : ''}`}>
                                <div className="image-wrapper">
                            <img
                                src={img.src || img.thumb || ''}
                                        alt={img.alt || 'Image'}
                                        className="image"
                                        loading="lazy"
                                    />
                                    <div className="image-overlay">
                                        <div className="image-buttons">
                                            <button
                                                className={`select-button ${selected[img.id] ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggle(img.id);
                                                }}
                                                aria-label={selected[img.id] ? 'Deselect image' : 'Select image'}
                                                title={selected[img.id] ? 'Deselect' : 'Select'}
                                            >
                                                {selected[img.id] && (
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                )}
                                            </button>
                                            <button
                                                className="download-button"
                                                onClick={(e) => handleDownload(img, e)}
                                                aria-label="Download image"
                                                title="Download"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M8 11V2M8 11L5 8M8 11L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M2 13H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    ))}
                </div>
                )}

                {loading && hasSearched && (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading images...</p>
                    </div>
                )}

                {!loading && hasSearched && !hasResults && (
                    <div className="empty-state">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.5, marginBottom: 16 }}>
                            <path d="M32 12C20.954 12 12 20.954 12 32C12 43.046 20.954 52 32 52C43.046 52 52 43.046 52 32C52 20.954 43.046 12 32 12Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M32 24V32M32 40H32.04" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <h3>No images found</h3>
                        <p>Try a different search term or check your spelling.</p>
                    </div>
                )}
            </section>
        </div>
    );
};


