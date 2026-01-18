import './style.css';

type StatBlock = {
  hp: number;
  stamina: number;
  gold: number;
  level: number;
};

type Location = {
  id: string;
  name: string;
  description: string;
  options: string[];
};

const locations: Location[] = [
  {
    id: 'village',
    name: '안개 마을 광장',
    description:
      '정적이 감도는 마을 광장. 우물 곁에 낡은 게시판이 있고, 모험가들의 흔적이 남아 있습니다.',
    options: ['게시판 살펴보기', '여관으로 이동', '숲길로 나가기']
  },
  {
    id: 'inn',
    name: '구름 여관',
    description:
      '따뜻한 벽난로와 잔잔한 음악이 흐르는 공간. 다음 여정에 대한 소문이 오갑니다.',
    options: ['수상한 소문 듣기', '식량 보충', '광장으로 돌아가기']
  },
  {
    id: 'forest',
    name: '푸른 숲길',
    description:
      '숲속 안개 너머로 고대 유적의 실루엣이 보입니다. 전투가 기다릴지도 모릅니다.',
    options: ['주변을 정찰', '임시 캠프 설치', '마을로 귀환']
  }
];

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('앱 루트를 찾을 수 없습니다.');
}

const state = {
  location: locations[0],
  stats: {
    hp: 120,
    stamina: 80,
    gold: 45,
    level: 1
  } satisfies StatBlock,
  log: [
    '모험의 시작입니다. 마을 광장에서 숨을 고르고 주변을 살펴보세요.'
  ]
};

const render = () => {
  const { location, stats, log } = state;
  app.innerHTML = `
    <div class="shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Web RPG Adventure</p>
          <h1>안개 너머의 서막</h1>
          <p class="subtitle">탐험, 선택, 성장에 초점을 둔 2D 기반 웹 RPG를 시작할 수 있는 기본 환경입니다.</p>
        </div>
        <div class="status-card">
          <h2>플레이어 상태</h2>
          <div class="stats">
            <div>
              <span>HP</span>
              <strong>${stats.hp}</strong>
            </div>
            <div>
              <span>ST</span>
              <strong>${stats.stamina}</strong>
            </div>
            <div>
              <span>Gold</span>
              <strong>${stats.gold}</strong>
            </div>
            <div>
              <span>Level</span>
              <strong>${stats.level}</strong>
            </div>
          </div>
        </div>
      </header>
      <main class="grid">
        <section class="panel">
          <h2>${location.name}</h2>
          <p>${location.description}</p>
          <div class="choices">
            ${location.options
              .map((option) => `<button type="button" data-option="${option}">${option}</button>`)
              .join('')}
          </div>
        </section>
        <section class="panel log">
          <h2>퀘스트 로그</h2>
          <ul>
            ${log
              .slice(0, 6)
              .map((entry) => `<li>${entry}</li>`)
              .join('')}
          </ul>
        </section>
      </main>
      <footer class="footer">
        <span>다음 단계: 캐릭터 생성, 전투 시스템, 아이템 데이터베이스를 추가하세요.</span>
      </footer>
    </div>
  `;

  const buttons = app.querySelectorAll<HTMLButtonElement>('button[data-option]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const option = button.dataset.option ?? '선택';
      state.log.unshift(`${location.name}에서 "${option}"을 선택했습니다.`);
      if (location.id === 'village' && option.includes('여관')) {
        state.location = locations[1];
      } else if (location.id === 'village' && option.includes('숲길')) {
        state.location = locations[2];
      } else if (location.id !== 'village' && option.includes('광장')) {
        state.location = locations[0];
      } else if (location.id === 'forest' && option.includes('마을')) {
        state.location = locations[0];
      }
      if (option.includes('식량')) {
        state.stats.stamina = Math.min(state.stats.stamina + 10, 100);
        state.stats.gold = Math.max(state.stats.gold - 5, 0);
      }
      if (option.includes('정찰')) {
        state.stats.stamina = Math.max(state.stats.stamina - 8, 0);
      }
      render();
    });
  });
};

render();
