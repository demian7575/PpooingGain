# Web RPG Adventure 환경

웹 기반 RPG 어드벤처를 빠르게 시작할 수 있는 Vite + TypeScript 기반의 기본 환경입니다. 간단한 상태 UI와 선택 로그를 포함한 프로토타입 화면이 포함되어 있습니다.

## 시작하기

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

브라우저에서 `http://localhost:5173`에 접속하면 화면을 확인할 수 있습니다.

## 빌드

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 5173
```

## 다음 단계 아이디어

- 캐릭터 생성 UI 추가 및 능력치 배분
- 전투/탐험 이벤트 시스템 설계
- 아이템/퀘스트 데이터 관리 모듈화
- 백엔드 API 연결 (예: Fastify, Supabase 등)
