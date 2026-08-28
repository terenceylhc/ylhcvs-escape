/**
 * 員林家商圖書館密室逃脫 - 全域通訊與狀態控制核心 (App Core v2.2 - 防錯修復版)
 * 修正：
 * 1. 加入相容防護 (Defensive Checks)，避免舊資料結構缺少 levelSequence 導致 JS 崩潰卡住。
 * 2. 開賽時自動同步所有隊伍的比賽起算時間 (startTime)。
 */

const DEFAULT_GAME_LEVELS = [
  {
    id: 1,
    title: "館舍尋蹤與守護法則",
    location: "1 樓 閱覽室 / 自主學習空間",
    answer: "1820",
    hint: "提示：查看 1 樓樓層 (1)、書籍上限 (8)、借期週數 (2)、當期雜誌可借 (0)。密碼：1820",
    question: "請輸入 1 樓館舍導覽圖與借閱規定算出的 4 位數密碼："
  },
  {
    id: 2,
    title: "2 樓書庫索書號尋寶",
    location: "2 樓 書庫區",
    answer: "122",
    hint: "提示：員家藝廊在 1 樓、流通櫃檯在 2 樓、影音上限 2 部。密碼：122",
    question: "請前往 2 樓書庫找出指定圖書，輸入書中卡片算出的 3 位數密碼："
  },
  {
    id: 3,
    title: "員家科系與專業教室大考驗",
    location: "3 樓與 4 樓 專業教室區",
    answer: "347",
    hint: "提示：國貿科 3 樓、商經科 4 樓。(4 × 3) - 5 = 7。密碼：347",
    question: "請計算專業教室樓層算式，輸入解密後的 3 位數密碼："
  },
  {
    id: 4,
    title: "借閱規定除錯題",
    location: "2 樓 休閒閱讀區",
    answer: "521",
    hint: "提示：期刊上限 5 冊、影音上限 2 部、可續借 1 次。密碼：521",
    question: "請檢查小員的借閱清單，輸入正確上限組合出的 3 位數密碼："
  },
  {
    id: 5,
    title: "2 樓流通櫃台實體過卡終極任務",
    location: "2 樓 流通櫃台",
    answer: "999",
    hint: "提示：拿著『學生證』與一本普通書籍，到二樓流通櫃台找館員辦理過卡借閱，口號：『員家圖書館，閱讀好習慣！』即可獲得終極密碼 999。",
    question: "請至 2 樓流通櫃台向館員辦理實體過卡借書，輸入館員給予的終極通關密碼："
  }
];

const DEFAULT_STATE = {
  status: 'setup', // 'setup' | 'playing' | 'ended'
  winningQuota: 3,
  startTime: null,
  questions: DEFAULT_GAME_LEVELS,
  teams: {}
};

class GameEngine {
  constructor() {
    this.channel = new BroadcastChannel('ylhcvs_escape_room_bus');
    this.state = this.loadState();
    this.listeners = [];
    this.firebaseDb = null;

    this.initFirebase();

    this.channel.onmessage = (event) => {
      if (event.data && event.data.type === 'STATE_UPDATE') {
        this.state = this.sanitizeState(event.data.state);
        this.notifyListeners();
      }
    };
  }

  // 舊資料結構自動修復（避免欄位缺少導致 JS 報錯）
  sanitizeState(rawState) {
    if (!rawState) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    const state = rawState;
    if (!state.teams) state.teams = {};
    if (!state.questions) state.questions = DEFAULT_GAME_LEVELS;
    if (!state.status) state.status = 'setup';
    if (!state.winningQuota) state.winningQuota = 3;

    // 確保每支隊伍都有防護預設欄位
    Object.values(state.teams).forEach(team => {
      if (!team.levelSequence || !Array.isArray(team.levelSequence) || team.levelSequence.length === 0) {
        team.levelSequence = [1, 2, 3, 4, 5];
      }
      if (typeof team.stepIndex !== 'number') team.stepIndex = 0;
      if (!team.levelTimes) team.levelTimes = {};
    });

    return state;
  }

  initFirebase() {
    if (typeof firebase !== 'undefined' && window.firebaseConfig && window.firebaseConfig.databaseURL && !window.firebaseConfig.databaseURL.includes('YOUR_PROJECT_ID')) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(window.firebaseConfig);
        }
        this.firebaseDb = firebase.database();
        console.log("🔥 Firebase 跨裝置即時資料庫連線成功！");

        this.firebaseDb.ref('ylhcvs_game_state').on('value', (snapshot) => {
          const val = snapshot.val();
          if (val) {
            this.state = this.sanitizeState(val);
            localStorage.setItem('ylhcvs_escape_state', JSON.stringify(this.state));
            this.notifyListeners();
          }
        });
      } catch (e) {
        console.warn("Firebase 連線未設置，切換為 LocalStorage 廣播模式：", e);
      }
    }
  }

  loadState() {
    const saved = localStorage.getItem('ylhcvs_escape_state');
    if (saved) {
      try { 
        return this.sanitizeState(JSON.parse(saved)); 
      } catch (e) {}
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    this.state = this.sanitizeState(this.state);
    localStorage.setItem('ylhcvs_escape_state', JSON.stringify(this.state));
    this.channel.postMessage({ type: 'STATE_UPDATE', state: this.state });
    
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

  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  autoRegisterTeam(teamName, members) {
    const teamKeys = Object.keys(this.state.teams);
    const nextGroupNum = teamKeys.length + 1;
    const teamId = `team_${nextGroupNum}`;
    const defaultName = teamName ? teamName.trim() : `第 ${nextGroupNum} 組`;

    const baseLevels = [1, 2, 3, 4];
    const shuffledLevels = this.shuffleArray(baseLevels);
    shuffledLevels.push(5);

    const newTeam = {
      id: teamId,
      groupNum: nextGroupNum,
      name: defaultName,
      members: members ? members.trim() : "",
      levelSequence: shuffledLevels,
      stepIndex: 0,
      completed: false,
      finishTime: null,
      levelTimes: {},
      startTime: Date.now()
    };

    this.state.teams[teamId] = newTeam;
    this.saveState();
    return newTeam;
  }

  setWinningQuota(quota) {
    this.state.winningQuota = parseInt(quota) || 3;
    this.saveState();
  }

  // 開始遊戲：更新比賽狀態與全員起算時間
  startGame() {
    const now = Date.now();
    this.state.status = 'playing';
    this.state.startTime = now;

    // 將所有已進場隊伍的計時起點同步更新為當下
    Object.values(this.state.teams).forEach(team => {
      team.startTime = now;
    });

    this.saveState();
  }

  resetGame() {
    this.state.status = 'setup';
    this.state.startTime = null;
    this.state.teams = {};
    this.saveState();
  }

  verifyAdminPassword(password) {
    return (password || '').trim() === '280282';
  }

  getCurrentQuestionForTeam(teamId) {
    const team = this.state.teams[teamId];
    if (!team) return null;

    const seq = (team.levelSequence && team.levelSequence.length) ? team.levelSequence : [1, 2, 3, 4, 5];
    const stepIdx = team.stepIndex || 0;

    if (team.completed || stepIdx >= seq.length) {
      return null;
    }

    const questionId = seq[stepIdx];
    const questionObj = (this.state.questions || DEFAULT_GAME_LEVELS).find(q => q.id === questionId);
    
    return {
      questionObj: questionObj || DEFAULT_GAME_LEVELS[0],
      stepNumber: stepIdx + 1,
      totalSteps: 5
    };
  }

  submitAnswer(teamId, answerInput) {
    if (this.state.status !== 'playing') {
      return { success: false, message: "比賽尚未開始，請等待老師開啟！" };
    }

    const team = this.state.teams[teamId];
    if (!team) return { success: false, message: "找不到該組別！" };
    if (team.completed) return { success: false, message: "您的團隊已通關！" };

    const seq = (team.levelSequence && team.levelSequence.length) ? team.levelSequence : [1, 2, 3, 4, 5];
    const stepIdx = team.stepIndex || 0;
    const currentQuestionId = seq[stepIdx];
    const currentQ = (this.state.questions || DEFAULT_GAME_LEVELS).find(q => q.id === currentQuestionId);
    
    if (!currentQ) return { success: false, message: "關卡資料異常" };

    const cleanInput = (answerInput || '').trim();
    if (cleanInput === currentQ.answer) {
      const now = Date.now();
      team.stepIndex = stepIdx + 1;
      team.levelTimes[team.stepIndex] = now;

      if (team.stepIndex >= 5) {
        team.completed = true;
        team.finishTime = now;
      }

      this.saveState();
      return { 
        success: true, 
        isCompleted: team.completed, 
        nextStep: team.stepIndex + 1 
      };
    } else {
      return { success: false, message: "密碼錯誤，請仔細核對！" };
    }
  }

  getSortedLeaderboard() {
    const teamsList = Object.values(this.state.teams || {});

    teamsList.sort((a, b) => {
      const aStep = a.stepIndex || 0;
      const bStep = b.stepIndex || 0;

      if (a.completed && !b.completed) return -1;
      if (!a.completed && b.completed) return 1;

      if (a.completed && b.completed) {
        return (a.finishTime - a.startTime) - (b.finishTime - b.startTime);
      }

      if (aStep !== bStep) {
        return bStep - aStep;
      }

      const aLastTime = a.levelTimes ? (a.levelTimes[aStep] || a.startTime || Infinity) : Infinity;
      const bLastTime = b.levelTimes ? (b.levelTimes[bStep] || b.startTime || Infinity) : Infinity;
      return aLastTime - bLastTime;
    });

    return teamsList;
  }

  updateQuestions(newQuestions) {
    this.state.questions = newQuestions;
    this.saveState();
  }
}

window.gameEngine = new GameEngine();
