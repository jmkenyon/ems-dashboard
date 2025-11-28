export async function sendHolidaysToBackend(
  rows: Array<{ market: string; date: string }>
) {
  const response = await fetch("http://127.0.0.1:8000/check-holiday", {
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
