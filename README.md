# Web RPG Adventure 환경

웹 기반 RPG 어드벤처를 빠르게 시작할 수 있는 Vite + TypeScript 기반의 기본 환경입니다. 캐릭터 생성, 전투 시스템, 아이템 데이터베이스가 포함된 프로토타입 화면을 제공합니다.

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

- 캐릭터 외형 커스터마이징 및 스킬 트리 구성
- 전투 애니메이션과 보스 패턴 설계
- 아이템 제작/강화 시스템 구축
- 백엔드 API 연결 (예: Fastify, Supabase 등)
