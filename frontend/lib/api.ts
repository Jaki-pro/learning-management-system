const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://learning-management-system-production-2179.up.railway.app/";

/**
 * A helper function to make fetch requests to Strapi API
 * @param endpoint The endpoint to fetch (e.g., '/api/courses')
 * @param options The options for the fetch request
 * @returns The JSON response from the API
 */

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const { headers, ...otherOptions } = options;

  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${STRAPI_URL}${endpoint}`, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...otherOptions,
  });
  console.log(response, 'response from fetchApi');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Something went wrong');
  }
  if(options.method === 'DELETE') {
    return;
  }
  return response.json();
}