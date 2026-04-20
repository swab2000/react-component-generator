#!/bin/bash

# 테스트 파일 존재 여부 검사 스크립트
# 목적: src/ 폴더의 .ts/.tsx 파일 수정 시 대응 테스트 파일 확인
# 호환성: bash, sh, zsh (크로스플랫폼)

# JSON 입력 읽기 (stdin에서)
input_json=$(cat)

# 빈 입력 방어
if [ -z "$input_json" ]; then
  exit 0
fi

# JSON에서 file_path 추출 (Node.js 대신 grep/sed 사용)
# jq가 없는 환경을 고려해 기본 정규식 사용
file_path=$(echo "$input_json" | grep -o '"file_path":"[^"]*' | cut -d'"' -f4)

# 빈 파일경로 방어
if [ -z "$file_path" ]; then
  exit 0
fi

# 경로 필터링: src/ 포함 여부 확인
if ! echo "$file_path" | grep -qE '[/\\]src[/\\]'; then
  exit 0
fi

# 확장자 필터링 (.ts, .tsx)
if ! echo "$file_path" | grep -qE '\.(ts|tsx)$'; then
  exit 0
fi

# 테스트 파일 제외 (.test.ts, .test.tsx)
if echo "$file_path" | grep -qE '\.test\.(ts|tsx)$'; then
  exit 0
fi

# 테스트 파일 경로 계산
base_path=$(echo "$file_path" | sed -E 's/\.(ts|tsx)$//')
test_path_ts="${base_path}.test.ts"
test_path_tsx="${base_path}.test.tsx"

# 테스트 파일 존재 여부 확인
test_exists=false
if [ -f "$test_path_ts" ] || [ -f "$test_path_tsx" ]; then
  test_exists=true
fi

# 없으면 경고 출력 (stderr로)
if [ "$test_exists" = false ]; then
  echo "⚠ 테스트 파일 없음: $file_path" >&2
fi

exit 0
