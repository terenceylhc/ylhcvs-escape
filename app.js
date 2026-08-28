/**
 * 員林家商圖書館密室逃脫 - 全域通訊與狀態控制核心 (App Core v3.0)
 * 升級亮點：
 * 1. 隱藏密碼提示：學生端提示訊息嚴格去除了密碼數字洩漏。
 * 2. 循環關卡順序：第1組 [1,2,3,4,5]、第2組 [2,3,4,5,1]、第3組 [3,4,5,1,2]、第4組 [4,5,1,2,3]、第5組 [5,1,2,3,4]...
 * 3. 題庫池與隨機抽題：每關卡預載多道題目，每組報到時從各關題庫池中隨機抽取 1 題。
 */

// 預設豐富題庫池 (五大關卡，每關多道題目)
const DEFAULT_QUESTIONS_POOL = [
  // ─── 關卡 1：館舍尋蹤與守護法則 (1 樓) ───
  {
    id: "q_1_1",
    categoryLevel: 1,
    title: "關卡一：館舍尋蹤與守護法則",
    location: "1 樓 閱覽室 / 自主學習空間",
    answer: "1820",
    hint: "提示：請前往 1 樓觀察【自主學習空間樓層】與宣導摺頁上的【書籍上限冊數】、【借期週數】與【當期雜誌規定】。",
    question: "【題目 1-1】請參閱 1 樓館舍導覽圖與借閱規定，回答下列問題並算出 4 位數密碼 (數字A:自主學習空間樓層 / 數字B:書籍上限 / 數字C:借期週數 / 數字D:當期雜誌可借冊數)："
  },
  {
    id: "q_1_2",
    categoryLevel: 1,
    title: "關卡一：館舍尋蹤與守護法則",
    location: "1 樓 TEAL教室",
    answer: "1810",
    hint: "提示：請確認 TEAL 教室樓層、學生證書籍上限冊數、可續借次數與漫畫外借冊數規定。",
    question: "【題目 1-2】請參閱 1 樓導覽圖與借閱規定，回答下列問題並算出 4 位數密碼 (數字A:TEAL教室樓層 / 數字B:書籍上限 / 數字C:可續借次數 / 數字D:漫畫可借冊數)："
  },
  {
    id: "q_1_3",
    categoryLevel: 1,
    title: "關卡一：館舍尋蹤與守護法則",
    location: "1 樓 員家藝廊",
    answer: "1820",
    hint: "提示：請確認員家藝廊樓層、書籍冊數上限、影音冊數上限與當期雜誌外借規定。",
    question: "【題目 1-3】請參閱 1 樓藝廊告示與借閱規定，回答下列問題並算出 4 位數密碼 (數字A:員家藝廊樓層 / 數字B:書籍上限 / 數字C:影音上限 / 數字D:當期雜誌外借冊數)："
  },
  {
    id: "q_1_4",
    categoryLevel: 1,
    title: "關卡一：館舍尋蹤與守護法則",
    location: "1 樓 閱覽室",
    answer: "1520",
    hint: "提示：請確認閱覽室樓層、期刊冊數上限、借期週數與漫畫外借規定。",
    question: "【題目 1-4】請參閱 1 樓閱覽室與借閱規定，回答下列問題並算出 4 位數密碼 (數字A:閱覽室樓層 / 數字B:期刊上限 / 數字C:借期週數 / 數字D:漫畫可借冊數)："
  },

  // ─── 關卡 2：2 樓書庫索書號尋寶 (2 樓) ───
  {
    id: "q_2_1",
    categoryLevel: 2,
    title: "關卡二：2 樓書庫索書號尋寶",
    location: "2 樓 書庫區 (文學類書架)",
    answer: "122",
    hint: "提示：請至 2 樓書庫找到索書號 857.7 的指定小說，翻開書頁回答：員家藝廊樓層、流通櫃檯樓層與影音上限部數。",
    question: "【題目 2-1】請前往 2 樓書庫找出索書號『857.7 4422』書籍，輸入書中卡片算出的 3 位數密碼："
  },
  {
    id: "q_2_2",
    categoryLevel: 2,
    title: "關卡二：2 樓書庫索書號尋寶",
    location: "2 樓 書庫區 (自然科學類書架)",
    answer: "281",
    hint: "提示：請至 2 樓書庫 300 類書架尋找科普書籍，回答：休閒閱讀區樓層、書籍冊數上限與可續借次數。",
    question: "【題目 2-2】請前往 2 樓書庫找出索书號『308 1245』書籍，輸入書中卡片算出的 3 位數密碼："
  },
  {
    id: "q_2_3",
    categoryLevel: 2,
    title: "關卡二：2 樓書庫索書號尋寶",
    location: "2 樓 書庫區 (商管類書架)",
    answer: "340",
    hint: "提示：請至 2 樓書庫 500 類商管書架尋找指定書籍，對照：國貿科樓層、商經科樓層與當期雜誌外借冊數。",
    question: "【題目 2-3】請前往 2 樓書庫找出索書號『525.7 8844』書籍，輸入書中卡片算出的 3 位數密碼："
  },

  // ─── 關卡 3：員家科系與專業教室大考驗 (3 樓與 4 樓) ───
  {
    id: "q_3_1",
    categoryLevel: 3,
    title: "關卡三：員家科系與專業教室大考驗",
    location: "3 樓與 4 樓 專業教室區",
    answer: "347",
    hint: "提示：請查閱樓層導覽圖，確認『國貿科專業教室樓層』與『商經科專業教室樓層』，帶入提示卡算式。",
    question: "【題目 3-1】已知算式 (商經科樓層 × 國貿科樓層) - 教師研究室樓層(5樓)，請輸入組合出的 3 位數密碼 (國貿科樓層 / 商經科樓層 / 算式結果)："
  },
  {
    id: "q_3_2",
    categoryLevel: 3,
    title: "關卡三：員家科系與專業教室大考驗",
    location: "3 樓美術教室與 4 樓電腦教室",
    answer: "345",
    hint: "提示：請查閱圖書館樓層配置圖，找出美術教室、專業電腦教室與教師研究室各自位於幾樓。",
    question: "【題目 3-2】請對照圖書館樓層圖，輸入 3 位數密碼 (美術教室樓層 / 專業電腦教室樓層 / 教師研究室樓層)："
  },
  {
    id: "q_3_3",
    categoryLevel: 3,
    title: "關卡三：員家科系與專業教室大考驗",
    location: "3 樓自然科教室與 4 樓商經科教室",
    answer: "347",
    hint: "提示：請確認自然科教室與商經科教室樓層，第三位數為兩者樓層相加。",
    question: "【題目 3-3】請輸入 3 位數密碼 (自然科教室樓層 / 商經科教室樓層 / 兩者樓層相加數字)："
  },

  // ─── 關卡 4：借閱規定除錯題 (2 樓休閒閱讀區) ───
  {
    id: "q_4_1",
    categoryLevel: 4,
    title: "關卡四：借閱規定除錯題",
    location: "2 樓 休閒閱讀區",
    answer: "521",
    hint: "提示：請查閱借閱規定摺頁，找出期刊冊數上限、影音部數上限與最高可續借次數。",
    question: "【題目 4-1】請檢查小員的借閱清單，輸入正確上限組合出的 3 位數密碼 (期刊上限 / 影音上限 / 續借次數)："
  },
  {
    id: 4,
    categoryLevel: 4,
    title: "關卡四：借閱規定除錯題",
    location: "2 樓 休閒閱讀區",
    answer: "852",
    hint: "提示：請查閱學生證可借閱的書籍、期刊與影音三者上限冊數。",
    question: "【題目 4-2】請查閱員家借閱規定，輸入 3 位數密碼 (書籍冊數上限 / 期刊冊數上限 / 影音部數上限)："
  },
  {
    id: "q_4_3",
    categoryLevel: 4,
    title: "關卡四：借閱規定除錯題",
    location: "2 樓 休閒閱讀區",
    answer: "212",
    hint: "提示：請查閱圖書借期週數、可續借次數與續借延長週數。",
    question: "【題目 4-3】請輸入 3 位數密碼 (借期週數 / 可續借次數 / 續借延長週數)："
  },

  // ─── 關卡 5：2 樓流通櫃台實體過卡終極任務 (2 樓流通櫃台) ───
  {
    id: 5,
    categoryLevel: 5,
    title: "關卡五：2 樓流通櫃台實體過卡終極任務",
    location: "2 樓 流通櫃台",
    answer: "999",
    hint: "提示：拿著『學生證』與一本普通書籍，到二樓流通櫃台找館員辦理實體過卡借閱，口號：『員家圖書館，閱讀好習慣！』。",
    question: "【題目 5-1】請全組持學生證與圖書至 2 樓流通櫃台向館員辦理過卡借書，輸入館員給予的終極通關密碼："
  },
  {
    id: "q_5_2",
    categoryLevel: 5,
    title: "關卡五：2 樓流通櫃台實體過卡終極任務",
    location: "2 樓 流通櫃台",
    answer: "888",
    hint: "提示：請拿學生證至流通櫃檯向館員說出通關口號『閱讀員家，智勝未來！』辦理過卡。",
    question: "【題目 5-2】請全組至 2 樓流通櫃台完成實體過卡，輸入館員認證後給予的終極密碼："
  },
  {
    id: "q_5_3",
    categoryLevel: 5,
    title: "關卡五：2 樓流通櫃台實體過卡終極任務",
    location: "2 樓 流通櫃台",
    answer: "777",
    hint: "提示：全組持學生證至二樓流通櫃檯體驗實體借書過卡，向館員說出『愛上圖書館，學習不中斷！』。",
    question: "【題目 5-3】請至二樓流通櫃檯體驗實體借書過卡，輸入館員給予的終極密碼："
  }
];

const DEFAULT_STATE = {
  status: 'setup', // 'setup' | 'playing' | 'ended'
  winningQuota: 3,
  startTime: null,
  questions: DEFAULT_QUESTIONS_POOL,
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

  sanitizeState(rawState) {
    if (!rawState) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    const state = rawState;
    if (!state.teams) state.teams = {};
    if (!state.questions || !Array.isArray(state.questions) || state.questions.length === 0) {
      state.questions = DEFAULT_QUESTIONS_POOL;
    }
    if (!state.status) state.status = 'setup';
    if (!state.winningQuota) state.winningQuota = 3;

    Object.values(state.teams).forEach(team => {
      if (!team.levelSequence || !Array.isArray(team.levelSequence) || team.levelSequence.length === 0) {
        team.levelSequence = [1, 2, 3, 4, 5];
      }
      if (!team.assignedQuestions) {
        team.assignedQuestions = this.pickQuestionsForSequence(team.levelSequence, state.questions);
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

  // 關卡順序循環移位：第1組 [1,2,3,4,5]、第2組 [2,3,4,5,1]、第3組 [3,4,5,1,2]、第4組 [4,5,1,2,3]、第5組 [5,1,2,3,4]...
  getCyclicSequence(groupNum) {
    const seq = [];
    const startCategory = ((groupNum - 1) % 5) + 1;
    for (let i = 0; i < 5; i++) {
      const cat = ((startCategory - 1 + i) % 5) + 1;
      seq.push(cat);
    }
    return seq;
  }

  // 為隊伍隨機抽取各關卡的一道題目
  pickQuestionsForSequence(sequence, questionsPool) {
    const assignedMap = {};
    const pool = (questionsPool && questionsPool.length > 0) ? questionsPool : DEFAULT_QUESTIONS_POOL;

    sequence.forEach(catLevel => {
      const matchingQuestions = pool.filter(q => (q.categoryLevel || q.id) == catLevel);
      if (matchingQuestions.length > 0) {
        const randomIdx = Math.floor(Math.random() * matchingQuestions.length);
        assignedMap[catLevel] = matchingQuestions[randomIdx];
      } else {
        // 備用防錯
        assignedMap[catLevel] = pool[0];
      }
    });

    return assignedMap;
  }

  autoRegisterTeam(teamName, members) {
    const teamKeys = Object.keys(this.state.teams);
    const nextGroupNum = teamKeys.length + 1;
    const teamId = `team_${nextGroupNum}`;
    const defaultName = teamName ? teamName.trim() : `第 ${nextGroupNum} 組`;

    // 依據組別號碼產生循環移位順序 (第1組 [1,2,3,4,5]、第2組 [2,3,4,5,1]...)
    const cyclicSequence = this.getCyclicSequence(nextGroupNum);
    const assignedQuestions = this.pickQuestionsForSequence(cyclicSequence, this.state.questions);

    const newTeam = {
      id: teamId,
      groupNum: nextGroupNum,
      name: defaultName,
      members: members ? members.trim() : "",
      levelSequence: cyclicSequence,
      assignedQuestions: assignedQuestions,
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

  startGame() {
    const now = Date.now();
    this.state.status = 'playing';
    this.state.startTime = now;

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

  // 取得學生端當前題目的詳細資訊 (絕不露出解答)
  getCurrentQuestionForTeam(teamId) {
    const team = this.state.teams[teamId];
    if (!team) return null;

    const seq = (team.levelSequence && team.levelSequence.length) ? team.levelSequence : [1, 2, 3, 4, 5];
    const stepIdx = typeof team.stepIndex === 'number' ? team.stepIndex : 0;

    if (team.completed || stepIdx >= seq.length) {
      return null;
    }

    const currentCatLevel = seq[stepIdx];
    let questionObj = null;

    if (team.assignedQuestions && team.assignedQuestions[currentCatLevel]) {
      questionObj = team.assignedQuestions[currentCatLevel];
    } else {
      const pool = this.state.questions || DEFAULT_QUESTIONS_POOL;
      questionObj = pool.find(q => (q.categoryLevel || q.id) == currentCatLevel) || pool[0];
    }
    
    return {
      questionObj: questionObj,
      stepNumber: stepIdx + 1,
      totalSteps: 5,
      catLevel: currentCatLevel
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
    const stepIdx = typeof team.stepIndex === 'number' ? team.stepIndex : 0;
    const currentCatLevel = seq[stepIdx];
    
    let currentQ = null;
    if (team.assignedQuestions && team.assignedQuestions[currentCatLevel]) {
      currentQ = team.assignedQuestions[currentCatLevel];
    } else {
      const pool = this.state.questions || DEFAULT_QUESTIONS_POOL;
      currentQ = pool.find(q => (q.categoryLevel || q.id) == currentCatLevel) || pool[0];
    }
    
    if (!currentQ) return { success: false, message: "關卡資料異常" };

    const cleanInput = (answerInput || '').trim();
    if (cleanInput === String(currentQ.answer).trim()) {
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
      return { success: false, message: "密碼錯誤，請仔細核對解謎細節！" };
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
