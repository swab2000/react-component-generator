export type SSEEvent =
  | { eventType: 'chunk'; text: string }
  | { eventType: 'complete'; processedCode: string }
  | { eventType: 'error'; error: string }
  | null;

export function parseSSEEvent(lines: string[]): SSEEvent {
  const eventLine = lines.find((l) => l.startsWith('event: '));
  const dataLine = lines.find((l) => l.startsWith('data: '));

  if (!dataLine) return null;

  const raw = dataLine.slice(6).trim();
  if (!raw) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!payload || typeof payload !== 'object') return null;
  const p = payload as Record<string, unknown>;

  const eventType = eventLine ? eventLine.slice(7).trim() : 'chunk';

  if (eventType === 'complete') {
    if (typeof p.processedCode !== 'string') return null;
    return { eventType: 'complete', processedCode: p.processedCode };
  }

  if (eventType === 'error') {
    if (typeof p.error !== 'string') return null;
    return { eventType: 'error', error: p.error };
  }

  if (typeof p.text !== 'string') return null;
  return { eventType: 'chunk', text: p.text };
}
