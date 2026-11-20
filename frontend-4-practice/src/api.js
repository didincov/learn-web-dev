export async function fetchToday() {
  const response = await fetch('/api/booking/today');
  if (!response.ok) throw new Error('Не удалось загрузить сегодняшнюю дату.');
  return response.json();
}


export async function fetchSlots(date) {
  const params = new URLSearchParams({
    day: String(date.day),
    month: String(date.month),
    year: String(date.year)
  });
  const response = await fetch(`/api/slots?${params.toString()}`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Не удалось загрузить свободное время.');
  return payload;
}
