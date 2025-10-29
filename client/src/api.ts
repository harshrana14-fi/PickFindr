import axios from 'axios';

const serverOrigin = import.meta.env.VITE_SERVER_ORIGIN || 'http://localhost:4000';

export const api = axios.create({
	baseURL: `${serverOrigin}/api`,
	withCredentials: true,
});

export type ImageItem = {
	id: string;
	alt?: string | null;
	src?: string | null;
	full?: string | null;
	thumb?: string | null;
	width?: number;
	height?: number;
	user?: { name?: string; profile?: string } | null;
};


