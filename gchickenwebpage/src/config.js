const configuredApiUrl = process.env.REACT_APP_API_URL?.trim();

export const API_URL = configuredApiUrl || "http://localhost:5001";
