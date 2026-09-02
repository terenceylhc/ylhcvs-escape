/**
 * 員林家商圖書館密室逃脫 - 全域通訊與狀態控制核心 (App Core v57.0 - 方案 A 強制廣播重置與舊組別徹底清空版)
 * 特點說明：
 * 1. 實作【方案 A】：當老師在大螢幕按下「重置大會」，發送強制清空指令給 Firebase 與所有設備。
 * 2. 徹底解決歷史舊組別 (味全龍、本機隊...) 殘留或死而復生問題！
 * 3. 各小隊配置 11 題 (關1:3題, 關2:3題, 關3:1題, 關4:3題隨機防抄, 關5:1題過卡)
 */

const DEFAULT_QUESTIONS_POOL = [
  // ─── 關卡 1：館舍尋蹤與守護法則 (10 題隨機抽 3 題) ───
  {
    id: "q_1_1",
    categoryLevel: 1,
    title: "關卡一：【館舍規定算式】",
    location: "自主學習空間",
    answer: "17",
    hint: "提示：書籍借閱上限冊數=8，借期週數=? 自主學習空間在幾樓?",
    question: "請參閱本館介紹，計算：(書籍借閱上限冊數 × 圖書借期週數) + 自主學習空間樓層 ＝ ？"
  },
  {
    id: "q_1_2",
    categoryLevel: 1,
    title: "關卡一：【館舍規定算式】",
    location: "TEAL教室",
    answer: "7",
    hint: "提示：期刊借閱上限冊數=5，影音上限=? TEAL教室在幾樓?",
    question: "請參閱本館介紹，計算：(期刊借閱上限冊數 + 影音借閱上限部數) × TEAL教室樓層 ＝ ？"
  },
  {
    id: "q_1_3",
    categoryLevel: 1,
    title: "關卡一：【員家藝廊與借閱規定密碼】",
    location: "員家藝廊",
    answer: "1820",
    hint: "提示：員家藝廊樓層=1，書籍上限=? 借期週數=? 當期雜誌可借冊數=0",
    question: "請參閱本館介紹，回答 4 位數密碼：（員家藝廊樓層 / 書籍借閱上限冊數 / 圖書借期週數 / 當期雜誌外借冊數）："
  },
  {
    id: "q_1_4",
    categoryLevel: 1,
    title: "關卡一：【圖書與期刊借期密碼】",
    location: "服務台導覽圖",
    answer: "9",
    hint: "提示：圖書借期天數=14，期刊上限=? 自主學習區在幾樓?",
    question: "請參閱本館介紹，計算：(圖書借期天數 - 期刊借閱上限冊數) × 自主學習區樓層 ＝ ？"
  },
  {
    id: "q_1_5",
    categoryLevel: 1,
    title: "關卡一：【全館借閱上限總和】",
    location: "閱覽室公告欄",
    answer: "15",
    hint: "提示：一般圖書借閱上限冊數=8，期刊上限=? 影音上限=?",
    question: "請參閱本館介紹，計算：一般圖書借閱上限冊數 + 期刊借閱上限冊數 + 視聽影音借閱上限部數 ＝ ？"
  },
  {
    id: "q_1_6",
    categoryLevel: 1,
    title: "關卡一：【視聽影音借閱密碼】",
    location: "視聽區與藝廊",
    answer: "3",
    hint: "提示：視聽影音借閱上限部數=2，影音借期週數=? 員家藝廊在幾樓?",
    question: "請參閱本館介紹，計算：(視聽影音借閱上限部數 × 影音借期週數) + 員家藝廊樓層 ＝ ？"
  },
  {
    id: "q_1_7",
    categoryLevel: 1,
    title: "關卡一：【期刊過刊借期算式】",
    location: "閱覽室過刊區",
    answer: "6",
    hint: "提示：期刊借閱上限冊數=5，過刊借期週數=?",
    question: "請參閱本館介紹，計算：(期刊借閱上限冊數 × 期刊過刊借期週數) + 1 ＝ ？"
  },
  {
    id: "q_1_8",
    categoryLevel: 1,
    title: "關卡一：【圖書續借規則密碼】",
    location: "服務台公告欄",
    answer: "18",
    hint: "提示：書籍借閱上限冊數=8，允許續借次數=? 借期週數=?",
    question: "請參閱本館介紹，計算：(書籍借閱上限冊數 + 圖書允許續借次數) × 圖書借期週數 ＝ ？"
  },
  {
    id: "q_1_9",
    categoryLevel: 1,
    title: "關卡一：【館藏守護天數密碼】",
    location: "自主學習空間",
    answer: "7",
    hint: "提示：圖書借期天數=14，書籍借閱上限=? 自主學習空間在幾樓?",
    question: "請參閱本館介紹，計算：(圖書借期天數 - 書籍借閱上限冊數) + 自主學習空間樓層 ＝ ？"
  },
  {
    id: "q_1_10",
    categoryLevel: 1,
    title: "關卡一：【館舍三大空間總和】",
    location: "藝廊/TEAL/自主區",
    answer: "6",
    hint: "提示：員家藝廊樓層=1，TEAL教室在幾樓? 自主區在幾樓? 影音上限=?",
    question: "請參閱本館介紹，計算：(藝廊樓層 + TEAL教室樓層 + 自主區樓層) × 影音借閱上限部數 ＝ ？"
  },

  // ─── 關卡 2：OPAC 線上檢索 (10 題隨機抽 3 題) ───
  {
    id: "q_2_1",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《情緒寄生》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["許皓宜2019", "許皓宜19"],
    hint: "提示：請在 WebOPAC 輸入書名《情緒寄生》，點入詳細頁面查看作者姓名與出版年份！",
    question: "🔍 請在 WebOPAC 搜尋《情緒寄生》，將【作者姓名】+【出版年份】拼湊成密碼："
  },
  {
    id: "q_2_2",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《大腦的主張》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["洪蘭2006", "洪蘭06"],
    hint: "提示：請在 WebOPAC 輸入書名《大腦的主張》，點入詳細頁面查看作者姓名與出版年份！",
    question: "📖 請在 WebOPAC 搜尋《大腦的主張》，將【作者姓名】+【出版年份】拼湊成暗號："
  },
  {
    id: "q_2_3",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《211彩虹瘦身餐盤》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["王麗蓉2024", "王麗蓉24"],
    hint: "提示：請在 WebOPAC 輸入書名《211彩虹瘦身餐盤》，點入詳細頁面查看作者姓名與出版年份！",
    question: "🥗 請在 WebOPAC 搜尋《211彩虹瘦身餐盤》，將【作者姓名】+【出版年份】拼湊成暗號："
  },
  {
    id: "q_2_4",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《觀念化學》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["蘇卡奇2006", "蘇卡奇06"],
    hint: "提示：請在 WebOPAC 輸入書名《觀念化學》，點入詳細頁面查看作者譯名與出版年份！",
    question: "🧪 請在 WebOPAC 搜尋《觀念化學》，將【作者譯名】+【出版年份】拼湊成密碼："
  },
  {
    id: "q_2_5",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《夜巡者》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["盧基揚年科2006", "盧基揚年科06"],
    hint: "提示：請在 WebOPAC 輸入書名《夜巡者》，點入詳細頁面查看作者姓名與出版年份！",
    question: "🐺 請在 WebOPAC 搜尋《夜巡者》，將【作者姓名】+【出版年份】拼湊成暗號："
  },
  {
    id: "q_2_6",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《國學潮人誌.2,古人超有才》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["宋怡慧2022", "宋怡慧22"],
    hint: "提示：請在 WebOPAC 輸入書名《國學潮人誌.2,古人超有才》，點入詳細頁面查看作者姓名與出版年份！",
    question: "😎 請在 WebOPAC 搜尋《國學潮人誌.2,古人超有才》，將【作者姓名】+【出版年份】拼湊成密碼："
  },
  {
    id: "q_2_7",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《芬蘭驚艷》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["吳祥輝2006", "吳祥輝06", "吳祥輝2012", "吳祥輝12"],
    hint: "提示：請在 WebOPAC 輸入書名《芬蘭驚艷》，點入詳細頁面查看作者姓名與出版年份！",
    question: "✈️ 請在 WebOPAC 搜尋《芬蘭驚艷》，將【作者姓名】+【出版年份】拼湊成暗號："
  },
  {
    id: "q_2_8",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《走入員林街仔》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["彰化縣文化局2007", "彰化縣文化局07"],
    hint: "提示：請在 WebOPAC 輸入書名《走入員林街仔》，點入詳細頁面查看出版者與出版年份！（⚠️ 注意！是出版者，不是作者喔！）",
    question: "🏠 請在 WebOPAC 搜尋《走入員林街仔》，將【出版者】+【出版年份】拼湊成密碼："
  },
  {
    id: "q_2_9",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《為什麼非蒂芬妮藍不可?》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["漢布利2023", "漢布利23"],
    hint: "提示：請在 WebOPAC 輸入書名《為什麼非蒂芬妮藍不可?》，點入詳細頁面查看作者與出版年份！",
    question: "🎨 請在 WebOPAC 搜尋《為什麼非蒂芬妮藍不可?》，將【作者】+【出版年份】拼湊成密碼："
  },
  {
    id: "q_2_10",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《為未來而教》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["葉丙成2015", "葉丙成15"],
    hint: "提示：請在 WebOPAC 輸入書名《為未來而教》，點入詳細頁面查看作者姓名與出版年份！",
    question: "💡 請在 WebOPAC 搜尋《為未來而教》，將【作者姓名】+【出版年份】拼湊成暗號："
  },

  // ─── 關卡 3：二樓書庫尋寶 (11 題選 1 題) ───
  {
    id: "q_3_1",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶】",
    location: "2 樓 書庫",
    answer: ["baby", "BABY"],
    hint: "提示：請至 2 樓書庫索書號 523.2 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 523.2 0812 2012] 《繪本主題教學資源手冊》\n❷ [索書號: 523.2 4450 2017] 《多元智能教具設計與應用》\n❸ [索書號: 523.26 8374 1998] 《保母人員(丙級)通關寶典》\n❹ [索書號: 523.23 4432 2011] 《幼兒園教保活動與課程》\n將收集到的 4 個字母組合英文單字："
  },
  {
    id: "q_3_2",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶】",
    location: "2 樓 書庫",
    answer: ["pass", "PASS"],
    hint: "提示：請至 2 樓書庫索書號 521.1 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 521.1 7594 2023] 《自律學習力》\n❷ [索書號: 521.1 4144 2018] 《刻意練習》\n❸ [索書號: 521.1 4723 2016] 《讀書別靠意志力》\n❹ [索書號: 521.1 7744 2021] 《大腦喜歡這樣學》\n將收集到的 4 個字母組合英文單字："
  },
  {
    id: "q_3_3",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶】",
    location: "2 樓 書庫",
    answer: ["idea", "IDEA"],
    hint: "提示：請至 2 樓書庫索書號 520~521.4 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 521.4 1190 2015] 《學思達》\n❷ [索書號: 521.407 4415 2015] 《為未來而教》\n❸ [索書號: 520.9476 7534 2011] 《美力芬蘭 從教育建立美感大國》\n❹ [索書號: 521.426 6034 2018] 《讓天賦發光》\n將收集到的 4 個字母組合英文單字："
  },
  {
    id: "q_3_4",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶】",
    location: "2 樓 書庫",
    answer: ["town", "TOWN"],
    hint: "提示：請至 2 樓書庫索書號 673.29 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 673.29/12 1114 2007] 《走入員林街仔》\n❷ [索書號: 673.29/12 1111 2008 v.30] 《再現百果山風華 上》\n❸ [索書號: 673.29/12 1111 2008 v.31] 《再現百果山風華 下》\n❹ [索書號: 673.29/1 7522 2008 v.27] 《鹿港不見天街傳奇》\n將收集到的 4 個字母組合英文單字："
  },
  {
    id: "q_3_5",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶】",
    location: "2 樓 書庫",
    answer: ["asia", "ASIA"],
    hint: "提示：請至 2 樓書庫索書號 673.22 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 673.22 8736 1998 v.1] 《漫畫台灣史 1 遠古時代》\n❷ [索書號: 673.22 8736 1998 v.2] 《漫畫台灣史 2 荷蘭時代》\n❸ [索書號: 673.22 8736 1998 v.3] 《漫畫台灣史 3 鄭家時代》\n❹ [索書號: 673.22 8736 1998 v.4] 《漫畫台灣史 4 清朝時代》\n將收集到的 4 個字母組合英文單字："
  },
  {
    id: "q_3_6",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶】",
    location: "2 樓 書庫",
    answer: ["hero", "HERO"],
    hint: "提示：請至 2 樓書庫索書號 782.1 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 782.1 4469 2022] 《學霸養成記》\n❷ [索書號: 782.1 4469 2022] 《鬼才養成記》\n❸ [索書號: 782.1 4469 2022] 《聖人養成記》\n❹ [索書號: 782.1 4469 2022] 《英雄養成記》\n將收集到的 4 個字母組合英文單字："
  },
  {
    id: "q_3_7",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶】",
    location: "2 樓 書庫",
    answer: ["cool", "COOL"],
    hint: "提示：請至 2 樓書庫索書號 782.2 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 782.24 4469 2022] 《狀元養成記》\n❷ [索書號: 782.2 4000 2021 v.1] 《胖古人的古人好朋友 1》\n❸ [索書號: 782.2 3095 2020] 《國學潮人誌，古人超有料》\n❹ [索書號: 782.2 3095 2022 v.2] 《國學潮人誌，古人超有才》\n將收集到的 4 個字母組合英文單字："
  },
  {
    id: "q_3_8",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶】",
    location: "2 樓 書庫",
    answer: ["trip", "TRIP"],
    hint: "提示：請至 2 樓書庫索書號 745-747 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 747.49 2639 2009] 《驚喜挪威》\n❷ [索書號: 747.69 2639 2006] 《芬蘭驚艷》\n❸ [索書號: 747.69 7511 2012] 《芬蘭青年力》\n❹ [索書號: 745.09 4449 2011 v.18] 《北歐五國》\n將收集到的 4 個字母組合英文單字："
  },
  {
    id: "q_3_9",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶】",
    location: "2 樓 書庫",
    answer: ["wish", "WISH"],
    hint: "提示：請至 2 樓書庫索書號 855 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 855 2290 2005 v.3] 《失樂園秘密花開了》\n❷ [索書號: 855 2290 2005 v.4] 《失樂園魔法失靈了》\n❸ [索書號: 855 2290 2007] 《戀之風景》\n❹ [索書號: 855.4 2290 2012] 《如果可以許一個願望》\n將收集到的 4 個字母組合英文單字："
  },
  {
    id: "q_3_11",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶】",
    location: "2 樓 書庫",
    answer: ["love", "LOVE"],
    hint: "提示：請至 2 樓書庫索書號 876 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 876.57 4424 2009] 《地獄誓約》\n❷ [索書號: 876.57 4477 2009] 《熱戀》\n❸ [索書號: 876.59 5622 2011] 《薩琪有好很多男朋友》\n❹ [索書號: 876.59 5622 2002] 《薩琪想要一個小寶寶》\n將收集到的 4 個字母組合英文單字："
  },
  {
    id: "q_3_12",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶】",
    location: "2 樓 書庫",
    answer: ["open", "OPEN"],
    hint: "提示：請至 2 樓書庫索書號 312 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 312.83 1703 2025] 《AI繪圖一秒上手》\n❷ [索書號: 312.83 4423 2023] 《ChatGPT與AI繪圖》\n❸ [索書號: 312.83 7547 2023] 《瘋ChatGPT 顛覆未來》\n❹ [索書號: 312.83 4410 2023] 《AI生成時代》\n將收集到的 4 個字母組合英文單字："
  },

  // ─── 關卡 4：當期與過期期刊尋寶 (20 題隨機抽 3 題亂數防抄襲；隱藏代碼，全數 2 書組合) ───
  {
    id: "q_4_1",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "11",
    hint: "提示：新小牛頓代號 A10 (數字=10)，財訊代號 C1 (數字=1)，再把兩個數字相加=11。",
    question: "📰 請至當期期刊區或過期期刊區，尋找《新小牛頓》與《財訊》，將兩本期刊架位代號的【數字部分相加】作為密碼："
  },
  {
    id: "q_4_2",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "15",
    hint: "提示：康健代號 B9 (數字=9)，少年牛頓代號 C6 (數字=6)，再把兩個數字相加=15。",
    question: "📰 請至當期期刊區或過期期刊區，尋找《康健》與《少年牛頓》，將兩本期刊架位代號的【數字部分相加】作為密碼："
  },
  {
    id: "q_4_3",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "23",
    hint: "提示：國家地理代號 C17 (數字=17)，鄉間小路代號 B6 (數字=6)，再把兩個數字相加=23。",
    question: "📰 請至當期期刊區或過期期刊區，尋找《國家地理》與《鄉間小路》，將兩本期刊架位代號的【數字部分相加】作為密碼："
  },
  {
    id: "q_4_4",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "17",
    hint: "提示：商業周刊代號 C9 (數字=9)，美麗佳人代號 A8 (數字=8)，再把兩個數字相加=17。",
    question: "📰 請至當期期刊區或過期期刊區，尋找《商業周刊》與《美麗佳人》，將兩本期刊架位代號的【數字部分相加】作為密碼："
  },
  {
    id: "q_4_5",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "26",
    hint: "提示：料理台灣代號 A14 (數字=14)，經典代號 C12 (數字=12)，再把兩個數字相加=26。",
    question: "📰 請至當期期刊區或過期期刊區，尋找《料理台灣》與《經典》，將兩本期刊架位代號的【數字部分相加】作為密碼："
  },
  {
    id: "q_4_6",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "17",
    hint: "提示：遠見代號 B13 (數字=13)，皇冠代號 C4 (數字=4)，再把兩個數字相加=17。",
    question: "📰 請至當期期刊區或過期期刊區，尋找《遠見》與《皇冠》，將兩本期刊架位代號的【數字部分相加】作為密碼："
  },
  {
    id: "q_4_7",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "15",
    hint: "提示：天下代號 B12 (數字=12)，今周刊代號數字部分是多少呢? 再把兩個數字相加=?。",
    question: "📰 請至當期期刊區或過期期刊區，尋找《天下》與《今周刊》，將兩本期刊架位代號的【數字部分相加】作為密碼："
  },
  {
    id: "q_4_8",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "商人",
    hint: "提示：請前往期刊區找出《商業周刊》與《經理人》，分別取出兩本刊名的指定字元，拼湊成一個與買賣生意有關的職業詞語！",
    question: "📰 請至當期期刊區或過期期刊區，尋找《商業周刊》與《經理人》，將【商業周刊第 1 個字】+【經理人第 3 個字】組合成一個詞語作為密碼："
  },
  {
    id: "q_4_9",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "皇家",
    hint: "提示：請前往期刊區找出《皇冠》與《時尚家居》，分別取出兩本刊名的指定字元，拼湊成象徵帝王家族的詞語！",
    question: "📰 請至當期期刊區或過期期刊區，尋找《皇冠》與《時尚家居》，將【皇冠第 1 個字】+【時尚家居第 3 個字】組合成一個詞語作為密碼："
  },
  {
    id: "q_4_10",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "國家",
    hint: "提示：請前往期刊區找出《國家地理》與《時尚家居》，分別取出兩本刊名的指定字元，拼湊成表示國度社會的雙字詞語！",
    question: "📰 請至當期期刊區或過期期刊區，尋找《國家地理》與《時尚家居》，將【國家地理第 1 個字】+【時尚家居第 3 個字】組合成一個詞語作為密碼："
  },
  {
    id: "q_4_11",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "美人",
    hint: "提示：請前往期刊區找出《美麗佳人》與《經理人》，分別取出兩本刊名的指定字元，拼湊成形容容貌美麗者的雙字詞語！",
    question: "📰 請至當期期刊區或過期期刊區，尋找《美麗佳人》與《經理人》，將【美麗佳人第 1 個字】+【經理人第 3 個字】組合成一個詞語作為密碼："
  },
  {
    id: "q_4_12",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "小夫",
    hint: "提示：請前往期刊區找出《鄉間小路》與《貴夫人》，分別取出兩本刊名的指定字元，拼湊成經典動漫哆啦A夢角色的名字！",
    question: "📰 請至當期期刊區或過期期刊區，尋找《鄉間小路》與《貴夫人》，將【鄉間小路第 3 個字】+【貴夫人第 2 個字】拼湊成密碼："
  },
  {
    id: "q_4_13",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "旅料",
    hint: "提示：請前往期刊區找出《旅人誌》與《料理台灣》，分別取出兩本刊名的第 1 個字組合輸入！",
    question: "📰 請至當期期刊區或過期期刊區，尋找《旅人誌》與《料理台灣》，將【旅人誌第 1 個字】+【料理台灣第 1 個字】拼湊成密碼："
  },
  {
    id: "q_4_14",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "春麗",
    hint: "提示：請前往期刊區找出《常春》與《美麗佳人》，分別取出兩本刊名的指定字元組合輸入！",
    question: "📰 請至當期期刊區或過期期刊區，尋找《常春》與《美麗佳人》，將【常春第 2 個字】+【美麗佳人第 2 個字】拼湊成密碼："
  },
  {
    id: "q_4_15",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "科經",
    hint: "提示：請前往期刊區找出《科學人》與《經典》，分別取出兩本刊名的第 1 個字組合輸入！",
    question: "📰 請至當期期刊區或過期期刊區，尋找《科學人》與《經典》，將【科學人第 1 個字】+【經典第 1 個字】拼湊成密碼："
  },
  {
    id: "q_4_16",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "張飛",
    hint: "提示：請前往期刊區找出《張老師》與《少年飛訊》，分別取出兩本刊名的指定字元，拼湊成三國著名武將的名字！",
    question: "📰 請至當期期刊區或過期期刊區，尋找《張老師》與《少年飛訊》，將【張老師第 1 個字】+【少年飛訊第 3 個字】拼湊成密碼："
  },
  {
    id: "q_4_17",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "老大",
    hint: "提示：請前往期刊區找出《張老師》與《知識大圖解》，分別取出兩本刊名的指定字元，拼湊成尊稱團體領導者的詞語！",
    question: "📰 請至當期期刊區或過期期刊區，尋找《張老師》與《知識大圖解》，將【張老師第 2 個字】+【知識大圖解第 3 個字】拼湊成密碼："
  },
  {
    id: "q_4_18",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "大師",
    hint: "提示：請前往期刊區找出《知識大圖解》與《張老師》，分別取出兩本刊名的指定字元，拼湊成尊稱學問或造詣極高者的詞語！",
    question: "📰 請至當期期刊區或過期期刊區，尋找《知識大圖解》與《張老師》，將【知識大圖解第 3 個字】+【張老師第 3 個字】拼湊成密碼："
  },
  {
    id: "q_4_19",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "飛人",
    hint: "提示：請前往期刊區找出《少年飛訊》與《科學人》，分別取出兩本刊名的指定字元，拼湊成形容籃球巨星彈跳力極佳的詞語！",
    question: "📰 請至當期期刊區或過期期刊區，尋找《少年飛訊》與《科學人》，將【少年飛訊第 3 個字】+【科學人第 3 個字】拼湊成密碼："
  },
  {
    id: "q_4_20",
    categoryLevel: 4,
    title: "關卡四：【期刊架尋寶】",
    location: "當期期刊區 / 過期期刊區",
    answer: "牛人",
    hint: "提示：請前往期刊區找出《新小牛頓》與《科學人》，分別取出兩本刊名的指定字元，拼湊成形容非常厲害高手的網路流行語！",
    question: "📰 請至當期期刊區或過期期刊區，尋找《新小牛頓》與《科學人》，將【新小牛頓第 3 個字】+【科學人第 3 個字】拼湊成密碼："
  },

  // ─── 關卡 5：2 樓流通櫃台 10 本實體圖書過卡題目 (選 1 題) ───
  {
    id: "q_5_1",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《古人原來很會過日子》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《古人原來很會過日子》",
    barcode: "1054564",
    answer: ["1054564", "PASS888", "999"],
    hint: "💡 提示：請先使用員林家商圖書館館藏查詢系統查詢指定圖書《古人原來很會過日子》的索書號與架位，至二樓書庫找到該實體書後，全組持學生證與書籍至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《古人原來很會過日子》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_2",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《穿裙子的男孩》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《穿裙子的男孩》",
    barcode: "053749",
    answer: ["053749", "PASS888", "999"],
    hint: "💡 提示：請先使用員林家商圖書館館藏查詢系統查詢指定圖書《穿裙子的男孩》的索書號與架位，至二樓書庫找到該實體書後，全組持學生證與書籍至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《穿裙子的男孩》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_3",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《網紅經濟》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《網紅經濟》",
    barcode: "052199",
    answer: ["052199", "PASS888", "999"],
    hint: "💡 提示：請先使用員林家商圖書館館藏查詢系統查詢指定圖書《網紅經濟》的索書號與架位，至二樓書庫找到該實體書後，全組持學生證與書籍至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《網紅經濟》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_4",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《獲利至上》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《獲利至上》",
    barcode: "054293",
    answer: ["054293", "PASS888", "999"],
    hint: "💡 提示：請先使用員林家商圖書館館藏查詢系統查詢指定圖書《獲利至上》的索書號與架位，至二樓書庫找到該實體書後，全組持學生證與書籍至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《獲利至上》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_5",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《芬蘭與波羅的海三國繪旅行》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《芬蘭與波羅的海三國繪旅行》",
    barcode: "052776",
    answer: ["052776", "PASS888", "999"],
    hint: "💡 提示：請先使用員林家商圖書館館藏查詢系統查詢指定圖書《芬蘭與波羅的海三國繪旅行》的索書號與架位，至二樓書庫找到該實體書後，全組持學生證與書籍至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《芬蘭與波羅的海三國繪旅行》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_6",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《這就是符號學！》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《這就是符號學！》",
    barcode: "052392",
    answer: ["052392", "PASS888", "999"],
    hint: "💡 提示：請先使用員林家商圖書館館藏查詢系統查詢指定圖書《這就是符號學！》的索書號與架位，至二樓書庫找到該實體書後，全組持學生證與書籍至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《這就是符號學！》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_7",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《國中生子彈筆記考試法》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《國中生子彈筆記考試法》",
    barcode: "053916",
    answer: ["053916", "PASS888", "999"],
    hint: "💡 提示：請先使用員林家商圖書館館藏查詢系統查詢指定圖書《國中生子彈筆記考試法》的索書號與架位，至二樓書庫找到該實體書後，全組持學生證與書籍至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《國中生子彈筆記考試法》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_8",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《這幅畫,原來要看這裡》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《這幅畫,原來要看這裡》",
    barcode: "051115",
    answer: ["051115", "PASS888", "999"],
    hint: "💡 提示：請先使用員林家商圖書館館藏查詢系統查詢指定圖書《這幅畫,原來要看這裡》的索書號與架位，至二樓書庫找到該實體書後，全組持學生證與書籍至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《這幅畫,原來要看這裡》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_9",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《教科書裡的瘋狂實驗:漫畫化學》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《教科書裡的瘋狂實驗:漫畫化學》",
    barcode: "1054906",
    answer: ["1054906", "PASS888", "999"],
    hint: "💡 提示：請先使用員林家商圖書館館藏查詢系統查詢指定圖書《教科書裡的瘋狂實驗:漫畫化學》的索書號與架位，至二樓書庫找到該實體書後，全組持學生證與書籍至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《教科書裡的瘋狂實驗:漫畫化學》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_10",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《門神的故事》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《門神的故事》",
    barcode: "025809",
    answer: ["025809", "PASS888", "999"],
    hint: "💡 提示：請先使用員林家商圖書館館藏查詢系統查詢指定圖書《門神的故事》的索書號與架位，至二樓書庫找到該實體書後，全組持學生證與書籍至二樓流通櫃台向館員刷條碼過卡，獲取智慧金鑰！",
    question: "🏆 請全組持學生證與指定圖書《門神的故事》至二樓流通櫃台向館員刷條碼過卡，獲取智慧金鑰！"
  }
];

const DEFAULT_STATE = {
  status: 'setup',
  winningQuota: 3,
  startTime: null,
  questions: DEFAULT_QUESTIONS_POOL,
  teams: {},
  resetTimestamp: Date.now()
};

class GameEngine {
  constructor() {
    this.channel = new BroadcastChannel('ylhcvs_escape_room_bus');
    this.state = this.loadState();
    this.listeners = [];
    this.firebaseDb = null;
    this.firebaseStatus = "INIT";
    this.firebaseError = null;

    this.initFirebase();

    this.channel.onmessage = (event) => {
      if (event.data && event.data.type === 'STATE_UPDATE') {
        this.mergeState(event.data.state);
        this.notifyListeners();
      }
    };
  }

  cleanObjectForFirebase(obj) {
    if (!obj) return {};
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      return value === undefined ? null : value;
    }));
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
    if (!state.resetTimestamp) state.resetTimestamp = 0;

    Object.values(state.teams).forEach(team => {
      team.levelSequence = [1, 2, 3, 4, 5];

      if (!team.assignedQuestionsList || !Array.isArray(team.assignedQuestionsList) || team.assignedQuestionsList.length !== 11 || team.assignedQuestionsList.some(q => !q)) {
        team.assignedQuestionsList = this.generateQuestionsListForTeam(team.groupNum || 1, state.questions);
      }
      if (typeof team.stepIndex !== 'number') team.stepIndex = 0;
      if (!team.levelTimes) team.levelTimes = {};
      if (!team.failedAttempts) team.failedAttempts = {};
    });

    return state;
  }

  // 方案 A：強化版合併邏輯，當接收到重置（resetTimestamp 更新或 teams 歸零）時，100% 抹除舊快取的歷史小隊！
  mergeState(incomingState) {
    if (!incomingState) return;
    const sanitized = this.sanitizeState(incomingState);
    
    const incomingResetTime = sanitized.resetTimestamp || 0;
    const localResetTime = (this.state && this.state.resetTimestamp) || 0;

    // 如果傳入的狀態屬於重置操作（resetTimestamp 較新，或狀態為 setup 且 teams 為空）
    if (incomingResetTime > localResetTime || (sanitized.status === 'setup' && Object.keys(sanitized.teams || {}).length === 0)) {
      this.state = sanitized;
      return;
    }

    // 普通動態合併
    const mergedTeams = { ...(sanitized.teams || {}) };
    if (this.state && this.state.teams && this.state.status !== 'setup') {
      Object.keys(this.state.teams).forEach(tid => {
        if (!mergedTeams[tid]) {
          mergedTeams[tid] = this.state.teams[tid];
        }
      });
    }

    this.state = sanitized;
    this.state.teams = mergedTeams;
  }

  initFirebase(retryCount = 0) {
    if (typeof firebase === 'undefined' || !window.firebaseConfig) {
      if (retryCount < 5) {
        setTimeout(() => this.initFirebase(retryCount + 1), 500);
      } else {
        this.firebaseStatus = "NOT_CONFIGURED";
        this.firebaseError = "未偵測到 firebase-config.js 金鑰設定";
        this.notifyListeners();
      }
      return;
    }

    if (this.firebaseDb) return;

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(window.firebaseConfig);
      }
      this.firebaseDb = firebase.database();

      const connectedRef = this.firebaseDb.ref(".info/connected");
      connectedRef.on("value", (snap) => {
        if (snap.val() === true) {
          console.log("🔥 Firebase 跨裝置即時資料庫連線成功！");
          this.firebaseStatus = "CONNECTED";
          this.firebaseError = null;
        } else {
          this.firebaseStatus = "DISCONNECTED";
          this.firebaseError = "未連線至 Firebase 雲端伺服器 (請確認網路連線與 Firebase 設定)";
        }
        this.notifyListeners();
      });

      this.firebaseDb.ref('ylhcvs_game_state_a').on('value', (snapshot) => {
        const val = snapshot.val();
        if (val) {
          this.mergeState(val);
          localStorage.setItem('ylhcvs_escape_state_a', JSON.stringify(this.state));
          this.notifyListeners();
        }
      }, (error) => {
        console.error("❌ Firebase 讀取權限失敗：", error);
        this.firebaseStatus = "ERROR";
        this.firebaseError = error.message;
        this.notifyListeners();
      });
    } catch (e) {
      console.warn("Firebase 初始化異常：", e);
      this.firebaseStatus = "ERROR";
      this.firebaseError = e.message;
    }
  }

  loadState() {
    const saved = localStorage.getItem('ylhcvs_escape_state_a');
    if (saved) {
      try { 
        return this.sanitizeState(JSON.parse(saved)); 
      } catch (e) {}
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    this.state = this.sanitizeState(this.state);
    localStorage.setItem('ylhcvs_escape_state_a', JSON.stringify(this.state));
    this.channel.postMessage({ type: 'STATE_UPDATE', state: this.state });
    
    if (this.firebaseDb) {
      const cleanData = this.cleanObjectForFirebase(this.state);
      this.firebaseDb.ref('ylhcvs_game_state_a').set(cleanData).then(() => {
        this.firebaseStatus = "CONNECTED";
        this.firebaseError = null;
      }).catch(err => {
        console.error("❌ Firebase 寫入被拒：", err);
        this.firebaseStatus = "ERROR";
        this.firebaseError = "PERMISSION_DENIED: Firebase 寫入遭拒！";
        this.notifyListeners();
      });
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

  generateQuestionsListForTeam(groupNum, questionsPool) {
    let pool = DEFAULT_QUESTIONS_POOL;
    if (Array.isArray(questionsPool) && questionsPool.length > 0) {
      const validFiltered = questionsPool.filter(q => q != null && typeof q === 'object' && q.categoryLevel);
      if (validFiltered.length >= 10) {
        pool = validFiltered;
      }
    }

    const cat1 = pool.filter(q => q && q.categoryLevel === 1);
    const cat2 = pool.filter(q => q && q.categoryLevel === 2);
    const cat3 = pool.filter(q => q && q.categoryLevel === 3);
    const cat4 = pool.filter(q => q && q.categoryLevel === 4);
    const cat5 = pool.filter(q => q && q.categoryLevel === 5);

    const safeCat1 = cat1.length >= 3 ? cat1 : DEFAULT_QUESTIONS_POOL.filter(q => q.categoryLevel === 1);
    const safeCat2 = cat2.length >= 3 ? cat2 : DEFAULT_QUESTIONS_POOL.filter(q => q.categoryLevel === 2);
    const safeCat3 = cat3.length >= 1 ? cat3 : DEFAULT_QUESTIONS_POOL.filter(q => q.categoryLevel === 3);
    const safeCat4 = cat4.length >= 3 ? cat4 : DEFAULT_QUESTIONS_POOL.filter(q => q.categoryLevel === 4);
    const safeCat5 = cat5.length >= 1 ? cat5 : DEFAULT_QUESTIONS_POOL.filter(q => q.categoryLevel === 5);

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const qL1 = shuffle(safeCat1).slice(0, 3);
    const qL2 = shuffle(safeCat2).slice(0, 3);
    const offset3 = (groupNum - 1) % (safeCat3.length || 11);
    const qL3 = [safeCat3[offset3] || safeCat3[0]];
    const qL4 = shuffle(safeCat4).slice(0, 3);
    const offset5 = (groupNum - 1) % (safeCat5.length || 10);
    const qL5 = [safeCat5[offset5] || safeCat5[0]];

    const result = [...qL1, ...qL2, ...qL3, ...qL4, ...qL5].filter(q => q != null);

    const defaultPool = DEFAULT_QUESTIONS_POOL;
    let idx = 0;
    while (result.length < 11) {
      result.push(defaultPool[idx % defaultPool.length]);
      idx++;
    }

    return result;
  }

  autoRegisterTeam(teamName, members) {
    const defaultName = teamName ? teamName.trim() : "";
    const cleanMembers = members ? members.trim() : "";

    const existingTeam = Object.values(this.state.teams).find(t => t.name === defaultName && !t.completed);
    if (existingTeam) {
      return existingTeam;
    }

    const teamKeys = Object.keys(this.state.teams);
    const nextGroupNum = teamKeys.length + 1;
    const teamId = `team_${nextGroupNum}_${Date.now().toString().slice(-4)}`;
    const finalName = defaultName || `第 ${nextGroupNum} 組`;

    const questionsList = this.generateQuestionsListForTeam(nextGroupNum, this.state.questions);

    const newTeam = {
      id: teamId,
      groupNum: nextGroupNum,
      name: finalName,
      members: cleanMembers,
      levelSequence: [1, 2, 3, 4, 5],
      assignedQuestionsList: questionsList,
      stepIndex: 0,
      failedAttempts: {},
      completed: false,
      finishTime: null,
      levelTimes: {},
      startTime: this.state.startTime || Date.now()
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

  // 方案 A 關鍵重置：更新 resetTimestamp，讓雲端與所有線上手機一律清空舊組別！
  resetGame() {
    const now = Date.now();
    this.state.status = 'setup';
    this.state.startTime = null;
    this.state.teams = {};
    this.state.resetTimestamp = now;
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
    if (!currentQ) return null;

    const catLevel = currentQ.categoryLevel || 1;

    let levelSubStep = 1;
    let levelSubTotal = 1;

    if (catLevel === 1) {
      levelSubStep = stepIdx + 1;
      levelSubTotal = 3;
    } else if (catLevel === 2) {
      levelSubStep = stepIdx - 3 + 1;
      levelSubTotal = 3;
    } else if (catLevel === 3) {
      levelSubStep = 1;
      levelSubTotal = 1;
    } else if (catLevel === 4) {
      levelSubStep = stepIdx - 7 + 1;
      levelSubTotal = 3;
    } else if (catLevel === 5) {
      levelSubStep = 1;
      levelSubTotal = 1;
    }

    const failedCount = (team.failedAttempts && team.failedAttempts[stepIdx]) ? team.failedAttempts[stepIdx] : 0;
    
    return {
      questionObj: currentQ,
      stepNumber: stepIdx + 1,
      totalSteps: 11,
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

      if (team.stepIndex >= 11) {
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
