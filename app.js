/**
 * 員林家商圖書館密室逃脫 - 全域通訊與狀態控制核心 (App Core v29.0 - 隱藏地點與索書號提示優化版)
 * 貼紙規則：全數黏貼於圖書【書背索書號標籤處】，同學目視搜尋不需抽取書籍！
 * 根據最新教學需求優化：
 * 1. 學生端隱藏 location 提示。
 * 2. 刪除 q_3_10 題目。
 * 3. 關卡五題目內文移除索書號，將索書號統一收納至「求救提示」中（引導學生自主解謎或解鎖提示尋書）。
 */

const DEFAULT_QUESTIONS_POOL = [
  // ─── 關卡 1：館舍尋蹤與守護法則 (10 題隨機抽 3 題) ───
  {
    id: "q_1_1",
    categoryLevel: 1,
    title: "關卡一：【館舍規定算式】",
    location: "自主學習空間",
    answer: "17",
    hint: "提示：請前往自主學習區旁對照館舍規定海報，找出書籍借閱上限冊數、借期週數與該空間所在樓層！",
    question: "請參閱館舍規定海報計算：(書籍借閱上限冊數 × 圖書借期週數) + 自主學習空間樓層 ＝ ？"
  },
  {
    id: "q_1_2",
    categoryLevel: 1,
    title: "關卡一：【館舍規定算式】",
    location: "TEAL教室",
    answer: "7",
    hint: "提示：請前往 TEAL 教室附近參閱館舍規定海報，對照期刊與影音借閱上限冊數及該空間樓層！",
    question: "請參閱館舍規定海報計算：(期刊借閱上限 + 影音借閱上限) × TEAL教室樓層 ＝ ？"
  },
  {
    id: "q_1_3",
    categoryLevel: 1,
    title: "關卡一：【員家藝廊與借閱規定密碼】",
    location: "員家藝廊",
    answer: "1820",
    hint: "提示：請對照員家藝廊所在樓層，以及館舍規定海報上的書籍上限、圖書借期週數與當期雜誌可借冊數！",
    question: "請回答 4 位數密碼：（員家藝廊樓層 / 書籍上限冊數 / 圖書借期週數 / 當期雜誌外借冊數）："
  },
  {
    id: "q_1_4",
    categoryLevel: 1,
    title: "關卡一：【圖書與期刊借期密碼】",
    location: "服務台導覽圖",
    answer: "9",
    hint: "提示：請至服務台導覽圖與規定海報，尋找圖書借期天數、期刊上限冊數與自主學習區樓層！",
    question: "請參閱館舍規定海報計算：(圖書借期天數 - 期刊借閱上限冊數) × 自主學習區樓層 ＝ ？"
  },
  {
    id: "q_1_5",
    categoryLevel: 1,
    title: "關卡一：【全館借閱上限總和】",
    location: "閱覽室公告欄",
    answer: "15",
    hint: "提示：請至閱覽室公告欄對照一般圖書、期刊與視聽影音三者的借閱上限冊數！",
    question: "請參閱館舍規定海報計算：一般圖書借閱上限 + 期刊借閱上限 + 視聽影音借閱上限 ＝ ？"
  },
  {
    id: "q_1_6",
    categoryLevel: 1,
    title: "關卡一：【視聽影音借閱密碼】",
    location: "視聽區與藝廊",
    answer: "3",
    hint: "提示：請至視聽區與藝廊參閱規定海報，找出影音借閱部數上限、借期週數與藝廊樓層！",
    question: "請參閱館舍規定海報計算：(影音借閱上限部數 × 影音借期週數) + 藝廊樓層 ＝ ？"
  },
  {
    id: "q_1_7",
    categoryLevel: 1,
    title: "關卡一：【期刊過刊借期算式】",
    location: "閱覽室過刊區",
    answer: "11",
    hint: "提示：請至過刊區對照館舍規定海報上的期刊借閱上限冊數與過刊借期週數！",
    question: "請參閱館舍規定海報計算：(期刊借閱上限冊數 × 期刊過刊借期週數) + 1 ＝ ？"
  },
  {
    id: "q_1_8",
    categoryLevel: 1,
    title: "關卡一：【圖書續借規則密碼】",
    location: "服務台公告欄",
    answer: "18",
    hint: "提示：請至服務台對照書籍借閱上限冊數、圖書允許續借次數與借期週數！",
    question: "請參閱館舍規定海報計算：(書籍借閱上限冊數 + 圖書允許續借次數) × 圖書借期週數 ＝ ？"
  },
  {
    id: "q_1_9",
    categoryLevel: 1,
    title: "關卡一：【館藏守護天數密碼】",
    location: "自主學習空間",
    answer: "7",
    hint: "提示：請對照圖書借期天數與書籍上限冊數進行相除取餘數，再加上自主學習空間樓層！",
    question: "請參閱館舍規定海報計算：(圖書借期天數 ÷ 書籍上限冊數 之餘數) + 自主學習空間樓層 ＝ ？"
  },
  {
    id: "q_1_10",
    categoryLevel: 1,
    title: "關卡一：【館舍三大空間總和】",
    location: "藝廊/TEAL/自主區",
    answer: "6",
    hint: "提示：請確認藝廊、TEAL教室與自主學習區所在樓層，並對照影音借閱上限部數！",
    question: "請參閱館舍規定海報計算：(藝廊樓層 + TEAL教室樓層 + 自主區樓層) × 影音借閱上限 ＝ ？"
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
    answer: ["王麗容2024", "王麗容24"],
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
    title: "關卡二：【OPAC 檢索：《國學潮人誌》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["宋怡慧2020", "宋怡慧20"],
    hint: "提示：請在 WebOPAC 輸入書名《國學潮人誌》，點入詳細頁面查看作者姓名與出版年份！",
    question: "😎 請在 WebOPAC 搜尋《國學潮人誌》，將【作者姓名】+【出版年份】拼湊成密碼："
  },
  {
    id: "q_2_7",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《芬蘭驚艷》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["吳祥輝2006", "吳祥輝06"],
    hint: "提示：請在 WebOPAC 輸入書名《芬蘭驚艷》，點入詳細頁面查看作者姓名與出版年份！",
    question: "✈️ 請在 WebOPAC 搜尋《芬蘭驚艷》，將【作者姓名】+【出版年份】拼湊成暗號："
  },
  {
    id: "q_2_8",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《走入員林街仔》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["彰化縣文化局2007", "彰化縣文化局07"],
    hint: "提示：請在 WebOPAC 輸入書名《走入員林街仔》，點入詳細頁面查看出版者與出版年份！",
    question: "🏠 請在 WebOPAC 搜尋《走入員林街仔》，將【出版者】+【出版年份】拼湊成密碼："
  },
  {
    id: "q_2_9",
    categoryLevel: 2,
    title: "關卡二：【OPAC 檢索：《保母人員通關寶典》】",
    location: "電腦查詢區 / 手機 (WebOPAC)",
    answer: ["童年工作坊1998", "童年工作坊98"],
    hint: "提示：請在 WebOPAC 輸入書名《保母人員丙級學術科通關寶典》，點入詳細頁面查看編著與出版年份！",
    question: "👶 請在 WebOPAC 搜尋《保母人員丙級學術科通關寶典》，將【編著】+【出版年份】拼湊成密碼："
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

  // ─── 關卡 3：二樓書庫尋寶 (11 題選 2 題，按組別錯開防擁擠；已刪除 q_3_10) ───
  {
    id: "q_3_1",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：523.2 號段】",
    location: "2 樓 書庫 (索書號 523.2 號段)",
    answer: ["baby", "BABY"],
    hint: "提示：請前往 2 樓書庫索書號 523.2 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 523.2 0812 2012] 《繪本主題教學資源手冊》\n❷ [索書號: 523.2 4450 2017] 《多元智能教具設計與應用》\n❸ [索書號: 523.26 8374 1998] 《保母人員(丙級)通關寶典》\n❹ [索書號: 523.23 4432 2011] 《幼兒園教保活動與課程》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_2",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：521.1 號段】",
    location: "2 樓 書庫 (索書號 521.1 號段)",
    answer: ["pass", "PASS"],
    hint: "提示：請前往 2 樓書庫索書號 521.1 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 521.1 7594 2023] 《自律學習力》\n❷ [索書號: 521.1 4144 2018] 《刻意練習》\n❸ [索書號: 521.1 4723 2016] 《讀書別靠意志力》\n❹ [索書號: 521.1 7744 2021] 《大腦喜歡這樣學》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_3",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：520-521.4 號段】",
    location: "2 樓 書庫 (索書號 520 號段)",
    answer: ["idea", "IDEA"],
    hint: "提示：請前往 2 樓書庫索書號 520~521.4 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 521.4 1190 2015] 《學思達》\n❷ [索書號: 521.407 4415 2015] 《為未來而教》\n❸ [索書號: 520.9476 7534 2011] 《美力芬蘭 從教育建立美感大國》\n❹ [索書號: 521.426 6034 2018] 《讓天賦發光》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_4",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：673.29 號段】",
    location: "2 樓 書庫 (索書號 673 號段)",
    answer: ["town", "TOWN"],
    hint: "提示：請前往 2 樓書庫索書號 673.29 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 673.29/12 1114 2007] 《走入員林街仔》\n❷ [索書號: 673.29/12 1111 2008 v.30] 《再現百果山風華 上》\n❸ [索書號: 673.29/12 1111 2008 v.31] 《再現百果山風華 下》\n❹ [索書號: 673.29/1 7522 2008 v.27] 《鹿港不見天街傳奇》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_5",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：673.22 號段】",
    location: "2 樓 書庫 (索書號 673 號段)",
    answer: ["asia", "ASIA"],
    hint: "提示：請前往 2 樓書庫索書號 673.22 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 673.22 8736 1998 v.1] 《漫畫台灣史 1 遠古時代》\n❷ [索書號: 673.22 8736 1998 v.2] 《漫畫台灣史 2 荷蘭時代》\n❸ [索書號: 673.22 8736 1998 v.3] 《漫畫台灣史 3 鄭家時代》\n❹ [索書號: 673.22 8736 1998 v.4] 《漫畫台灣史 4 清朝時代》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_6",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：782.1 號段】",
    location: "2 樓 書庫 (索書號 782.1 號段)",
    answer: ["hero", "HERO"],
    hint: "提示：請前往 2 樓書庫索書號 782.1 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 782.1 4469 2022] 《學霸養成記》\n❷ [索書號: 782.1 4469 2022] 《鬼才養成記》\n❸ [索書號: 782.1 4469 2022] 《聖人養成記》\n❹ [索書號: 782.1 4469 2022] 《英雄養成記》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_7",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：782.2 號段】",
    location: "2 樓 書庫 (索書號 782.2 號段)",
    answer: ["cool", "COOL"],
    hint: "提示：請前往 2 樓書庫索書號 782.2 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 782.24 4469 2022] 《狀元養成記》\n❷ [索書號: 782.2 4000 2021 v.1] 《胖古人的古人好朋友 1》\n❸ [索書號: 782.2 3095 2020] 《國學潮人誌，古人超有料》\n❹ [索書號: 782.2 3095 2022 v.2] 《國學潮人誌，古人超有才》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_8",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：745-747 號段】",
    location: "2 樓 書庫 (索書號 745-747 號段)",
    answer: ["trip", "TRIP"],
    hint: "提示：請前往 2 樓書庫索書號 745-747 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 747.49 2639 2009] 《驚喜挪威》\n❷ [索書號: 747.69 2639 2006] 《芬蘭驚艷》\n❸ [索書號: 747.69 7511 2012] 《芬蘭青年力》\n❹ [索書號: 745.09 4449 2011 v.18] 《北歐五國》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_9",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：855 號段】",
    location: "2 樓 書庫 (索書號 855 號段)",
    answer: ["wish", "WISH"],
    hint: "提示：請前往 2 樓書庫索書號 855 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 855 2290 2005 v.3] 《失樂園秘密花開了》\n❷ [索書號: 855 2290 2005 v.4] 《失樂園魔法失靈了》\n❸ [索書號: 855 2290 2007] 《戀之風景》\n❹ [索書號: 855.4 2290 2012] 《如果可以許一個願望》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_11",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：876 號段】",
    location: "2 樓 書庫 (索書號 876 號段)",
    answer: ["love", "LOVE"],
    hint: "提示：請前往 2 樓書庫索書號 876 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 876.57 4424 2009] 《地獄誓約》\n❷ [索書號: 876.57 4477 2009] 《熱戀》\n❸ [索書號: 876.59 5622 2011] 《薩琪有好很多男朋友》\n❹ [索書號: 876.59 5622 2002] 《薩琪想要一個小寶寶》\n將收集到的 4 個字母組合成英文單字："
  },
  {
    id: "q_3_12",
    categoryLevel: 3,
    title: "關卡三：【二樓書庫尋寶：312 號段】",
    location: "2 樓 書庫 (索書號 312 號段)",
    answer: ["open", "OPEN"],
    hint: "提示：請前往 2 樓書庫索書號 312 架位，目視查看 4 本圖書【書背標籤處】貼紙字母（請勿抽取書籍）。",
    question: "🔍 【二樓書庫尋寶】請至 2 樓書庫，根據索書號目視查看以下 4 本圖書【書背標籤處】貼紙字母（請勿拿書）：\n❶ [索書號: 312.83 1703 2025] 《AI繪圖一秒上手》\n❷ [索書號: 312.83 4423 2023] 《ChatGPT與AI繪圖》\n❸ [索書號: 312.83 7547 2023] 《瘋ChatGPT 顛覆未來》\n❹ [索書號: 312.83 4410 2023] 《AI生成時代》\n將收集到的 4 個字母組合成英文單字："
  },

  // ─── 關卡 5：2 樓流通櫃台 10 本實體圖書獨家過卡題目 (索書號收納於提示中) ───
  {
    id: "q_5_1",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《古人原來很會過日子》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《古人原來很會過日子》",
    barcode: "051984",
    answer: ["051984", "PASS888", "999"],
    hint: "提示：請參閱索書號 [610.9 1010 2022] 尋找指定圖書《古人原來很會過日子》，全組持學生證至二樓流通櫃台向館員刷條碼過卡！",
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
    hint: "提示：請參閱索書號 [873.59 5304 2018] 尋找指定圖書《穿裙子的男孩》，全組持學生證至二樓流通櫃台向館員刷條碼過卡！",
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
    hint: "提示：請參閱索書號 [550.16 4063 2016] 尋找指定圖書《網紅經濟》，全組持學生證至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《網紅經濟》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_4",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《獲利至上》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《獲利至上》",
    barcode: "050302",
    answer: ["050302", "PASS888", "999"],
    hint: "提示：請參閱索書號 [312.932 4474 2021] 尋找指定圖書《獲利至上》，全組持學生證至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《獲利至上》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_5",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《芬蘭與波羅的海三國繪旅行》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《芬蘭與波羅的海三國繪旅行》",
    barcode: "046608",
    answer: ["046608", "PASS888", "999"],
    hint: "提示：請參閱索書號 [747.09 0099 2018] 尋找指定圖書《芬蘭與波羅的海三國繪旅行》，全組持學生證至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《芬蘭與波羅的海三國繪旅行》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_6",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《這就是符號學！》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《這就是符號學！》",
    barcode: "047242",
    answer: ["047242", "PASS888", "999"],
    hint: "提示：請參閱索書號 [143 1184 2012] 尋找指定圖書《這就是符號學！》，全組持學生證至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《這就是符號學！》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_7",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《國中生子彈筆記考試法》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《國中生子彈筆記考試法》",
    barcode: "048756",
    answer: ["048756", "PASS888", "999"],
    hint: "提示：請參閱索書號 [019.2 0407 2020] 尋找指定圖書《國中生子彈筆記考試法》，全組持學生證至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《國中生子彈筆記考試法》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_8",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《這幅畫,原來要看這裡》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《這幅畫,原來要看這裡》",
    barcode: "050115",
    answer: ["050115", "PASS888", "999"],
    hint: "提示：請參閱索書號 [909.4 3152 2015] 尋找指定圖書《這幅畫,原來要看這裡》，全組持學生證至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《這幅畫,原來要看這裡》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_9",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《教科書裡的瘋狂實驗:漫畫化學》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《教科書裡的瘋狂實驗:漫畫化學》",
    barcode: "047235",
    answer: ["047235", "PASS888", "999"],
    hint: "提示：請參閱索書號 [347 2218 2022] 尋找指定圖書《教科書裡的瘋狂實驗:漫畫化學》，全組持學生證至二樓流通櫃台向館員刷條碼過卡！",
    question: "🏆 請全組持學生證與指定圖書《教科書裡的瘋狂實驗:漫畫化學》至二樓流通櫃台向館員刷條碼過卡："
  },
  {
    id: "q_5_10",
    categoryLevel: 5,
    title: "關卡五：【流通櫃台過卡：《門神的故事》】",
    location: "2 樓 流通櫃台",
    bookTitle: "《門神的故事》",
    barcode: "021627",
    answer: ["021627", "PASS888", "999"],
    hint: "提示：請參閱索書號 [538.6 2269 1989] 尋找指定圖書《門神的故事》，全組持學生證至二樓流通櫃台向館員刷條碼過卡，獲取智慧金鑰！",
    question: "🏆 請全組持學生證與指定圖書《門神的故事》至二樓流通櫃台向館員刷條碼過卡，獲取智慧金鑰！"
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

    Object.values(state.teams).forEach(team => {
      team.levelSequence = [1, 2, 3, 5];

      if (!team.assignedQuestionsList || !Array.isArray(team.assignedQuestionsList) || team.assignedQuestionsList.length !== 9 || team.assignedQuestionsList.some(q => !q)) {
        team.assignedQuestionsList = this.generateQuestionsListForTeam(team.groupNum || 1, state.questions);
      }
      if (typeof team.stepIndex !== 'number') team.stepIndex = 0;
      if (!team.levelTimes) team.levelTimes = {};
      if (!team.failedAttempts) team.failedAttempts = {};
    });

    return state;
  }

  mergeState(incomingState) {
    if (!incomingState) return;
    const sanitized = this.sanitizeState(incomingState);

    const mergedTeams = { ...(sanitized.teams || {}) };

    if (this.state && this.state.teams) {
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

      this.firebaseDb.ref('ylhcvs_game_state').on('value', (snapshot) => {
        const val = snapshot.val();
        if (val) {
          this.mergeState(val);
          localStorage.setItem('ylhcvs_escape_state', JSON.stringify(this.state));
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
      const cleanData = this.cleanObjectForFirebase(this.state);
      this.firebaseDb.ref('ylhcvs_game_state').set(cleanData).then(() => {
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
    const cat5 = pool.filter(q => q && q.categoryLevel === 5);

    const safeCat1 = cat1.length >= 3 ? cat1 : DEFAULT_QUESTIONS_POOL.filter(q => q.categoryLevel === 1);
    const safeCat2 = cat2.length >= 3 ? cat2 : DEFAULT_QUESTIONS_POOL.filter(q => q.categoryLevel === 2);
    const safeCat3 = cat3.length >= 2 ? cat3 : DEFAULT_QUESTIONS_POOL.filter(q => q.categoryLevel === 3);
    const safeCat5 = cat5.length >= 1 ? cat5 : DEFAULT_QUESTIONS_POOL.filter(q => q.categoryLevel === 5);

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const qL1 = shuffle(safeCat1).slice(0, 3);
    const qL2 = shuffle(safeCat2).slice(0, 3);

    const offset3 = ((groupNum - 1) * 2) % (safeCat3.length || 11);
    const qL3_1 = safeCat3[offset3] || safeCat3[0];
    const qL3_2 = safeCat3[(offset3 + 1) % safeCat3.length] || safeCat3[1];
    const qL3 = [qL3_1, qL3_2];

    const offset5 = (groupNum - 1) % (safeCat5.length || 10);
    const qL5 = [safeCat5[offset5] || safeCat5[0]];

    const result = [...qL1, ...qL2, ...qL3, ...qL5].filter(q => q != null);

    const defaultPool = DEFAULT_QUESTIONS_POOL;
    let idx = 0;
    while (result.length < 9) {
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
      levelSequence: [1, 2, 3, 5],
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
