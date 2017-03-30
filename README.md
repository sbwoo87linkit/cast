# nanum

나눔기술-모비젠 B-IRIS 개발 협업을 위한 repository


## 프로젝트 시작하는 방법
아래 작업은 linux 또는 max os terminal 기준으로 작성되었습니다.

### 순서
1. Git clone
2. Node.js 설치
3. Node.js 패키지 설치
4. gulp 설치
5. JavaScript 빌드
6. 서버 실행


### Git clone
`git clone`을 수행하여 프로젝트를 받습니다.
ex)
```sh
git clone git@github.com:mobigen/nanum.git
```


### Node.js 설치
Node.js LTS 버전을 설치합니다. (sudoer 권한 필요)
* [Node.js 홈페이지](https://nodejs.org/ko/)


### Node.js 패키지 설치
프로젝트 최상단(루트) 위치에서 `npm install`을 실행합니다.
```sh
npm install
```


### Gulp 설치
Gulp를 설치합니다. (sudoer 권한 필요)
* [Gulp 홈페이지](http://gulpjs.com/)

```sh
npm install gulp-cli -g
npm install gulp -D
```


### JavaScript 빌드
gulp를 이용하여 .js 파일들을 하나의 파일로 빌드합니다.
`spring/src/main/javascript/` 폴더의 파일들을 대상으로 합니다.
```sh
gulp build
```


### 서버 실행
Node.js 서버를 실행합니다.
```sh
node node/www.js [port_number] # default port_number: 3030
```

서버가 정상적으로 실행되었다면 아래 주소로 웹 페이지 접속이 가능합니다.

http://localhost:3030/


### 정리
```sh
git clone git@github.com:mobigen/nanum.git
npm install
npm install gulp-cli -g
npm install gulp -D
gulp build
node node/www.js
```



## 개발 시에는...
`gulp build`는 Browserify를 사용하여 패키지/모듈을 모두 하나로 합치는 명령어입니다.
개발시에 이 과정을 반복하면 시간이 오래 걸리므로, 아래와 같이 하면 개발 시간을 단축할 수 있습니다.

1. `gulp build` 명령 수행 (한 번만)
2. background로 node 서버 실행
  * `node node/www.js`
  * `pm2 start node/node.js --name=nanum` (pm2 설치 필요)
3. `gulp` 명령 수행 (foreground)
4. .js 파일 수정
5. 브라우저 웹 페이지 새로고침(F5)

이후에는 .js 파일을 변경할 때마다 `gulp` 프로세스가 이를 감지하여
자동으로 .min.js 파일을 갱신하고, 브라우저에서 F5 등으로 새로고침을 하면
변경내역이 반영이 됩니다.
