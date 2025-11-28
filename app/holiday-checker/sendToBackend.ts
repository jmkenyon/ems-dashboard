
const API_URL = process.env.NEXT_PUBLIC_PYTHON_BACKEND;

export async function sendHolidaysToBackend(
  rows: Array<{ market: string; date: string }>
) {
  const response = await fetch(`${API_URL}/check-holiday`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
       rows
    }),
  });
  const data = await response.json();
  return data
}
