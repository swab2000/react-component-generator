import { describe, it, expect } from 'vitest';
import { getCharacterCount, formatCharacterCount, handleExampleSelection, isValidPrompt } from './promptHelper';

describe('PromptInput - Character Counter', () => {
  describe('RED: 사용자가 타이핑하면 글자수 카운터가 증가한다', () => {
    it('getCharacterCount는 5글자를 입력하면 5를 반환해야 한다', () => {
      const count = getCharacterCount('Hello');
      expect(count).toBe(5);
    });

    it('formatCharacterCount는 5를 "5 글자"로 포맷팅해야 한다', () => {
      const formatted = formatCharacterCount(5);
      expect(formatted).toBe('5 글자');
    });
  });

  describe('RED: 텍스트를 삭제하면 글자수 카운터가 감소한다', () => {
    it('getCharacterCount는 빈 문자열에 0을 반환해야 한다', () => {
      const count = getCharacterCount('');
      expect(count).toBe(0);
    });

    it('formatCharacterCount는 0을 "0 글자"로 포맷팅해야 한다', () => {
      const formatted = formatCharacterCount(0);
      expect(formatted).toBe('0 글자');
    });
  });

  describe('RED: 예시 chip을 클릭하면 카운터가 업데이트된다', () => {
    it('handleExampleSelection은 예시 텍스트를 반환해야 한다', () => {
      const example = '커서가 깜빡이며 한 글자씩 타이핑되는 애니메이션 텍스트. 여러 문장을 순환하며 반복';
      const result = handleExampleSelection(example);
      expect(result).toBe(example);
    });

    it('handleExampleSelection 후 getCharacterCount는 올바른 길이를 반환해야 한다', () => {
      const example = '커서가 깜빡이며 한 글자씩 타이핑되는 애니메이션 텍스트. 여러 문장을 순환하며 반복';
      const selected = handleExampleSelection(example);
      const count = getCharacterCount(selected);
      expect(count).toBe(46);
    });

    it('formatCharacterCount는 예시 텍스트 길이를 올바르게 포맷팅해야 한다', () => {
      const example = '커서가 깜빡이며 한 글자씩 타이핑되는 애니메이션 텍스트. 여러 문장을 순환하며 반복';
      const count = getCharacterCount(example);
      const formatted = formatCharacterCount(count);
      expect(formatted).toBe('46 글자');
    });
  });

  describe('isValidPrompt 검증', () => {
    it('공백이 아닌 텍스트는 유효해야 한다', () => {
      expect(isValidPrompt('Hello')).toBe(true);
    });

    it('빈 문자열은 무효해야 한다', () => {
      expect(isValidPrompt('')).toBe(false);
    });

    it('공백만 있는 텍스트는 무효해야 한다', () => {
      expect(isValidPrompt('   ')).toBe(false);
    });
  });

  describe('예시 텍스트들의 글자수', () => {
    const EXAMPLES = [
      '커서가 깜빡이며 한 글자씩 타이핑되는 애니메이션 텍스트. 여러 문장을 순환하며 반복',
      '클릭하면 3D로 뒤집히는 카드. 앞면은 아바타와 이름, 뒷면은 이메일과 SNS 링크',
      '0에서 목표 숫자까지 카운트업 애니메이션이 있는 통계 대시보드. 매출, 사용자 수, 전환율 3개 카드',
      '포커스 시 입력 필드가 네온 빛으로 빛나는 다크 테마 로그인 폼. 이메일, 비밀번호, 로그인 버튼 포함',
      '별 이모지에 호버하면 노란색으로 채워지고, 클릭하면 평점이 고정되는 5점 만점 리뷰 위젯',
      '반투명 배경에 블러 효과가 적용된 글래스모피즘 날씨 카드. 온도, 날씨 아이콘, 습도, 풍속 표시',
    ];

    it('첫 번째 예시의 글자수를 정확히 계산해야 한다', () => {
      const count = getCharacterCount(EXAMPLES[0]);
      expect(count).toBe(46);
      expect(formatCharacterCount(count)).toBe('46 글자');
    });

    it('두 번째 예시의 글자수를 정확히 계산해야 한다', () => {
      const count = getCharacterCount(EXAMPLES[1]);
      expect(count).toBe(46);
      expect(formatCharacterCount(count)).toBe('46 글자');
    });

    it('세 번째 예시의 글자수를 정확히 계산해야 한다', () => {
      const count = getCharacterCount(EXAMPLES[2]);
      expect(count).toBe(56);
      expect(formatCharacterCount(count)).toBe('56 글자');
    });

    it('네 번째 예시의 글자수를 정확히 계산해야 한다', () => {
      const count = getCharacterCount(EXAMPLES[3]);
      expect(count).toBe(57);
      expect(formatCharacterCount(count)).toBe('57 글자');
    });

    it('다섯 번째 예시의 글자수를 정확히 계산해야 한다', () => {
      const count = getCharacterCount(EXAMPLES[4]);
      expect(count).toBe(49);
      expect(formatCharacterCount(count)).toBe('49 글자');
    });

    it('여섯 번째 예시의 글자수를 정확히 계산해야 한다', () => {
      const count = getCharacterCount(EXAMPLES[5]);
      expect(count).toBe(54);
      expect(formatCharacterCount(count)).toBe('54 글자');
    });
  });

  describe('사용자 입력 흐름 시뮬레이션', () => {
    it('빈 입력 -> 타이핑 -> 삭제 흐름을 처리해야 한다', () => {
      // 빈 상태
      let input = '';
      expect(isValidPrompt(input)).toBe(false);
      expect(formatCharacterCount(getCharacterCount(input))).toBe('0 글자');

      // 한 글자 타이핑
      input = 'A';
      expect(isValidPrompt(input)).toBe(true);
      expect(formatCharacterCount(getCharacterCount(input))).toBe('1 글자');

      // 계속 타이핑
      input = 'Apple';
      expect(isValidPrompt(input)).toBe(true);
      expect(formatCharacterCount(getCharacterCount(input))).toBe('5 글자');

      // 모두 삭제
      input = '';
      expect(isValidPrompt(input)).toBe(false);
      expect(formatCharacterCount(getCharacterCount(input))).toBe('0 글자');
    });

    it('예시 클릭 후 글자수 업데이트를 처리해야 한다', () => {
      const example = '테스트 예시';
      const selected = handleExampleSelection(example);
      expect(isValidPrompt(selected)).toBe(true);
      expect(formatCharacterCount(getCharacterCount(selected))).toBe('6 글자');
    });
  });
});
