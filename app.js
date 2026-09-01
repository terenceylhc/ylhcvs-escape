/**
 * 員林家商圖書館密室逃脫 - 全域通訊與狀態控制核心 (App Core v21.0 - 順序闖關與防擁擠派題版)
 * 闖關流程：全組一律依序闖關 (關卡一 3題 ➔ 關卡二 3題 ➔ 關卡三 2題 ➔ 關卡五 1題 = 共 9 題總通關)
 * 貼紙規則：全數黏貼於圖書【書背索書號標籤處】，同學目視搜尋不需抽取書籍！
 * 防擁擠機制：關卡三與關卡五根據組別編號自動錯開分配圖書與架位，全場絕不卡關搶書！
 */

const DEFAULT_QUESTIONS_POOL = [
  // ─── 關卡 1：館舍尋蹤與守護法則 (10 題隨機抽 3 題) ───
  {
    id: "q_1_1",
    categoryLevel: 1,
    title: "關卡一：【館舍規定算式 1-1】",
    location: "1 樓 自主學習空間",
    answer: "17",
    hint: "提示：自主學習區(1F)、書籍上限(8冊)、借期(2週)。算式：(8 × 2) + 1 = 17。",
    question: "【題目 1-1】請參閱 1 樓館舍規定計算：(書籍借閱上限冊數 × 圖書借期週數) + 自主學習空間樓層 ＝ ？"
  },
  {
    id: "q_1_2",
    categoryLevel: 1,
    title: "關卡一：【館舍規定算式 1-2】",
    location: "1 樓 TEAL教室",
    answer: "7",
    hint: "提示：期刊上限(5冊)、影音上限(2部)、TEAL樓層(1F)。算式：(5 + 2) × 1 = 7。",
    question: "【題目 1-2】請參閱 1 樓規定計算：(期刊借閱上限 + 影音借閱上限) × TEAL教室樓層 ＝ ？"
  },
  {
    id: "q_1_3",
    categoryLevel: 1,
    title: "關卡一：【員家藝廊與借閱規定密碼】",
    location: "1 樓 員家藝廊",
    answer: "1820",
    hint: "提示：組合 4 位數：藝廊樓層(1)、書籍上限(8)、借期週數(2)、當期雜誌可借冊數(0)。",
    question: "【題目 1-3】請回答 4 位數密碼：（員家藝廊樓層 / 書籍上限冊數 / 圖書借期週數 / 當期雜誌外借冊數）："
  },
  {
    id: "q_1_4",
    categoryLevel: 1,
    title: "關卡一：【圖書與期刊借期密碼】",
    location: "1 樓 服務台導覽圖",
    answer: "9",
    hint: "提示：圖書借期(14天)、期刊上限(5冊)、自主學習區樓層(1F)。算式：(14 - 5) × 1 = 9。",
    question: "【題目 1-4】計算：(圖書借期天數 - 期刊借閱上限冊數) × 自主學習區樓層 ＝ ？"
  },
  {
    id: "q_1_5",
    categoryLevel: 1,
    title: "關卡一：【全館借閱上限總和】",
    location: "1 樓 閱覽室公告欄",
    answer: "15",
    hint: "提示：圖書上限(8) + 期刊上限(5) + 影音上限(2) = 15。",
    question: "【題目 1-5】請計算：一般圖書借閱上限 + 期刊借閱上限 + 視聽影音借閱上限 ＝ ？"
  },
  {
    id: "q_1_6",
    categoryLevel: 1,
    title: "關卡一：【視聽影音借閱密碼】",
    location: "1 樓 視聽區與藝廊",
    answer: "3",
    hint: "提示：影音上限(2部)、影音借期(1週)。算式：(2 × 1) + 1 = 3。",
    question: "【題目 1-6】計算：(影音借閱上限部數 × 影音借期週數) + 藝廊樓層 ＝ ？"
  },
  {
    id: "q_1_7",
    categoryLevel: 1,
    title: "關卡一：【期刊過刊借期算式】",
    location: "1 樓 閱覽室過刊區",
    answer: "11",
    hint: "提示：期刊上限(5冊)、過刊借期(2週)。算式：(5 × 2) + 1 = 11。",
    question: "【題目 1-7】計算：(期刊借閱上限冊數 × 期刊過刊借期週數) + 1 ＝ ？"
  },
  {
    id: "q_1_8",
    categoryLevel: 1,
    title: "關卡一：【圖書續借規則密碼】",
    location: "1 樓 服務台",
    answer: "18",
    hint: "提示：圖書上限(8冊)、續借次數(1次)、借期(2週)。算式：(8 + 1) × 2 = 18。",
    question: "【題目 1-8】計算：(書籍借閱上限冊數 + 圖書允許續借次數) × 圖書借期週數 ＝ ？"
  },
  {
    id: "q_1_9",
    categoryLevel: 1,
    title: "關卡一：【館藏守護天數密碼】",
    location: "1 樓 自主學習空間",
    answer: "7",
    hint: "提示：圖書借期14天除以8的餘數為6，加上1得 7。",
    question: "【題目 1-9】計算：(圖書借期14天 ÷ 書籍上限8冊 之餘數) + 自主學習空間樓層 ＝ ？"
  },
  {
    id: "q_1_10",
    categoryLevel: 1,
    title: "關卡一：【一樓三大空間總和】",
    location: "1 樓 藝廊/TEAL/自主區",
    answer: "6",
    hint: "提示：(藝廊1F + TEAL 1F + 自主學習1F) × 影音上限2部 = 6。",
    question: "【題目 1-10】計算：(藝廊樓層 + TEAL教室樓層 + 自主區樓層) × 影音借閱上限 ＝ ？"
  },

  // ─── 關卡 2：OPAC 線上檢索 (10 題隨機抽 3 題) ───
  {
    id: "q_2_1",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《情緒寄生》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["許皓宜2019", "許皓宜19"],
    hint: "提示：WebOPAC 搜尋《情緒寄生》，作者『許皓宜』+ 出版年『2019』。",
    question: "🔍 請在 WebOPAC 搜尋《情緒寄生》，將【作者姓名 許皓宜】+【出版年份 2019】拼湊成密碼："
  },
  {
    id: "q_2_2",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《大腦的主張》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["洪蘭2006", "洪蘭06"],
    hint: "提示：WebOPAC 搜尋《大腦的主張》，作者『洪蘭』+ 出版年『2006』。",
    question: "📖 請在 WebOPAC 搜尋《大腦的主張》，將【作者姓名 洪蘭】+【出版年份 2006】拼湊成暗號："
  },
  {
    id: "q_2_3",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《211彩虹瘦身餐盤》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["王麗容2024", "王麗容24"],
    hint: "提示：WebOPAC 搜尋《211彩虹瘦身餐盤》，作者『王麗容』+ 出版年『2024』。",
    question: "🥗 請在 WebOPAC 搜尋《211彩虹瘦身餐盤》，將【作者姓名 王麗容】+【出版年份 2024】拼湊成暗號："
  },
  {
    id: "q_2_4",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《觀念化學》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["蘇卡奇2006", "蘇卡奇06"],
    hint: "提示：WebOPAC 搜尋《觀念化學》，作者『蘇卡奇』+ 出版年『2006』。",
    question: "🧪 請在 WebOPAC 搜尋《觀念化學》，將【作者譯名 蘇卡奇】+【出版年份 2006】拼湊成密碼："
  },
  {
    id: "q_2_5",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《夜巡者》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["盧基揚年科2006", "盧基揚年科06"],
    hint: "提示：WebOPAC 搜尋《夜巡者》，作者『盧基揚年科』+ 出版年『2006』。",
    question: "🐺 請在 WebOPAC 搜尋《夜巡者》，將【作者姓名 盧基揚年科】+【出版年份 2006】拼湊成暗號："
  },
  {
    id: "q_2_6",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《國學潮人誌》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["宋怡慧2020", "宋怡慧20"],
    hint: "提示：WebOPAC 搜尋《國學潮人誌》，作者『宋怡慧』+ 出版年『2020』。",
    question: "😎 請在 WebOPAC 搜尋《國學潮人誌》，將【作者姓名 宋怡慧】+【出版年份 2020】拼湊成密碼："
  },
  {
    id: "q_2_7",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《芬蘭驚艷》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["吳祥輝2006", "吳祥輝06"],
    hint: "提示：WebOPAC 搜尋《芬蘭驚艷》，作者『吳祥輝』+ 出版年『2006』。",
    question: "✈️ 請在 WebOPAC 搜尋《芬蘭驚艷》，將【作者姓名 吳祥輝】+【出版年份 2006】拼湊成暗號："
  },
  {
    id: "q_2_8",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《走入員林街仔》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["彰化縣文化局2007", "彰化縣文化局07"],
    hint: "提示：WebOPAC 搜尋《走入員林街仔》，出版者『彰化縣文化局』+ 出版年『2007』。",
    question: "🏠 請在 WebOPAC 搜尋《走入員林街仔》，將【出版者 彰化縣文化局】+【出版年份 2007】拼湊成密碼："
  },
  {
    id: "q_2_9",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《保母人員通關寶典》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["童年工作坊1998", "童年工作坊98"],
    hint: "提示：WebOPAC 搜尋《保母人員丙級學術科通關寶典》，編著『童年工作坊』+ 出版年『1998』。",
    question: "👶 請在 WebOPAC 搜尋《保母人員丙級學術科通關寶典》，將【編著 童年工作坊】+【出版年 1998】拼湊成密碼："
  },
  {
    id: "q_2_10",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《為未來而教》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["葉丙成2015", "葉丙成15"],
    hint: "提示：WebOPAC 搜尋《為未來而教》，作者『葉丙成』+ 出版年『2015』。",
    question: "💡 請在 WebOPAC 搜尋《為未來而教》，將【作者姓名 葉丙成】+【出版年份 2015】拼湊成暗號："
  },

  // ─── 關卡 3：二樓書庫尋寶 (12 題選 2 題，按組別錯開防擁擠) ───
  {
    id: "q_3_1",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：523.2 號段】",
    location: "2 樓 書庫 (索書號 523.2 號段)",
    answer: ["baby", "BABY"],
    hint: "提示：請前往 2 樓書庫索書號 523.2 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿拿書）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 523.2 0812 2012] 《繪本主題教學資源手冊》\n❷ [索書號: 523.2 4450 2017] 《多元智能教具設計與應用》\n❸ [索書號: 523.26 8374 1998] 《保母人員(丙級)通關寶典》\n❹ [索書號: 523.23 4432 2011] 《幼兒園教保活動與課程》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_2",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：521.1 號段】",
    location: "2 樓 書庫 (索書號 521.1 號段)",
    answer: ["pass", "PASS"],
    hint: "提示：請前往 2 樓書庫索書號 521.1 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿拿書）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 521.1 7594 2023] 《自律學習力》\n❷ [索書號: 521.1 4144 2018] 《刻意練習》\n❸ [索書號: 521.1 4723 2016] 《讀書別靠意志力》\n❹ [索書號: 521.1 7744 2021] 《大腦喜歡這樣學》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_3",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：520-521.4 號段】",
    location: "2 樓 書庫 (索書號 520 號段)",
    answer: ["idea", "IDEA"],
    hint: "提示：請前往 2 樓書庫索書號 520~521.4 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿拿書）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 521.4 1190 2015] 《學思達》\n❷ [索書號: 521.407 4415 2015] 《為未來而教》\n❸ [索書號: 520.9476 7534 2011] 《美力芬蘭 從教育建立美感大國》\n❹ [索書號: 521.426 6034 2018] 《讓天賦發光》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_4",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：673.29 號段】",
    location: "2 樓 書庫 (索書號 673 號段)",
    answer: ["town", "TOWN"],
    hint: "提示：請前往 2 樓書庫索書號 673.29 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿拿書）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 673.29/12 1114 2007] 《走入員林街仔》\n❷ [索書號: 673.29/12 1111 2008 v.30] 《再現百果山風華 上》\n❸ [索書號: 673.29/12 1111 2008 v.31] 《再現百果山風華 下》\n❹ [索書號: 673.29/1 7522 2008 v.27] 《鹿港不見天街傳奇》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_5",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：673.22 號段】",
    location: "2 樓 書庫 (索書號 673 號段)",
    answer: ["asia", "ASIA"],
    hint: "提示：請前往 2 樓書庫索書號 673.22 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿拿書）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 673.22 8736 1998 v.1] 《漫畫台灣史 1 遠古時代》\n❷ [索書號: 673.22 8736 1998 v.2] 《漫畫台灣史 2 荷蘭時代》\n❸ [索書號: 673.22 8736 1998 v.3] 《漫畫台灣史 3 鄭家時代》\n❹ [索書號: 673.22 8736 1998 v.4] 《漫畫台灣史 4 清朝時代》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_6",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：782.1 號段】",
    location: "2 樓 書庫 (索書號 782.1 號段)",
    answer: ["hero", "HERO"],
    hint: "提示：請前往 2 樓書庫索書號 782.1 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿拿書）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 782.1 4469 2022] 《學霸養成記》\n❷ [索書號: 782.1 4469 2022] 《鬼才養成記》\n❸ [索書號: 782.1 4469 2022] 《聖人養成記》\n❹ [索書號: 782.1 4469 2022] 《英雄養成記》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_7",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：782.2 號段】",
    location: "2 樓 書庫 (索書號 782.2 號段)",
    answer: ["cool", "COOL"],
    hint: "提示：請前往 2 樓書庫索書號 782.2 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿拿書）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 782.24 4469 2022] 《狀元養成記》\n❷ [索書號: 782.2 4000 2021 v.1] 《胖古人的古人好朋友 1》\n❸ [索書號: 782.2 3095 2020] 《國學潮人誌，古人超有料》\n❹ [索書號: 782.2 3095 2022 v.2] 《國學潮人誌，古人超有才》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_8",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：745-747 號段】",
    location: "2 樓 書庫 (索書號 745-747 號段)",
    answer: ["trip", "TRIP"],
    hint: "提示：請前往 2 樓書庫索書號 745-747 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿拿書）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 747.49 2639 2009] 《驚喜挪威》\n❷ [索書號: 747.69 2639 2006] 《芬蘭驚艷》\n❸ [索書號: 747.69 7511 2012] 《芬蘭青年力》\n❹ [索書號: 745.09 4449 2011 v.18] 《北歐五國》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_9",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：855 號段】",
    location: "2 樓 書庫 (索書號 855 號段)",
    answer: ["wish", "WISH"],
    hint: "提示：請前往 2 樓書庫索書號 855 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿拿書）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 855 2290 2005 v.3] 《失樂園秘密花開了》\n❷ [索書號: 855 2290 2005 v.4] 《失樂園魔法失靈了》\n❸ [索書號: 855 2290 2007] 《戀之風景》\n❹ [索書號: 855.4 2290 2012] 《如果可以許一個願望》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_10",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：170 號段】",
    location: "2 樓 書庫 (索書號 170 號段)",
    answer: ["read", "READ"],
    hint: "提示：請前往 2 樓書庫索書號 170 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿拿書）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 170.181 0823 2019] 《情緒寄生》\n❷ [索書號: 175.21 4477 2006] 《大腦的主張》\n❸ [索書號: 177.2 444 2014] 《被討厭的勇氣》\n❹ [索書號: 177.3 118 2016] 《傾聽》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_11",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：876 號段】",
    location: "2 樓 書庫 (索書號 876 號段)",
    answer: ["love", "LOVE"],
    hint: "提示：請前往 2 樓書庫索書號 876 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿拿書）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 876.57 4424 2009] 《地獄誓約》\n❷ [索書號: 876.57 4477 2009] 《熱戀》\n❸ [索書號: 876.59 5622 2011] 《薩琪有好很多男朋友》\n❹ [索書號: 876.59 5622 2002] 《薩琪想要一個小寶寶》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_12",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：312 號段】",
    location: "2 樓 書庫 (索書號 312 號段)",
    answer: ["open", "OPEN"],
    hint: "提示：請前往 2 樓書庫索書號 312 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿拿書）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 312.83 1703 2025] 《AI繪圖一秒上手》\n❷ [索書號: 312.83 4423 2023] 《ChatGPT與AI繪圖》\n❸ [索書號: 312.83 7547 2023] 《瘋ChatGPT 顛覆未來》\n❹ [索書號: 312.83 4410 2023] 《AI生成時代》\n將收集到的 4 個字母組合成英文單字："
  },

  // ─── 關卡 5：2 樓流通櫃台 10 本實體圖書獨立過卡題目 (q_5_1 ~ q_5_10) ───
  {
    id: "q_5_1",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡 5-1：《古人原來很會過日子》】",
    location: "2 樓 流通櫃台",
    answer: ["051984", "053749", "052199", "046608", "047242", "048756", "050302", "050115", "047235", "021627", "R010", "r010", "999", "PASS888"],
    hint: "提示：持學生證與指定圖書《古人原來很會過日子》（索書號: 610.9 1010 2022）至二樓流通櫃台向館員刷條碼過卡（登錄號: 051984）！",
    question: "🏆 【題目 5-1】請持學生證與指定圖書《古人原來很會過日子》（索書號: 610.9 1010 2022）至二樓流通櫃台向館員刷條碼過卡（或輸入登錄號 051984）："
  },
  {
    id: "q_5_2",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡 5-2：《穿裙子的男孩》】",
    location: "2 樓 流通櫃台",
    answer: ["053749", "051984", "052199", "046608", "047242", "048756", "050302", "050115", "047235", "021627", "R020", "r020", "999", "PASS888"],
    hint: "提示：請拿取圖書《穿裙子的男孩》（索書號: 873.59 5304 2018）至櫃台審核過卡（登錄號: 053749）。",
    question: "🏆 【題目 5-2】請持《穿裙子的男孩》（索書號: 873.59 5304 2018）與學生證至流通櫃台向館員刷條碼過卡（或輸入登錄號 053749）："
  },
  {
    id: "q_5_3",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡 5-3：《網紅經濟》】",
    location: "2 樓 流通櫃台",
    answer: ["052199", "051984", "053749", "046608", "047242", "048756", "050302", "050115", "047235", "021627", "R010", "r010", "999", "PASS888"],
    hint: "提示：請至櫃台向館員出示團隊學生證與《網紅經濟》（索書號: 550.16 4063 2016）辦理過卡（登錄號: 052199）。",
    question: "🏆 【題目 5-3】請至二樓流通櫃台出示《網紅經濟》（索書號: 550.16 4063 2016）與學生證，由館員使用條碼槍刷卡通關："
  },
  {
    id: "q_5_4",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡 5-4：《獲利至上》】",
    location: "2 樓 流通櫃台",
    answer: ["050302", "051984", "053749", "052199", "046608", "047242", "048756", "050115", "047235", "021627", "R010", "r010", "999", "PASS888"],
    hint: "提示：請全組集合至流通櫃台出示《獲利至上》（索書號: 312.932 4474 2021）辦理過卡（登錄號: 050302）。",
    question: "🏆 【題目 5-4】請全組至二樓流通櫃台向館員出示《獲利至上》（索書號: 312.932 4474 2021）並完成實體過卡程序："
  },
  {
    id: "q_5_5",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡 5-5：《芬蘭與波羅的海三國繪旅行》】",
    location: "2 樓 流通櫃台",
    answer: ["046608", "051984", "053749", "052199", "047242", "048756", "050302", "050115", "047235", "021627", "PASS888", "R010", "r010", "999"],
    hint: "提示：持圖書《芬蘭與波羅的海三國繪旅行》（索書號: 747.09 0099 2018）與學生證至櫃台刷卡過卡（登錄號: 046608）。",
    question: "🏆 【題目 5-5】請持《芬蘭與波羅的海三國繪旅行》（索書號: 747.09 0099 2018）至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_6",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡 5-6：《這就是符號學！》】",
    location: "2 樓 流通櫃台",
    answer: ["047242", "051984", "053749", "052199", "046608", "048756", "050302", "050115", "047235", "021627", "PASS888", "R010", "r010", "999"],
    hint: "提示：持圖書《這就是符號學！》（索書號: 143 1184 2012）與學生證至櫃台刷卡過卡（登錄號: 047242）。",
    question: "🏆 【題目 5-6】請持《這就是符號學！》（索書號: 143 1184 2012）至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_7",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡 5-7：《國中生子彈筆記考試法》】",
    location: "2 樓 流通櫃台",
    answer: ["048756", "051984", "053749", "052199", "046608", "047242", "050302", "050115", "047235", "021627", "PASS888", "R010", "r010", "999"],
    hint: "提示：持圖書《國中生子彈筆記考試法》（索書號: 019.2 0407 2020）與學生證至櫃台刷卡過卡（登錄號: 048756）。",
    question: "🏆 【題目 5-7】請持《國中生子彈筆記考試法》（索書號: 019.2 0407 2020）至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_8",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡 5-8：《這幅畫,原來要看這裡》】",
    location: "2 樓 流通櫃台",
    answer: ["050115", "051984", "053749", "052199", "046608", "047242", "048756", "050302", "047235", "021627", "PASS888", "R010", "r010", "999"],
    hint: "提示：持圖書《這幅畫,原來要看這裡》（索書號: 909.4 3152 2015）與學生證至櫃台刷卡過卡（登錄號: 050115）。",
    question: "🏆 【題目 5-8】請持《這幅畫,原來要看這裡》（索書號: 909.4 3152 2015）至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_9",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡 5-9：《教科書裡的瘋狂實驗:漫畫化學》】",
    location: "2 樓 流通櫃台",
    answer: ["047235", "051984", "053749", "052199", "046608", "047242", "048756", "050302", "050115", "021627", "PASS888", "R010", "r010", "999"],
    hint: "提示：持圖書《教科書裡的瘋狂實驗:漫畫化學》（索書號: 347 2218 2022）與學生證至櫃台刷卡過卡（登錄號: 047235）。",
    question: "🏆 【題目 5-9】請持《教科書裡的瘋狂實驗:漫畫化學》（索書號: 347 2218 2022）至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_10",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡 5-10：《門神的故事》】",
    location: "2 樓 流通櫃台",
    answer: ["021627", "051984", "053749", "052199", "046608", "047242", "048756", "050302", "050115", "047235", "PASS888", "R010", "r010", "999"],
    hint: "提示：全組持圖書《門神的故事》（索書號: 538.6 2269 1989，登錄號: 021627）與學生證至櫃台刷卡過卡！",
    question: "🏆 【題目 5-10】請至二樓流通櫃台出示《門神的故事》（索書號: 538.6 2269 1989）進行過卡驗證，獲得圖書館智慧金鑰！"
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
      team.levelSequence = [1, 2, 3, 5]; // 固定為 1 -> 2 -> 3 -> 5

      if (!team.assignedQuestionsList || !Array.isArray(team.assignedQuestionsList) || team.assignedQuestionsList.length !== 9) {
        team.assignedQuestionsList = this.generateQuestionsListForTeam(team.groupNum || 1, state.questions);
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

  /**
   * 根據組別號碼產生該組 9 題獨立闖關題目 (關卡一 3 題 + 關卡二 3 題 + 關卡三 2 題 + 關卡五 1 題)
   * 防擁擠機制：關卡三與關卡五透過算法錯開圖書與架位，全場不搶書！
   */
  generateQuestionsListForTeam(groupNum, questionsPool) {
    const pool = (questionsPool && questionsPool.length > 0) ? questionsPool : DEFAULT_QUESTIONS_POOL;
    
    const cat1 = pool.filter(q => q.categoryLevel === 1);
    const cat2 = pool.filter(q => q.categoryLevel === 2);
    const cat3 = pool.filter(q => q.categoryLevel === 3);
    const cat5 = pool.filter(q => q.categoryLevel === 5);

    // 陣列洗牌隨機函數
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    // 1. 關卡一：隨機 3 題
    const qL1 = shuffle(cat1).slice(0, 3);
    
    // 2. 關卡二：隨機 3 題
    const qL2 = shuffle(cat2).slice(0, 3);

    // 3. 關卡三：防擁擠錯開分配 2 題 (按組別 offset 輪替)
    const offset3 = ((groupNum - 1) * 2) % (cat3.length || 12);
    const qL3_1 = cat3[offset3] || cat3[0];
    const qL3_2 = cat3[(offset3 + 1) % cat3.length] || cat3[1];
    const qL3 = [qL3_1, qL3_2];

    // 4. 關卡五：防擁擠錯開分配 1 本指定實體過卡圖書
    const offset5 = (groupNum - 1) % (cat5.length || 10);
    const qL5 = [cat5[offset5] || cat5[0]];

    // 組合為 9 題連續題目串列
    return [...qL1, ...qL2, ...qL3, ...qL5];
  }

  autoRegisterTeam(teamName, members) {
    const teamKeys = Object.keys(this.state.teams);
    const nextGroupNum = teamKeys.length + 1;
    const teamId = `team_${nextGroupNum}`;
    const defaultName = teamName ? teamName.trim() : `第 ${nextGroupNum} 組`;

    const questionsList = this.generateQuestionsListForTeam(nextGroupNum, this.state.questions);

    const newTeam = {
      id: teamId,
      groupNum: nextGroupNum,
      name: defaultName,
      members: members ? members.trim() : "",
      levelSequence: [1, 2, 3, 5],
      assignedQuestionsList: questionsList,
      stepIndex: 0, // 0 到 8 (共 9 題)
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

  getCurrentQuestionForTeam(teamId) {
    const team = this.state.teams[teamId];
    if (!team) return null;

    const qList = team.assignedQuestionsList || [];
    const stepIdx = typeof team.stepIndex === 'number' ? team.stepIndex : 0;

    if (team.completed || stepIdx >= qList.length) {
      return null;
    }

    const currentQ = qList[stepIdx];
    const catLevel = currentQ.categoryLevel;

    // 計算在該關卡內的子題數 (例如：關卡一 1/3, 2/3, 3/3)
    let levelSubStep = 1;
    let levelSubTotal = 1;

    if (catLevel === 1) {
      levelSubStep = stepIdx + 1;
      levelSubTotal = 3;
    } else if (catLevel === 2) {
      levelSubStep = stepIdx - 3 + 1;
      levelSubTotal = 3;
    } else if (catLevel === 3) {
      levelSubStep = stepIdx - 6 + 1;
      levelSubTotal = 2;
    } else if (catLevel === 5) {
      levelSubStep = 1;
      levelSubTotal = 1;
    }

    const failedCount = (team.failedAttempts && team.failedAttempts[stepIdx]) ? team.failedAttempts[stepIdx] : 0;
    
    return {
      questionObj: currentQ,
      stepNumber: stepIdx + 1,
      totalSteps: 9,
      catLevel: catLevel,
      levelSubStep: levelSubStep,
      levelSubTotal: levelSubTotal,
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

    const qList = team.assignedQuestionsList || [];
    const stepIdx = typeof team.stepIndex === 'number' ? team.stepIndex : 0;
    const currentQ = qList[stepIdx];
    
    if (!currentQ) return { success: false, message: "關卡資料異常" };

    if (this.checkAnswerMatch(answerInput, currentQ.answer)) {
      const now = Date.now();
      team.stepIndex = stepIdx + 1;
      team.levelTimes[team.stepIndex] = now;

      if (team.stepIndex >= 9) {
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
      if (!team.failedAttempts) team.failedAttempts = {};
      team.failedAttempts[stepIdx] = (team.failedAttempts[stepIdx] || 0) + 1;
      
      this.saveState();

      const failedCount = team.failedAttempts[stepIdx];
      let msg = "解答不正確，請仔細檢查題目與地點線索！";
      if (failedCount >= 2) {
        msg = "解答不正確！求救提示已解鎖，請參考下方提示！";
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
