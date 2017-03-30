##

## card 구조체
```javascript
{
    // 카드 아이디
    id: 'dd9a8ac0-0396-11e7-abf2-3f1ea42094ae',
    // 현재 차트 타입
    chartType: 'heatmap',
    // 최대화 여부
    isMaxSize: false,
    // 작업 실행 상태
    state: {
        running: true,
        success: false,
        error: false,
        // 카드별 프로그레스바에서 사용
        current: 0,
        total: 1
    },
    // 다이얼로그 등으로 설정한 ADE 옵션(params)
    adeOptions: options,
    // 카드 데이터
    data: {}
}
```

## options 구조체

```javascript
{
    // 제목
    title: 'Untitled 01',
    // 키 필드
    keyFields: [
        {
            field: { name: 'ENB_ID', type: 'NUMBER' },
            label: '기지국',
            values: '22590, 23211, 23304'
        },
        {
            field: { name: 'CELL_ID', type: 'NUMBER' }
        }
    ],
    // 최대 키 개수
    limit_num: 100,
    // 값 필드
    valFields: [
        {
            field: { name: '시도수', type: 'NUMBER' },
            func: 'sum'
        },
        {
            field: { name: 'HO_성공률', type: 'NUMBER' },
            func: 'count',
            min: 15,
            max: 75,
            excludes: '15, 22, 54'
        }
    ],
    // 모델
    model: 'SPC',
    // 없는 Key 값: 이상상황 처리 여부
    includeNewKey: false,
    // 결측치
    missingValue: 'custom_value',
    // 결측치: 사용자 지정 값
    customMissingValue: 'UNDEFINED',
    // 비교 기간
    comTimeRange: {
        start: 1487896625527,
        end: 1487896625527
    },
    // 참조 기간
    refTimeRange: {
        start: 1487896625527,
        end: 1487896625527
    },
    // 시간 단위
    timeUnit: '1h',
    // 시간대: 일치 여부
    isMatchTimezone: true,
    // 요일 분류
    dateClassification: 'sameday'
}
```
