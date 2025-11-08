const normalizeBaseUrl = (rawUrl: string | undefined | null): string => {
  if (!rawUrl) {
    return "/api";
  }

  const trimmed = rawUrl.replace(/\/+$/, "");

  if (trimmed.endsWith("/api")) {
    return trimmed;
  }

  return `${trimmed}/api`;
};

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_BACKEND_URL);

export const buildApiUrl = (path = ""): string => {
  if (!path) {
    return API_BASE_URL;
  }
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
