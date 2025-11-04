import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { api } from '../api';

type User = any;

type AuthContextType = {
	user: User | null;
	loading: boolean;
	refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, refresh: async () => {} });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const loadingRef = useRef(false);

	const load = async () => {
		if (loadingRef.current) return;
		loadingRef.current = true;
		try {
			const { data } = await api.get('/auth/me');
			setUser(data.user);
		} catch (_err) {
			setUser(null);
		} finally {
			setLoading(false);
			loadingRef.current = false;
		}
	};

	useEffect(() => {
		// Load user on mount
		load();

		// Refresh auth state when window regains focus (user comes back to tab)
		const handleFocus = () => {
			if (!loadingRef.current) {
				load();
			}
		};

		window.addEventListener('focus', handleFocus);
		
		// Also refresh when the page becomes visible (handles tab switching and browser restore)
		const handleVisibilityChange = () => {
			if (!document.hidden && !loadingRef.current) {
				load();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			window.removeEventListener('focus', handleFocus);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading, refresh: load }}>{children}</AuthContext.Provider>
	);
};

export function useAuth() {
	return useContext(AuthContext);
}


