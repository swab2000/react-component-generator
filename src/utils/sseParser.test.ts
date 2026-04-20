import { describe, it, expect } from 'vitest';
import { parseSSEEvent } from './sseParser';

describe('parseSSEEvent', () => {
  describe('chunk 이벤트', () => {
    it('data 줄만 있는 chunk 이벤트를 파싱해야 한다', () => {
      const result = parseSSEEvent(['data: {"type":"chunk","text":"const "}']);
      expect(result).toEqual({ eventType: 'chunk', text: 'const ' });
    });

    it('여러 단어가 포함된 text를 파싱해야 한다', () => {
      const result = parseSSEEvent(['data: {"type":"chunk","text":"function Button() {"}']);
      expect(result).toEqual({ eventType: 'chunk', text: 'function Button() {' });
    });

    it('빈 text 청크를 파싱해야 한다', () => {
      const result = parseSSEEvent(['data: {"type":"chunk","text":""}']);
      expect(result).toEqual({ eventType: 'chunk', text: '' });
    });

    it('한국어 텍스트 청크를 파싱해야 한다', () => {
      const result = parseSSEEvent(['data: {"type":"chunk","text":"안녕"}']);
      expect(result).toEqual({ eventType: 'chunk', text: '안녕' });
    });
  });

  describe('complete 이벤트', () => {
    it('event: complete + data 두 줄로 구성된 complete 이벤트를 파싱해야 한다', () => {
      const result = parseSSEEvent([
        'event: complete',
        'data: {"processedCode":"render(<Button />)"}',
      ]);
      expect(result).toEqual({ eventType: 'complete', processedCode: 'render(<Button />)' });
    });

    it('processedCode가 긴 코드 문자열이어도 파싱해야 한다', () => {
      const code = 'function App() { return <div>Hello</div>; }\nrender(<App />);';
      const result = parseSSEEvent([
        'event: complete',
        `data: ${JSON.stringify({ processedCode: code })}`,
      ]);
      expect(result).toEqual({ eventType: 'complete', processedCode: code });
    });
  });

  describe('error 이벤트', () => {
    it('event: error + data 두 줄로 구성된 error 이벤트를 파싱해야 한다', () => {
      const result = parseSSEEvent([
        'event: error',
        'data: {"error":"rate limited"}',
      ]);
      expect(result).toEqual({ eventType: 'error', error: 'rate limited' });
    });

    it('API key required 에러 메시지를 파싱해야 한다', () => {
      const result = parseSSEEvent([
        'event: error',
        'data: {"error":"API key required"}',
      ]);
      expect(result).toEqual({ eventType: 'error', error: 'API key required' });
    });
  });

  describe('null 반환 케이스', () => {
    it('빈 배열은 null을 반환해야 한다', () => {
      expect(parseSSEEvent([])).toBeNull();
    });

    it('빈 줄만 있는 경우 null을 반환해야 한다', () => {
      expect(parseSSEEvent([''])).toBeNull();
    });

    it('data: 접두사 없는 줄은 null을 반환해야 한다', () => {
      expect(parseSSEEvent(['event: complete'])).toBeNull();
    });

    it('잘못된 JSON은 null을 반환해야 한다', () => {
      expect(parseSSEEvent(['data: not-json'])).toBeNull();
    });

    it('data: 뒤에 내용이 없으면 null을 반환해야 한다', () => {
      expect(parseSSEEvent(['data: '])).toBeNull();
    });

    it('text 필드가 없는 chunk는 null을 반환해야 한다', () => {
      expect(parseSSEEvent(['data: {"type":"chunk"}'])).toBeNull();
    });

    it('processedCode 필드가 없는 complete는 null을 반환해야 한다', () => {
      expect(parseSSEEvent(['event: complete', 'data: {"code":"..."}'])).toBeNull();
    });

    it('error 필드가 없는 error 이벤트는 null을 반환해야 한다', () => {
      expect(parseSSEEvent(['event: error', 'data: {"message":"..."}'])).toBeNull();
    });
  });
});
