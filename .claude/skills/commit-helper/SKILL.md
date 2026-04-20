---
name: commit-helper
description: 변경사항을 분석하여 컨벤션에 맞는 커밋 메시지를 작성하고 커밋을 수행합니다. 사용자가 "커밋해줘", "변경사항 저장", "commit" 등의 요청을 할 때 자동으로 사용됩니다. git diff를 분석해서 변경사항을 논리적 단위로 분류하고, 한국어 커밋 메시지(feat/fix/refactor/chore 등)를 제안한 후 사용자 승인 하에 커밋합니다.
compatibility: git, bash
---

# Commit Helper

변경사항을 자동으로 분석하고 컨벤션을 따르는 커밋을 생성합니다.

## 동작 흐름

1. **변경사항 분석** — `git diff` 및 `git status`로 현재 변경사항 파악
2. **타입 분류** — 파일 변경의 성질을 분석해 커밋 타입 결정
   - `feat`: 새 기능 추가
   - `fix`: 버그 수정
   - `refactor`: 코드 구조 변경 (기능 변화 없음)
   - `chore`: 빌드, 설정, 의존성 변경
   - `docs`: 문서 변경
   - `design`: UI/스타일 변경
   - `perf`: 성능 개선
   - `test`: 테스트 추가/수정
3. **메시지 제안** — 규칙에 맞는 커밋 메시지 제안
4. **사용자 승인** — 메시지 검토 후 사용자 동의 확인
5. **커밋 실행** — `git commit`으로 변경사항 저장

## 커밋 메시지 포맷

```
<type>(<scope>): <subject>

<body>

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

### 규칙

- **type**: 위의 분류에 따른 타입 (소문자)
- **scope** (선택): 영향을 받는 영역 (UI, API, 설정 등)
- **subject**: 한국어로 60자 이내, 명령형 현재형
- **body** (선택): 변경의 이유와 결과 설명
- **Co-Authored-By**: 항상 포함

### 예시

```
feat(UI): 다크 테마 지원 추가

사용자가 시스템 설정에 따라 다크 테마를 자동 적용할 수 있도록 했습니다.
- prefers-color-scheme 미디어 쿼리 감지
- localStorage에 사용자 선택 저장
- 초기 로드 시 깜빡임 방지

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

```
fix: 로그인 폼 유효성 검사 오류 수정

이메일 필드가 빈 상태에서도 폼이 제출되던 버그를 수정했습니다.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

## 변경사항 분류

스킬은 다음과 같이 변경사항을 자동으로 분류합니다:

| 패턴 | 타입 |
|------|------|
| src/\*.{css,scss} 추가/변경 | design |
| src/\*.{tsx,jsx,ts,js} 추가 | feat |
| 기존 src/\*.{tsx,jsx,ts,js} 기능 수정 | fix (또는 refactor) |
| 구조 개선, 변수명 변경 등 | refactor |
| package.json, .env, 설정 파일 변경 | chore |
| README, docs 변경 | docs |
| \*.test.tsx, \*.spec.ts 변경 | test |

## 사용 시기

다음과 같은 상황에서 자동으로 이 스킬을 사용하세요:

- 파일 수정 후 "커밋해줘"라고 요청할 때
- "변경사항 저장해줘"라고 말할 때
- "이 변경사항 커밋하고 싶은데 메시지 도와줄 수 있어?"라고 할 때
- Claude Code에서 파일을 수정하고 커밋이 필요할 때

## 주의사항

1. **커밋 전 확인** — 스킬은 항상 메시지를 보여주고 사용자 승인을 기다립니다. 자동으로 커밋하지 않습니다.

2. **변경사항 없음** — `git status`가 clean인 경우 경고를 표시합니다.

3. **Staged vs Unstaged** — 스킬은 모든 변경사항(staged + unstaged)을 분석합니다. 필요시 부분적 커밋을 원하는 사용자를 위해 먼저 staging 안내를 합니다.

4. **merge conflict** — 충돌 중이면 커밋을 진행하지 않습니다.

5. **여러 커밋** — 변경사항이 서로 다른 타입이면 여러 커밋으로 나눌지 하나로 할지 사용자에게 물어봅니다.
