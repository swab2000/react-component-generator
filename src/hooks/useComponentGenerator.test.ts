import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useComponentGenerator } from './useComponentGenerator';

function createSSEStream(sseBlocks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const block of sseBlocks) {
        controller.enqueue(encoder.encode(block));
      }
      controller.close();
    },
  });
}

function mockSSEFetch(sseBlocks: string[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      body: createSSEStream(sseBlocks),
    } as unknown as Response)
  );
}

function mockErrorFetch(status: number, errorBody: object) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      body: null,
      json: async () => errorBody,
    } as unknown as Response)
  );
  void status;
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useComponentGenerator', () => {
  describe('초기 상태', () => {
    it('컴포넌트 목록이 비어있어야 한다', () => {
      const { result } = renderHook(() => useComponentGenerator());
      expect(result.current.components).toHaveLength(0);
    });

    it('isLoading이 false여야 한다', () => {
      const { result } = renderHook(() => useComponentGenerator());
      expect(result.current.isLoading).toBe(false);
    });

    it('error가 null이어야 한다', () => {
      const { result } = renderHook(() => useComponentGenerator());
      expect(result.current.error).toBeNull();
    });
  });

  describe('generate() - 스트리밍 성공', () => {
    it('완료 후 컴포넌트가 목록에 추가되어야 한다', async () => {
      mockSSEFetch([
        'data: {"type":"chunk","text":"const Btn"}\n\n',
        'event: complete\ndata: {"processedCode":"const Btn = () => <button/>;\nrender(<Btn/>)"}\n\n',
      ]);
      const { result } = renderHook(() => useComponentGenerator());

      await act(async () => {
        await result.current.generate('button', undefined, 'anthropic');
      });

      expect(result.current.components).toHaveLength(1);
    });

    it('완료 후 컴포넌트의 code가 processedCode로 설정되어야 한다', async () => {
      const processedCode = 'const Btn = () => <button/>;\nrender(<Btn/>)';
      mockSSEFetch([
        'data: {"type":"chunk","text":"const Btn"}\n\n',
        `event: complete\ndata: ${JSON.stringify({ processedCode })}\n\n`,
      ]);
      const { result } = renderHook(() => useComponentGenerator());

      await act(async () => {
        await result.current.generate('button', undefined, 'anthropic');
      });

      expect(result.current.components[0].code).toBe(processedCode);
    });

    it('완료 후 isStreaming이 false여야 한다', async () => {
      mockSSEFetch([
        'event: complete\ndata: {"processedCode":"render(<A/>)"}\n\n',
      ]);
      const { result } = renderHook(() => useComponentGenerator());

      await act(async () => {
        await result.current.generate('test', undefined, 'anthropic');
      });

      expect(result.current.components[0].isStreaming).toBe(false);
    });

    it('완료 후 isLoading이 false여야 한다', async () => {
      mockSSEFetch([
        'event: complete\ndata: {"processedCode":"render(<A/>)"}\n\n',
      ]);
      const { result } = renderHook(() => useComponentGenerator());

      await act(async () => {
        await result.current.generate('test', undefined, 'anthropic');
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('완료 후 streamingCode가 undefined여야 한다', async () => {
      mockSSEFetch([
        'data: {"type":"chunk","text":"hello"}\n\n',
        'event: complete\ndata: {"processedCode":"render(<A/>)"}\n\n',
      ]);
      const { result } = renderHook(() => useComponentGenerator());

      await act(async () => {
        await result.current.generate('test', undefined, 'anthropic');
      });

      expect(result.current.components[0].streamingCode).toBeUndefined();
    });

    it('컴포넌트의 prompt가 입력값과 일치해야 한다', async () => {
      mockSSEFetch([
        'event: complete\ndata: {"processedCode":"render(<A/>)"}\n\n',
      ]);
      const { result } = renderHook(() => useComponentGenerator());

      await act(async () => {
        await result.current.generate('retro button', undefined, 'anthropic');
      });

      expect(result.current.components[0].prompt).toBe('retro button');
    });

    it('여러 청크가 누적된 후 complete가 오면 code가 확정되어야 한다', async () => {
      const processedCode = 'function App(){return <div/>}\nrender(<App/>)';
      mockSSEFetch([
        'data: {"type":"chunk","text":"function "}\n\n',
        'data: {"type":"chunk","text":"App()"}\n\n',
        'data: {"type":"chunk","text":"{return <div/>}"}\n\n',
        `event: complete\ndata: ${JSON.stringify({ processedCode })}\n\n`,
      ]);
      const { result } = renderHook(() => useComponentGenerator());

      await act(async () => {
        await result.current.generate('app', undefined, 'anthropic');
      });

      expect(result.current.components[0].code).toBe(processedCode);
    });
  });

  describe('generate() - 스트리밍 에러', () => {
    it('SSE error 이벤트 수신 시 error 상태가 설정되어야 한다', async () => {
      mockSSEFetch([
        'event: error\ndata: {"error":"rate limited"}\n\n',
      ]);
      const { result } = renderHook(() => useComponentGenerator());

      await act(async () => {
        await result.current.generate('test', undefined, 'anthropic');
      });

      expect(result.current.error).toBe('rate limited');
    });

    it('SSE error 이벤트 수신 시 isLoading이 false여야 한다', async () => {
      mockSSEFetch([
        'event: error\ndata: {"error":"rate limited"}\n\n',
      ]);
      const { result } = renderHook(() => useComponentGenerator());

      await act(async () => {
        await result.current.generate('test', undefined, 'anthropic');
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('HTTP 오류 응답 시 error 상태가 설정되어야 한다', async () => {
      mockErrorFetch(400, { error: 'API key required' });
      const { result } = renderHook(() => useComponentGenerator());

      await act(async () => {
        await result.current.generate('test', undefined, 'anthropic');
      });

      expect(result.current.error).toBe('API key required');
    });
  });

  describe('removeComponent()', () => {
    it('해당 id의 컴포넌트가 목록에서 제거되어야 한다', async () => {
      mockSSEFetch([
        'event: complete\ndata: {"processedCode":"render(<A/>)"}\n\n',
      ]);
      const { result } = renderHook(() => useComponentGenerator());

      await act(async () => {
        await result.current.generate('test', undefined, 'anthropic');
      });

      const id = result.current.components[0].id;
      act(() => {
        result.current.removeComponent(id);
      });

      expect(result.current.components).toHaveLength(0);
    });
  });

  describe('clearAll()', () => {
    it('모든 컴포넌트가 제거되어야 한다', async () => {
      mockSSEFetch([
        'event: complete\ndata: {"processedCode":"render(<A/>)"}\n\n',
      ]);
      const { result } = renderHook(() => useComponentGenerator());

      await act(async () => {
        await result.current.generate('test', undefined, 'anthropic');
      });

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.components).toHaveLength(0);
    });
  });
});
