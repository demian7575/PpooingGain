import './style.css';

type StatBlock = {
  hp: number;
  stamina: number;
  gold: number;
  level: number;
  strength: number;
  agility: number;
  intellect: number;
};

type Location = {
  id: string;
  name: string;
  description: string;
  options: string[];
};

type CharacterClass = '전사' | '마법사' | '도적';

type Item = {
  id: string;
  name: string;
  type: '소모품' | '장비' | '퀘스트';
  effect: string;
};

type Enemy = {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
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

const itemDatabase: Item[] = [
  {
    id: 'potion',
    name: '치유 물약',
    type: '소모품',
    effect: 'HP를 20 회복합니다.'
  },
  {
    id: 'dagger',
    name: '그림자 단검',
    type: '장비',
    effect: '민첩 +3, 선제 공격 확률 증가.'
  },
  {
    id: 'talisman',
    name: '안개의 부적',
    type: '퀘스트',
    effect: '숲속 유적의 문을 여는 열쇠.'
  }
];

const enemyTemplates: Enemy[] = [
  {
    id: 'wolf',
    name: '안개 늑대',
    hp: 60,
    maxHp: 60,
    attack: 8
  },
  {
    id: 'spirit',
    name: '숲의 정령',
    hp: 75,
    maxHp: 75,
    attack: 10
  }
];

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('앱 루트를 찾을 수 없습니다.');
}

const baseStats: StatBlock = {
  hp: 120,
  stamina: 80,
  gold: 45,
  level: 1,
  strength: 8,
  agility: 7,
  intellect: 6
};

const state = {
  location: locations[0],
  character: {
    name: '신입 모험가',
    class: '전사' as CharacterClass,
    stats: { ...baseStats }
  },
  unassignedPoints: 6,
  inventory: [itemDatabase[0], itemDatabase[2]],
  activeEnemy: { ...enemyTemplates[0] },
  log: [
    '모험의 시작입니다. 마을 광장에서 숨을 고르고 주변을 살펴보세요.'
  ]
};

const classDescriptions: Record<CharacterClass, string> = {
  전사: '튼튼한 방어와 근접 전투에 능합니다.',
  마법사: '마나와 주문으로 원거리 전투를 지배합니다.',
  도적: '빠른 기습과 회피에 특화되어 있습니다.'
};

const resetEnemy = () => {
  const next = enemyTemplates[Math.floor(Math.random() * enemyTemplates.length)];
  state.activeEnemy = { ...next };
};

const pushLog = (message: string) => {
  state.log.unshift(message);
  state.log = state.log.slice(0, 8);
};

const render = () => {
  const { location, character, log, inventory, activeEnemy, unassignedPoints } = state;
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
              <strong>${character.stats.hp}</strong>
            </div>
            <div>
              <span>ST</span>
              <strong>${character.stats.stamina}</strong>
            </div>
            <div>
              <span>Gold</span>
              <strong>${character.stats.gold}</strong>
            </div>
            <div>
              <span>Level</span>
              <strong>${character.stats.level}</strong>
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
        <section class="panel">
          <h2>캐릭터 생성</h2>
          <p class="hint">이름과 직업을 선택하고 능력치를 배분하세요.</p>
          <div class="field">
            <label for="character-name">이름</label>
            <input id="character-name" type="text" value="${character.name}" />
          </div>
          <div class="field">
            <label for="character-class">직업</label>
            <select id="character-class">
              ${(['전사', '마법사', '도적'] as CharacterClass[])
                .map(
                  (klass) =>
                    `<option value="${klass}" ${klass === character.class ? 'selected' : ''}>${klass}</option>`
                )
                .join('')}
            </select>
          </div>
          <p class="class-desc">${classDescriptions[character.class]}</p>
          <div class="stat-grid">
            <div>
              <span>힘</span>
              <strong>${character.stats.strength}</strong>
              <button type="button" data-stat="strength" ${
                unassignedPoints === 0 ? 'disabled' : ''
              }>+</button>
            </div>
            <div>
              <span>민첩</span>
              <strong>${character.stats.agility}</strong>
              <button type="button" data-stat="agility" ${
                unassignedPoints === 0 ? 'disabled' : ''
              }>+</button>
            </div>
            <div>
              <span>지능</span>
              <strong>${character.stats.intellect}</strong>
              <button type="button" data-stat="intellect" ${
                unassignedPoints === 0 ? 'disabled' : ''
              }>+</button>
            </div>
          </div>
          <p class="points">남은 포인트: ${unassignedPoints}</p>
          <button type="button" class="primary" data-action="save-character">캐릭터 확정</button>
        </section>
        <section class="panel">
          <h2>전투 시스템</h2>
          <p class="hint">현재 전투: ${activeEnemy.name}</p>
          <div class="enemy-status">
            <span>HP ${activeEnemy.hp} / ${activeEnemy.maxHp}</span>
            <div class="health-bar">
              <div style="width: ${(activeEnemy.hp / activeEnemy.maxHp) * 100}%"></div>
            </div>
          </div>
          <div class="choices">
            <button type="button" data-action="attack">공격</button>
            <button type="button" data-action="defend">방어</button>
            <button type="button" data-action="use-potion">물약 사용</button>
          </div>
        </section>
        <section class="panel">
          <h2>아이템 데이터베이스</h2>
          <ul class="item-list">
            ${itemDatabase
              .map(
                (item) => `
                  <li>
                    <strong>${item.name}</strong>
                    <span class="tag">${item.type}</span>
                    <p>${item.effect}</p>
                  </li>
                `
              )
              .join('')}
          </ul>
        </section>
        <section class="panel log">
          <h2>퀘스트 로그</h2>
          <ul>
            ${log
              .map((entry) => `<li>${entry}</li>`)
              .join('')}
          </ul>
        </section>
        <section class="panel">
          <h2>인벤토리</h2>
          <ul class="inventory">
            ${inventory
              .map((item) => `<li>${item.name} <span>${item.type}</span></li>`)
              .join('')}
          </ul>
          <button type="button" data-action="loot">전리품 획득</button>
        </section>
      </main>
      <footer class="footer">
        <span>다음 단계: 전투 애니메이션, 맵 탐험, 대화 시스템을 확장해보세요.</span>
      </footer>
    </div>
  `;

  const locationButtons = app.querySelectorAll<HTMLButtonElement>('button[data-option]');
  locationButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const option = button.dataset.option ?? '선택';
      pushLog(`${location.name}에서 "${option}"을 선택했습니다.`);
      if (location.id === 'village' && option.includes('여관')) {
        state.location = locations[1];
      } else if (location.id === 'village' && option.includes('숲길')) {
        state.location = locations[2];
        resetEnemy();
      } else if (location.id !== 'village' && option.includes('광장')) {
        state.location = locations[0];
      } else if (location.id === 'forest' && option.includes('마을')) {
        state.location = locations[0];
      }
      if (option.includes('식량')) {
        state.character.stats.stamina = Math.min(state.character.stats.stamina + 10, 100);
        state.character.stats.gold = Math.max(state.character.stats.gold - 5, 0);
        pushLog('여관에서 식량을 보충했습니다.');
      }
      if (option.includes('정찰')) {
        state.character.stats.stamina = Math.max(state.character.stats.stamina - 8, 0);
        pushLog('숲을 정찰하며 기력을 소모했습니다.');
      }
      render();
    });
  });

  const nameInput = app.querySelector<HTMLInputElement>('#character-name');
  const classSelect = app.querySelector<HTMLSelectElement>('#character-class');
  nameInput?.addEventListener('change', () => {
    state.character.name = nameInput.value.trim() || '신입 모험가';
  });
  classSelect?.addEventListener('change', () => {
    state.character.class = classSelect.value as CharacterClass;
    pushLog(`직업을 ${state.character.class}(으)로 선택했습니다.`);
    render();
  });

  const statButtons = app.querySelectorAll<HTMLButtonElement>('button[data-stat]');
  statButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const stat = button.dataset.stat as keyof StatBlock | undefined;
      if (!stat || state.unassignedPoints <= 0) {
        return;
      }
      state.character.stats[stat] += 1;
      state.unassignedPoints -= 1;
      render();
    });
  });

  const actionButtons = app.querySelectorAll<HTMLButtonElement>('button[data-action]');
  actionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (action === 'save-character') {
        pushLog(`${state.character.name} (${state.character.class}) 캐릭터가 확정되었습니다.`);
      }
      if (action === 'attack') {
        const damage = state.character.stats.strength + 4;
        state.activeEnemy.hp = Math.max(state.activeEnemy.hp - damage, 0);
        pushLog(`${state.activeEnemy.name}에게 ${damage}의 피해를 입혔습니다.`);
        if (state.activeEnemy.hp === 0) {
          pushLog(`${state.activeEnemy.name}을(를) 처치했습니다!`);
          state.character.stats.gold += 15;
          state.character.stats.level += 1;
          resetEnemy();
        } else {
          const enemyDamage = state.activeEnemy.attack;
          state.character.stats.hp = Math.max(state.character.stats.hp - enemyDamage, 0);
          pushLog(`${state.activeEnemy.name}의 반격! HP가 ${enemyDamage} 감소했습니다.`);
        }
      }
      if (action === 'defend') {
        const reduced = Math.max(state.activeEnemy.attack - 4, 2);
        state.character.stats.hp = Math.max(state.character.stats.hp - reduced, 0);
        pushLog(`방어 자세로 피해를 줄였습니다. (${reduced} 피해)`);
      }
      if (action === 'use-potion') {
        const potionIndex = state.inventory.findIndex((item) => item.id === 'potion');
        if (potionIndex >= 0) {
          state.inventory.splice(potionIndex, 1);
          state.character.stats.hp = Math.min(state.character.stats.hp + 20, 140);
          pushLog('치유 물약을 사용해 HP를 회복했습니다.');
        } else {
          pushLog('사용할 수 있는 물약이 없습니다.');
        }
      }
      if (action === 'loot') {
        const loot = itemDatabase[Math.floor(Math.random() * itemDatabase.length)];
        state.inventory.push(loot);
        pushLog(`${loot.name}을(를) 획득했습니다.`);
      }
      render();
    });
  });
};

render();
