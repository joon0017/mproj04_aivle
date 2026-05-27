# Project Notion link
[노션 링크](https://www.notion.so/AI-368de926c009803ab4e0d37791325d49)

# AI 도서관리 시스템

React와 Vite로 만든 도서 관리 웹 애플리케이션입니다. `json-server`를 로컬 데이터 API로 사용하며, 도서 목록 조회, 검색, 정렬, 상세 보기, 등록, 수정, 삭제, AI 표지 이미지 생성 기능을 제공합니다.

## 주요 기능

- 도서 목록을 책장 형태의 그리드 UI로 조회
- 제목, 저자, 출판사, 도서 유형, ISBN, 출판연도 기준 검색
- 제목순, 저자순, 최근 등록순 정렬
- 선택한 도서의 상세 정보 확인
- 도서 더블클릭 시 상세 모달 표시
- 신규 도서 등록
- 기존 도서 정보 수정
- 도서 삭제
- OpenAI API Key를 입력해 도서 정보 기반 AI 표지 이미지 생성

## 기술 스택

- React 19
- Vite
- CSS
- json-server
- OpenAI Images API

## 프로젝트 구조

```text
src/
  App.jsx                    # 전체 상태 관리와 주요 이벤트 처리
  main.jsx                   # React 앱 진입점
  pages/
    MainPage.jsx             # 메인 도서 관리 화면
    BookFormPage.jsx         # 도서 등록/수정 화면
  components/
    ShelfSection.jsx         # 책장 섹션
    ShelfBookItem.jsx        # 책장 도서 아이템
    BookDetailsPanel.jsx     # 우측 상세 정보 패널
    BookDetailModal.jsx      # 도서 상세 모달
    ApiKey.jsx               # API Key 입력 컴포넌트
    SearchArea.jsx           # 검색 UI 컴포넌트
  assets/                    # 이미지 리소스
db.json                      # json-server 도서 데이터
vite.config.js               # Vite 설정
```

## 실행 방법

패키지를 설치합니다.

```bash
npm install
```

로컬 데이터 서버를 실행합니다.

```bash
npx json-server --watch db.json --port 3000
```

새 터미널에서 개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 Vite가 안내하는 로컬 주소로 접속합니다. 일반적으로 `http://localhost:5173`에서 확인할 수 있습니다.

## 데이터 구조

`db.json`의 `books` 배열을 기준으로 도서 데이터를 관리합니다.

```json
{
  "id": "1",
  "title": "도서 제목",
  "author": "저자",
  "publisher": "출판사",
  "year": 2026,
  "type": "단행본",
  "isbn": "ISBN 번호",
  "description": "도서 설명",
  "coverUrl": "표지 이미지 URL 또는 base64 데이터",
  "createdAt": "2026-05-27T00:00:00.000Z"
}
```

## 화면 흐름

- 앱 시작 시 `http://localhost:3000/books`에서 도서 목록을 불러옵니다.
- 메인 화면에서 도서를 클릭하면 우측 상세 패널이 갱신됩니다.
- 같은 도서를 다시 클릭하거나 도서를 더블클릭하면 상세 모달이 열립니다.
- `신규 도서 등록` 버튼을 누르면 등록 화면으로 이동합니다.
- 상세 패널의 수정 버튼을 누르면 선택한 도서 정보를 수정할 수 있습니다.
- 삭제 버튼은 `json-server`의 해당 도서 데이터를 삭제합니다.

## AI 표지 이미지 생성

등록/수정 화면에서 OpenAI API Key를 입력한 뒤 AI 이미지 미리보기를 실행하면, 입력한 도서 제목, 저자, 출판사, 설명을 기반으로 표지 이미지를 생성합니다. 생성된 이미지는 `coverUrl` 값으로 저장되어 목록과 상세 화면에서 사용됩니다.

API Key는 화면 입력값으로만 사용되며 별도의 환경 변수 파일에는 저장하지 않습니다.

## 참고 사항

- `json-server`가 3000번 포트에서 실행 중이어야 도서 조회, 등록, 수정, 삭제가 정상 동작합니다.

- `db.json`에는 base64 이미지 데이터가 포함될 수 있어 파일 크기가 커질 수 있습니다.
