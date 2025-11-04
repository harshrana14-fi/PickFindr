import React from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SearchPage } from './pages/SearchPage';
import { HistoryPage } from './pages/HistoryPage';

const serverOrigin = import.meta.env.VITE_SERVER_ORIGIN || 'http://localhost:4000';

const Header: React.FC = () => {
    const { user, refresh } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        try {
            await fetch(`${serverOrigin}/api/auth/logout`, {
                method: 'GET',
                credentials: 'include',
            });
            // Refresh auth state after logout
            await refresh();
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
            // Still refresh and navigate even if request fails
            await refresh();
            navigate('/');
        }
    };

    return (
        <header className="header">
            <div className="container header-inner">
                <div className="brand">PicFindr</div>
                <nav className="nav">
                    <Link to="/">Search</Link>
                    {user && <Link to="/history">History</Link>}
                </nav>
                <div className="spacer" />
                <div>
                    {user ? (
                        <a className="btn" href="#" onClick={handleLogout}>Logout</a>
                    ) : (
                        <>
                            <a className="btn" href={`${serverOrigin}/api/auth/google`} style={{ marginRight: 8 }}>Google</a>
                            <a className="btn" href={`${serverOrigin}/api/auth/github`}>GitHub</a>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

const AppRoutes: React.FC = () => (
	<Routes>
		<Route path="/" element={<SearchPage />} />
		<Route
			path="/history"
			element={
				<ProtectedRoute>
					<HistoryPage />
				</ProtectedRoute>
			}
		/>
	</Routes>
);

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Header />
            <main className="container section">
                <AppRoutes />
            </main>
            <footer className="container" style={{ color: '#9aa4b2', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                © {new Date().getFullYear()} PicFindr
            </footer>
        </AuthProvider>
    );
};

export default App;


