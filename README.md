berry-api
=========

```
     ______                       o  o
    / ____ |                     o  o  o
   / /___/ /  __   __,__  __,__   __  __ 
  / ____ <  / o_| / ____|/ ____| / / / /
 / /___/ / / <_  / /    / /     | |_/ /
/_______/ |___/ /_/    /_/     _|__  /
                              /_____/
```

## 개발 단계

1. 개발(development)
> 개별 개발자들이 자기 소유의 로컬 개발 장비로 개발하고 실행. 개발이 완료되면 2단계로...
2. 테스트(test)
> 로컬 개발 장비 또는 CI 서버에서 테스트를 실행. 테스트가 성공하고 모든 항목의 개발이 끝나면 3단계, 실패하거나 아직 개발해야할 항목이 남아 있으면 다시 1단계로...
3. 스테이징(staging)
> 공용 개발 장비로 실행 및 통합 테스트(QA/QC). QA/QC 통과하면 4단계, 실패하면 다시 1,2 단계로...
4. 상용(production)
> 실 서비스 장비로 실행

## 설정

> `config` 디렉토리 아래에 각 개발 단계별 설정이 있음.
> 특정 개발 단계의 설정이 공통 설정보다 우선함.

* 공통: `config/default.js`
* 개발: `config/development.js`
* 테스트: `config/test.js`
* 통합: `config/staging.js`
* 상용: `config/production.js`

### 로그 설정

`config.logger.logsDir`에 로그 파일을 보관할 디렉토리 설정.

* 접근 로그

`config.logger.accessLog`가 `true`면
접근 로그를 
`config.logger.accessLogFileName`에 지정한 이름의
파일에 기록(아니면 stdout)
단, 파일이름 중에 `TIMESTAMP`는 오늘의 `YYYY-MM-DD`로 대체됨.

* 에러 로그
`config.logger.errorLog`가 `true`면 에러 로그(console.log 등의 출력)를
`config.logger.errorLogFileName`에 지정한 이름의
파일에 기록(아니면 stdout/stderr)
단, 파일이름 중에 `TIMESTAMP`는 오늘의 `YYYY-MM-DD`로 대체됨.

## 테스트

* 개별 테스트

> `jake test:test[테스트파일이름]`

* 일괄 테스트

> `jake test:all` 또는 `npm test`

테스트 결과는 `docs/test-all.html`에 있음.

* 테스트 커버리지 리포트

> `jake test:coverage`

테스트 커버리지 리포트는 `docs/test-coverage.html`에 있음.

## 배포/실행

### 로컬 실행
> NODE_ENV=development

> `npm start` 또는 `node bin/launcher`

> `node lib/main`으로 실행하면 클러스터없이 실행(디버깅용).

### TODO: 통합 서버 배포/실행
> NODE_ENV=staging

1. 원격 git 저장소에 `STAGING` 브랜치에 머지/푸시하고,
> `git push origin STAGING`
2. 관리 서버에 `deploy` 명령을 내리고
> `curl http://localhost/astral/berry-dev/deploy`
3. 관리 서버에 `restart` 명령을 내리고
> `curl http://localhost/astral/berry-dev/restart`
4. 결과를 확인
> `curl http://localhost/astral/berry-dev/status`

### TODO: 상용 서버 배포/실행
> NODE_ENV=production

1. 원격 git 저장소에 `PRODUCTION` 브랜치에 머지/푸시하고,
> `git push origin PRODUCTION`
2. 관리 서버에 `deploy` 명령을 내림
> `curl http://localhost/astral/berry/deploy`
3. 관리 배포 서버에 `restart` 명령을 내림
> `curl http://localhost/astral/berry/restart`
4. 결과를 확인
> `curl http://localhost/astral/berry/status`

## 기타

### npm tasks

```
npm start
npm test
```

### jake tasks

```
$ jake -T
jake jslint:jslint     # jslint a js file  
jake jslint:all        # jslint all js files  
jake test:test         # test a mocha test-case  
jake test:all          # test all mocha test-cases  
jake test:coverage     # generate test coverage report  
jake thrift:checkout   # checkout thrift IDL files from remote git repository  
jake thrift:thrift     # generate js files for a thrift IDL file  
jake thrift:all        # generate js files for all thrift IDL files 
```

#### 소스 검증

* 개별 소스 검증

> `jake jslint:all`

* 일괄 소스 검증

> `jake jslint:jslint[소스파일이름]`

#### TBW: thirft 소스 생성

* ...


----
*may the source be with you...*
