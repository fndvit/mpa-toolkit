export const staticUrl = (path: string) => `${import.meta.env.VITE_UPLOAD_BASE_URL}${path}`;

export const parseTextToID = (text: string) => text.replace(/\s|\./g, '');
