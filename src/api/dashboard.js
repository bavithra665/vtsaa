const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');

export async function fetchDashboard(month, signal) {
  if (!API_BASE_URL) {
    throw new Error('Set EXPO_PUBLIC_API_URL in .env to connect to the dashboard API.');
  }

  const response = await fetch(`${API_BASE_URL}/dashboard?month=${month}`, { signal });

  if (!response.ok) {
    throw new Error(`Dashboard request failed (${response.status}).`);
  }

  const dashboard = await response.json();

  if (
    dashboard.month !== month ||
    !Array.isArray(dashboard.categories) ||
    !Array.isArray(dashboard.monthlyTrend) ||
    typeof dashboard.currency !== 'string'
  ) {
    throw new Error('The dashboard API returned an invalid response.');
  }

  return dashboard;
}
