/**
 * 員林家商圖書館密室逃脫 - 全域通訊與狀態控制核心 (App Core)
 * 支援：GitHub Pages 靜態託管 + Firebase 跨裝置即時通訊 (WebSockets)
 */

// 題目解答資料庫 (員林家商專屬)
const GAME_LEVELS = [
  {
    level: 1,
    title: "關卡一：館舍尋蹤與守護法則",
    location: "1 樓 閱覽室 / 自主學習空間",
    answer: "1820",
    hint: "提示：請查看 1 樓樓層 (1)、書籍上限 (8)、借期週數 (2)、當期雜誌可借 (0)。密碼組合：1820",
    question: "請輸入 1 樓館舍導覽圖與借閱規定算出的 4 位數密碼："
  },
  {
    level: 2,
    title: "關卡二：2 樓書庫索書號尋寶",
    location: "2 樓 書庫區",
    answer: "122",
    hint: "提示：員家藝廊在 1 樓、流通櫃檯在 2 樓、影音上限 2 部。密碼組合：122",
    question: "請前往 2 樓書庫找出指定圖書，輸入書中卡片算出的 3 位數密碼："
  },
  {
    level: 3,
    title: "關卡三：員家科系與專業教室大考驗",
    location: "3 樓與 4 樓 專業教室區",
    answer: "347",
    hint: "提示：國貿科 3 樓、商經科 4 樓。(4 × 3) - 5 = 7。密碼組合：347",
    question: "請計算專業教室樓層算式，輸入解密後的 3 位數密碼："
  },
  {
    level: 4,
    title: "關卡四：借閱規定除錯題",
    location: "2 樓 休閒閱讀區",
    answer: "521",
    hint: "提示：期刊上限 5 冊、影音上限 2 部、可續借 1 次。密碼組合：521",
    question: "請檢查小員的借閱清單，輸入正確上限組合出的 3 位數密碼："
  },
  {
    level: 5,
    title: "關卡五：2 樓流通櫃台實體過卡終極任務",
    location: "2 樓 流通櫃台",
    answer: "999",
    hint: "提示：拿著『學生證』與一本普通書籍，到二樓流通櫃台找館員辦理借閱過卡，口號：『員家圖書館，閱讀好習慣！』即可獲得終極密碼 999。",
    question: "請至 2 樓流通櫃台向館員辦理實體過卡借書，輸入館員給予的終極通關密碼："
  }
];

const DEFAULT_STATE = {
  status: 'setup', // 'setup' | 'playing' | 'ended'
  winningQuota: 3, // 錄取前 N 名
  totalTeams: 12,
  startTime: null,
  teams: {}
};

class GameEngine {
  constructor() {
    this.channel = new BroadcastChannel('ylhcvs_escape_room_bus');
    this.state = this.loadState();
    this.listeners = [];
    this.firebaseDb = null;

    this.initFirebase();

    // 廣播頻道監聽 (同網域單機/多分頁備用)
    this.channel.onmessage = (event) => {
      if (event.data && event.data.type === 'STATE_UPDATE') {
        this.state = event.data.state;
        this.notifyListeners();
      }
    };
  }

  // 初始化 Firebase 雲端資料庫（跨裝置同步核心）
  initFirebase() {
    if (typeof firebase !== 'undefined' && window.firebaseConfig && window.firebaseConfig.databaseURL && !window.firebaseConfig.databaseURL.includes('YOUR_PROJECT_ID')) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(window.firebaseConfig);
        }
        this.firebaseDb = firebase.database();
        console.log("🔥 Firebase 跨裝置即時資料庫已成功連線！");

        // 監聽雲端資料庫更新
        this.firebaseDb.ref('ylhcvs_game_state').on('value', (snapshot) => {
          const val = snapshot.val();
          if (val) {
            this.state = val;
            localStorage.setItem('ylhcvs_escape_state', JSON.stringify(this.state));
            this.notifyListeners();
          }
        });
      } catch (e) {
        console.warn("Firebase 初始化失敗，使用 LocalStorage 模式：", e);
      }
    }
  }

  loadState() {
    const saved = localStorage.getItem('ylhcvs_escape_state');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    localStorage.setItem('ylhcvs_escape_state', JSON.stringify(this.state));
    this.channel.postMessage({ type: 'STATE_UPDATE', state: this.state });
    
    // 如果開啟了 Firebase，同步更新至雲端
    if (this.firebaseDb) {
      this.firebaseDb.ref('ylhcvs_game_state').set(this.state);
    }

    this.notifyListeners();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.state);
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.state));
  }

  // 教師端設定
  setupGame(winningQuota, totalTeams) {
    const teams = {};
    for (let i = 1; i <= totalTeams; i++) {
      teams[`team_${i}`] = {
        id: `team_${i}`,
        name: `第 ${i} 組`,
        members: "",
        currentLevel: 1,
        completed: false,
        finishTime: null,
        levelTimes: {},
        startTime: null
      };
    }

    this.state = {
      status: 'setup',
      winningQuota: parseInt(winningQuota) || 3,
      totalTeams: parseInt(totalTeams) || 12,
      startTime: null,
      teams: teams
    };

    this.saveState();
  }

  startGame() {
    this.state.status = 'playing';
    this.state.startTime = Date.now();
    this.saveState();
  }

  resetGame() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
  }

  registerTeam(teamId, teamName, members) {
    if (!this.state.teams[teamId]) {
      this.state.teams[teamId] = {
        id: teamId,
        name: teamName || `第 ${teamId.replace('team_', '')} 組`,
        members: members || "",
        currentLevel: 1,
        completed: false,
        finishTime: null,
        levelTimes: {},
        startTime: Date.now()
      };
    } else {
      if (teamName) this.state.teams[teamId].name = teamName;
      if (members) this.state.teams[teamId].members = members;
      if (!this.state.teams[teamId].startTime) {
        this.state.teams[teamId].startTime = Date.now();
      }
    }
    this.saveState();
  }

  submitAnswer(teamId, level, answerInput) {
    const team = this.state.teams[teamId];
    if (!team) return { success: false, message: "找不到該組別！" };
    if (team.completed) return { success: false, message: "您的團隊已通關！" };

    const currentLevelInfo = GAME_LEVELS.find(l => l.level === level);
    if (!currentLevelInfo) return { success: false, message: "關卡異常" };

    const cleanInput = (answerInput || '').trim();
    if (cleanInput === currentLevelInfo.answer) {
      const now = Date.now();
      team.levelTimes[level] = now;

      if (level < 5) {
        team.currentLevel = level + 1;
      } else {
        team.currentLevel = 6;
        team.completed = true;
        team.finishTime = now;
      }

      this.saveState();
      return { success: true, isCompleted: team.completed, nextLevel: team.currentLevel };
    } else {
      return { success: false, message: "密碼錯誤，請再仔細核對！" };
    }
  }

  getSortedLeaderboard() {
    const teamsList = Object.values(this.state.teams);

    teamsList.sort((a, b) => {
      if (a.completed && !b.completed) return -1;
      if (!a.completed && b.completed) return 1;

      if (a.completed && b.completed) {
        return (a.finishTime - a.startTime) - (b.finishTime - b.startTime);
      }

      if (a.currentLevel !== b.currentLevel) {
        return b.currentLevel - a.currentLevel;
      }

      const aLastTime = a.levelTimes[a.currentLevel - 1] || a.startTime || Infinity;
      const bLastTime = b.levelTimes[b.currentLevel - 1] || b.startTime || Infinity;
      return aLastTime - bLastTime;
    });

    return teamsList;
  }
}

window.gameEngine = new GameEngine();
