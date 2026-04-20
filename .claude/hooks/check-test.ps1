# 테스트 파일 존재 여부 검사 스크립트
# 목적: src/ 폴더의 .ts/.tsx 파일 수정 시 대응 테스트 파일 확인

try {
    # stdin에서 JSON 읽기
    $input_json = [Console]::In.ReadToEnd()

    # 빈 입력 방어
    if ([string]::IsNullOrWhiteSpace($input_json)) {
        exit 0
    }

    # JSON 파싱
    $data = $input_json | ConvertFrom-Json
    $file_path = $data.tool_input.file_path

    # 빈 파일경로 방어
    if ([string]::IsNullOrWhiteSpace($file_path)) {
        exit 0
    }

    # 경로 필터링: src/ 포함 여부 확인
    if (-not ($file_path -match '[\\/]src[\\/]')) {
        exit 0
    }

    # 확장자 필터링
    if (-not ($file_path -match '\.(ts|tsx)$')) {
        exit 0
    }

    # 테스트 파일 제외 (.test.ts, .test.tsx)
    if ($file_path -match '\.test\.(ts|tsx)$') {
        exit 0
    }

    # 테스트 파일 경로 계산
    $base_path = $file_path -replace '\.(ts|tsx)$', ''
    $test_path_ts = "$base_path.test.ts"
    $test_path_tsx = "$base_path.test.tsx"

    # 테스트 파일 존재 여부 확인
    $test_exists = (Test-Path -LiteralPath $test_path_ts) -or (Test-Path -LiteralPath $test_path_tsx)

    # 없으면 경고 출력
    if (-not $test_exists) {
        [Console]::Error.WriteLine("⚠ 테스트 파일 없음: $file_path")
    }

    exit 0
}
catch {
    # 에러 발생해도 항상 exit 0으로 종료 (작업 차단 금지)
    exit 0
}
