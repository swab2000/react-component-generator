import { useState, useCallback } from 'react';
import type { GeneratedComponent, Provider } from '../types';
import { parseSSEEvent } from '../utils/sseParser';

interface UseComponentGeneratorReturn {
  components: GeneratedComponent[];
  isLoading: boolean;
  error: string | null;
  generate: (prompt: string, apiKey: string | undefined, provider: Provider) => Promise<void>;
  removeComponent: (id: string) => void;
  clearAll: () => void;
}

export function useComponentGenerator(): UseComponentGeneratorReturn {
  const [components, setComponents] = useState<GeneratedComponent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (prompt: string, apiKey: string | undefined, provider: Provider) => {
    setIsLoading(true);
    setError(null);

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    setComponents((prev) => [
      {
        id,
        prompt,
        code: '',
        streamingCode: '',
        isStreaming: true,
        createdAt: new Date(),
      },
      ...prev,
    ]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...(apiKey && { apiKey }), provider }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate component');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const eventBlocks = buffer.split('\n\n');
        buffer = eventBlocks.pop() ?? '';

        for (const block of eventBlocks) {
          if (!block.trim()) continue;

          const lines = block.split('\n');
          const event = parseSSEEvent(lines);

          if (event?.eventType === 'chunk') {
            setComponents((prev) =>
              prev.map((c) =>
                c.id === id
                  ? { ...c, streamingCode: (c.streamingCode ?? '') + event.text }
                  : c
              )
            );
          } else if (event?.eventType === 'complete') {
            setComponents((prev) =>
              prev.map((c) =>
                c.id === id
                  ? { ...c, code: event.processedCode, streamingCode: undefined, isStreaming: false }
                  : c
              )
            );
            setIsLoading(false);
            return;
          } else if (event?.eventType === 'error') {
            setComponents((prev) => prev.filter((c) => c.id !== id));
            setError(event.error);
            setIsLoading(false);
            return;
          }
        }
      }
    } catch (err) {
      setComponents((prev) => prev.filter((c) => c.id !== id));
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeComponent = useCallback((id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setComponents([]);
  }, []);

  return { components, isLoading, error, generate, removeComponent, clearAll };
}
