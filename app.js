/**
 * 員林家商圖書館密室逃脫 - 全域通訊與狀態控制核心 (App Core v2.1)
 * Bug 修改與新功能：
 * 1. 學生輸入隊名後進入「等待區」，需等待教師按下「開始遊戲」才開放解謎。
 * 2. 初始與重置時預設 teams 為空物件 {}，不再預載假隊伍。
 * 3. 題庫管理新增密碼驗證權限（密碼：280282）。
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
  status: 'setup', // 'setup' (等待開賽) | 'playing' (比賽中) | 'ended'
  winningQuota: 3,
  startTime: null,
  questions: DEFAULT_GAME_LEVELS,
  teams: {} // 預設完全空白，無預設 12 組
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
        this.state = event.data.state;
        this.notifyListeners();
      }
    };
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
            this.state = val;
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
      try { return JSON.parse(saved); } catch (e) {}
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
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

  // 學生端報到：自動依進場順序給予組別號碼 (第 1 組, 第 2 組...)
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

  // 教師按下「開始遊戲」：狀態變更為 'playing'，全場解鎖題目
  startGame() {
    this.state.status = 'playing';
    this.state.startTime = Date.now();
    this.saveState();
  }

  // 完全清空資料庫與隊伍
  resetGame() {
    this.state.status = 'setup';
    this.state.startTime = null;
    this.state.teams = {};
    this.saveState();
  }

  // 驗證後台管理密碼
  verifyAdminPassword(password) {
    return (password || '').trim() === '280282';
  }

  getCurrentQuestionForTeam(teamId) {
    const team = this.state.teams[teamId];
    if (!team) return null;

    if (team.completed || team.stepIndex >= team.levelSequence.length) {
      return null;
    }

    const questionId = team.levelSequence[team.stepIndex];
    const questionObj = (this.state.questions || DEFAULT_GAME_LEVELS).find(q => q.id === questionId);
    
    return {
      questionObj: questionObj || DEFAULT_GAME_LEVELS[0],
      stepNumber: team.stepIndex + 1,
      totalSteps: 5
    };
  }

  submitAnswer(teamId, answerInput) {
    if (this.state.status !== 'playing') {
      return { success: false, message: "比賽尚未開始，請耐心等待老師開啟！" };
    }

    const team = this.state.teams[teamId];
    if (!team) return { success: false, message: "找不到該組別！" };
    if (team.completed) return { success: false, message: "您的團隊已通關！" };

    const currentQuestionId = team.levelSequence[team.stepIndex];
    const currentQ = (this.state.questions || DEFAULT_GAME_LEVELS).find(q => q.id === currentQuestionId);
    
    if (!currentQ) return { success: false, message: "關卡資料異常" };

    const cleanInput = (answerInput || '').trim();
    if (cleanInput === currentQ.answer) {
      const now = Date.now();
      team.levelTimes[team.stepIndex + 1] = now;

      team.stepIndex += 1;

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
    const teamsList = Object.values(this.state.teams);

    teamsList.sort((a, b) => {
      if (a.completed && !b.completed) return -1;
      if (!a.completed && b.completed) return 1;

      if (a.completed && b.completed) {
        return (a.finishTime - a.startTime) - (b.finishTime - b.startTime);
      }

      if (a.stepIndex !== b.stepIndex) {
        return b.stepIndex - a.stepIndex;
      }

      const aLastTime = a.levelTimes[a.stepIndex] || a.startTime || Infinity;
      const bLastTime = b.levelTimes[b.stepIndex] || b.startTime || Infinity;
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
