import React, { createContext, useContext, useEffect, useState } from 'react';
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

	const load = async () => {
		try {
			const { data } = await api.get('/auth/me');
			setUser(data.user);
		} catch (_err) {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading, refresh: load }}>{children}</AuthContext.Provider>
	);
};

export function useAuth() {
	return useContext(AuthContext);
}


