
## Fetch Results

#### URL

- `/angora/ade/jobs/[sid]`

#### Method

- `GET`

#### Description

- ADE 결과를 반환 합니다.

#### Output Format

- Keys

  | Keys       | Description                                             | Format  |
  |:--------------: | ------------------------------------------------------- |:--------:|
  | `status`        | 진행 상태를 의미합니다. `current` 와 `total`의 키를 갖고 있습니다. | JSON object |
  | `fields`        | 각종 ADE에 필요한 필드 이름을 구분하여 담고 있습니다.               | JSON object  |
  | `results`       | 결과 값을 nested JSON array 형식으로 갖고 있습니다.             | JSON array |

- `fields`

  | Keys         | Description                                             | Format  |
  |:-------------: | ----------------------------------------------------- |:--------:|
  | `keys`         | 이상 탐지에 사용된 키들의 이름을 갖고 있습니다.                  | JSON array |
  | `keys`         | 이상 탐지에 사용된 값들의 이름을 갖고 있습니다.                  | JSON array |
  | `time_fields`  | 이상 탐지에 사용된 시간을 나타네는 필드 명을 갖고 있습니다.         | JSON array |
  | `ucl`          | 계산된 각 필드별 상한치를 나타네는 필드 명을 갖고 있습니다.. | JSON array |
  | `lcl`          | 계산된 각 필드별 하한치를 나타네는 필드 명을 갖고 있습니다.   | JSON array |
  | `variance`     | 상한치 또는 하한치가 없을 경우, 이상 탐지에 사용 될 값을 갖고 있습니다. SPC의 경우에는 표준 편차 값을 갖고 있고, IQR의 경우에는 IQR값을 갖고 있습니다. 중앙 값을 나타냅니다.     | JSON array |
  | `center`       | 상한치 또는 하한치가 없을 경우, 이상 탐지에 사용 될 값을 갖고 있습니다. SPC 모델의 경우 평균 값을 갖고 있으며, IQR의 경우에는 중간 값을 갖고 있는 필드들의 목록 입니다.| JSON array |
  | `zscore`       | Z-score 값을 지니고 있습니다. 이상 정도를 나타냅니다.        | JSON array |
  | `code`       | 알람의 종류를 들고 있는 필드 명을 의미합니다. <br/> `Q1_U` (IQR 상한치 초과) <br/>  `Q1_L` (IQR 하한치 초과)  <br/>  `N1_U` (상한치 하한치를 구하지 못하였을 경우, 평균 (SPC) 혹은 max (IQR) 보다 큰 경우) <br/> `N1_L` (상한치 하한치를 구하지 못하였을 경우, 평균 (SPC) 혹은 min (IQR) 보다 작은 경우) <br/> `S1_U` (SCP 상한치 초과) <br/> `S1_L`  (SCP 하한치 초과) <br/> `F1` (참조 데이터에 값이 존재하지 않는 경우)  | JSON array |
  | `all`          | 모든 필드의 목록을 갖고 있습니다.         | JSON array |


#### Example

- Request

  ```bash
    curl -XGET "http://localhost:6036/angora/ade/jobs/1461649586.1695"
  ```

- Response

  ```javascript
    {
    "status": {
        "current": 1,
        "total": 1
    },
    "fields": {
      "time_fields": ["FTS_PARTITION_TIME"],
      "keys": ["PLAYERID"],
      "values": ["avg(HR)"],
      "ucl": ["ucl_avg(HR)"],
      "lcl": ["lcl_avg(HR)"],
      "variance": ["variance_avg(HR)"],
      "center": ["center_avg(HR)"],
      "score": ["score"],
      "code": ["code_avg(HR)"],
      "all": [
        {
          "name": "FTS_PARTITION_TIME",
          "type": "text"
        },
        {
          "name": "PLAYERID",
          "type": "text"
        },
        {
          "name": "avg(HR)",
          "type": "number"
        },
        {
          "name": "ucl_avg(HR)",
          "type": "number"
        },
        {
          "name": "lcl_avg(HR)",
          "type": "number"
        },
        {
          "name": "center_avg(HR)",
          "type": "number"
        },
        {
          "name": "variance_avg(HR)",
          "type": "number"
        },
        {
          "name": "score",
          "type": "number"
        },
        {
          "name": "code_avg(HR)",
          "type": "number"
        }
      ]
    },
    "results": [
      // 'holloke01'는 1월 1일에는 항상 홈런을 1개만 쳤었는데, 해당 일에도 역시 1개를 쳤다. UCL/LCL은 표준편차를 기반으로 하기 때문에, 변동이 없어 구할 수 없었으나, `center_avg(HR)`를 보니, 1개 이고, 'avg(HR)'과 일치함으로 정상이다.
      ["20100101000000", "holloke01", 1,  0,    0,   1,    1,   null, null],

      // 'adamssp01'는 1월 1일에는 항상 홈런을 1개만 쳤었는데, 해당 일에는 치지 못했다. UCL/LCL은 표준편차를 기반으로 하기 때문에, 변동이 없어 구할 수 없었으나, `center_avg(HR)`를 보니, 1개 이고, 'avg(HR)'보다 낮음으로 'N1_L' 알람 / 비정상이다. 'N1' 알람에 대해서는 항상 1의 score가 주어진다.
      ["20100101000000", "adamssp01", 1,  0,    0,   0,    1,   1, "N1_L"],

      // 'cldrivi01'는 LCL/UCL 안에 속해있는 5개의 홈런을 쳤다. UCL/LCL 의 범위 안에 있기 때문에 정상이다.
      ["20100101000000", "cldrivi01", 5,  7,    3,   4.5,  3.5, 0.14, null],

      // 'holloke01'는 2010년 4월 14일 출전 경기가 처음이라 데이터가 없다. 'F1' 에 대해서는 항상 2의 score가 주어진다.
      ["20100102000000", "holloke01", 1,  null, null, null, null, 2, "F1"],

      // 'adamssp01'는 홈런을 11개를 쳤는데, UCL인 10.1을 초과했다. 따라서 이상값 이며 알람은 'S1_U' 이다.
      ["20100102000000", "adamssp01", 11, 10.1, 3.3, 5.5, 4.5, 3.22, "S1_U"],

      // 아래는 정상의 경우이다.
      ["20100102000000", "cldrivi01", 5, 5.1,  4.2, 3.5, 4,   1.37, null],
      ["20100103000000", "holloke01", 3, 3.3,  0.5, 2,   2.1, 0.45, null],
      ["20100103000000", "adamssp01", 9, 10.5, 1.1, 6,   5.3, 2.56, null],
      ["20100103000000", "cldrivi01", 3, 5.1,  2.4, 3.2, 4.4, 0.74, null]
    ]
  }
  ```

- Hitmap 예제 - min (정상): 0.14, max (비정상): 3.22. 3을 넘으면 비정상 값으로 간주

  |                | holloke01      | adamssp01      | cldrivi01      |
  |:--------------:|:--------------:|:--------------:|:--------------:|
  | 20100101000000 | null           | 1              | 0.14           |
  | 20100102000000 | 2              | 3.22           | 1.36           |
  | 20100103000000 | 0.45           | 2.56           | 0.74           |


- Response

  ```javascript
    {
    "status": {
        "current": 1,
        "total": 1
    },
    "fields": {
      "time_fields": ["FTS_PARTITION_TIME"],
      "keys": ["PLAYERID", "LGID"],
      "values": ["avg(HR)"],
      "ucl": ["ucl_avg(HR)"],
      "lcl": ["lcl_avg(HR)"],
      "variance": ["variance_avg(HR)"],
      "center": ["center_avg(HR)"],
      "score": ["score"],
      "code": ["code_avg(HR)"],
      "all": [
        {
          "name": "FTS_PARTITION_TIME",
          "type": "text"
        },
        {
          "name": "PLAYERID",
          "type": "text"
        },
        {
          "name": "LGID",
          "type": "text"
        },
        {
          "name": "avg(HR)",
          "type": "number"
        },
        {
          "name": "ucl_avg(HR)",
          "type": "number"
        },
        {
          "name": "lcl_avg(HR)",
          "type": "number"
        },
        {
          "name": "center_avg(HR)",
          "type": "number"
        },
        {
          "name": "variance_avg(HR)",
          "type": "number"
        },
        {
          "name": "score",
          "type": "number"
        },
        {
          "name": "code_avg(HR)",
          "type": "number"
        }
      ]
    },
    "results": [
      ["20100101000000", "NL", "holloke01", 1,  0,    0,   1,    1,   null, null],
      ["20100101000000", "AL", "adamssp01", 1,  0,    0,   0,    1,   1, "N1_L"],
      ["20100101000000", "NL", "cldrivi01", 5,  7,    3,   4.5,  3.5, 0.14, null],
      ["20100102000000", "AL", "holloke01", 1,  null, null,null, null, 2, "F1"],
      ["20100102000000", "AL", "adamssp01", 11, 10.1, 3.3, 5.5, 4.5, 3.22, "S1_U"],
      ["20100102000000", "NL", "cldrivi01", 5, 5.1,  4.2, 3.5, 4,   1.37, null],
      ["20100103000000", "NL", "holloke01", 3, 3.3,  0.5, 2,   2.1, 0.45, null],
      ["20100103000000", "AL", "adamssp01", 9, 10.5, 1.1, 6,   5.3, 2.56, null],
      ["20100103000000", "AL", "cldrivi01", 3, 5.1,  2.4, 3.2, 4.4, 0.74, null]
    ]
  }
  ```

- Hitmap 예제 - min (정상): 0.14, max (비정상): 3.22. 3을 넘으면 비정상 값으로 간주

  |                | holloke01, NL  | holloke01, AL  | adamssp01, NL  | adamssp01, AL  | cldrivi01, NL  | cldrivi01, AL  |
  |:--------------:|:--------------:|:--------------:|:--------------:|:--------------:|:--------------:|:--------------:|
  | 20100101000000 | null           | null           | null           | 1              | 0.14           | null           |
  | 20100102000000 | null           | 2              | null           | 3.22           | 1.37           | null           |
  | 20100103000000 | 0.45           | null           | null           | 2.56           | null           | 0.74           |



- Response

  ```javascript
    {
    "status": {
        "current": 1,
        "total": 1
    },
    "fields": {
      "time_fields": ["FTS_PARTITION_TIME"],
      "keys": ["PLAYERID"],
      "values": ["avg(HR)", "avg(STINT)"],
      "ucl": ["ucl_avg(HR)", "ucl_avg(STINT)"],
      "lcl": ["lcl_avg(HR)", "lcl_avg(STINT)"],
      "variance": ["variance_avg(HR)", "variance_avg(STINT)"],
      "center": ["center_avg(HR)", "center_avg(STINT)"],
      "score": ["score"],
      "code": ["code_avg(HR)", "code_avg(STINT)"],
      "all": [
        {
          "name": "FTS_PARTITION_TIME",
          "type": "text"
        },
        {
          "name": "PLAYERID",
          "type": "text"
        },
        {
          "name": "avg(HR)",
          "type": "number"
        },
        {
          "name": "avg(STINT)",
          "type": "number"
        },
        {
          "name": "ucl_avg(HR)",
          "type": "number"
        },
        {
          "name": "ucl_avg(STINT)",
          "type": "number"
        },
        {
          "name": "lcl_avg(HR)",
          "type": "number"
        },
        {
          "name": "lcl_avg(STINT)",
          "type": "number"
        },
        {
          "name": "center_avg(HR)",
          "type": "number"
        },
        {
          "name": "center_avg(STINT)",
          "type": "number"
        },
        {
          "name": "variance_avg(HR)",
          "type": "number"
        },
        {
          "name": "variance_avg(STINT)",
          "type": "number"
        },
        {
          "name": "score",
          "type": "number"
        },
        {
          "name": "code_avg(HR)",
          "type": "number"
        },
        {
          "name": "code_avg(STINT)",
          "type": "number"
        }
      ]
    },
    "results": [
      ["20100101000000", "holloke01", 1,  1, 0,   0,   0,   0,   1,   1,   1,   1,   null, null,  null],
      ["20100101000000", "adamssp01", 1,  1, 0,   0,   0,   0,   0,   0,   1,   1,   1,    "N1_L","N1_L"],
      ["20100101000000", "cldrivi01", 5,  5, 7,   7,   3,   3,   4.5, 4.5, 3.5, 3.5, 0.14, null,  null],
      ["20100102000000", "holloke01", 1,  1, null,null,null,null,null,null,null,null,2,   "F1",   "F1"],
      ["20100102000000", "adamssp01", 11, 11,10.1,10.1,3.3, 3.3, 5.5, 5.5, 4.5, 4.5, 3.22, "S1_U","S1_U"],
      ["20100102000000", "cldrivi01", 5,  5, 5.1, 5.1, 4.2, 4.2, 3.5, 3.5, 4,   4,   1.37, null,  null],
      ["20100103000000", "holloke01", 3,  3, 3.3, 3.3, 0.5, 0.5, 2,   2,   2.1, 2.1, 0.45, null,  null],
      ["20100103000000", "adamssp01", 9,  9, 10.5,10.5,1.1, 1.1, 6,   6,   5.3, 5.3, 2.56, null,  null],
      ["20100103000000", "cldrivi01", 3,  3, 5.1, 5.1, 2.4, 2.4, 3.2, 3.2, 4.4, 4.4, 0.74, null,  null]
    ]
  }
  ```

- Hitmap 예제 - min (정상): 0.14, max (비정상): 3.22. 3을 넘으면 비정상 값으로 간주

  |                | holloke01      | adamssp01      | cldrivi01      |
  |:--------------:|:--------------:|:--------------:|:--------------:|
  | 20100101000000 | null           | 1              | 0.14           |
  | 20100102000000 | 2              | 3.22           | 1.36           |
  | 20100103000000 | 0.45           | 2.56           | 0.74           |


- Exception :

  ```json
    {
      "type": "RuntimeError",
      "message": "This was failed because..."
    }
  ```
