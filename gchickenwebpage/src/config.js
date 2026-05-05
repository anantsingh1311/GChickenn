const configuredApiUrl = process.env.REACT_APP_API_URL?.trim();

export const API_URL = configuredApiUrl || "http://localhost:5001";

export const API_CANDIDATES = Array.from(
  new Set([API_URL, "http://localhost:5001"].filter(Boolean))
);
