import axios from "axios";

import { API_CANDIDATES } from "../config";
import { normalizeItemsPayload } from "./normalizers";

function isLikelyHtml(payload) {
  return typeof payload === "string" && payload.toLowerCase().includes("<!doctype html");
}

export async function fetchItemsFromApi() {
  let lastError = null;

  for (const baseUrl of API_CANDIDATES) {
    try {
      const response = await axios.get(`${baseUrl}/items`);
      const normalizedItems = normalizeItemsPayload(response.data);

      if (normalizedItems.length) {
        return normalizedItems;
      }

      if (Array.isArray(response.data)) {
        return response.data;
      }

      if (isLikelyHtml(response.data)) {
        lastError = new Error(`Received HTML instead of API data from ${baseUrl}`);
        continue;
      }

      if (response.data && (response.data.items || response.data.data)) {
        return normalizedItems;
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to fetch items from the API");
}
