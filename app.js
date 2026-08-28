/**
 * 員林家商圖書館密室逃脫 - 全域通訊與狀態控制核心 (App Core v3.3 - 答錯 2 次解鎖提示版)
 * 升級亮點：
 * 1. 錯誤計數機制：學生預設不顯示提示，需答錯 2 次（含）以上才自動解鎖顯示求救提示！
 * 2. 完整題庫、解答與提示比對 logic。
 */

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

  // ─── 關卡 2：OPAC 跨欄位進階運算 Ⅰ ───
  {
    id: "q_2_1",
    categoryLevel: 2,
    title: "關卡二：【跨欄位數學算式：《解憂雜貨店》】",
    location: "電腦查詢區 / 學生手機 (WebOPAC 檢索)",
    answer: ["652"],
    hint: "提示：請在 WebOPAC 搜尋《解憂雜貨店》，計算出版年末兩碼相加、索書號點號前三位數字和的個位數，以及館藏總冊數。",
    question: "🧮 請在 WebOPAC 搜尋《解憂雜貨店》（皇冠出版），回答 3 位數密碼 (數字A: 出版年2015末兩碼相加 / 數字B: 索書號861.57點號前861三數字和的個位數 / 數字C: 館藏總冊數)："
  },
  {
    id: "q_2_2",
    categoryLevel: 2,
    title: "關卡二：【筆畫與年份排列：《解憂雜貨店》】",
    location: "電腦查詢區 / 學生手機 (WebOPAC 檢索)",
    answer: ["895"],
    hint: "提示：請在 WebOPAC 搜尋《解憂雜貨店》，查出作者第一個字筆畫數、出版社第一個字筆畫數與出版年個位數。",
    question: "✍️ 請在 WebOPAC 搜尋《解憂雜貨店》，回答 3 位數密碼 (數字A: 作者『東野圭吾』首字『東』筆畫數 / 數字B: 出版社『皇冠』首字『皇』筆畫數 / 數字C: 出版年2015個位數)："
  },
  {
    id: "q_2_3",
    categoryLevel: 2,
    title: "關卡二：【索書號與年份疊加算式：《原子習慣》】",
    location: "電腦查詢區 / 學生手機 (WebOPAC 檢索)",
    answer: ["266"],
    hint: "提示：請在 WebOPAC 搜尋《原子習慣》，算出出版年四位數字和的個位數、索書號小數點後與作者號數字合，以及出版社筆畫個位數。",
    question: "🔢 請在 WebOPAC 搜尋《原子習慣》（方智出版），回答 3 位數密碼 (數字A: 出版年2019四數字和個位 / 數字B: 索書號小數點後2與作者號4422首位4相加 / 數字C: 出版社『方智』總筆畫個位)："
  },

  // ─── 關卡 3：OPAC 跨欄位進階運算 Ⅱ ───
  {
    id: "q_3_1",
    categoryLevel: 3,
    title: "關卡三：【文字與數字混合暗號：《被討厭的勇氣》】",
    location: "電腦查詢區 / 學生手機 (WebOPAC 檢索)",
    answer: ["究竟見4", "7774"],
    hint: "提示：請在 WebOPAC 搜尋《被討厭的勇氣》，組合出版社名稱、作者第二個字與出版年末碼。",
    question: "🔀 請在 WebOPAC 搜尋《被討厭的勇氣》，輸入暗號密碼 (出版社全名 + 作者『岸見一郎』第二個字 + 出版年2014末碼數字)："
  },
  {
    id: "q_3_2",
    categoryLevel: 3,
    title: "關卡三：【館藏冊數與索書號邏輯減法：《哈利波特》】",
    location: "電腦查詢區 / 學生手機 (WebOPAC 檢索)",
    answer: ["822"],
    hint: "提示：請在 WebOPAC 搜尋《哈利波特》，計算索書號整數和個位數、在架剩餘冊數與出版年首碼。",
    question: "🏛️ 請在 WebOPAC 搜尋《哈利波特》，回答 3 位數密碼 (數字A: 索書號873.57整數873數字和個位 / 數字B: 館藏(1/3)未外借剩餘冊數 / 數字C: 出版年2000年首碼數字)："
  },
  {
    id: "q_3_3",
    categoryLevel: 3,
    title: "關卡三：【筆畫與年份連乘加法：《三體》】",
    location: "電腦查詢區 / 學生手機 (WebOPAC 檢索)",
    answer: ["362"],
    hint: "提示：請在 WebOPAC 搜尋《三體》，查出作者姓名總字數、出版社第一個字筆畫個位數與出版年末兩碼和。",
    question: "🌌 請在 WebOPAC 搜尋《三體》（貓頭鷹出版），回答 3 位數密碼 (數字A: 作者『劉慈欣』姓名總字數 / 數字B: 出版社『貓頭鷹』首字『貓』筆畫個位 / 數字C: 出版年2011末兩碼和)："
  },

  // ─── 關卡 4：OPAC 跨欄位進階運算 Ⅲ ───
  {
    id: "q_4_1",
    categoryLevel: 4,
    title: "關卡四：【數字連環扣：《被隱形的女性》】",
    location: "電腦查詢區 / 學生手機 (WebOPAC 檢索)",
    answer: ["209"],
    hint: "提示：請在 WebOPAC 搜尋《被隱形的女性》，計算出版年十位數、索書號小數位連乘個位數與出版社總筆畫個位數。",
    question: "📊 請在 WebOPAC 搜尋《被隱形的女性》（商周出版），回答 3 位數密碼 (數字A: 出版年2020十位數 / 數字B: 索書號544.52點後5與2相乘個位 / 數字C: 出版社『商周』總筆畫個位)："
  },
  {
    id: "q_4_2",
    categoryLevel: 4,
    title: "關卡四：【跨欄位替換暗號：《雪球：巴菲特傳》】",
    location: "電腦查詢區 / 學生手機 (WebOPAC 檢索)",
    answer: ["天下29", "4329"],
    hint: "提示：請在 WebOPAC 搜尋《雪球》，組合出版社前兩個字與出版年的千位及個位數字。",
    question: "❄️ 請在 WebOPAC 搜尋《雪球》（天下文化出版/2009年），輸入暗號密碼 (出版社名稱前兩個字 + 出版年2009的千位與個位數字組合)："
  },
  {
    id: "q_4_3",
    categoryLevel: 4,
    title: "關卡四：【索書號與筆畫減法：《思考，快與慢》】",
    location: "電腦查詢區 / 學生手機 (WebOPAC 檢索)",
    answer: ["554"],
    hint: "提示：請在 WebOPAC 搜尋《思考，快與慢》，計算出版年數字總和、索書號小數點後數字與出版社筆畫差。",
    question: "🧠 請在 WebOPAC 搜尋《思考，快與慢》（遠流出版/2012年），回答 3 位數密碼 (數字A: 出版年2012四位數和 / 數字B: 索書號176.5點後數字 / 數字C: 出版社『遠流』兩字筆畫差)："
  },

  // ─── 關卡 5：2 樓流通櫃台實體過卡終極任務 ───
  {
    id: "q_5_1",
    categoryLevel: 5,
    title: "關卡五：2 樓流通櫃台實體過卡終極任務",
    location: "2 樓 流通櫃台",
    answer: "999",
    hint: "提示：拿著『學生證』與一本普通書籍，到二樓流通櫃台找館員辦理過卡借閱，口號：『員家圖書館，閱讀好習慣！』。",
    question: "【終極考驗】請全組持學生證與圖書至 2 樓流通櫃台向館員辦理過卡借書，輸入館員給予的終極通關密碼："
  },
  {
    id: "q_5_2",
    categoryLevel: 5,
    title: "關卡五：2 樓流通櫃台實體過卡終極任務",
    location: "2 樓 流通櫃台",
    answer: "888",
    hint: "提示：請拿學生證至流通櫃檯向館員說出通關口號『閱讀員家，智勝未來！』辦理過卡。",
    question: "【終極考驗】請全組至 2 樓流通櫃台完成實體過卡，輸入館員認證後給予的終極密碼："
  }
];

const DEFAULT_STATE = {
  status: 'setup',
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
      if (!team.failedAttempts) team.failedAttempts = {};
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

  getCyclicSequence(groupNum) {
    const seq = [];
    const startCategory = ((groupNum - 1) % 5) + 1;
    for (let i = 0; i < 5; i++) {
      const cat = ((startCategory - 1 + i) % 5) + 1;
      seq.push(cat);
    }
    return seq;
  }

  pickQuestionsForSequence(sequence, questionsPool) {
    const assignedMap = {};
    const pool = (questionsPool && questionsPool.length > 0) ? questionsPool : DEFAULT_QUESTIONS_POOL;

    sequence.forEach(catLevel => {
      const matchingQuestions = pool.filter(q => (q.categoryLevel || q.id) == catLevel);
      if (matchingQuestions.length > 0) {
        const randomIdx = Math.floor(Math.random() * matchingQuestions.length);
        assignedMap[catLevel] = matchingQuestions[randomIdx];
      } else {
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
      failedAttempts: {},
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

  // 取得學生端題目資料（包含答錯次數，用於決定是否開放顯示提示）
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

    const failedCount = (team.failedAttempts && team.failedAttempts[stepIdx]) ? team.failedAttempts[stepIdx] : 0;
    
    return {
      questionObj: questionObj,
      stepNumber: stepIdx + 1,
      totalSteps: 5,
      catLevel: currentCatLevel,
      failedAttempts: failedCount
    };
  }

  checkAnswerMatch(userInput, expectedAnswer) {
    const cleanInput = (userInput || '').trim().toLowerCase();
    if (Array.isArray(expectedAnswer)) {
      return expectedAnswer.some(ans => String(ans || '').trim().toLowerCase() === cleanInput);
    }
    return String(expectedAnswer || '').trim().toLowerCase() === cleanInput;
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

    if (this.checkAnswerMatch(answerInput, currentQ.answer)) {
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
      // 答案不正確：增加答錯計數
      if (!team.failedAttempts) team.failedAttempts = {};
      team.failedAttempts[stepIdx] = (team.failedAttempts[stepIdx] || 0) + 1;
      
      this.saveState();

      const failedCount = team.failedAttempts[stepIdx];
      let msg = "解答不正確，請再檢查 WebOPAC 檢索資料或書籍資訊！";
      if (failedCount >= 2) {
        msg = "解答不正確！求救提示已為您解鎖，請參考下方提示！";
      } else {
        msg = `解答不正確！（已答錯 ${failedCount} 次，答錯 2 次將自動解鎖提示）`;
      }

      return { 
        success: false, 
        message: msg,
        failedAttempts: failedCount
      };
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
