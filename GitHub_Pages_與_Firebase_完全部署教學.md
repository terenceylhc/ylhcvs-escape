# 🌐 GitHub Pages + Firebase 跨裝置即時排行榜：完全部署教學

這是一份專為老師準備的 100% 免費、免租用伺服器、支援 20+ 組手機即時同步的 GitHub Pages 部署手冊。

專案資料夾：[web_app 專案資料夾](file:///f:/雲端硬碟/01研習資料/Antigravity/圖書館密室逃脫/web_app)

---

## 📌 步驟 1：建立免費 Firebase 即時資料庫（只需要 2 分鐘）

為了讓分布在圖書館各樓層的 20 組學生手機，能將解謎密碼**即時回傳**到教師投影大螢幕，我們使用 Google 提供的免費 Firebase Realtime Database。

1. **前往 Firebase 官網**：打開 [https://console.firebase.google.com/](https://console.firebase.google.com/) 並以 Google 帳號登入。
2. **新增專案**：點擊「新增專案」，輸入專案名稱（例如 `ylhcvs-escape`），一路點擊「繼續」建立專案。
3. **建立 Realtime Database**：
   - 在左側選單點擊 **「Build」➔「Realtime Database」**。
   - 點擊「建立資料庫」，位置選擇 `United States (us-central1)` 或任意近區域。
   - 規則選擇 **「以測試模式啟動 (Start in test mode)」**，點擊「啟用」。
4. **取得 API 金鑰設定檔**：
   - 點擊左側齒輪圖示 ⚙️ **「專案設定 (Project settings)」**。
   - 在下方「您的應用程式」點擊網頁圖示 `</>`（新增網頁應用程式）。
   - 複製 SDK 設定物件中的程式碼，將金鑰覆蓋貼到專案檔 [firebase-config.js](file:///f:/雲端硬碟/01研習資料/Antigravity/圖書館密室逃脫/web_app/firebase-config.js) 檔案中即可！

---

## 📌 步驟 2：上傳專案至 GitHub 並開啟 GitHub Pages

1. **建立 GitHub 倉庫 (Repository)**：
   - 打開 [https://github.com/](https://github.com/) 登入後點擊右上角 **`+` ➔ New repository**。
   - 倉庫名稱輸入 `ylhcvs-escape`，設為 `Public`，點擊 **Create repository**。

2. **上傳網頁檔案**：
   - 點擊 **Upload an existing file**。
   - 將 [web_app 資料夾](file:///f:/雲端硬碟/01研習資料/Antigravity/圖書館密室逃脫/web_app) 裡的所有檔案（`index.html`, `teacher.html`, `dashboard.html`, `student.html`, `style.css`, `app.js`, `firebase-config.js`）拖曳上傳至 GitHub。
   - 點擊 **Commit changes** 儲存檔案。

3. **啟用 GitHub Pages 靜態網站發布**：
   - 進入該倉庫的 **Settings ➔ Pages**（左側選單）。
   - 在 **Build and deployment** 下方的 Branch 選擇 `main` (或 `master`)，目錄選 `/ (root)`，點擊 **Save**。
   - 約 1 分鐘後，系統會生成您的專屬發布網址：
     `https://你的GitHub帳號.github.io/ylhcvs-escape/`

---

## 🏆 步驟 3：活動當天現場使用流程

1. **投影大螢幕**：
   - 打開 `https://你的GitHub帳號.github.io/ylhcvs-escape/dashboard.html` 全螢幕投影。

2. **教師主控端**：
   - 打開 `https://你的GitHub帳號.github.io/ylhcvs-escape/teacher.html`。
   - 設定錄取前 N 名（例如 3 名）與總組數，點擊【💾 初始化/儲存設定】。
   - 將頁面上的 **QR Code 投影出來** 給學生掃描。

3. **學生入場闖關**：
   - 各組學生手機掃描 QR Code 進入 `student.html`，選擇組別輸入成員姓名。
   - 老師按下【🚀 開始密室逃脫】，全場大螢幕倒數計時開始！
   - 學生每解開一關並輸入密碼，大螢幕排行榜**即時自動更新排名與彩帶特效**！
